defmodule Picknwin.Repo.Migrations.CreatePlayers do
  use Ecto.Migration

  def change do
    create table(:players, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :external_id, :string, null: false
      add :name, :string, null: false
      add :position, :string, null: false
      add :team, :string, null: false
      add :jersey_number, :integer
      add :photo_url, :string
      add :nationality, :string
      add :age, :integer
      add :height, :string
      add :weight, :string
      add :status, :string, null: false, default: "active"
      add :is_playing_eleven, :boolean, null: false, default: false
      add :injury_status, :string
      add :form_rating, :decimal, precision: 3, scale: 1
      add :season_stats, :map
      add :recent_scores, :map
      add :metadata, :map, null: false, default: %{}
      
      # Match-specific data
      add :match_id, references(:matches, type: :binary_id, on_delete: :delete_all), null: false
      add :fantasy_points, :decimal, precision: 8, scale: 2, null: false, default: 0.0
      add :credits, :decimal, precision: 4, scale: 1, null: false, default: 8.0
      add :selection_percentage, :decimal, precision: 5, scale: 2, null: false, default: 0.0
      add :captain_percentage, :decimal, precision: 5, scale: 2, null: false, default: 0.0
      add :vice_captain_percentage, :decimal, precision: 5, scale: 2, null: false, default: 0.0

      timestamps(type: :utc_datetime)
    end

    create unique_index(:players, [:external_id, :match_id])
    create index(:players, [:match_id])
    create index(:players, [:name])
    create index(:players, [:position])
    create index(:players, [:team])
    create index(:players, [:status])
    create index(:players, [:is_playing_eleven])
    create index(:players, [:fantasy_points])
    create index(:players, [:credits])
    create index(:players, [:selection_percentage])
    
    # Composite indexes for common queries
    create index(:players, [:match_id, :team])
    create index(:players, [:match_id, :position])
    create index(:players, [:match_id, :is_playing_eleven])
    create index(:players, [:match_id, :fantasy_points])
    
    # GIN index for full-text search
    create index(:players, ["to_tsvector('english', coalesce(name, '') || ' ' || coalesce(team, '') || ' ' || coalesce(position, ''))"], using: :gin)
  end
end