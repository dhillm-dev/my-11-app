defmodule Picknwin.Schema do
  @moduledoc """
  Database schema definitions for event-sourced scoring system.
  """
  
  defmodule MatchEvent do
    @moduledoc """
    Append-only event store for match events.
    Events are immutable and versioned for auditing.
    """
    use Ecto.Schema
    import Ecto.Changeset
    
    @primary_key {:id, :binary_id, autogenerate: true}
    @foreign_key_type :binary_id
    
    schema "match_events" do
      field :match_id, :binary_id
      field :player_id, :integer
      field :event_type, :string
      field :event_data, :map  # JSON data for event-specific fields
      field :sequence_number, :integer  # For ordering within match
      field :scoring_rules_version, :string  # Version of scoring rules used
      field :processed_at, :utc_datetime
      field :source, :string  # "manual", "api", "feed", etc.
      field :metadata, :map  # Additional context
      
      timestamps(type: :utc_datetime)
    end
    
    @required_fields [:match_id, :player_id, :event_type, :sequence_number, :scoring_rules_version]
    @optional_fields [:event_data, :processed_at, :source, :metadata]
    
    def changeset(event, attrs) do
      event
      |> cast(attrs, @required_fields ++ @optional_fields)
      |> validate_required(@required_fields)
      |> validate_inclusion(:event_type, [
        "goal", "assist", "clean_sheet", "save", "penalty_save",
        "penalty_miss", "yellow_card", "red_card", "own_goal", "appearance"
      ])
      |> validate_number(:sequence_number, greater_than: 0)
      |> validate_number(:player_id, greater_than: 0)
    end
  end
  
  defmodule TeamPoints do
    @moduledoc """
    Computed team scores for contests.
    Recalculated when events change or rules version updates.
    """
    use Ecto.Schema
    import Ecto.Changeset
    
    @primary_key {:id, :binary_id, autogenerate: true}
    @foreign_key_type :binary_id
    
    schema "team_points" do
      field :contest_id, :binary_id
      field :user_id, :binary_id
      field :match_id, :binary_id
      field :team_data, :map  # Serialized team sheet
      field :total_points, :integer
      field :player_points, :map  # player_id -> points breakdown
      field :scoring_rules_version, :string
      field :last_event_sequence, :integer  # Last processed event
      field :calculated_at, :utc_datetime
      
      timestamps(type: :utc_datetime)
    end
    
    @required_fields [:contest_id, :user_id, :match_id, :team_data, :total_points, :scoring_rules_version]
    @optional_fields [:player_points, :last_event_sequence, :calculated_at]
    
    def changeset(team_points, attrs) do
      team_points
      |> cast(attrs, @required_fields ++ @optional_fields)
      |> validate_required(@required_fields)
      |> validate_number(:total_points, greater_than_or_equal_to: 0)
      |> validate_number(:last_event_sequence, greater_than_or_equal_to: 0)
      |> unique_constraint([:contest_id, :user_id], name: :team_points_contest_user_index)
    end
  end
  
  defmodule Leaderboard do
    @moduledoc """
    Contest leaderboard with rankings and prize distribution.
    Updated in real-time as team points change.
    """
    use Ecto.Schema
    import Ecto.Changeset
    
    @primary_key {:id, :binary_id, autogenerate: true}
    @foreign_key_type :binary_id
    
    schema "leaderboard" do
      field :contest_id, :binary_id
      field :user_id, :binary_id
      field :rank, :integer
      field :total_points, :integer
      field :prize_amount, :decimal, precision: 10, scale: 2
      field :prize_rank, :integer  # Prize tier (1st, 2nd, etc.)
      field :is_winner, :boolean, default: false
      field :points_breakdown, :map  # Detailed scoring breakdown
      field :last_updated, :utc_datetime
      
      timestamps(type: :utc_datetime)
    end
    
    @required_fields [:contest_id, :user_id, :rank, :total_points]
    @optional_fields [:prize_amount, :prize_rank, :is_winner, :points_breakdown, :last_updated]
    
    def changeset(leaderboard, attrs) do
      leaderboard
      |> cast(attrs, @required_fields ++ @optional_fields)
      |> validate_required(@required_fields)
      |> validate_number(:rank, greater_than: 0)
      |> validate_number(:total_points, greater_than_or_equal_to: 0)
      |> validate_number(:prize_rank, greater_than: 0)
      |> unique_constraint([:contest_id, :user_id], name: :leaderboard_contest_user_index)
      |> unique_constraint([:contest_id, :rank], name: :leaderboard_contest_rank_index)
    end
  end
  
  defmodule ScoringRulesVersion do
    @moduledoc """
    Versioned scoring rules to ensure historical consistency.
    Never modify past versions - always create new ones.
    """
    use Ecto.Schema
    import Ecto.Changeset
    
    @primary_key {:version, :string, autogenerate: false}
    
    schema "scoring_rules_versions" do
      field :rules_config, :map  # JSON configuration of scoring weights
      field :description, :string
      field :is_active, :boolean, default: false
      field :effective_from, :utc_datetime
      field :created_by, :string
      
      timestamps(type: :utc_datetime)
    end
    
    @required_fields [:version, :rules_config, :effective_from]
    @optional_fields [:description, :is_active, :created_by]
    
    def changeset(version, attrs) do
      version
      |> cast(attrs, @required_fields ++ @optional_fields)
      |> validate_required(@required_fields)
      |> validate_format(:version, ~r/^\d+\.\d+\.\d+$/)
      |> unique_constraint(:version)
    end
  end
end