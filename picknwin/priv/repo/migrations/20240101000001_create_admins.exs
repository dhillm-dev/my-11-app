defmodule PicknwinAdmin.Repo.Migrations.CreateAdmins do
  use Ecto.Migration

  def change do
    create table(:admins) do
      add :email, :string, null: false
      add :hashed_password, :string, null: false
      add :role, :string, null: false, default: "viewer"
      add :confirmed_at, :utc_datetime
      add :is_active, :boolean, default: true, null: false
      add :last_login_at, :utc_datetime
      add :login_count, :integer, default: 0, null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:admins, [:email])
    create index(:admins, [:role])
    create index(:admins, [:is_active])
  end
end