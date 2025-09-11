defmodule Picknwin.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :citext, null: false
      add :username, :string, null: false
      add :password_hash, :string, null: false
      add :first_name, :string, null: false
      add :last_name, :string, null: false
      add :phone, :string
      add :date_of_birth, :date
      add :country, :string
      add :region, :string
      add :role, :string, null: false, default: "user"
      add :status, :string, null: false, default: "active"
      add :email_verified, :boolean, null: false, default: false
      add :phone_verified, :boolean, null: false, default: false
      add :kyc_status, :string, null: false, default: "pending"
      add :balance, :decimal, precision: 10, scale: 2, null: false, default: 0.00
      add :bonus_balance, :decimal, precision: 10, scale: 2, null: false, default: 0.00
      add :last_login_at, :utc_datetime
      add :login_count, :integer, null: false, default: 0
      add :preferences, :map, null: false, default: %{}
      add :metadata, :map, null: false, default: %{}

      timestamps(type: :utc_datetime)
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:username])
    create index(:users, [:role])
    create index(:users, [:status])
    create index(:users, [:country])
    create index(:users, [:region])
    create index(:users, [:kyc_status])
    create index(:users, [:last_login_at])
    
    # GIN index for full-text search
    create index(:users, ["to_tsvector('english', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(username, '') || ' ' || coalesce(email, ''))"], using: :gin)
  end
end