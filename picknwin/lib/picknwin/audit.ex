defmodule Picknwin.Audit do
  @moduledoc """
  The Audit context for logging system actions.
  """

  import Ecto.Query, warn: false
  alias Picknwin.Repo
  alias Picknwin.Audit.Log

  @doc """
  Logs an action performed by a user.
  """
  def log_action(action, changes_or_metadata \\\ %{}, actor \\\ nil, opts \\\ []) do
    attrs = %{
      action: action,
      user_id: get_user_id(actor),
      changes: changes_or_metadata,
      metadata: Keyword.get(opts, :metadata, %{}),
      ip_address: Keyword.get(opts, :ip_address),
      user_agent: Keyword.get(opts, :user_agent),
      session_id: Keyword.get(opts, :session_id)
    }
    
    # Extract resource info from changes if available
    attrs = 
      attrs
      |> put_resource_info(changes_or_metadata)
    
    %Log{}
    |> Log.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, log} -> {:ok, log}
      {:error, changeset} -> 
        # Log the error but don't fail the main operation
        require Logger
        Logger.error("Failed to create audit log: #{inspect(changeset.errors)}")
        {:error, changeset}
    end
  end

  @doc """
  Gets audit logs with filters.
  """
  def list_logs(opts \\\ []) do
    Log
    |> apply_log_filters(opts)
    |> preload([:user])
    |> Repo.all()
  end

  @doc """
  Gets recent audit logs.
  """
  def list_recent_logs(limit \\\ 100) do
    Log.recent_query(limit)
    |> preload([:user])
    |> Repo.all()
  end

  @doc """
  Gets audit logs for a specific user.
  """
  def list_user_logs(user_id, opts \\\ []) do
    Log.by_user_query(user_id)
    |> apply_log_filters(opts)
    |> preload([:user])
    |> Repo.all()
  end

  @doc """
  Gets audit logs for a specific resource.
  """
  def list_resource_logs(resource_type, resource_id, opts \\\ []) do
    Log.by_resource_query(resource_type, resource_id)
    |> apply_log_filters(opts)
    |> preload([:user])
    |> Repo.all()
  end

  @doc """
  Gets audit logs by action type.
  """
  def list_logs_by_action(action, opts \\\ []) do
    Log.by_action_query(action)
    |> apply_log_filters(opts)
    |> preload([:user])
    |> Repo.all()
  end

  @doc """
  Gets audit statistics.
  """
  def get_audit_stats(opts \\\ []) do
    start_date = Keyword.get(opts, :start_date, DateTime.add(DateTime.utc_now(), -30, :day))
    end_date = Keyword.get(opts, :end_date, DateTime.utc_now())
    
    base_query = Log.by_date_range_query(start_date, end_date)
    
    %{
      total_actions: get_total_count(base_query),
      actions_by_type: get_actions_by_type(base_query),
      actions_by_user: get_actions_by_user(base_query),
      daily_activity: get_daily_activity(base_query)
    }
  end

  # Helper functions

  defp get_user_id(nil), do: nil
  defp get_user_id(%{id: id}), do: id
  defp get_user_id(user_id) when is_binary(user_id), do: user_id

  defp put_resource_info(attrs, changes) do
    cond do
      Map.has_key?(changes, :match_id) ->
        attrs
        |> Map.put(:resource_type, "match")
        |> Map.put(:resource_id, changes.match_id)
      
      Map.has_key?(changes, :contest_id) ->
        attrs
        |> Map.put(:resource_type, "contest")
        |> Map.put(:resource_id, changes.contest_id)
      
      Map.has_key?(changes, :user_id) ->
        attrs
        |> Map.put(:resource_type, "user")
        |> Map.put(:resource_id, changes.user_id)
      
      Map.has_key?(changes, :entry_id) ->
        attrs
        |> Map.put(:resource_type, "entry")
        |> Map.put(:resource_id, changes.entry_id)
      
      true -> attrs
    end
  end

  defp apply_log_filters(query, []), do: query
  defp apply_log_filters(query, [{:action, action} | rest]) do
    query
    |> Log.by_action_query(action)
    |> apply_log_filters(rest)
  end
  defp apply_log_filters(query, [{:user_id, user_id} | rest]) do
    query
    |> Log.by_user_query(user_id)
    |> apply_log_filters(rest)
  end
  defp apply_log_filters(query, [{:resource_type, resource_type} | rest]) do
    query
    |> where([l], l.resource_type == ^resource_type)
    |> apply_log_filters(rest)
  end
  defp apply_log_filters(query, [{:date_range, {start_date, end_date}} | rest]) do
    query
    |> Log.by_date_range_query(start_date, end_date)
    |> apply_log_filters(rest)
  end
  defp apply_log_filters(query, [{:limit, limit} | rest]) do
    query
    |> limit(^limit)
    |> apply_log_filters(rest)
  end
  defp apply_log_filters(query, [_unknown | rest]), do: apply_log_filters(query, rest)

  defp get_total_count(query) do
    Repo.aggregate(query, :count)
  end

  defp get_actions_by_type(query) do
    query
    |> group_by([l], l.action)
    |> select([l], {l.action, count(l.id)})
    |> Repo.all()
    |> Enum.into(%{})
  end

  defp get_actions_by_user(query) do
    query
    |> join(:left, [l], u in assoc(l, :user))
    |> group_by([l, u], [l.user_id, u.username])
    |> select([l, u], {u.username || "System", count(l.id)})
    |> Repo.all()
    |> Enum.into(%{})
  end

  defp get_daily_activity(query) do
    query
    |> group_by([l], fragment("DATE(?)", l.inserted_at))
    |> select([l], {fragment("DATE(?)", l.inserted_at), count(l.id)})
    |> order_by([l], fragment("DATE(?)", l.inserted_at))
    |> Repo.all()
    |> Enum.into(%{})
  end

  # Convenience functions for common audit actions

  def log_login(user, opts \\\ []) do
    log_action("user_login", %{user_id: user.id}, user, opts)
  end

  def log_logout(user, opts \\\ []) do
    log_action("user_logout", %{user_id: user.id}, user, opts)
  end

  def log_match_curation(match, old_state, new_state, curator, reason \\\ nil) do
    log_action("match_curation_changed", %{
      match_id: match.id,
      curation_change: %{
        before: old_state,
        after: new_state,
        reason: reason
      }
    }, curator)
  end

  def log_contest_status_change(contest, old_status, new_status, actor) do
    log_action("contest_status_changed", %{
      contest_id: contest.id,
      status_change: %{
        before: old_status,
        after: new_status
      }
    }, actor)
  end
end