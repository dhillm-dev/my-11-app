defmodule PicknwinJobs.Workers.FinalizeResultsWorker do
  @moduledoc """
  Oban worker to finalize contest results and calculate final rankings.
  
  This job is idempotent and processes all match events to compute
  final scores and leaderboard positions.
  """
  use Oban.Worker, queue: :scoring, max_attempts: 5
  
  alias Picknwin.Contests
  alias Picknwin.Scoring
  alias Picknwin.Leaderboard
  alias PicknwinWeb.ContestChannel
  
  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"contest_id" => contest_id}}) do
    case Contests.get_contest(contest_id) do
      {:ok, contest} ->
        finalize_contest_results(contest)
      
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
  Schedule result finalization job.
  """
  def schedule(contest_id, finalization_time) when is_binary(contest_id) do
    %{
      "contest_id" => contest_id
    }
    |> new(scheduled_at: finalization_time)
    |> Oban.insert()
  end
  
  # Private functions
  
  defp finalize_contest_results(contest) do
    case contest.status do
      status when status in [:locked, :live] ->
        perform_finalization(contest)
      
      :completed ->
        # Already finalized, job succeeded
        :ok
      
      :cancelled ->
        # Contest was cancelled, nothing to finalize
        :ok
      
      _ ->
        {:error, "Invalid contest status for finalization: #{contest.status}"}
    end
  end
  
  defp perform_finalization(contest) do
    with {:ok, final_scores} <- calculate_final_scores(contest),
         {:ok, leaderboard} <- generate_final_leaderboard(contest, final_scores),
         {:ok, completed_contest} <- mark_contest_completed(contest, leaderboard) do
      
      # Broadcast final results
      broadcast_final_results(contest.id, leaderboard)
      
      # Schedule payout processing
      schedule_payout_job(completed_contest)
      
      :ok
    else
      {:error, reason} -> {:error, reason}
    end
  end
  
  defp calculate_final_scores(contest) do
    case Scoring.calculate_all_team_scores(contest.id) do
      {:ok, scores} ->
        # Verify all teams have been scored
        expected_teams = Contests.get_team_count(contest.id)
        actual_teams = length(scores)
        
        if actual_teams == expected_teams do
          {:ok, scores}
        else
          {:error, "Score calculation incomplete: #{actual_teams}/#{expected_teams} teams"}
        end
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  defp generate_final_leaderboard(contest, final_scores) do
    case Leaderboard.generate_final_rankings(contest.id, final_scores) do
      {:ok, leaderboard} ->
        # Calculate prize distribution
        case calculate_prize_distribution(contest, leaderboard) do
          {:ok, leaderboard_with_prizes} ->
            {:ok, leaderboard_with_prizes}
          
          {:error, reason} ->
            {:error, reason}
        end
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  defp calculate_prize_distribution(contest, leaderboard) do
    case Contests.get_prize_structure(contest.id) do
      {:ok, prize_structure} ->
        Leaderboard.apply_prize_distribution(leaderboard, prize_structure)
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  defp mark_contest_completed(contest, leaderboard) do
    completion_data = %{
      status: :completed,
      completed_at: DateTime.utc_now(),
      final_leaderboard: leaderboard,
      total_prize_pool: calculate_total_prizes(leaderboard)
    }
    
    Contests.update_contest(contest.id, completion_data)
  end
  
  defp calculate_total_prizes(leaderboard) do
    leaderboard
    |> Enum.map(& &1.prize_amount || Decimal.new(0))
    |> Enum.reduce(Decimal.new(0), &Decimal.add/2)
  end
  
  defp broadcast_final_results(contest_id, leaderboard) do
    # Broadcast complete final leaderboard
    ContestChannel.broadcast_leaderboard_update(
      contest_id,
      "final",
      %{leaderboard: leaderboard}
    )
    
    # Broadcast contest completion status
    ContestChannel.broadcast_status_change(
      contest_id,
      %{
        status: :completed,
        completed_at: DateTime.utc_now(),
        total_winners: count_winners(leaderboard)
      }
    )
  end
  
  defp count_winners(leaderboard) do
    leaderboard
    |> Enum.count(fn entry -> 
      entry.prize_amount && Decimal.positive?(entry.prize_amount)
    end)
  end
  
  defp schedule_payout_job(contest) do
    # Schedule payout processing immediately after finalization
    PicknwinJobs.Workers.PayoutWinningsWorker.schedule(
      contest.id,
      DateTime.utc_now()
    )
  end
end