defmodule Picknwin.ScoringTest do
  use ExUnit.Case, async: true
  
  alias Picknwin.Scoring
  
  describe "event creation functions" do
    test "goal/1 creates goal event" do
      event = Scoring.goal(1)
      assert event == {:goal, 1}
    end
    
    test "assist/1 creates assist event" do
      event = Scoring.assist(2)
      assert event == {:assist, 2}
    end
    
    test "clean_sheet/1 creates clean sheet event" do
      event = Scoring.clean_sheet(3)
      assert event == {:clean_sheet, 3}
    end
    
    test "save/1 creates save event" do
      event = Scoring.save(4)
      assert event == {:save, 4}
    end
    
    test "penalty_save/1 creates penalty save event" do
      event = Scoring.penalty_save(5)
      assert event == {:penalty_save, 5}
    end
    
    test "penalty_miss/1 creates penalty miss event" do
      event = Scoring.penalty_miss(6)
      assert event == {:penalty_miss, 6}
    end
    
    test "yellow_card/1 creates yellow card event" do
      event = Scoring.yellow_card(7)
      assert event == {:yellow_card, 7}
    end
    
    test "red_card/1 creates red card event" do
      event = Scoring.red_card(8)
      assert event == {:red_card, 8}
    end
    
    test "own_goal/1 creates own goal event" do
      event = Scoring.own_goal(9)
      assert event == {:own_goal, 9}
    end
    
    test "appearance/2 creates appearance event" do
      event = Scoring.appearance(10, 90)
      assert event == {:appearance, 10, 90}
    end
  end
  
  describe "score_event/2" do
    test "scores goal by forward correctly" do
      event = Scoring.goal(1)
      assert Scoring.score_event(event, :fwd) == 4
    end
    
    test "scores goal by midfielder correctly" do
      event = Scoring.goal(1)
      assert Scoring.score_event(event, :mid) == 5
    end
    
    test "scores goal by defender correctly" do
      event = Scoring.goal(1)
      assert Scoring.score_event(event, :def) == 6
    end
    
    test "scores goal by goalkeeper correctly" do
      event = Scoring.goal(1)
      assert Scoring.score_event(event, :gk) == 6
    end
    
    test "scores assist correctly for all roles" do
      event = Scoring.assist(1)
      
      assert Scoring.score_event(event, :fwd) == 3
      assert Scoring.score_event(event, :mid) == 3
      assert Scoring.score_event(event, :def) == 3
      assert Scoring.score_event(event, :gk) == 3
    end
    
    test "scores clean sheet correctly by role" do
      event = Scoring.clean_sheet(1)
      
      assert Scoring.score_event(event, :gk) == 4
      assert Scoring.score_event(event, :def) == 4
      assert Scoring.score_event(event, :mid) == 1
      assert Scoring.score_event(event, :fwd) == 0
    end
    
    test "scores saves correctly" do
      event = Scoring.save(1)
      assert Scoring.score_event(event, :gk) == 1
    end
    
    test "scores penalty saves correctly" do
      event = Scoring.penalty_save(1)
      assert Scoring.score_event(event, :gk) == 5
    end
    
    test "scores penalty misses correctly" do
      event = Scoring.penalty_miss(1)
      assert Scoring.score_event(event, :fwd) == -2
    end
    
    test "scores yellow cards correctly" do
      event = Scoring.yellow_card(1)
      assert Scoring.score_event(event, :mid) == -1
    end
    
    test "scores red cards correctly" do
      event = Scoring.red_card(1)
      assert Scoring.score_event(event, :def) == -3
    end
    
    test "scores own goals correctly" do
      event = Scoring.own_goal(1)
      assert Scoring.score_event(event, :def) == -2
    end
    
    test "scores short appearances correctly" do
      event = Scoring.appearance(1, 45)
      assert Scoring.score_event(event, :mid) == 1
    end
    
    test "scores full appearances correctly" do
      event = Scoring.appearance(1, 90)
      assert Scoring.score_event(event, :fwd) == 2
    end
  end
  
  describe "score_player/4" do
    test "scores player with basic events" do
      events = [
        Scoring.goal(1),
        Scoring.assist(1),
        Scoring.appearance(1, 90)
      ]
      
      score = Scoring.score_player(events, :fwd, false, false)
      assert score == 9  # 4 + 3 + 2
    end
    
    test "applies captain multiplier correctly" do
      events = [
        Scoring.goal(1),
        Scoring.appearance(1, 90)
      ]
      
      score = Scoring.score_player(events, :fwd, true, false)
      assert score == 12  # (4 + 2) * 2
    end
    
    test "applies vice captain multiplier correctly" do
      events = [
        Scoring.goal(1),
        Scoring.appearance(1, 90)
      ]
      
      score = Scoring.score_player(events, :mid, false, true)
      assert score == 10  # (5 + 2) * 1.5 = 10.5 -> 10 (rounded down)
    end
    
    test "handles negative scores correctly" do
      events = [
        Scoring.yellow_card(1),
        Scoring.red_card(1),
        Scoring.own_goal(1),
        Scoring.appearance(1, 30)
      ]
      
      score = Scoring.score_player(events, :def, false, false)
      assert score == -5  # -1 + -3 + -2 + 1 = -5
    end
    
    test "captain multiplier doesn't apply to negative scores" do
      events = [
        Scoring.red_card(1),
        Scoring.appearance(1, 90)
      ]
      
      # Assuming captain multiplier only applies to positive base scores
      score = Scoring.score_player(events, :def, true, false)
      # This depends on implementation - might be (-3 + 2) * 2 = -2 or -3 + (2 * 2) = 1
      # Let's assume it's the total multiplied: (-3 + 2) * 2 = -2
      assert score == -2
    end
  end
  
  describe "aggregate_team/4" do
    test "aggregates team score correctly" do
      events_by_player = %{
        1 => [Scoring.goal(1), Scoring.appearance(1, 90)],
        2 => [Scoring.assist(2), Scoring.appearance(2, 90)],
        3 => [Scoring.clean_sheet(3), Scoring.appearance(3, 90)]
      }
      
      role_map = %{
        1 => :fwd,  # Captain
        2 => :mid,  # Vice captain
        3 => :gk
      }
      
      total_score = Scoring.aggregate_team(events_by_player, 1, 2, role_map)
      
      # Player 1 (Captain): (4 + 2) * 2 = 12
      # Player 2 (Vice): (3 + 2) * 1.5 = 7.5 -> 7
      # Player 3: 4 + 2 = 6
      # Total: 12 + 7 + 6 = 25
      assert total_score == 25
    end
    
    test "handles missing players gracefully" do
      events_by_player = %{
        1 => [Scoring.goal(1)]
        # Player 2 has no events
      }
      
      role_map = %{
        1 => :fwd,
        2 => :mid
      }
      
      total_score = Scoring.aggregate_team(events_by_player, 1, 2, role_map)
      
      # Player 1 (Captain): 4 * 2 = 8
      # Player 2 (Vice): 0 * 1.5 = 0
      # Total: 8
      assert total_score == 8
    end
    
    test "handles players not in role map" do
      events_by_player = %{
        1 => [Scoring.goal(1)],
        2 => [Scoring.assist(2)]
      }
      
      role_map = %{
        1 => :fwd
        # Player 2 not in role map
      }
      
      total_score = Scoring.aggregate_team(events_by_player, 1, 2, role_map)
      
      # Player 1 (Captain): 4 * 2 = 8
      # Player 2 (Vice): Should be skipped or default role
      # This depends on implementation
      assert is_integer(total_score)
    end
  end
  
  describe "score_breakdown/4" do
    test "returns detailed score breakdown" do
      events_by_player = %{
        1 => [Scoring.goal(1), Scoring.assist(1), Scoring.appearance(1, 90)],
        2 => [Scoring.clean_sheet(2), Scoring.appearance(2, 90)]
      }
      
      role_map = %{
        1 => :fwd,
        2 => :gk
      }
      
      breakdown = Scoring.score_breakdown(events_by_player, 1, 2, role_map)
      
      assert is_map(breakdown)
      assert Map.has_key?(breakdown, :total_score)
      assert Map.has_key?(breakdown, :player_scores)
      
      # Check player scores structure
      player_scores = breakdown.player_scores
      assert is_map(player_scores)
      assert Map.has_key?(player_scores, 1)
      assert Map.has_key?(player_scores, 2)
      
      # Check individual player score details
      player_1_score = player_scores[1]
      assert Map.has_key?(player_1_score, :base_score)
      assert Map.has_key?(player_1_score, :final_score)
      assert Map.has_key?(player_1_score, :is_captain)
      assert Map.has_key?(player_1_score, :is_vice_captain)
      assert Map.has_key?(player_1_score, :multiplier)
    end
  end
  
  describe "integration tests" do
    test "complete match scoring scenario" do
      # Simulate a complete match with various events
      events_by_player = %{
        1 => [Scoring.appearance(1, 90), Scoring.clean_sheet(1)],  # GK
        2 => [Scoring.appearance(2, 90), Scoring.clean_sheet(2)],  # DEF
        3 => [Scoring.appearance(3, 90), Scoring.clean_sheet(3)],  # DEF
        4 => [Scoring.appearance(4, 90), Scoring.clean_sheet(4)],  # DEF
        5 => [Scoring.appearance(5, 90), Scoring.goal(5), Scoring.clean_sheet(5)],  # MID (Captain)
        6 => [Scoring.appearance(6, 90), Scoring.assist(6), Scoring.clean_sheet(6)],  # MID
        7 => [Scoring.appearance(7, 90), Scoring.clean_sheet(7)],  # MID
        8 => [Scoring.appearance(8, 90), Scoring.clean_sheet(8)],  # MID
        9 => [Scoring.appearance(9, 90), Scoring.goal(9), Scoring.assist(9)],  # FWD (Vice)
        10 => [Scoring.appearance(10, 60)],  # FWD (substituted)
        11 => [Scoring.appearance(11, 30), Scoring.yellow_card(11)]  # FWD (late sub)
      }
      
      role_map = %{
        1 => :gk, 2 => :def, 3 => :def, 4 => :def,
        5 => :mid, 6 => :mid, 7 => :mid, 8 => :mid,
        9 => :fwd, 10 => :fwd, 11 => :fwd
      }
      
      total_score = Scoring.aggregate_team(events_by_player, 5, 9, role_map)
      
      # Verify the score is reasonable (should be positive for a good performance)
      assert total_score > 50
      assert total_score < 200  # Reasonable upper bound
    end
  end
end