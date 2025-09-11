defmodule Picknwin.Repo.Migrations.CreateAuditLogs do
  use Ecto.Migration

  def change do
    create table(:audit_logs, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :action, :string, null: false
      add :resource_type, :string, null: false
      add :resource_id, :string
      add :changes, :map, null: false, default: %{}
      add :metadata, :map, null: false, default: %{}
      add :ip_address, :string
      add :user_agent, :text
      add :session_id, :string
      add :request_id, :string
      add :severity, :string, null: false, default: "info"
      add :tags, {:array, :string}, null: false, default: []
      
      # User relationship (nullable for system actions)
      add :user_id, references(:users, type: :binary_id, on_delete: :nilify_all)
      
      # Additional context
      add :before_state, :map
      add :after_state, :map
      add :error_details, :map
      add :duration_ms, :integer
      add :success, :boolean, null: false, default: true

      timestamps(type: :utc_datetime, updated_at: false)
    end

    create index(:audit_logs, [:user_id])
    create index(:audit_logs, [:action])
    create index(:audit_logs, [:resource_type])
    create index(:audit_logs, [:resource_id])
    create index(:audit_logs, [:severity])
    create index(:audit_logs, [:success])
    create index(:audit_logs, [:inserted_at])
    create index(:audit_logs, [:session_id])
    create index(:audit_logs, [:request_id])
    
    # Composite indexes for common queries
    create index(:audit_logs, [:user_id, :inserted_at])
    create index(:audit_logs, [:resource_type, :resource_id])
    create index(:audit_logs, [:action, :resource_type])
    create index(:audit_logs, [:inserted_at, :severity])
    
    # GIN indexes for JSON fields and arrays
    create index(:audit_logs, [:changes], using: :gin)
    create index(:audit_logs, [:metadata], using: :gin)
    create index(:audit_logs, [:tags], using: :gin)
    
    # Partial indexes for performance
    create index(:audit_logs, [:inserted_at], where: "severity IN ('error', 'critical')")
    create index(:audit_logs, [:user_id, :inserted_at], where: "success = false")
  end
end