defmodule Picknwin.Repo.Migrations.CreateContests do
  use Ecto.Migration

  def change do
    create table(:contests, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string, null: false
      add :description, :text
      add :type, :string, null: false, default: "public"
      add :template, :string, null: false, default: "classic"
      add :entry_fee, :decimal, precision: 10, scale: 2, null: false, default: 0.00
      add :max_entries, :integer, null: false
      add :total_spots, :integer, null: false
      add :entries_count, :integer, null: false, default: 0
      add :prize_pool, :decimal, precision: 12, scale: 2, null: false
      add :first_prize, :decimal, precision: 10, scale: 2
      add :prize_distribution, :map, null: false, default: %{}
      add :status, :string, null: false, default: "draft"
      add :visibility, :string, null: false, default: "public"
      add :is_guaranteed, :boolean, null: false, default: false
      add :is_mega, :boolean, null: false, default: false
      add :is_featured, :boolean, null: false, default: false
      add :auto_create_teams, :boolean, null: false, default: false
      add :allow_multi_entry, :boolean, null: false, default: true
      add :max_entries_per_user, :integer, null: false, default: 1
      add :salary_cap, :decimal, precision: 8, scale: 1, null: false, default: 100.0
      add :captain_multiplier, :decimal, precision: 3, scale: 1, null: false, default: 2.0
      add :vice_captain_multiplier, :decimal, precision: 3, scale: 1, null: false, default: 1.5
      add :lineup_requirements, :map, null: false, default: %{}
      add :rules, :map, null: false, default: %{}
      add :metadata, :map, null: false, default: %{}
      
      # Match relationship
      add :match_id, references(:matches, type: :binary_id, on_delete: :delete_all), null: false
      
      # Lifecycle timestamps
      add :registration_opens_at, :utc_datetime
      add :registration_closes_at, :utc_datetime
      add :starts_at, :utc_datetime
      add :ends_at, :utc_datetime
      add :results_declared_at, :utc_datetime
      add :prizes_distributed_at, :utc_datetime
      
      # Admin tracking
      add :created_by_id, references(:users, type: :binary_id, on_delete: :nilify_all)
      add :published_by_id, references(:users, type: :binary_id, on_delete: :nilify_all)
      add :published_at, :utc_datetime
      add :cancelled_by_id, references(:users, type: :binary_id, on_delete: :nilify_all)
      add :cancelled_at, :utc_datetime
      add :cancellation_reason, :text

      timestamps(type: :utc_datetime)
    end

    create index(:contests, [:match_id])
    create index(:contests, [:status])
    create index(:contests, [:visibility])
    create index(:contests, [:type])
    create index(:contests, [:template])
    create index(:contests, [:is_guaranteed])
    create index(:contests, [:is_mega])
    create index(:contests, [:is_featured])
    create index(:contests, [:entry_fee])
    create index(:contests, [:prize_pool])
    create index(:contests, [:entries_count])
    create index(:contests, [:created_by_id])
    create index(:contests, [:published_by_id])
    create index(:contests, [:registration_opens_at])
    create index(:contests, [:registration_closes_at])
    create index(:contests, [:starts_at])
    
    # Composite indexes for common queries
    create index(:contests, [:match_id, :status])
    create index(:contests, [:match_id, :visibility])
    create index(:contests, [:status, :registration_opens_at])
    create index(:contests, [:status, :registration_closes_at])
    create index(:contests, [:visibility, :is_featured])
    
    # GIN index for full-text search
    create index(:contests, ["to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))"], using: :gin)
  end
end