defmodule Picknwin.Matches do
  @moduledoc """
  The Matches context.
  """

  import Ecto.Query, warn: false
  alias Picknwin.Repo
  alias Picknwin.Matches.{Match, Player}
  alias Picknwin.Audit

  @doc """
  Returns the list of matches.
  """
  def list_matches(opts \\\ []) do
    Match
    |> apply_match_filters(opts)
    |> Repo.all()
  end

  @doc """
  Returns upcoming matches.
  """
  def list_upcoming_matches(opts \\\ []) do
    Match.upcoming_query()
    |> apply_match_filters(opts)
    |> Repo.all()
  end

  @doc """
  Returns curated matches only.
  """
  def list_curated_matches(opts \\\ []) do
    Match.curated_query()
    |> apply_match_filters(opts)
    |> Repo.all()
  end

  @doc """
  Gets a single match.
  """
  def get_match!(id), do: Repo.get!(Match, id)

  def get_match(id), do: Repo.get(Match, id)

  @doc """
  Gets a match by external ID.
  """
  def get_match_by_external_id(external_id) do
    Repo.get_by(Match, external_id: external_id)
  end

  @doc """
  Creates a match.
  """
  def create_match(attrs \\\ %{}) do
    %Match{}
    |> Match.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, match} ->
        Audit.log_action("match_created", %{match_id: match.id}, nil)
        {:ok, match}
      error -> error
    end
  end

  @doc """
  Updates a match.
  """
  def update_match(%Match{} = match, attrs) do
    match
    |> Match.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates match curation state.
  """
  def update_curation_state(%Match{} = match, new_state, curator, reason \\\ nil) do
    old_state = match.curation_state
    attrs = %{curation_state: new_state}
    attrs = if reason, do: Map.put(attrs, :blacklist_reason, reason), else: attrs
    
    match
    |> Match.curation_changeset(attrs, curator)
    |> Repo.update()
    |> case do
      {:ok, updated_match} ->
        Audit.log_action("match_curation_updated", %{
          match_id: match.id,
          curation_change: %{
            before: old_state,
            after: new_state,
            reason: reason
          }
        }, curator)
        {:ok, updated_match}
      error -> error
    end
  end

  @doc """
  Bulk update curation states.
  """
  def bulk_update_curation(match_ids, new_state, curator, reason \\\ nil) when is_list(match_ids) do
    matches = Repo.all(from m in Match, where: m.id in ^match_ids)
    
    results = Enum.map(matches, fn match ->
      update_curation_state(match, new_state, curator, reason)
    end)
    
    success_count = Enum.count(results, fn {status, _} -> status == :ok end)
    
    Audit.log_action("bulk_match_curation", %{
      match_ids: match_ids,
      new_state: new_state,
      success_count: success_count,
      total_count: length(match_ids),
      reason: reason
    }, curator)
    
    {:ok, %{success: success_count, total: length(match_ids), results: results}}
  end

  @doc """
  Deletes a match.
  """
  def delete_match(%Match{} = match) do
    Repo.delete(match)
  end

  @doc """
  Syncs match data from external feed.
  """
  def sync_from_feed(feed_data) when is_list(feed_data) do
    results = Enum.map(feed_data, &sync_single_match/1)
    
    success_count = Enum.count(results, fn {status, _} -> status == :ok end)
    
    Audit.log_action("feed_sync", %{
      total_matches: length(feed_data),
      success_count: success_count
    }, nil)
    
    {:ok, %{success: success_count, total: length(feed_data)}}
  end

  defp sync_single_match(feed_match) do
    case get_match_by_external_id(feed_match.external_id) do
      nil -> create_match(feed_match)
      existing -> update_match(existing, feed_match)
    end
  end

  # Player functions

  @doc """
  Returns players for a match.
  """
  def list_players(match_id, opts \\\ []) do
    Player
    |> where([p], p.match_id == ^match_id)
    |> apply_player_filters(opts)
    |> Repo.all()
  end

  @doc """
  Gets a single player.
  """
  def get_player!(id), do: Repo.get!(Player, id)

  def get_player(id), do: Repo.get(Player, id)

  @doc """
  Creates a player.
  """
  def create_player(attrs \\\ %{}) do
    %Player{}
    |> Player.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a player.
  """
  def update_player(%Player{} = player, attrs) do
    player
    |> Player.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates player scoring.
  """
  def update_player_scoring(%Player{} = player, attrs) do
    player
    |> Player.scoring_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a player.
  """
  def delete_player(%Player{} = player) do
    Repo.delete(player)
  end

  @doc """
  Syncs players from feed data.
  """
  def sync_players_from_feed(match_id, feed_players) when is_list(feed_players) do
    # Delete existing players for this match
    from(p in Player, where: p.match_id == ^match_id)
    |> Repo.delete_all()
    
    # Insert new players
    players_with_match_id = Enum.map(feed_players, &Map.put(&1, :match_id, match_id))
    
    results = Enum.map(players_with_match_id, &create_player/1)
    success_count = Enum.count(results, fn {status, _} -> status == :ok end)
    
    {:ok, %{success: success_count, total: length(feed_players)}}
  end

  # Filter helpers

  defp apply_match_filters(query, []), do: query
  defp apply_match_filters(query, [{:league, league} | rest]) do
    query
    |> Match.by_league_query(league)
    |> apply_match_filters(rest)
  end
  defp apply_match_filters(query, [{:curation_state, state} | rest]) do
    query
    |> where([m], m.curation_state == ^state)
    |> apply_match_filters(rest)
  end
  defp apply_match_filters(query, [{:big_matches_only, true} | rest]) do
    query
    |> Match.big_matches_query()
    |> apply_match_filters(rest)
  end
  defp apply_match_filters(query, [{:date_range, {start_date, end_date}} | rest]) do
    query
    |> Match.by_date_range_query(start_date, end_date)
    |> apply_match_filters(rest)
  end
  defp apply_match_filters(query, [{:status, status} | rest]) do
    query
    |> where([m], m.status == ^status)
    |> apply_match_filters(rest)
  end
  defp apply_match_filters(query, [_unknown | rest]), do: apply_match_filters(query, rest)

  defp apply_player_filters(query, []), do: query
  defp apply_player_filters(query, [{:team, team} | rest]) do
    query
    |> Player.by_team_query(team)
    |> apply_player_filters(rest)
  end
  defp apply_player_filters(query, [{:position, position} | rest]) do
    query
    |> Player.by_position_query(position)
    |> apply_player_filters(rest)
  end
  defp apply_player_filters(query, [{:starters_only, true} | rest]) do
    query
    |> Player.starters_query()
    |> apply_player_filters(rest)
  end
  defp apply_player_filters(query, [{:available_only, true} | rest]) do
    query
    |> Player.available_query()
    |> apply_player_filters(rest)
  end
  defp apply_player_filters(query, [_unknown | rest]), do: apply_player_filters(query, rest)
end