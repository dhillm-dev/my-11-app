defmodule PicknwinAdmin.Players do
  @moduledoc """
  The Players context.
  """

  import Ecto.Query, warn: false
  alias PicknwinAdmin.Repo
  alias PicknwinAdmin.Players.Player

  @doc """
  Returns the list of players with optional filtering and pagination.
  """
  def list_players(opts \\[]) do
    Player
    |> apply_filters(opts)
    |> apply_sorting(opts)
    |> apply_pagination(opts)
    |> Repo.all()
    |> Repo.preload([:match])
  end

  @doc """
  Gets the total count of players with optional filtering.
  """
  def count_players(opts \\[]) do
    Player
    |> apply_filters(opts)
    |> Repo.aggregate(:count, :id)
  end

  @doc """
  Gets a single player.
  """
  def get_player!(id) do
    Player
    |> Repo.get!(id)
    |> Repo.preload([:match])
  end

  @doc """
  Gets a player by external_id and match_id.
  """
  def get_player_by_external_id(external_id, match_id) do
    Player
    |> where([p], p.external_id == ^external_id and p.match_id == ^match_id)
    |> Repo.one()
    |> case do
      nil -> nil
      player -> Repo.preload(player, [:match])
    end
  end

  @doc """
  Gets players for a specific match.
  """
  def get_players_for_match(match_id, opts \\[]) do
    Player
    |> where([p], p.match_id == ^match_id)
    |> apply_filters(opts)
    |> apply_sorting(opts)
    |> Repo.all()
    |> Repo.preload([:match])
  end

  @doc """
  Creates a player.
  """
  def create_player(attrs \\ %{}) do
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
  Updates player fantasy points.
  """
  def update_player_points(%Player{} = player, points) do
    player
    |> Player.points_changeset(%{fantasy_points: points})
    |> Repo.update()
  end

  @doc """
  Updates player playing eleven status.
  """
  def update_playing_eleven(%Player{} = player, is_playing) do
    player
    |> Player.playing_eleven_changeset(%{is_playing_eleven: is_playing})
    |> Repo.update()
  end

  @doc """
  Deletes a player.
  """
  def delete_player(%Player{} = player) do
    Repo.delete(player)
  end

  @doc """
  Bulk creates or updates players for a match.
  """
  def upsert_players_for_match(match_id, players_data) do
    Repo.transaction(fn ->
      Enum.map(players_data, fn player_data ->
        case get_player_by_external_id(player_data.external_id, match_id) do
          nil ->
            create_player(Map.put(player_data, :match_id, match_id))
          existing_player ->
            update_player(existing_player, player_data)
        end
      end)
    end)
  end

  @doc """
  Bulk updates player points for a match.
  """
  def bulk_update_points(match_id, points_data) do
    Repo.transaction(fn ->
      Enum.each(points_data, fn {external_id, points} ->
        case get_player_by_external_id(external_id, match_id) do
          nil -> {:error, "Player not found: #{external_id}"}
          player -> update_player_points(player, points)
        end
      end)
    end)
  end

  @doc """
  Bulk updates playing eleven status for a match.
  """
  def bulk_update_playing_eleven(match_id, playing_eleven_ids) do
    Repo.transaction(fn ->
      # First, set all players for this match as not playing
      from(p in Player, where: p.match_id == ^match_id)
      |> Repo.update_all(set: [is_playing_eleven: false])
      
      # Then, set specified players as playing
      from(p in Player, where: p.match_id == ^match_id and p.external_id in ^playing_eleven_ids)
      |> Repo.update_all(set: [is_playing_eleven: true])
    end)
  end

  @doc """
  Gets player statistics for a match.
  """
  def get_match_player_stats(match_id) do
    from(p in Player,
      where: p.match_id == ^match_id,
      select: %{
        total_players: count(p.id),
        playing_eleven: count(p.id) |> filter(p.is_playing_eleven == true),
        avg_credits: avg(p.credits),
        avg_points: avg(p.fantasy_points),
        top_scorer: max(p.fantasy_points)
      }
    )
    |> Repo.one()
  end

  @doc """
  Gets top performing players across matches.
  """
  def get_top_performers(limit \\ 10) do
    from(p in Player,
      where: not is_nil(p.fantasy_points),
      order_by: [desc: p.fantasy_points],
      limit: ^limit,
      preload: [:match]
    )
    |> Repo.all()
  end

  @doc """
  Gets players by position for a match.
  """
  def get_players_by_position(match_id, position) do
    from(p in Player,
      where: p.match_id == ^match_id and p.position == ^position,
      order_by: [desc: p.fantasy_points, asc: p.credits]
    )
    |> Repo.all()
  end

  # Private helper functions
  defp apply_filters(query, opts) do
    Enum.reduce(opts, query, fn
      {:search, search_term}, query when is_binary(search_term) and search_term != "" ->
        search_pattern = "%#{search_term}%"
        where(query, [p], 
          ilike(p.name, ^search_pattern) or 
          ilike(p.team, ^search_pattern) or
          ilike(p.position, ^search_pattern)
        )
      
      {:match_id, match_id}, query when not is_nil(match_id) ->
        where(query, [p], p.match_id == ^match_id)
      
      {:position, position}, query when is_binary(position) and position != "" ->
        where(query, [p], p.position == ^position)
      
      {:team, team}, query when is_binary(team) and team != "" ->
        where(query, [p], p.team == ^team)
      
      {:is_playing_eleven, is_playing}, query when is_boolean(is_playing) ->
        where(query, [p], p.is_playing_eleven == ^is_playing)
      
      {:credits_min, min_credits}, query when is_number(min_credits) ->
        where(query, [p], p.credits >= ^min_credits)
      
      {:credits_max, max_credits}, query when is_number(max_credits) ->
        where(query, [p], p.credits <= ^max_credits)
      
      {:points_min, min_points}, query when is_number(min_points) ->
        where(query, [p], p.fantasy_points >= ^min_points)
      
      {:points_max, max_points}, query when is_number(max_points) ->
        where(query, [p], p.fantasy_points <= ^max_points)
      
      _, query -> query
    end)
  end

  defp apply_sorting(query, opts) do
    case Keyword.get(opts, :sort_by, "name") do
      "name" -> order_by(query, [p], asc: p.name)
      "name_desc" -> order_by(query, [p], desc: p.name)
      "credits" -> order_by(query, [p], asc: p.credits)
      "credits_desc" -> order_by(query, [p], desc: p.credits)
      "points" -> order_by(query, [p], asc: p.fantasy_points)
      "points_desc" -> order_by(query, [p], desc: p.fantasy_points)
      "position" -> order_by(query, [p], [asc: p.position, asc: p.name])
      "team" -> order_by(query, [p], [asc: p.team, asc: p.name])
      "updated_at" -> order_by(query, [p], desc: p.updated_at)
      _ -> order_by(query, [p], asc: p.name)
    end
  end

  defp apply_pagination(query, opts) do
    page = Keyword.get(opts, :page, 1)
    per_page = Keyword.get(opts, :per_page, 20)
    offset = (page - 1) * per_page
    
    query
    |> limit(^per_page)
    |> offset(^offset)
  end
end