defmodule PicknwinJobs.Workers.PayoutWinningsWorker do
  @moduledoc """
  Oban worker to process contest winnings payouts.
  
  This job is idempotent and handles both regular payouts and refunds.
  Ensures atomic wallet updates and proper audit trails.
  """
  use Oban.Worker, queue: :payouts, max_attempts: 5
  
  alias Picknwin.Contests
  alias Picknwin.Wallets
  alias Picknwin.Leaderboard
  alias PicknwinWeb.WalletChannel
  
  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"contest_id" => contest_id, "type" => "payout"}}) do
    case Contests.get_contest(contest_id) do
      {:ok, contest} ->
        process_contest_payouts(contest)
      
      {:error, :not_found} ->
        # Contest was deleted, job is no longer needed
        :ok
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  def perform(%Oban.Job{args: %{"contest_id" => contest_id, "type" => "refund"}}) do
    case Contests.get_contest(contest_id) do
      {:ok, contest} ->
        process_contest_refunds(contest)
      
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
  Schedule payout processing job.
  """
  def schedule(contest_id, payout_time) when is_binary(contest_id) do
    %{
      "contest_id" => contest_id,
      "type" => "payout"
    }
    |> new(scheduled_at: payout_time)
    |> Oban.insert()
  end
  
  @doc """
  Schedule refund processing job.
  """
  def schedule_refunds(contest_id, refund_time) when is_binary(contest_id) do
    %{
      "contest_id" => contest_id,
      "type" => "refund"
    }
    |> new(scheduled_at: refund_time)
    |> Oban.insert()
  end
  
  # Private functions
  
  defp process_contest_payouts(contest) do
    case contest.status do
      :completed ->
        perform_payouts(contest)
      
      status when status in [:open, :locked, :live] ->
        {:error, "Contest not yet completed: #{status}"}
      
      :cancelled ->
        # Should use refund job instead
        {:error, "Cannot payout cancelled contest"}
      
      _ ->
        {:error, "Invalid contest status for payout: #{contest.status}"}
    end
  end
  
  defp process_contest_refunds(contest) do
    case contest.status do
      :cancelled ->
        perform_refunds(contest)
      
      _ ->
        {:error, "Cannot refund non-cancelled contest: #{contest.status}"}
    end
  end
  
  defp perform_payouts(contest) do
    case Leaderboard.get_winners(contest.id) do
      {:ok, winners} ->
        process_winner_payouts(contest, winners)
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  defp process_winner_payouts(contest, winners) do
    results = 
      winners
      |> Enum.map(&process_individual_payout(contest, &1))
      |> Enum.group_by(&elem(&1, 0))
    
    case Map.get(results, :error, []) do
      [] ->
        # All payouts successful
        mark_payouts_completed(contest)
        :ok
      
      errors ->
        # Some payouts failed - log and retry
        {:error, "Payout failures: #{inspect(errors)}"}
    end
  end
  
  defp process_individual_payout(contest, winner) do
    payout_data = %{
      contest_id: contest.id,
      user_id: winner.user_id,
      amount: winner.prize_amount,
      rank: winner.rank,
      prize_tier: winner.prize_rank,
      transaction_type: :contest_winnings,
      description: "Contest winnings - #{contest.name} (Rank #{winner.rank})",
      metadata: %{
        contest_id: contest.id,
        contest_name: contest.name,
        rank: winner.rank,
        total_points: winner.total_points
      }
    }
    
    case Wallets.credit_winnings(winner.user_id, payout_data) do
      {:ok, transaction} ->
        # Broadcast payout notification
        WalletChannel.broadcast_payout(
          winner.user_id,
          %{
            contest_id: contest.id,
            contest_name: contest.name,
            amount: winner.prize_amount,
            rank: winner.rank,
            prize_tier: winner.prize_rank
          }
        )
        
        # Update wallet balance notification
        case Wallets.get_balance(winner.user_id) do
          {:ok, balance} ->
            WalletChannel.broadcast_balance_update(winner.user_id, balance)
          
          _ ->
            # Log warning but don't fail the payout
            :ok
        end
        
        {:ok, transaction}
      
      {:error, reason} ->
        {:error, {winner.user_id, reason}}
    end
  end
  
  defp perform_refunds(contest) do
    case Contests.get_contest_entries(contest.id) do
      {:ok, entries} ->
        process_entry_refunds(contest, entries)
      
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  defp process_entry_refunds(contest, entries) do
    results = 
      entries
      |> Enum.map(&process_individual_refund(contest, &1))
      |> Enum.group_by(&elem(&1, 0))
    
    case Map.get(results, :error, []) do
      [] ->
        # All refunds successful
        mark_refunds_completed(contest)
        :ok
      
      errors ->
        # Some refunds failed - log and retry
        {:error, "Refund failures: #{inspect(errors)}"}
    end
  end
  
  defp process_individual_refund(contest, entry) do
    refund_data = %{
      contest_id: contest.id,
      user_id: entry.user_id,
      amount: entry.entry_fee,
      transaction_type: :contest_refund,
      description: "Contest refund - #{contest.name} (Cancelled)",
      metadata: %{
        contest_id: contest.id,
        contest_name: contest.name,
        original_entry_fee: entry.entry_fee,
        cancellation_reason: contest.cancellation_reason
      }
    }
    
    case Wallets.credit_refund(entry.user_id, refund_data) do
      {:ok, transaction} ->
        # Broadcast refund notification
        WalletChannel.broadcast_transaction(
          entry.user_id,
          transaction
        )
        
        # Update wallet balance notification
        case Wallets.get_balance(entry.user_id) do
          {:ok, balance} ->
            WalletChannel.broadcast_balance_update(entry.user_id, balance)
          
          _ ->
            # Log warning but don't fail the refund
            :ok
        end
        
        {:ok, transaction}
      
      {:error, reason} ->
        {:error, {entry.user_id, reason}}
    end
  end
  
  defp mark_payouts_completed(contest) do
    Contests.update_contest(contest.id, %{
      payouts_completed_at: DateTime.utc_now(),
      payout_status: :completed
    })
  end
  
  defp mark_refunds_completed(contest) do
    Contests.update_contest(contest.id, %{
      refunds_completed_at: DateTime.utc_now(),
      refund_status: :completed
    })
  end
end