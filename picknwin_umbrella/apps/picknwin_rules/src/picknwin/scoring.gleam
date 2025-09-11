import gleam/list
import gleam/dict.{type Dict}
import gleam/int
import picknwin/rules.{type Role, Gk, Def, Mid, Fwd}

// Event types for scoring
pub type Event {
  Goal(player_id: Int)
  Assist(player_id: Int)
  CleanSheet(player_id: Int)
  Save(player_id: Int)
  PenaltySave(player_id: Int)
  PenaltyMiss(player_id: Int)
  YellowCard(player_id: Int)
  RedCard(player_id: Int)
  OwnGoal(player_id: Int)
  Appearance(player_id: Int, minutes: Int)
}

// Score a single event based on player role
pub fn score_event(event: Event, role: Role) -> Int {
  case event {
    Goal(_) -> case role {
      Fwd -> 4
      Mid -> 5
      Def -> 6
      Gk -> 6
    }
    
    Assist(_) -> 3
    
    CleanSheet(_) -> case role {
      Gk -> 4
      Def -> 4
      Mid -> 1
      Fwd -> 0
    }
    
    Save(_) -> case role {
      Gk -> 1  // Note: actual implementation should count every 3 saves
      _ -> 0
    }
    
    PenaltySave(_) -> case role {
      Gk -> 5
      _ -> 0
    }
    
    PenaltyMiss(_) -> -2
    
    YellowCard(_) -> -1
    
    RedCard(_) -> -3
    
    OwnGoal(_) -> -2
    
    Appearance(_, minutes) -> case minutes {
      m if m >= 60 -> 2
      m if m >= 1 -> 1
      _ -> 0
    }
  }
}

// Count saves for a player and calculate save points
fn calculate_save_points(events: List(Event)) -> Int {
  let save_count = 
    events
    |> list.filter(fn(event) {
      case event {
        Save(_) -> True
        _ -> False
      }
    })
    |> list.length
  
  // 1 point per 3 saves
  save_count / 3
}

// Score all events for a single player
pub fn score_player(
  events: List(Event),
  role: Role,
  is_captain: Bool,
  is_vice: Bool
) -> Int {
  let base_score = case role {
    Gk -> {
      // Special handling for goalkeeper saves
      let non_save_events = list.filter(events, fn(event) {
        case event {
          Save(_) -> False
          _ -> True
        }
      })
      let non_save_points = 
        non_save_events
        |> list.map(fn(event) { score_event(event, role) })
        |> list.fold(0, int.add)
      
      let save_points = calculate_save_points(events)
      non_save_points + save_points
    }
    _ -> {
      events
      |> list.map(fn(event) { score_event(event, role) })
      |> list.fold(0, int.add)
    }
  }
  
  // Apply captain/vice-captain multipliers
  case is_captain, is_vice {
    True, _ -> base_score * 2  // Captain gets 2x
    False, True -> base_score + base_score / 2  // Vice gets 1.5x
    False, False -> base_score
  }
}

// Aggregate team score from all player events
pub fn aggregate_team(
  events_by_player: Dict(Int, List(Event)),
  captain_id: Int,
  vice_id: Int,
  role_map: Dict(Int, Role)
) -> Int {
  events_by_player
  |> dict.to_list
  |> list.map(fn(entry) {
    let #(player_id, events) = entry
    
    case dict.get(role_map, player_id) {
      Ok(role) -> {
        let is_captain = player_id == captain_id
        let is_vice = player_id == vice_id
        score_player(events, role, is_captain, is_vice)
      }
      Error(_) -> 0  // Player not found in role map
    }
  })
  |> list.fold(0, int.add)
}

// Helper function to create events
pub fn new_goal(player_id: Int) -> Event {
  Goal(player_id)
}

pub fn new_assist(player_id: Int) -> Event {
  Assist(player_id)
}

pub fn new_clean_sheet(player_id: Int) -> Event {
  CleanSheet(player_id)
}

pub fn new_save(player_id: Int) -> Event {
  Save(player_id)
}

pub fn new_penalty_save(player_id: Int) -> Event {
  PenaltySave(player_id)
}

pub fn new_penalty_miss(player_id: Int) -> Event {
  PenaltyMiss(player_id)
}

pub fn new_yellow_card(player_id: Int) -> Event {
  YellowCard(player_id)
}

pub fn new_red_card(player_id: Int) -> Event {
  RedCard(player_id)
}

pub fn new_own_goal(player_id: Int) -> Event {
  OwnGoal(player_id)
}

pub fn new_appearance(player_id: Int, minutes: Int) -> Event {
  Appearance(player_id, minutes)
}