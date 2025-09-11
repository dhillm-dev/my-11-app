defmodule PicknwinAdmin.Matches do
  @moduledoc """
  The Matches context.
  """

  import Ecto.Query, warn: false
  alias PicknwinAdmin.Repo

  alias PicknwinAdmin.Matches.Match

  @doc """
  Returns the list of matches.

  ## Examples

      iex> list_matches()
      [%Match{}, ...]

  """
  def list_matches do
    Repo.all(Match)
  end

  @doc """
  Returns the list of matches with filters and pagination.
  """
  def list_matches(filters \\ %{}, opts \\ []) do
    Match
    |> apply_filters(filters)
    |> apply_sorting(opts[:sort_by], opts[:sort_dir])
    |> maybe_paginate(opts)
    |> Repo.all()
  end

  @doc """
  Gets a single match.

  Raises `Ecto.NoResultsError` if the Match does not exist.

  ## Examples

      iex> get_match!(123)
      %Match{}

      iex> get_match!(456)
      ** (Ecto.NoResultsError)

  """
  def get_match!(id), do: Repo.get!(Match, id)

  @doc """
  Gets a match by external ID.
  """
  def get_match_by_external_id(external_id) do
    Repo.get_by(Match, external_id: external_id)
  end

  @doc """
  Creates a match.

  ## Examples

      iex> create_match(%{field: value})
      {:ok, %Match{}}

      iex> create_match(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_match(attrs \\ %{}) do
    %Match{}
    |> Match.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a match.

  ## Examples

      iex> update_match(match, %{field: new_value})
      {:ok, %Match{}}

      iex> update_match(match, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_match(%Match{} = match, attrs) do
    match
    |> Match.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a match.

  ## Examples

      iex> delete_match(match)
      {:ok, %Match{}}

      iex> delete_match(match)
      {:error, %Ecto.Changeset{}}

  """
  def delete_match(%Match{} = match) do
    Repo.delete(match)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking match changes.

  ## Examples

      iex> change_match(match)
      %Ecto.Changeset{data: %Match{}}

  """
  def change_match(%Match{} = match, attrs \\ %{}) do
    Match.changeset(match, attrs)
  end

  @doc """
  Curates a match (makes it available for contests).
  """
  def curate_match(%Match{} = match, admin) do
    update_match(match, %{
      curation_state: "curated",
      curated_at: DateTime.utc_now(),
      curated_by_id: admin.id
    })
  end

  @doc """
  Blacklists a match (removes from contests).
  """
  def blacklist_match(%Match{} = match, admin, reason \\ nil) do
    update_match(match, %{
      curation_state: "blacklisted",
      blacklisted_at: DateTime.utc_now(),
      blacklisted_by_id: admin.id,
      blacklist_reason: reason
    })
  end

  @doc """
  Bulk curate matches.
  """
  def bulk_curate_matches(match_ids, admin) when is_list(match_ids) do
    from(m in Match, where: m.id in ^match_ids)
    |> Repo.update_all(
      set: [
        curation_state: "curated",
        curated_at: DateTime.utc_now(),
        curated_by_id: admin.id,
        updated_at: DateTime.utc_now()
      ]
    )
  end

  @doc """
  Bulk blacklist matches.
  """
  def bulk_blacklist_matches(match_ids, admin, reason \\ nil) when is_list(match_ids) do
    from(m in Match, where: m.id in ^match_ids)
    |> Repo.update_all(
      set: [
        curation_state: "blacklisted",
        blacklisted_at: DateTime.utc_now(),
        blacklisted_by_id: admin.id,
        blacklist_reason: reason,
        updated_at: DateTime.utc_now()
      ]
    )
  end

  @doc """
  Gets matches statistics.
  """
  def get_matches_stats do
    from(m in Match,
      select: %{
        total: count(m.id),
        curated: count(fragment("CASE WHEN ? = 'curated' THEN 1 END", m.curation_state)),
        blacklisted: count(fragment("CASE WHEN ? = 'blacklisted' THEN 1 END", m.curation_state)),
        feed_only: count(fragment("CASE WHEN ? = 'feed_only' THEN 1 END", m.curation_state)),
        live: count(fragment("CASE WHEN ? = 'live' THEN 1 END", m.status)),
        upcoming: count(fragment("CASE WHEN ? = 'scheduled' THEN 1 END", m.status))
      }
    )
    |> Repo.one()
  end

  # Private functions

  defp apply_filters(query, filters) do
    Enum.reduce(filters, query, fn
      {:search, search_term}, query when is_binary(search_term) and search_term != "" ->
        search_pattern = "%#{search_term}%"
        where(query, [m], 
          ilike(m.home_team, ^search_pattern) or 
          ilike(m.away_team, ^search_pattern) or 
          ilike(m.league, ^search_pattern)
        )

      {:sport, sport}, query when is_binary(sport) and sport != "" ->
        where(query, [m], m.sport == ^sport)

      {:league, league}, query when is_binary(league) and league != "" ->
        where(query, [m], m.league == ^league)

      {:status, status}, query when is_binary(status) and status != "" ->
        where(query, [m], m.status == ^status)

      {:curation_state, state}, query when is_binary(state) and state != "" ->
        where(query, [m], m.curation_state == ^state)

      {:is_big_match, true}, query ->
        where(query, [m], m.is_big_match == true)

      {:date_from, date}, query when not is_nil(date) ->
        where(query, [m], m.kickoff >= ^date)

      {:date_to, date}, query when not is_nil(date) ->
        where(query, [m], m.kickoff <= ^date)

      _, query ->
        query
    end)
  end

  defp apply_sorting(query, sort_by, sort_dir) do
    sort_dir = if sort_dir in [:asc, :desc], do: sort_dir, else: :desc
    
    case sort_by do
      "kickoff" -> order_by(query, [m], [{^sort_dir, m.kickoff}])
      "popularity_score" -> order_by(query, [m], [{^sort_dir, m.popularity_score}])
      "home_team" -> order_by(query, [m], [{^sort_dir, m.home_team}])
      "away_team" -> order_by(query, [m], [{^sort_dir, m.away_team}])
      "league" -> order_by(query, [m], [{^sort_dir, m.league}])
      "status" -> order_by(query, [m], [{^sort_dir, m.status}])
      "curation_state" -> order_by(query, [m], [{^sort_dir, m.curation_state}])
      _ -> order_by(query, [m], desc: m.kickoff)
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
end