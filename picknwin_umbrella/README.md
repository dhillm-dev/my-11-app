# PickNWin - Fantasy Sports Platform

A modern fantasy sports platform built with Phoenix umbrella architecture, featuring pure functional rules validation in Gleam and real-time scoring capabilities.

## Architecture Overview

This project uses Phoenix umbrella architecture with four specialized applications:

### 🎯 **picknwin_rules** (Gleam)
Pure functional rules engine for team validation and scoring logic.
- **Language**: Gleam (compiles to Erlang)
- **Purpose**: Immutable business rules, validation logic, scoring algorithms
- **Key Features**: Type-safe validation, pure functions, comprehensive error handling

### 🏗️ **picknwin_core** (Elixir)
Domain logic and database layer with Elixir wrappers for Gleam functions.
- **Language**: Elixir
- **Purpose**: Database schemas, business logic, Gleam integration
- **Key Features**: Event-sourced scoring, Ecto schemas, data persistence

### 🌐 **picknwin_web** (Phoenix)
Web interface and API endpoints with real-time features.
- **Language**: Elixir/Phoenix
- **Purpose**: HTTP API, WebSocket channels, user interface
- **Key Features**: Real-time leaderboards, contest management, user authentication

### ⚙️ **picknwin_jobs** (Oban)
Background job processing for contest lifecycle management.
- **Language**: Elixir/Oban
- **Purpose**: Scheduled tasks, contest automation, payout processing
- **Key Features**: Contest locking, result finalization, automated payouts

## Key Features

### 🔒 **Type-Safe Validation**
- Gleam's type system ensures validation logic correctness
- Compile-time guarantees for business rules
- Immutable data structures prevent state corruption

### ⚡ **Real-Time Updates**
- Phoenix channels for live leaderboard updates
- WebSocket connections for instant score changes
- Real-time contest status notifications

### 📊 **Event-Sourced Scoring**
- Append-only event store for match data
- Reproducible score calculations
- Complete audit trail of all scoring events

### 🔄 **Automated Contest Management**
- Scheduled contest locking at kickoff time
- Automatic result finalization after matches
- Seamless payout processing for winners

### 🧪 **Comprehensive Testing**
- Gleam unit tests for pure functions
- ExUnit property-based testing
- Integration tests for complete workflows

## Project Structure

```
picknwin_umbrella/
├── apps/
│   ├── picknwin_rules/          # Gleam rules engine
│   │   ├── src/picknwin/
│   │   │   ├── rules.gleam      # Team validation logic
│   │   │   └── scoring.gleam    # Scoring algorithms
│   │   ├── test/                # Gleam unit tests
│   │   ├── gleam.toml          # Gleam project config
│   │   └── mix.exs             # Mix integration
│   │
│   ├── picknwin_core/          # Domain logic & database
│   │   ├── lib/picknwin/
│   │   │   ├── rules.ex        # Elixir wrapper for Gleam rules
│   │   │   ├── scoring.ex      # Elixir wrapper for Gleam scoring
│   │   │   └── schema.ex       # Database schemas
│   │   ├── test/               # ExUnit tests
│   │   └── mix.exs
│   │
│   ├── picknwin_web/           # Phoenix web application
│   │   ├── lib/picknwin_web/
│   │   │   └── channels/       # Real-time channels
│   │   │       ├── contest_channel.ex
│   │   │       └── wallet_channel.ex
│   │   └── mix.exs
│   │
│   └── picknwin_jobs/          # Background job processing
│       ├── lib/picknwin_jobs/
│       │   └── workers/        # Oban job workers
│       │       ├── lock_contests_worker.ex
│       │       ├── finalize_results_worker.ex
│       │       ├── payout_winnings_worker.ex
│       │       └── cleanup_tokens_worker.ex
│       └── mix.exs
│
├── config/                     # Umbrella configuration
└── mix.exs                     # Umbrella project definition
```

## Getting Started

### Prerequisites

- **Elixir** 1.15+ with OTP 26+
- **Gleam** 1.0+
- **PostgreSQL** 14+
- **Node.js** 18+ (for frontend assets)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd picknwin_umbrella
   ```

2. **Install dependencies**
   ```bash
   mix deps.get
   ```

3. **Compile Gleam code**
   ```bash
   cd apps/picknwin_rules
   gleam build
   cd ../..
   ```

4. **Setup database**
   ```bash
   mix ecto.setup
   ```

5. **Install frontend dependencies**
   ```bash
   cd apps/picknwin_web/assets
   npm install
   cd ../../..
   ```

### Development

1. **Start the development server**
   ```bash
   mix phx.server
   ```

2. **Run tests**
   ```bash
   # Run all tests
   mix test
   
   # Run Gleam tests specifically
   cd apps/picknwin_rules
   gleam test
   cd ../..
   
   # Run specific app tests
   mix test apps/picknwin_core/test/
   ```

3. **Interactive development**
   ```bash
   # Start IEx with all apps loaded
   iex -S mix
   
   # Test Gleam integration
   iex> alias Picknwin.Rules
   iex> player = Rules.new_player(1, 10, :gk, 8)
   iex> team = Rules.new_team_sheet([player], 1, 1)
   iex> Rules.validate_team(team, 100)
   ```

## Usage Examples

### Team Validation

```elixir
# Create players
players = [
  Picknwin.Rules.new_player(1, 1, :gk, 8),
  Picknwin.Rules.new_player(2, 2, :def, 7),
  # ... more players
]

# Create team sheet
team = Picknwin.Rules.new_team_sheet(players, captain_id: 5, vice_captain_id: 9)

# Validate team
case Picknwin.Rules.validate_team(team, credit_limit: 100) do
  :ok -> 
    IO.puts("Team is valid!")
  {:error, errors} -> 
    IO.puts("Validation errors: #{inspect(errors)}")
end
```

### Scoring Events

```elixir
# Create scoring events
events = [
  Picknwin.Scoring.goal(player_id: 1),
  Picknwin.Scoring.assist(player_id: 2),
  Picknwin.Scoring.clean_sheet(player_id: 3)
]

# Calculate player score
score = Picknwin.Scoring.score_player(
  events, 
  role: :fwd, 
  is_captain: true, 
  is_vice_captain: false
)

IO.puts("Player score: #{score}")
```

### Background Jobs

```elixir
# Schedule contest workflow
contest_times = %{
  kickoff: ~U[2024-01-15 15:00:00Z],
  finalization: ~U[2024-01-15 17:00:00Z],
  payout: ~U[2024-01-15 17:30:00Z]
}

{:ok, jobs} = PicknwinJobs.schedule_contest_workflow("contest_123", contest_times)
IO.puts("Scheduled #{length(jobs)} jobs for contest lifecycle")
```

### Real-Time Updates

```javascript
// Frontend WebSocket connection
const socket = new Phoenix.Socket("/socket")
const channel = socket.channel("contest:123", {})

channel.on("leaderboard_update", (payload) => {
  console.log("New leaderboard:", payload.leaderboard)
  updateLeaderboardUI(payload.leaderboard)
})

channel.join()
```

## Testing Strategy

### Unit Tests (Gleam)
- Pure function testing with property-based approaches
- Type-safe test data generation
- Comprehensive edge case coverage

### Integration Tests (ExUnit)
- Database integration testing
- API endpoint testing
- WebSocket channel testing

### Property-Based Testing
- Validation rule properties
- Scoring algorithm properties
- Data consistency properties

## Deployment

### Production Build

```bash
# Set production environment
export MIX_ENV=prod

# Compile all applications
mix compile

# Build Gleam code
cd apps/picknwin_rules && gleam build && cd ../..

# Build frontend assets
cd apps/picknwin_web/assets && npm run build && cd ../../..

# Create release
mix release
```

### Environment Configuration

Set the following environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost/picknwin_prod

# Security
SECRET_KEY_BASE=your-secret-key-base
LIVE_VIEW_SIGNING_SALT=your-signing-salt

# External APIs
SPORTS_API_KEY=your-sports-api-key
PAYMENT_GATEWAY_KEY=your-payment-key

# Job Processing
OBAN_QUEUES=scoring:10,payouts:5,maintenance:2
```

## Contributing

1. **Code Style**
   - Follow Elixir community conventions
   - Use Gleam formatting (`gleam format`)
   - Write comprehensive tests

2. **Pull Request Process**
   - Ensure all tests pass
   - Update documentation
   - Add changelog entries

3. **Architecture Decisions**
   - Keep business logic in Gleam (pure functions)
   - Use Elixir for I/O and integration
   - Maintain clear separation of concerns

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Review the test suite for usage examples