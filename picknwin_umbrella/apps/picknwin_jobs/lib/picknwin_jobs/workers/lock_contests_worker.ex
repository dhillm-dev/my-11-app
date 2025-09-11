defmodule PicknwinJobs.Workers.LockContestsWorker do
  @moduledoc """
  Oban worker to lock contests at kickoff time.
  
  This job is idempotent and can be safely retried.
  Scheduled to run at match kickoff time.
  """
  use Oban.Worker, queue: :contests, max_attempts: 3
  
  alias Picknwin.Contests
  alias PicknwinWeb.ContestChannel
  
  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"contest_id" => contest_id}}) do
    case Contests.get_contest(contest_id) do
      {:ok, contest} ->
        lock_contest(contest)
      
      {:error, :not_found} ->
        # Contest was deleted, job is no longer needed
        :ok
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  def perform(%Oban.Job{args: args}) do
    {:error, "Invalid job arguments: #{inspect(args)}"}
  end
  
  @doc """
  Schedule contest locking job.
  """
  def schedule(contest_id, kickoff_time) when is_binary(contest_id) do
    %{
      "contest_id" => contest_id
    }
    |> new(scheduled_at: kickoff_time)
    |> Oban.insert()
  end
  
  # Private functions
  
  defp lock_contest(contest) do
    case contest.status do
      :open ->
        perform_lock(contest)
      
      :locked ->
        # Already locked, job succeeded
        :ok
      
      status when status in [:live, :completed, :cancelled] ->
        # Contest moved beyond locking stage
        :ok
      
      _ ->
        {:error, "Invalid contest status: #{contest.status}"}
    end
  end
  
  defp perform_lock(contest) do
    case Contests.lock_contest(contest.id) do
      {:ok, locked_contest} ->
        # Broadcast status change to all subscribers
        ContestChannel.broadcast_status_change(
          contest.id,
          %{
            status: :locked,
            locked_at: locked_contest.locked_at,
            total_entries: locked_contest.total_entries
          }
        )
        
        # Schedule result finalization job
        schedule_finalization_job(contest)
        
        :ok
      
      {:error, :already_locked} ->
        # Race condition - another process locked it first
        :ok
      
      {:error, :insufficient_entries} ->
        # Cancel contest due to insufficient participation
        cancel_contest_with_refunds(contest)
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  defp schedule_finalization_job(contest) do
    # Schedule finalization 2 hours after match end time
    finalization_time = 
      contest.match_end_time
      |> DateTime.add(2 * 60 * 60, :second)
    
    PicknwinJobs.Workers.FinalizeResultsWorker.schedule(
      contest.id,
      finalization_time
    )
  end
  
  defp cancel_contest_with_refunds(contest) do
    case Contests.cancel_contest_with_refunds(contest.id) do
      {:ok, cancelled_contest} ->
        # Broadcast cancellation to all subscribers
        ContestChannel.broadcast_status_change(
          contest.id,
          %{
            status: :cancelled,
            reason: "Insufficient entries",
            cancelled_at: cancelled_contest.cancelled_at
          }
        )
        
        # Schedule refund processing
        schedule_refund_job(contest)
        
        :ok
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  defp schedule_refund_job(contest) do
    # Process refunds immediately
    PicknwinJobs.Workers.PayoutWinningsWorker.schedule_refunds(
      contest.id,
      DateTime.utc_now()
    )
  end
end