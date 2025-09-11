defmodule PicknwinJobs do
  @moduledoc """
  Public API for PickNWin background job scheduling.
  
  This module provides a clean interface for scheduling various types of jobs
  in the PickNWin system, including contest management, scoring, and maintenance tasks.
  """
  
  alias PicknwinJobs.Workers.{
    LockContestsWorker,
    FinalizeResultsWorker,
    PayoutWinningsWorker,
    CleanupTokensWorker
  }
  
  @doc """
  Schedule contest locking at kickoff time.
  
  ## Examples
  
      iex> PicknwinJobs.schedule_contest_lock("contest_123", ~U[2024-01-15 15:00:00Z])
      {:ok, %Oban.Job{}}
  
  """
  def schedule_contest_lock(contest_id, kickoff_time) do
    LockContestsWorker.schedule(contest_id, kickoff_time)
  end
  
  @doc """
  Schedule result finalization after match completion.
  
  ## Examples
  
      iex> PicknwinJobs.schedule_result_finalization("contest_123", ~U[2024-01-15 17:00:00Z])
      {:ok, %Oban.Job{}}
  
  """
  def schedule_result_finalization(contest_id, finalization_time) do
    FinalizeResultsWorker.schedule(contest_id, finalization_time)
  end
  
  @doc """
  Schedule payout processing for completed contests.
  
  ## Examples
  
      iex> PicknwinJobs.schedule_payouts("contest_123", ~U[2024-01-15 17:30:00Z])
      {:ok, %Oban.Job{}}
  
  """
  def schedule_payouts(contest_id, payout_time) do
    PayoutWinningsWorker.schedule(contest_id, payout_time)
  end
  
  @doc """
  Schedule refund processing for cancelled contests.
  
  ## Examples
  
      iex> PicknwinJobs.schedule_refunds("contest_123", ~U[2024-01-15 14:00:00Z])
      {:ok, %Oban.Job{}}
  
  """
  def schedule_refunds(contest_id, refund_time) do
    PayoutWinningsWorker.schedule_refunds(contest_id, refund_time)
  end
  
  @doc """
  Schedule periodic token cleanup.
  
  ## Options
  
  - `:token_expiry_days` - Days after which tokens are considered expired (default: 30)
  - `:session_expiry_days` - Days after which sessions are considered expired (default: 7)
  - `:batch_size` - Number of records to process in each batch (default: 1000)
  
  ## Examples
  
      iex> PicknwinJobs.schedule_token_cleanup()
      {:ok, %Oban.Job{}}
      
      iex> PicknwinJobs.schedule_token_cleanup(token_expiry_days: 14)
      {:ok, %Oban.Job{}}
  
  """
  def schedule_token_cleanup(opts \\ []) do
    CleanupTokensWorker.schedule_periodic(opts)
  end
  
  @doc """
  Schedule immediate token cleanup.
  
  ## Examples
  
      iex> PicknwinJobs.cleanup_tokens_now()
      {:ok, %Oban.Job{}}
  
  """
  def cleanup_tokens_now(opts \\ []) do
    CleanupTokensWorker.schedule_immediate(opts)
  end
  
  @doc """
  Schedule a complete contest workflow from lock to payout.
  
  This is a convenience function that schedules all necessary jobs
  for a contest lifecycle.
  
  ## Examples
  
      iex> contest_times = %{
      ...>   kickoff: ~U[2024-01-15 15:00:00Z],
      ...>   finalization: ~U[2024-01-15 17:00:00Z],
      ...>   payout: ~U[2024-01-15 17:30:00Z]
      ...> }
      iex> PicknwinJobs.schedule_contest_workflow("contest_123", contest_times)
      {:ok, [%Oban.Job{}, %Oban.Job{}, %Oban.Job{}]}
  
  """
  def schedule_contest_workflow(contest_id, %{kickoff: kickoff_time, finalization: finalization_time, payout: payout_time}) do
    with {:ok, lock_job} <- schedule_contest_lock(contest_id, kickoff_time),
         {:ok, finalize_job} <- schedule_result_finalization(contest_id, finalization_time),
         {:ok, payout_job} <- schedule_payouts(contest_id, payout_time) do
      {:ok, [lock_job, finalize_job, payout_job]}
    else
      {:error, reason} -> {:error, reason}
    end
  end
  
  @doc """
  Cancel all scheduled jobs for a contest.
  
  Useful when a contest is cancelled or rescheduled.
  
  ## Examples
  
      iex> PicknwinJobs.cancel_contest_jobs("contest_123")
      {:ok, 3}
  
  """
  def cancel_contest_jobs(contest_id) do
    # Cancel jobs by contest_id in args
    query = 
      Oban.Job
      |> Oban.Job.where(state: "scheduled")
      |> Oban.Job.where([j], fragment("?->>'contest_id' = ?", j.args, ^contest_id))
    
    case Oban.cancel_all_jobs(query) do
      {count, _} -> {:ok, count}
      error -> error
    end
  end
  
  @doc """
  Get job statistics for monitoring.
  
  ## Examples
  
      iex> PicknwinJobs.job_stats()
      %{
        scheduled: 15,
        executing: 2,
        completed: 1250,
        failed: 3,
        by_queue: %{
          "scoring" => 8,
          "payouts" => 5,
          "maintenance" => 2
        }
      }
  
  """
  def job_stats do
    %{
      scheduled: count_jobs_by_state("scheduled"),
      executing: count_jobs_by_state("executing"),
      completed: count_jobs_by_state("completed"),
      failed: count_jobs_by_state("retryable"),
      by_queue: jobs_by_queue()
    }
  end
  
  # Private functions
  
  defp count_jobs_by_state(state) do
    Oban.Job
    |> Oban.Job.where(state: ^state)
    |> Oban.Repo.aggregate(:count, :id)
  end
  
  defp jobs_by_queue do
    import Ecto.Query
    
    Oban.Job
    |> where([j], j.state in ["scheduled", "executing"])
    |> group_by([j], j.queue)
    |> select([j], {j.queue, count(j.id)})
    |> Oban.Repo.all()
    |> Enum.into(%{})
  end
end