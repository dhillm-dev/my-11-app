defmodule Picknwin.Rules do
  @moduledoc """
  Elixir wrapper for Gleam team validation rules.
  """

  @type role :: :gk | :def | :mid | :fwd
  @type player :: %{
    id: integer(),
    team_id: integer(),
    role: role(),
    credit: integer()
  }
  @type team_sheet :: %{
    players: [player()],
    captain_id: integer(),
    vice_id: integer()
  }
  @type validation_error :: 
    :not_eleven |
    :missing_gk |
    {:role_bounds, role()} |
    {:too_many_from_team, integer()} |
    {:credit_exceeded, integer()} |
    :missing_captain |
    :missing_vice |
    :captain_equals_vice

  @doc """
  Validates a team sheet according to Pick-11 rules.
  
  ## Rules
  - Exactly 11 players
  - Exactly 1 goalkeeper
  - 3-5 defenders
  - 3-5 midfielders  
  - 1-3 forwards
  - Maximum 7 players from same team
  - Total credits within limit
  - Captain and vice-captain must exist and be different
  
  ## Examples
  
      iex> players = [
      ...>   %{id: 1, team_id: 1, role: :gk, credit: 8},
      ...>   %{id: 2, team_id: 1, role: :def, credit: 7},
      ...>   # ... 9 more players
      ...> ]
      iex> team_sheet = %{players: players, captain_id: 1, vice_id: 2}
      iex> Picknwin.Rules.validate_team(team_sheet, 100)
      :ok
      
      iex> invalid_sheet = %{players: [], captain_id: 1, vice_id: 2}
      iex> Picknwin.Rules.validate_team(invalid_sheet, 100)
      {:error, [:not_eleven, :missing_gk, :missing_captain, :missing_vice]}
  """
  @spec validate_team(team_sheet(), integer()) :: :ok | {:error, [validation_error()]}
  def validate_team(team_sheet, max_credit) do
    # Convert Elixir data to Gleam format
    gleam_players = Enum.map(team_sheet.players, &convert_player_to_gleam/1)
    gleam_sheet = {
      :team_sheet,
      gleam_players,
      team_sheet.captain_id,
      team_sheet.vice_id
    }
    
    # Call Gleam validation function
    case :picknwin_rules@rules.validate_team(gleam_sheet, max_credit) do
      {:ok, nil} -> :ok
      {:error, errors} -> {:error, Enum.map(errors, &convert_error_from_gleam/1)}
    end
  end
  
  @doc """
  Creates a new player struct.
  """
  @spec new_player(integer(), integer(), role(), integer()) :: player()
  def new_player(id, team_id, role, credit) do
    %{
      id: id,
      team_id: team_id,
      role: role,
      credit: credit
    }
  end
  
  @doc """
  Creates a new team sheet struct.
  """
  @spec new_team_sheet([player()], integer(), integer()) :: team_sheet()
  def new_team_sheet(players, captain_id, vice_id) do
    %{
      players: players,
      captain_id: captain_id,
      vice_id: vice_id
    }
  end
  
  # Private helper functions
  
  defp convert_player_to_gleam(player) do
    {
      :player,
      player.id,
      player.team_id,
      convert_role_to_gleam(player.role),
      player.credit
    }
  end
  
  defp convert_role_to_gleam(:gk), do: :gk
  defp convert_role_to_gleam(:def), do: :def
  defp convert_role_to_gleam(:mid), do: :mid
  defp convert_role_to_gleam(:fwd), do: :fwd
  
  defp convert_error_from_gleam(:not_eleven), do: :not_eleven
  defp convert_error_from_gleam(:missing_gk), do: :missing_gk
  defp convert_error_from_gleam({:role_bounds, role}), do: {:role_bounds, convert_role_from_gleam(role)}
  defp convert_error_from_gleam({:too_many_from_team, team_id}), do: {:too_many_from_team, team_id}
  defp convert_error_from_gleam({:credit_exceeded, total}), do: {:credit_exceeded, total}
  defp convert_error_from_gleam(:missing_captain), do: :missing_captain
  defp convert_error_from_gleam(:missing_vice), do: :missing_vice
  defp convert_error_from_gleam(:captain_equals_vice), do: :captain_equals_vice
  
  defp convert_role_from_gleam(:gk), do: :gk
  defp convert_role_from_gleam(:def), do: :def
  defp convert_role_from_gleam(:mid), do: :mid
  defp convert_role_from_gleam(:fwd), do: :fwd
end