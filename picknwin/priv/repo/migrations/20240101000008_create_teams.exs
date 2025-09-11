defmodule Picknwin.Repo.Migrations.CreateTeams do
  use Ecto.Migration

  def change do
    create table(:teams, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string, null: false
      add :lineup, :map, null: false, default: %{}
      add :captain_id, :binary_id, null: false
      add :vice_captain_id, :binary_id, null: false
      add :total_credits, :decimal, precision: 8, scale: 1, null: false, default: 0.0
      add :is_valid, :boolean, null: false, default: false
      add :validation_errors, {:array, :string}, null: false, default: []
      add :is_template, :boolean, null: false, default: false
      add :template_name, :string
      add :usage_count, :integer, null: false, default: 0
      add :avg_points, :decimal, precision: 8, scale: 2, null: false, default: 0.0
      add :best_rank, :integer
      add :metadata, :map, null: false, default: %{}
      
      # Relationships
      add :match_id, references(:matches, type: :binary_id, on_delete: :delete_all), null: false
      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false
      
      # Player breakdown by position
      add :wicket_keepers, {:array, :binary_id}, null: false, default: []
      add :batsmen, {:array, :binary_id}, null: false, default: []
      add :all_rounders, {:array, :binary_id}, null: false, default: []
      add :bowlers, {:array, :binary_id}, null: false, default: []
      
      # Team composition stats
      add :home_players_count, :integer, null: false, default: 0
      add :away_players_count, :integer, null: false, default: 0
      add :playing_eleven_count, :integer, null: false, default: 0
      
      # Performance tracking
      add :contests_entered, :integer, null: false, default: 0
      add :total_winnings, :decimal, precision: 12, scale: 2, null: false, default: 0.0
      add :win_rate, :decimal, precision: 5, scale: 2, null: false, default: 0.0

      timestamps(type: :utc_datetime)
    end

    create index(:teams, [:user_id])
    create index(:teams, [:match_id])
    create index(:teams, [:captain_id])
    create index(:teams, [:vice_captain_id])
    create index(:teams, [:is_valid])
    create index(:teams, [:is_template])
    create index(:teams, [:usage_count])
    create index(:teams, [:avg_points])
    create index(:teams, [:total_credits])
    
    # Composite indexes for common queries
    create index(:teams, [:user_id, :match_id])
    create index(:teams, [:match_id, :is_valid])
    create index(:teams, [:user_id, :is_template])
    create index(:teams, [:match_id, :avg_points], order: [match_id: :asc, avg_points: :desc])
    
    # GIN indexes for array fields
    create index(:teams, [:lineup], using: :gin)
    create index(:teams, [:wicket_keepers], using: :gin)
    create index(:teams, [:batsmen], using: :gin)
    create index(:teams, [:all_rounders], using: :gin)
    create index(:teams, [:bowlers], using: :gin)
    
    # Unique constraint for template names per user
    create unique_index(:teams, [:user_id, :template_name], where: "is_template = true AND template_name IS NOT NULL")
  end
end