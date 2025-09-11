defmodule Picknwin.Repo.Migrations.CreateMatches do
  use Ecto.Migration

  def change do
    create table(:matches, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :external_id, :string, null: false
      add :sport, :string, null: false
      add :league, :string, null: false
      add :season, :string
      add :home_team, :string, null: false
      add :away_team, :string, null: false
      add :home_team_logo, :string
      add :away_team_logo, :string
      add :venue, :string
      add :kickoff, :utc_datetime, null: false
      add :status, :string, null: false, default: "scheduled"
      add :curation_state, :string, null: false, default: "feed_only"
      add :popularity_score, :integer, null: false, default: 0
      add :is_big_match, :boolean, null: false, default: false
      add :lineup_confirmed, :boolean, null: false, default: false
      add :weather, :map
      add :odds, :map
      add :stats, :map
      add :metadata, :map, null: false, default: %{}
      
      # Curation tracking
      add :curated_at, :utc_datetime
      add :curated_by_id, references(:users, type: :binary_id, on_delete: :nilify_all)
      add :blacklisted_at, :utc_datetime
      add :blacklisted_by_id, references(:users, type: :binary_id, on_delete: :nilify_all)
      add :blacklist_reason, :text

      timestamps(type: :utc_datetime)
    end

    create unique_index(:matches, [:external_id])
    create index(:matches, [:sport])
    create index(:matches, [:league])
    create index(:matches, [:kickoff])
    create index(:matches, [:status])
    create index(:matches, [:curation_state])
    create index(:matches, [:is_big_match])
    create index(:matches, [:popularity_score])
    create index(:matches, [:curated_by_id])
    create index(:matches, [:blacklisted_by_id])
    
    # Composite indexes for common queries
    create index(:matches, [:curation_state, :kickoff])
    create index(:matches, [:sport, :league, :kickoff])
    create index(:matches, [:status, :kickoff])
    
    # GIN index for full-text search on teams
    create index(:matches, ["to_tsvector('english', coalesce(home_team, '') || ' ' || coalesce(away_team, '') || ' ' || coalesce(league, ''))"], using: :gin)
  end
end