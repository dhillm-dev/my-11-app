defmodule Picknwin.Repo.Migrations.CreateContestEntries do
  use Ecto.Migration

  def change do
    create table(:contest_entries, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :entry_number, :integer, null: false
      add :team_name, :string, null: false
      add :lineup, :map, null: false, default: %{}
      add :captain_id, :binary_id
      add :vice_captain_id, :binary_id
      add :total_credits_used, :decimal, precision: 8, scale: 1, null: false, default: 0.0
      add :fantasy_points, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :rank, :integer
      add :prize_amount, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :is_winner, :boolean, null: false, default: false
      add :status, :string, null: false, default: "active"
      add :metadata, :map, null: false, default: %{}
      
      # Relationships
      add :contest_id, references(:contests, type: :binary_id, on_delete: :delete_all), null: false
      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false
      add :team_id, references(:teams, type: :binary_id, on_delete: :nilify_all)
      
      # Scoring breakdown
      add :player_scores, :map, null: false, default: %{}
      add :captain_points, :decimal, precision: 8, scale: 2, null: false, default: 0.0
      add :vice_captain_points, :decimal, precision: 8, scale: 2, null: false, default: 0.0
      add :substitution_points, :decimal, precision: 8, scale: 2, null: false, default: 0.0
      
      # Payment tracking
      add :entry_fee_paid, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :bonus_used, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :payment_status, :string, null: false, default: "pending"
      add :refund_amount, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :refund_status, :string

      timestamps(type: :utc_datetime)
    end

    create unique_index(:contest_entries, [:contest_id, :user_id, :entry_number])
    create index(:contest_entries, [:contest_id])
    create index(:contest_entries, [:user_id])
    create index(:contest_entries, [:team_id])
    create index(:contest_entries, [:fantasy_points])
    create index(:contest_entries, [:rank])
    create index(:contest_entries, [:is_winner])
    create index(:contest_entries, [:status])
    create index(:contest_entries, [:payment_status])
    create index(:contest_entries, [:captain_id])
    create index(:contest_entries, [:vice_captain_id])
    
    # Composite indexes for leaderboard queries
    create index(:contest_entries, [:contest_id, :fantasy_points], order: [contest_id: :asc, fantasy_points: :desc])
    create index(:contest_entries, [:contest_id, :rank])
    create index(:contest_entries, [:contest_id, :is_winner])
    create index(:contest_entries, [:user_id, :contest_id])
    
    # GIN index for lineup and player_scores JSON queries
    create index(:contest_entries, [:lineup], using: :gin)
    create index(:contest_entries, [:player_scores], using: :gin)
  end
end