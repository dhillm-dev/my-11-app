import gleam/list
import gleam/dict.{type Dict}
import gleam/result
import gleam/int
import gleam/option

// Player role types
pub type Role {
  Gk
  Def
  Mid
  Fwd
}

// Player representation
pub type Player {
  Player(id: Int, team_id: Int, role: Role, credit: Int)
}

// Team sheet with captain and vice-captain
pub type TeamSheet {
  TeamSheet(players: List(Player), captain_id: Int, vice_id: Int)
}

// Validation errors
pub type Error {
  NotEleven
  MissingGK
  RoleBounds(Role)
  TooManyFromTeam(team_id: Int)
  CreditExceeded(max: Int)
  MissingCaptain
  MissingVice
  CaptainEqualsVice
}

// Count players by role
fn count_by_role(players: List(Player), target_role: Role) -> Int {
  players
  |> list.filter(fn(player) { player.role == target_role })
  |> list.length
}

// Count players by team
fn count_by_team(players: List(Player)) -> Dict(Int, Int) {
  players
  |> list.fold(dict.new(), fn(acc, player) {
    dict.upsert(acc, player.team_id, fn(count) {
      case count {
        option.Some(n) -> n + 1
        option.None -> 1
      }
    })
  })
}

// Calculate total credits
fn total_credits(players: List(Player)) -> Int {
  players
  |> list.fold(0, fn(acc, player) { acc + player.credit })
}

// Check if player exists in team
fn player_exists(players: List(Player), player_id: Int) -> Bool {
  players
  |> list.any(fn(player) { player.id == player_id })
}

// Validate team composition and constraints
pub fn validate_team(sheet: TeamSheet, max_credit: Int) -> Result(Nil, List(Error)) {
  let TeamSheet(players, captain_id, vice_id) = sheet
  
  let player_count_error = case list.length(players) {
    11 -> []
    _ -> [NotEleven]
  }
  
  let gk_count_error = case count_by_role(players, Gk) {
    1 -> []
    _ -> [MissingGK]
  }
  
  let def_count_error = case count_by_role(players, Def) {
    n if n >= 3 && n <= 5 -> []
    _ -> [RoleBounds(Def)]
  }
  
  let mid_count_error = case count_by_role(players, Mid) {
    n if n >= 3 && n <= 5 -> []
    _ -> [RoleBounds(Mid)]
  }
  
  let fwd_count_error = case count_by_role(players, Fwd) {
    n if n >= 1 && n <= 3 -> []
    _ -> [RoleBounds(Fwd)]
  }
  
  let team_counts = count_by_team(players)
  let team_violations = 
    team_counts
    |> dict.to_list
    |> list.filter_map(fn(entry) {
      let #(team_id, count) = entry
      case count > 7 {
        True -> Ok(TooManyFromTeam(team_id))
        False -> Error(Nil)
      }
    })
  
  let credit_error = case total_credits(players) {
    total if total <= max_credit -> []
    total -> [CreditExceeded(total)]
  }
  
  let captain_error = case player_exists(players, captain_id) {
    True -> []
    False -> [MissingCaptain]
  }
  
  let vice_error = case player_exists(players, vice_id) {
    True -> []
    False -> [MissingVice]
  }
  
  let captain_vice_error = case captain_id == vice_id {
    True -> [CaptainEqualsVice]
    False -> []
  }
  
  let all_errors = 
    list.flatten([
      player_count_error,
      gk_count_error,
      def_count_error,
      mid_count_error,
      fwd_count_error,
      team_violations,
      credit_error,
      captain_error,
      vice_error,
      captain_vice_error
    ])
  
  case all_errors {
    [] -> Ok(Nil)
    errors -> Error(errors)
  }
}

// Helper function to create a player
pub fn new_player(id: Int, team_id: Int, role: Role, credit: Int) -> Player {
  Player(id: id, team_id: team_id, role: role, credit: credit)
}

// Helper function to create a team sheet
pub fn new_team_sheet(players: List(Player), captain_id: Int, vice_id: Int) -> TeamSheet {
  TeamSheet(players: players, captain_id: captain_id, vice_id: vice_id)
}