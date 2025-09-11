defmodule Picknwin.Scoring do
  @moduledoc """
  Elixir wrapper for Gleam scoring engine.
  """

  @type role :: :gk | :def | :mid | :fwd
  @type event :: 
    {:goal, integer()} |
    {:assist, integer()} |
    {:clean_sheet, integer()} |
    {:save, integer()} |
    {:penalty_save, integer()} |
    {:penalty_miss, integer()} |
    {:yellow_card, integer()} |
    {:red_card, integer()} |
    {:own_goal, integer()} |
    {:appearance, integer(), integer()}

  @doc """
  Scores a single event for a player based on their role.
  
  ## Scoring Rules
  - Goal: Fwd +4, Mid +5, Def/GK +6
  - Assist: +3
  - Clean Sheet: GK/Def +4, Mid +1
  - Save (GK): +1 per 3 saves
  - Penalty Save: +5
  - Penalty Miss: -2
  - Yellow Card: -1
  - Red Card: -3
  - Own Goal: -2
  - Appearance: 1-59 min +1, 60+ min +2
  
  ## Examples
  
      iex> Picknwin.Scoring.score_event({:goal, 1}, :fwd)
      4
      
      iex> Picknwin.Scoring.score_event({:goal, 1}, :gk)
      6
      
      iex> Picknwin.Scoring.score_event({:appearance, 1, 75}, :mid)
      2
  """
  @spec score_event(event(), role()) :: integer()
  def score_event(event, role) do
    gleam_event = convert_event_to_gleam(event)
    gleam_role = convert_role_to_gleam(role)
    :picknwin_rules@scoring.score_event(gleam_event, gleam_role)
  end
  
  @doc """
  Scores all events for a single player with captain/vice-captain multipliers.
  
  ## Examples
  
      iex> events = [{:goal, 1}, {:assist, 1}, {:appearance, 1, 90}]
      iex> Picknwin.Scoring.score_player(events, :fwd, true, false)
      18  # (4 + 3 + 2) * 2 for captain
      
      iex> Picknwin.Scoring.score_player(events, :fwd, false, true)
      13  # (4 + 3 + 2) * 1.5 for vice-captain (rounded down)
  """
  @spec score_player([event()], role(), boolean(), boolean()) :: integer()
  def score_player(events, role, is_captain, is_vice) do
    gleam_events = Enum.map(events, &convert_event_to_gleam/1)
    gleam_role = convert_role_to_gleam(role)
    :picknwin_rules@scoring.score_player(gleam_events, gleam_role, is_captain, is_vice)
  end
  
  @doc """
  Aggregates team score from all player events.
  
  ## Parameters
  - `events_by_player`: Map of player_id -> list of events
  - `captain_id`: ID of team captain
  - `vice_id`: ID of vice-captain
  - `role_map`: Map of player_id -> role
  
  ## Examples
  
      iex> events_by_player = %{
      ...>   1 => [{:goal, 1}, {:appearance, 1, 90}],
      ...>   2 => [{:assist, 2}, {:appearance, 2, 45}]
      ...> }
      iex> role_map = %{1 => :fwd, 2 => :mid}
      iex> Picknwin.Scoring.aggregate_team(events_by_player, 1, 2, role_map)
      25  # Captain goal+appearance doubled + vice assist+appearance * 1.5
  """
  @spec aggregate_team(map(), integer(), integer(), map()) :: integer()
  def aggregate_team(events_by_player, captain_id, vice_id, role_map) do
    # Convert events map to Gleam format
    gleam_events_map = 
      events_by_player
      |> Enum.map(fn {player_id, events} ->
        gleam_events = Enum.map(events, &convert_event_to_gleam/1)
        {player_id, gleam_events}
      end)
      |> Enum.into(%{})
    
    # Convert role map to Gleam format
    gleam_role_map = 
      role_map
      |> Enum.map(fn {player_id, role} ->
        {player_id, convert_role_to_gleam(role)}
      end)
      |> Enum.into(%{})
    
    :picknwin_rules@scoring.aggregate_team(
      gleam_events_map,
      captain_id,
      vice_id,
      gleam_role_map
    )
  end
  
  @doc """
  Calculates individual player scores and returns a detailed breakdown.
  
  Returns a map with player scores and team total.
  """
  @spec score_breakdown(map(), integer(), integer(), map()) :: %{
    player_scores: map(),
    team_total: integer()
  }
  def score_breakdown(events_by_player, captain_id, vice_id, role_map) do
    player_scores = 
      events_by_player
      |> Enum.map(fn {player_id, events} ->
        case Map.get(role_map, player_id) do
          nil -> {player_id, 0}
          role ->
            is_captain = player_id == captain_id
            is_vice = player_id == vice_id
            score = score_player(events, role, is_captain, is_vice)
            {player_id, score}
        end
      end)
      |> Enum.into(%{})
    
    team_total = 
      player_scores
      |> Map.values()
      |> Enum.sum()
    
    %{
      player_scores: player_scores,
      team_total: team_total
    }
  end
  
  # Event creation helpers
  
  @doc "Creates a goal event"
  @spec goal(integer()) :: event()
  def goal(player_id), do: {:goal, player_id}
  
  @doc "Creates an assist event"
  @spec assist(integer()) :: event()
  def assist(player_id), do: {:assist, player_id}
  
  @doc "Creates a clean sheet event"
  @spec clean_sheet(integer()) :: event()
  def clean_sheet(player_id), do: {:clean_sheet, player_id}
  
  @doc "Creates a save event"
  @spec save(integer()) :: event()
  def save(player_id), do: {:save, player_id}
  
  @doc "Creates a penalty save event"
  @spec penalty_save(integer()) :: event()
  def penalty_save(player_id), do: {:penalty_save, player_id}
  
  @doc "Creates a penalty miss event"
  @spec penalty_miss(integer()) :: event()
  def penalty_miss(player_id), do: {:penalty_miss, player_id}
  
  @doc "Creates a yellow card event"
  @spec yellow_card(integer()) :: event()
  def yellow_card(player_id), do: {:yellow_card, player_id}
  
  @doc "Creates a red card event"
  @spec red_card(integer()) :: event()
  def red_card(player_id), do: {:red_card, player_id}
  
  @doc "Creates an own goal event"
  @spec own_goal(integer()) :: event()
  def own_goal(player_id), do: {:own_goal, player_id}
  
  @doc "Creates an appearance event"
  @spec appearance(integer(), integer()) :: event()
  def appearance(player_id, minutes), do: {:appearance, player_id, minutes}
  
  # Private helper functions
  
  defp convert_event_to_gleam({:goal, player_id}), do: {:goal, player_id}
  defp convert_event_to_gleam({:assist, player_id}), do: {:assist, player_id}
  defp convert_event_to_gleam({:clean_sheet, player_id}), do: {:clean_sheet, player_id}
  defp convert_event_to_gleam({:save, player_id}), do: {:save, player_id}
  defp convert_event_to_gleam({:penalty_save, player_id}), do: {:penalty_save, player_id}
  defp convert_event_to_gleam({:penalty_miss, player_id}), do: {:penalty_miss, player_id}
  defp convert_event_to_gleam({:yellow_card, player_id}), do: {:yellow_card, player_id}
  defp convert_event_to_gleam({:red_card, player_id}), do: {:red_card, player_id}
  defp convert_event_to_gleam({:own_goal, player_id}), do: {:own_goal, player_id}
  defp convert_event_to_gleam({:appearance, player_id, minutes}), do: {:appearance, player_id, minutes}
  
  defp convert_role_to_gleam(:gk), do: :gk
  defp convert_role_to_gleam(:def), do: :def
  defp convert_role_to_gleam(:mid), do: :mid
  defp convert_role_to_gleam(:fwd), do: :fwd
end