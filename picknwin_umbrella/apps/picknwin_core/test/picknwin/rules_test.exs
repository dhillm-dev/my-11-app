defmodule Picknwin.RulesTest do
  use ExUnit.Case, async: true
  
  alias Picknwin.Rules
  
  describe "new_player/4" do
    test "creates a valid player struct" do
      player = Rules.new_player(1, 10, :gk, 8)
      
      assert player.id == 1
      assert player.team_id == 10
      assert player.role == :gk
      assert player.credit == 8
    end
  end
  
  describe "new_team_sheet/3" do
    test "creates a valid team sheet struct" do
      players = [
        Rules.new_player(1, 1, :gk, 8),
        Rules.new_player(2, 2, :def, 7)
      ]
      
      team_sheet = Rules.new_team_sheet(players, 1, 2)
      
      assert team_sheet.players == players
      assert team_sheet.captain_id == 1
      assert team_sheet.vice_captain_id == 2
    end
  end
  
  describe "validate_team/2" do
    setup do
      valid_players = [
        Rules.new_player(1, 1, :gk, 8),     # GK
        Rules.new_player(2, 1, :def, 7),    # DEF
        Rules.new_player(3, 2, :def, 6),    # DEF
        Rules.new_player(4, 3, :def, 5),    # DEF
        Rules.new_player(5, 4, :mid, 9),    # MID
        Rules.new_player(6, 5, :mid, 8),    # MID
        Rules.new_player(7, 6, :mid, 7),    # MID
        Rules.new_player(8, 7, :mid, 6),    # MID
        Rules.new_player(9, 8, :fwd, 10),   # FWD
        Rules.new_player(10, 9, :fwd, 9),   # FWD
        Rules.new_player(11, 10, :fwd, 8)   # FWD
      ]
      
      valid_team = Rules.new_team_sheet(valid_players, 5, 9)
      
      %{valid_team: valid_team, valid_players: valid_players}
    end
    
    test "validates a correct team", %{valid_team: team} do
      assert Rules.validate_team(team, 100) == :ok
    end
    
    test "returns error for team with wrong number of players" do
      players = [Rules.new_player(1, 1, :gk, 8)]
      team = Rules.new_team_sheet(players, 1, 1)
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      assert :not_eleven in errors
    end
    
    test "returns error for team without goalkeeper", %{valid_players: players} do
      # Replace GK with another defender
      players_no_gk = [
        Rules.new_player(1, 1, :def, 8) | Enum.drop(players, 1)
      ]
      
      team = Rules.new_team_sheet(players_no_gk, 5, 9)
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      assert :missing_gk in errors
    end
    
    test "returns error for team with too many defenders", %{valid_players: players} do
      # Add extra defender (replace midfielder)
      players_extra_def = [
        Rules.new_player(1, 1, :gk, 8),
        Rules.new_player(2, 1, :def, 7),
        Rules.new_player(3, 2, :def, 6),
        Rules.new_player(4, 3, :def, 5),
        Rules.new_player(5, 4, :def, 4),  # Extra defender
        Rules.new_player(6, 5, :def, 3),  # Extra defender
        Rules.new_player(7, 6, :def, 2),  # Extra defender (7 total)
        Rules.new_player(8, 7, :mid, 6),
        Rules.new_player(9, 8, :fwd, 10),
        Rules.new_player(10, 9, :fwd, 9),
        Rules.new_player(11, 10, :fwd, 8)
      ]
      
      team = Rules.new_team_sheet(players_extra_def, 8, 9)
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      assert {:role_bounds, :def} in errors
    end
    
    test "returns error for team with too many players from same team", %{valid_players: players} do
      # Make 8 players from team 1
      players_same_team = [
        Rules.new_player(1, 1, :gk, 8),
        Rules.new_player(2, 1, :def, 7),
        Rules.new_player(3, 1, :def, 6),
        Rules.new_player(4, 1, :def, 5),
        Rules.new_player(5, 1, :mid, 9),
        Rules.new_player(6, 1, :mid, 8),
        Rules.new_player(7, 1, :mid, 7),
        Rules.new_player(8, 1, :fwd, 6),  # 8th player from team 1
        Rules.new_player(9, 2, :mid, 10),
        Rules.new_player(10, 2, :fwd, 9),
        Rules.new_player(11, 2, :fwd, 8)
      ]
      
      team = Rules.new_team_sheet(players_same_team, 5, 9)
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      assert {:too_many_from_team, 1} in errors
    end
    
    test "returns error for team exceeding credit limit", %{valid_team: team} do
      assert {:error, errors} = Rules.validate_team(team, 50)  # Low limit
      assert {:credit_exceeded, 50} in errors
    end
    
    test "returns error for team with missing captain", %{valid_players: players} do
      team = Rules.new_team_sheet(players, 999, 9)  # Non-existent captain
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      assert :missing_captain in errors
    end
    
    test "returns error for team with missing vice captain", %{valid_players: players} do
      team = Rules.new_team_sheet(players, 5, 999)  # Non-existent vice captain
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      assert :missing_vice_captain in errors
    end
    
    test "returns error when captain equals vice captain", %{valid_players: players} do
      team = Rules.new_team_sheet(players, 5, 5)  # Same player
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      assert :captain_equals_vice in errors
    end
    
    test "returns multiple errors for invalid team" do
      # Team with multiple issues
      players = [
        Rules.new_player(1, 1, :def, 8),  # No GK
        Rules.new_player(2, 1, :def, 7)
        # Only 2 players (not 11)
      ]
      
      team = Rules.new_team_sheet(players, 1, 1)  # Captain == Vice
      
      assert {:error, errors} = Rules.validate_team(team, 100)
      
      # Should have multiple errors
      assert :not_eleven in errors
      assert :missing_gk in errors
      assert :captain_equals_vice in errors
      assert length(errors) >= 3
    end
  end
  
  describe "property-based testing" do
    @tag :property
    test "valid teams always pass validation" do
      # This would use a property testing library like StreamData
      # For now, we'll do a simple example
      
      for _i <- 1..10 do
        team = generate_valid_team()
        assert Rules.validate_team(team, 100) == :ok
      end
    end
    
    @tag :property
    test "teams with wrong player count always fail" do
      for count <- [1, 5, 10, 12, 15] do
        team = generate_team_with_player_count(count)
        assert {:error, errors} = Rules.validate_team(team, 100)
        assert :not_eleven in errors
      end
    end
  end
  
  # Helper functions for generating test data
  
  defp generate_valid_team do
    players = [
      Rules.new_player(1, 1, :gk, 8),
      Rules.new_player(2, 2, :def, 7),
      Rules.new_player(3, 3, :def, 6),
      Rules.new_player(4, 4, :def, 5),
      Rules.new_player(5, 5, :mid, 9),
      Rules.new_player(6, 6, :mid, 8),
      Rules.new_player(7, 7, :mid, 7),
      Rules.new_player(8, 8, :mid, 6),
      Rules.new_player(9, 9, :fwd, 10),
      Rules.new_player(10, 10, :fwd, 9),
      Rules.new_player(11, 11, :fwd, 8)
    ]
    
    Rules.new_team_sheet(players, 5, 9)
  end
  
  defp generate_team_with_player_count(count) do
    players = 
      1..count
      |> Enum.map(fn i ->
        role = case rem(i, 4) do
          0 -> :gk
          1 -> :def
          2 -> :mid
          3 -> :fwd
        end
        Rules.new_player(i, i, role, 5 + rem(i, 5))
      end)
    
    captain_id = if count > 0, do: 1, else: 1
    vice_id = if count > 1, do: 2, else: 1
    
    Rules.new_team_sheet(players, captain_id, vice_id)
  end
end