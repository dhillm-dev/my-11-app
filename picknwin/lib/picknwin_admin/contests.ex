defmodule PicknwinAdmin.Contests do
  @moduledoc """
  The Contests context.
  """

  import Ecto.Query, warn: false
  alias PicknwinAdmin.Repo

  alias PicknwinAdmin.Contests.Contest
  alias PicknwinAdmin.Contests.ContestEntry

  @doc """
  Returns the list of contests.
  """
  def list_contests do
    Repo.all(Contest)
  end

  @doc """
  Returns the list of contests with filters and pagination.
  """
  def list_contests(filters \\ %{}, opts \\ []) do
    Contest
    |> apply_filters(filters)
    |> apply_sorting(opts[:sort_by], opts[:sort_dir])
    |> maybe_paginate(opts)
    |> preload([:match, :created_by, :published_by])
    |> Repo.all()
  end

  @doc """
  Gets a single contest.
  """
  def get_contest!(id) do
    Repo.get!(Contest, id)
    |> Repo.preload([:match, :created_by, :published_by, :cancelled_by])
  end

  @doc """
  Creates a contest.
  """
  def create_contest(attrs \\ %{}) do
    %Contest{}
    |> Contest.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a contest.
  """
  def update_contest(%Contest{} = contest, attrs) do
    contest
    |> Contest.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a contest.
  """
  def delete_contest(%Contest{} = contest) do
    Repo.delete(contest)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking contest changes.
  """
  def change_contest(%Contest{} = contest, attrs \\ %{}) do
    Contest.changeset(contest, attrs)
  end

  @doc """
  Publishes a contest (makes it live for users).
  """
  def publish_contest(%Contest{} = contest, admin) do
    update_contest(contest, %{
      status: "live",
      published_at: DateTime.utc_now(),
      published_by_id: admin.id
    })
  end

  @doc """
  Cancels a contest.
  """
  def cancel_contest(%Contest{} = contest, admin, reason \\ nil) do
    update_contest(contest, %{
      status: "cancelled",
      cancelled_at: DateTime.utc_now(),
      cancelled_by_id: admin.id,
      cancellation_reason: reason
    })
  end

  @doc """
  Bulk publish contests.
  """
  def bulk_publish_contests(contest_ids, admin) when is_list(contest_ids) do
    from(c in Contest, where: c.id in ^contest_ids and c.status == "draft")
    |> Repo.update_all(
      set: [
        status: "live",
        published_at: DateTime.utc_now(),
        published_by_id: admin.id,
        updated_at: DateTime.utc_now()
      ]
    )
  end

  @doc """
  Bulk cancel contests.
  """
  def bulk_cancel_contests(contest_ids, admin, reason \\ nil) when is_list(contest_ids) do
    from(c in Contest, where: c.id in ^contest_ids and c.status in ["draft", "live"])
    |> Repo.update_all(
      set: [
        status: "cancelled",
        cancelled_at: DateTime.utc_now(),
        cancelled_by_id: admin.id,
        cancellation_reason: reason,
        updated_at: DateTime.utc_now()
      ]
    )
  end

  @doc """
  Gets contests statistics.
  """
  def get_contests_stats do
    from(c in Contest,
      select: %{
        total: count(c.id),
        draft: count(fragment("CASE WHEN ? = 'draft' THEN 1 END", c.status)),
        live: count(fragment("CASE WHEN ? = 'live' THEN 1 END", c.status)),
        completed: count(fragment("CASE WHEN ? = 'completed' THEN 1 END", c.status)),
        cancelled: count(fragment("CASE WHEN ? = 'cancelled' THEN 1 END", c.status)),
        total_prize_pool: sum(c.prize_pool),
        total_entries: sum(c.entries_count)
      }
    )
    |> Repo.one()
  end

  @doc """
  Gets contest entries for a specific contest.
  """
  def list_contest_entries(contest_id, opts \\ []) do
    ContestEntry
    |> where([ce], ce.contest_id == ^contest_id)
    |> maybe_paginate_entries(opts)
    |> preload([:user, :contest])
    |> Repo.all()
  end

  @doc """
  Gets a single contest entry.
  """
  def get_contest_entry!(id) do
    Repo.get!(ContestEntry, id)
    |> Repo.preload([:user, :contest])
  end

  @doc """
  Creates a contest entry.
  """
  def create_contest_entry(attrs \\ %{}) do
    %ContestEntry{}
    |> ContestEntry.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a contest entry.
  """
  def update_contest_entry(%ContestEntry{} = entry, attrs) do
    entry
    |> ContestEntry.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a contest entry.
  """
  def delete_contest_entry(%ContestEntry{} = entry) do
    Repo.delete(entry)
  end

  # Private functions

  defp apply_filters(query, filters) do
    Enum.reduce(filters, query, fn
      {:search, search_term}, query when is_binary(search_term) and search_term != "" ->
        search_pattern = "%#{search_term}%"
        where(query, [c], ilike(c.name, ^search_pattern))

      {:status, status}, query when is_binary(status) and status != "" ->
        where(query, [c], c.status == ^status)

      {:type, type}, query when is_binary(type) and type != "" ->
        where(query, [c], c.type == ^type)

      {:template, template}, query when is_binary(template) and template != "" ->
        where(query, [c], c.template == ^template)

      {:is_guaranteed, true}, query ->
        where(query, [c], c.is_guaranteed == true)

      {:is_mega, true}, query ->
        where(query, [c], c.is_mega == true)

      {:is_featured, true}, query ->
        where(query, [c], c.is_featured == true)

      {:match_id, match_id}, query when not is_nil(match_id) ->
        where(query, [c], c.match_id == ^match_id)

      {:created_by_id, admin_id}, query when not is_nil(admin_id) ->
        where(query, [c], c.created_by_id == ^admin_id)

      {:entry_fee_min, min_fee}, query when not is_nil(min_fee) ->
        where(query, [c], c.entry_fee >= ^min_fee)

      {:entry_fee_max, max_fee}, query when not is_nil(max_fee) ->
        where(query, [c], c.entry_fee <= ^max_fee)

      {:prize_pool_min, min_pool}, query when not is_nil(min_pool) ->
        where(query, [c], c.prize_pool >= ^min_pool)

      {:prize_pool_max, max_pool}, query when not is_nil(max_pool) ->
        where(query, [c], c.prize_pool <= ^max_pool)

      _, query ->
        query
    end)
  end

  defp apply_sorting(query, sort_by, sort_dir) do
    sort_dir = if sort_dir in [:asc, :desc], do: sort_dir, else: :desc
    
    case sort_by do
      "name" -> order_by(query, [c], [{^sort_dir, c.name}])
      "entry_fee" -> order_by(query, [c], [{^sort_dir, c.entry_fee}])
      "prize_pool" -> order_by(query, [c], [{^sort_dir, c.prize_pool}])
      "max_entries" -> order_by(query, [c], [{^sort_dir, c.max_entries}])
      "entries_count" -> order_by(query, [c], [{^sort_dir, c.entries_count}])
      "status" -> order_by(query, [c], [{^sort_dir, c.status}])
      "created_at" -> order_by(query, [c], [{^sort_dir, c.inserted_at}])
      "starts_at" -> order_by(query, [c], [{^sort_dir, c.starts_at}])
      _ -> order_by(query, [c], desc: c.inserted_at)
    end
  end

  defp maybe_paginate(query, opts) do
    if opts[:page] && opts[:per_page] do
      page = max(opts[:page], 1)
      per_page = min(opts[:per_page], 100)
      offset = (page - 1) * per_page
      
      query
      |> limit(^per_page)
      |> offset(^offset)
    else
      query
    end
  end

  defp maybe_paginate_entries(query, opts) do
    if opts[:page] && opts[:per_page] do
      page = max(opts[:page], 1)
      per_page = min(opts[:per_page], 100)
      offset = (page - 1) * per_page
      
      query
      |> limit(^per_page)
      |> offset(^offset)
    else
      query
    end
  end
end