import gleeunit
import gleeunit/should
import picknwin/rules.{type Player, type TeamSheet, type Role, type Error}
import gleam/list

pub fn main() {
  gleeunit.main()
}

// Test data helpers
fn create_player(id: Int, team_id: Int, role: Role, credit: Int) -> Player {
  Player(id: id, team_id: team_id, role: role, credit: credit)
}

fn create_valid_team() -> TeamSheet {
  let players = [
    create_player(1, 1, rules.Gk, 8),     // GK
    create_player(2, 1, rules.Def, 7),    // DEF
    create_player(3, 2, rules.Def, 6),    // DEF
    create_player(4, 3, rules.Def, 5),    // DEF
    create_player(5, 4, rules.Mid, 9),    // MID
    create_player(6, 5, rules.Mid, 8),    // MID
    create_player(7, 6, rules.Mid, 7),    // MID
    create_player(8, 7, rules.Mid, 6),    // MID
    create_player(9, 8, rules.Fwd, 10),   // FWD
    create_player(10, 9, rules.Fwd, 9),   // FWD
    create_player(11, 10, rules.Fwd, 8),  // FWD
  ]
  
  TeamSheet(
    players: players,
    captain_id: 5,
    vice_captain_id: 9
  )
}

// Validation tests
pub fn validate_team_valid_test() {
  let team = create_valid_team()
  let result = rules.validate_team(team, 100)
  
  result
  |> should.be_ok
}

pub fn validate_team_not_eleven_players_test() {
  let team = TeamSheet(
    players: [create_player(1, 1, rules.Gk, 8)],
    captain_id: 1,
    vice_captain_id: 1
  )
  
  let result = rules.validate_team(team, 100)
  
  result
  |> should.be_error
  |> list.contains(rules.NotEleven)
  |> should.be_true
}

pub fn validate_team_missing_gk_test() {
  let players = [
    create_player(1, 1, rules.Def, 7),    // No GK!
    create_player(2, 2, rules.Def, 6),
    create_player(3, 3, rules.Def, 5),
    create_player(4, 4, rules.Def, 4),
    create_player(5, 5, rules.Mid, 9),
    create_player(6, 6, rules.Mid, 8),
    create_player(7, 7, rules.Mid, 7),
    create_player(8, 8, rules.Mid, 6),
    create_player(9, 9, rules.Fwd, 10),
    create_player(10, 10, rules.Fwd, 9),
    create_player(11, 11, rules.Fwd, 8),
  ]
  
  let team = TeamSheet(
    players: players,
    captain_id: 5,
    vice_captain_id: 9
  )
  
  let result = rules.validate_team(team, 100)
  
  result
  |> should.be_error
  |> list.contains(rules.MissingGK)
  |> should.be_true
}

pub fn validate_team_too_many_defenders_test() {
  let players = [
    create_player(1, 1, rules.Gk, 8),
    create_player(2, 2, rules.Def, 7),    // 6 defenders (max 5)
    create_player(3, 3, rules.Def, 6),
    create_player(4, 4, rules.Def, 5),
    create_player(5, 5, rules.Def, 4),
    create_player(6, 6, rules.Def, 3),
    create_player(7, 7, rules.Def, 2),
    create_player(8, 8, rules.Mid, 9),
    create_player(9, 9, rules.Mid, 8),
    create_player(10, 10, rules.Mid, 7),
    create_player(11, 11, rules.Fwd, 10),
  ]
  
  let team = TeamSheet(
    players: players,
    captain_id: 8,
    vice_captain_id: 11
  )
  
  let result = rules.validate_team(team, 100)
  
  result
  |> should.be_error
  |> list.contains(rules.RoleBounds(rules.Def))
  |> should.be_true
}

pub fn validate_team_too_many_from_same_team_test() {
  let players = [
    create_player(1, 1, rules.Gk, 8),
    create_player(2, 1, rules.Def, 7),    // 8 players from team 1 (max 7)
    create_player(3, 1, rules.Def, 6),
    create_player(4, 1, rules.Def, 5),
    create_player(5, 1, rules.Mid, 9),
    create_player(6, 1, rules.Mid, 8),
    create_player(7, 1, rules.Mid, 7),
    create_player(8, 1, rules.Fwd, 6),
    create_player(9, 2, rules.Mid, 8),
    create_player(10, 2, rules.Fwd, 9),
    create_player(11, 2, rules.Fwd, 8),
  ]
  
  let team = TeamSheet(
    players: players,
    captain_id: 5,
    vice_captain_id: 10
  )
  
  let result = rules.validate_team(team, 100)
  
  result
  |> should.be_error
  |> list.contains(rules.TooManyFromTeam(1))
  |> should.be_true
}

pub fn validate_team_credit_exceeded_test() {
  let team = create_valid_team()
  let result = rules.validate_team(team, 50)  // Low credit limit
  
  result
  |> should.be_error
  |> list.contains(rules.CreditExceeded(50))
  |> should.be_true
}

pub fn validate_team_missing_captain_test() {
  let team = TeamSheet(
    players: create_valid_team().players,
    captain_id: 999,  // Non-existent player
    vice_captain_id: 9
  )
  
  let result = rules.validate_team(team, 100)
  
  result
  |> should.be_error
  |> list.contains(rules.MissingCaptain)
  |> should.be_true
}

pub fn validate_team_captain_equals_vice_test() {
  let team = TeamSheet(
    players: create_valid_team().players,
    captain_id: 5,
    vice_captain_id: 5  // Same as captain
  )
  
  let result = rules.validate_team(team, 100)
  
  result
  |> should.be_error
  |> list.contains(rules.CaptainEqualsVice)
  |> should.be_true
}

// Role counting tests
pub fn count_by_role_test() {
  let players = [
    create_player(1, 1, rules.Gk, 8),
    create_player(2, 2, rules.Def, 7),
    create_player(3, 3, rules.Def, 6),
    create_player(4, 4, rules.Mid, 5),
  ]
  
  rules.count_by_role(players, rules.Gk)
  |> should.equal(1)
  
  rules.count_by_role(players, rules.Def)
  |> should.equal(2)
  
  rules.count_by_role(players, rules.Mid)
  |> should.equal(1)
  
  rules.count_by_role(players, rules.Fwd)
  |> should.equal(0)
}

pub fn count_by_team_test() {
  let players = [
    create_player(1, 1, rules.Gk, 8),
    create_player(2, 1, rules.Def, 7),
    create_player(3, 2, rules.Def, 6),
    create_player(4, 2, rules.Mid, 5),
  ]
  
  rules.count_by_team(players, 1)
  |> should.equal(2)
  
  rules.count_by_team(players, 2)
  |> should.equal(2)
  
  rules.count_by_team(players, 3)
  |> should.equal(0)
}

pub fn total_credits_test() {
  let players = [
    create_player(1, 1, rules.Gk, 8),
    create_player(2, 2, rules.Def, 7),
    create_player(3, 3, rules.Mid, 5),
  ]
  
  rules.total_credits(players)
  |> should.equal(20)
}