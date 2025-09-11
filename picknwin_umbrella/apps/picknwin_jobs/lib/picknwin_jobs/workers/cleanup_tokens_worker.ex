defmodule PicknwinJobs.Workers.CleanupTokensWorker do
  @moduledoc """
  Oban worker to cleanup expired authentication tokens and sessions.
  
  This job runs periodically to maintain database hygiene by removing:
  - Expired JWT refresh tokens
  - Expired password reset tokens
  - Expired email verification tokens
  - Old session data
  
  This job is idempotent and safe to run multiple times.
  """
  use Oban.Worker, queue: :maintenance, max_attempts: 3
  
  alias Picknwin.Accounts
  alias Picknwin.Sessions
  
  # Default cleanup intervals (in days)
  @default_token_expiry_days 30
  @default_session_expiry_days 7
  @default_batch_size 1000
  
  @impl Oban.Worker
  def perform(%Oban.Job{args: args}) do
    token_expiry_days = Map.get(args, "token_expiry_days", @default_token_expiry_days)
    session_expiry_days = Map.get(args, "session_expiry_days", @default_session_expiry_days)
    batch_size = Map.get(args, "batch_size", @default_batch_size)
    
    cleanup_results = %{
      expired_tokens: cleanup_expired_tokens(token_expiry_days, batch_size),
      expired_sessions: cleanup_expired_sessions(session_expiry_days, batch_size),
      orphaned_data: cleanup_orphaned_data(batch_size)
    }
    
    log_cleanup_results(cleanup_results)
    :ok
  end
  
  @doc """
  Schedule periodic token cleanup job.
  
  ## Options
  - `:token_expiry_days` - Days after which tokens are considered expired (default: 30)
  - `:session_expiry_days` - Days after which sessions are considered expired (default: 7)
  - `:batch_size` - Number of records to process in each batch (default: 1000)
  """
  def schedule_periodic(opts \\[]) do
    args = %{
      "token_expiry_days" => Keyword.get(opts, :token_expiry_days, @default_token_expiry_days),
      "session_expiry_days" => Keyword.get(opts, :session_expiry_days, @default_session_expiry_days),
      "batch_size" => Keyword.get(opts, :batch_size, @default_batch_size)
    }
    
    # Schedule to run daily at 2 AM UTC
    schedule_time = next_cleanup_time()
    
    args
    |> new(scheduled_at: schedule_time)
    |> Oban.insert()
  end
  
  @doc """
  Schedule immediate cleanup job.
  """
  def schedule_immediate(opts \\[]) do
    args = %{
      "token_expiry_days" => Keyword.get(opts, :token_expiry_days, @default_token_expiry_days),
      "session_expiry_days" => Keyword.get(opts, :session_expiry_days, @default_session_expiry_days),
      "batch_size" => Keyword.get(opts, :batch_size, @default_batch_size)
    }
    
    args
    |> new()
    |> Oban.insert()
  end
  
  # Private functions
  
  defp cleanup_expired_tokens(expiry_days, batch_size) do
    cutoff_date = DateTime.utc_now() |> DateTime.add(-expiry_days, :day)
    
    results = %{
      refresh_tokens: cleanup_expired_refresh_tokens(cutoff_date, batch_size),
      reset_tokens: cleanup_expired_reset_tokens(cutoff_date, batch_size),
      verification_tokens: cleanup_expired_verification_tokens(cutoff_date, batch_size)
    }
    
    total_cleaned = 
      results
      |> Map.values()
      |> Enum.sum()
    
    Map.put(results, :total, total_cleaned)
  end
  
  defp cleanup_expired_refresh_tokens(cutoff_date, batch_size) do
    case Accounts.delete_expired_refresh_tokens(cutoff_date, batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp cleanup_expired_reset_tokens(cutoff_date, batch_size) do
    case Accounts.delete_expired_reset_tokens(cutoff_date, batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp cleanup_expired_verification_tokens(cutoff_date, batch_size) do
    case Accounts.delete_expired_verification_tokens(cutoff_date, batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp cleanup_expired_sessions(expiry_days, batch_size) do
    cutoff_date = DateTime.utc_now() |> DateTime.add(-expiry_days, :day)
    
    results = %{
      user_sessions: cleanup_user_sessions(cutoff_date, batch_size),
      guest_sessions: cleanup_guest_sessions(cutoff_date, batch_size)
    }
    
    total_cleaned = 
      results
      |> Map.values()
      |> Enum.sum()
    
    Map.put(results, :total, total_cleaned)
  end
  
  defp cleanup_user_sessions(cutoff_date, batch_size) do
    case Sessions.delete_expired_user_sessions(cutoff_date, batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp cleanup_guest_sessions(cutoff_date, batch_size) do
    case Sessions.delete_expired_guest_sessions(cutoff_date, batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp cleanup_orphaned_data(batch_size) do
    results = %{
      orphaned_teams: cleanup_orphaned_teams(batch_size),
      orphaned_entries: cleanup_orphaned_entries(batch_size),
      orphaned_events: cleanup_orphaned_events(batch_size)
    }
    
    total_cleaned = 
      results
      |> Map.values()
      |> Enum.sum()
    
    Map.put(results, :total, total_cleaned)
  end
  
  defp cleanup_orphaned_teams(batch_size) do
    # Clean up team sheets for cancelled contests older than 30 days
    cutoff_date = DateTime.utc_now() |> DateTime.add(-30, :day)
    
    case Contests.delete_orphaned_teams(cutoff_date, batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp cleanup_orphaned_entries(batch_size) do
    # Clean up contest entries for deleted users
    case Contests.delete_orphaned_entries(batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp cleanup_orphaned_events(batch_size) do
    # Clean up match events for contests older than 90 days
    cutoff_date = DateTime.utc_now() |> DateTime.add(-90, :day)
    
    case Contests.delete_old_match_events(cutoff_date, batch_size) do
      {:ok, count} -> count
      {:error, _reason} -> 0
    end
  end
  
  defp next_cleanup_time do
    now = DateTime.utc_now()
    
    # Schedule for 2 AM UTC tomorrow
    tomorrow = DateTime.add(now, 1, :day)
    
    %{tomorrow | hour: 2, minute: 0, second: 0, microsecond: {0, 6}}
  end
  
  defp log_cleanup_results(results) do
    require Logger
    
    total_tokens = get_in(results, [:expired_tokens, :total]) || 0
    total_sessions = get_in(results, [:expired_sessions, :total]) || 0
    total_orphaned = get_in(results, [:orphaned_data, :total]) || 0
    
    grand_total = total_tokens + total_sessions + total_orphaned
    
    Logger.info(
      "Token cleanup completed: #{grand_total} records cleaned " <>
      "(tokens: #{total_tokens}, sessions: #{total_sessions}, orphaned: #{total_orphaned})",
      cleanup_results: results
    )
  end
end