import gleeunit
import gleeunit/should
import picknwin/scoring.{type Event, type Role}
import picknwin/rules
import gleam/dict
import gleam/list

pub fn main() {
  gleeunit.main()
}

// Event scoring tests
pub fn score_goal_by_forward_test() {
  let event = scoring.Goal(player_id: 1)
  let result = scoring.score_event(event, rules.Fwd)
  
  result
  |> should.equal(4)
}

pub fn score_goal_by_midfielder_test() {
  let event = scoring.Goal(player_id: 1)
  let result = scoring.score_event(event, rules.Mid)
  
  result
  |> should.equal(5)
}

pub fn score_goal_by_defender_test() {
  let event = scoring.Goal(player_id: 1)
  let result = scoring.score_event(event, rules.Def)
  
  result
  |> should.equal(6)
}

pub fn score_goal_by_goalkeeper_test() {
  let event = scoring.Goal(player_id: 1)
  let result = scoring.score_event(event, rules.Gk)
  
  result
  |> should.equal(6)
}

pub fn score_assist_test() {
  let event = scoring.Assist(player_id: 1)
  
  // Assist points are same for all roles
  scoring.score_event(event, rules.Fwd)
  |> should.equal(3)
  
  scoring.score_event(event, rules.Mid)
  |> should.equal(3)
  
  scoring.score_event(event, rules.Def)
  |> should.equal(3)
  
  scoring.score_event(event, rules.Gk)
  |> should.equal(3)
}

pub fn score_clean_sheet_goalkeeper_test() {
  let event = scoring.CleanSheet(player_id: 1)
  let result = scoring.score_event(event, rules.Gk)
  
  result
  |> should.equal(4)
}

pub fn score_clean_sheet_defender_test() {
  let event = scoring.CleanSheet(player_id: 1)
  let result = scoring.score_event(event, rules.Def)
  
  result
  |> should.equal(4)
}

pub fn score_clean_sheet_midfielder_test() {
  let event = scoring.CleanSheet(player_id: 1)
  let result = scoring.score_event(event, rules.Mid)
  
  result
  |> should.equal(1)
}

pub fn score_clean_sheet_forward_test() {
  let event = scoring.CleanSheet(player_id: 1)
  let result = scoring.score_event(event, rules.Fwd)
  
  result
  |> should.equal(0)  // Forwards don't get clean sheet points
}

pub fn score_save_test() {
  let event = scoring.Save(player_id: 1)
  let result = scoring.score_event(event, rules.Gk)
  
  result
  |> should.equal(1)
}

pub fn score_penalty_save_test() {
  let event = scoring.PenaltySave(player_id: 1)
  let result = scoring.score_event(event, rules.Gk)
  
  result
  |> should.equal(5)
}

pub fn score_penalty_miss_test() {
  let event = scoring.PenaltyMiss(player_id: 1)
  let result = scoring.score_event(event, rules.Fwd)
  
  result
  |> should.equal(-2)
}

pub fn score_yellow_card_test() {
  let event = scoring.YellowCard(player_id: 1)
  let result = scoring.score_event(event, rules.Mid)
  
  result
  |> should.equal(-1)
}

pub fn score_red_card_test() {
  let event = scoring.RedCard(player_id: 1)
  let result = scoring.score_event(event, rules.Def)
  
  result
  |> should.equal(-3)
}

pub fn score_own_goal_test() {
  let event = scoring.OwnGoal(player_id: 1)
  let result = scoring.score_event(event, rules.Def)
  
  result
  |> should.equal(-2)
}

pub fn score_appearance_short_test() {
  let event = scoring.Appearance(player_id: 1, minutes: 45)
  let result = scoring.score_event(event, rules.Mid)
  
  result
  |> should.equal(1)  // Less than 60 minutes
}

pub fn score_appearance_full_test() {
  let event = scoring.Appearance(player_id: 1, minutes: 90)
  let result = scoring.score_event(event, rules.Fwd)
  
  result
  |> should.equal(2)  // 60+ minutes
}

// Player scoring tests
pub fn score_player_basic_test() {
  let events = [
    scoring.Goal(player_id: 1),
    scoring.Assist(player_id: 1),
    scoring.Appearance(player_id: 1, minutes: 90)
  ]
  
  let result = scoring.score_player(events, rules.Fwd, False, False)
  
  result
  |> should.equal(9)  // 4 + 3 + 2
}

pub fn score_player_captain_test() {
  let events = [
    scoring.Goal(player_id: 1),
    scoring.Appearance(player_id: 1, minutes: 90)
  ]
  
  let result = scoring.score_player(events, rules.Fwd, True, False)
  
  result
  |> should.equal(12)  // (4 + 2) * 2
}

pub fn score_player_vice_captain_test() {
  let events = [
    scoring.Goal(player_id: 1),
    scoring.Appearance(player_id: 1, minutes: 90)
  ]
  
  let result = scoring.score_player(events, rules.Mid, False, True)
  
  result
  |> should.equal(10)  // (5 + 2) * 1.5 = 10.5 -> 10 (rounded down)
}

pub fn score_player_negative_points_test() {
  let events = [
    scoring.YellowCard(player_id: 1),
    scoring.RedCard(player_id: 1),
    scoring.OwnGoal(player_id: 1),
    scoring.Appearance(player_id: 1, minutes: 30)
  ]
  
  let result = scoring.score_player(events, rules.Def, False, False)
  
  result
  |> should.equal(-5)  // -1 + -3 + -2 + 1 = -5
}

// Team aggregation tests
pub fn aggregate_team_test() {
  let events_by_player = dict.new()
    |> dict.insert(1, [scoring.Goal(player_id: 1), scoring.Appearance(player_id: 1, minutes: 90)])
    |> dict.insert(2, [scoring.Assist(player_id: 2), scoring.Appearance(player_id: 2, minutes: 90)])
    |> dict.insert(3, [scoring.CleanSheet(player_id: 3), scoring.Appearance(player_id: 3, minutes: 90)])
  
  let role_map = dict.new()
    |> dict.insert(1, rules.Fwd)  // Captain
    |> dict.insert(2, rules.Mid)  // Vice captain
    |> dict.insert(3, rules.Gk)
  
  let result = scoring.aggregate_team(events_by_player, 1, 2, role_map)
  
  // Player 1 (Captain): (4 + 2) * 2 = 12
  // Player 2 (Vice): (3 + 2) * 1.5 = 7.5 -> 7
  // Player 3: 4 + 2 = 6
  // Total: 12 + 7 + 6 = 25
  result
  |> should.equal(25)
}

pub fn aggregate_team_missing_player_test() {
  let events_by_player = dict.new()
    |> dict.insert(1, [scoring.Goal(player_id: 1)])
  
  let role_map = dict.new()
    |> dict.insert(1, rules.Fwd)
    |> dict.insert(2, rules.Mid)  // Player 2 has no events
  
  let result = scoring.aggregate_team(events_by_player, 1, 2, role_map)
  
  // Player 1 (Captain): 4 * 2 = 8
  // Player 2 (Vice): 0 * 1.5 = 0
  // Total: 8
  result
  |> should.equal(8)
}

// Save points calculation tests
pub fn calculate_save_points_test() {
  // Test save points calculation (1 point per 3 saves)
  scoring.calculate_save_points(0)
  |> should.equal(0)
  
  scoring.calculate_save_points(2)
  |> should.equal(0)
  
  scoring.calculate_save_points(3)
  |> should.equal(1)
  
  scoring.calculate_save_points(5)
  |> should.equal(1)
  
  scoring.calculate_save_points(6)
  |> should.equal(2)
  
  scoring.calculate_save_points(10)
  |> should.equal(3)
}