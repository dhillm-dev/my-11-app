defmodule Picknwin.Repo.Migrations.CreateTransactions do
  use Ecto.Migration

  def change do
    create table(:transactions, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :external_id, :string
      add :type, :string, null: false
      add :category, :string, null: false
      add :amount, :decimal, precision: 12, scale: 2, null: false
      add :currency, :string, null: false, default: "USD"
      add :status, :string, null: false, default: "pending"
      add :description, :text
      add :reference_type, :string
      add :reference_id, :binary_id
      add :payment_method, :string
      add :payment_gateway, :string
      add :gateway_transaction_id, :string
      add :gateway_response, :map
      add :fee_amount, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :net_amount, :decimal, precision: 12, scale: 2, null: false
      add :balance_before, :decimal, precision: 12, scale: 2
      add :balance_after, :decimal, precision: 12, scale: 2
      add :bonus_balance_before, :decimal, precision: 12, scale: 2
      add :bonus_balance_after, :decimal, precision: 12, scale: 2
      add :metadata, :map, null: false, default: %{}
      
      # User relationship
      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false
      
      # Processing details
      add :processed_at, :utc_datetime
      add :failed_at, :utc_datetime
      add :failure_reason, :text
      add :retry_count, :integer, null: false, default: 0
      add :max_retries, :integer, null: false, default: 3
      
      # Reconciliation
      add :reconciled, :boolean, null: false, default: false
      add :reconciled_at, :utc_datetime
      add :reconciliation_reference, :string
      
      # Tax and compliance
      add :tax_amount, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :tds_amount, :decimal, precision: 10, scale: 2, null: false, default: 0.0
      add :is_taxable, :boolean, null: false, default: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:transactions, [:external_id], where: "external_id IS NOT NULL")
    create index(:transactions, [:user_id])
    create index(:transactions, [:type])
    create index(:transactions, [:category])
    create index(:transactions, [:status])
    create index(:transactions, [:payment_method])
    create index(:transactions, [:payment_gateway])
    create index(:transactions, [:gateway_transaction_id])
    create index(:transactions, [:reference_type, :reference_id])
    create index(:transactions, [:processed_at])
    create index(:transactions, [:reconciled])
    create index(:transactions, [:inserted_at])
    
    # Composite indexes for common queries
    create index(:transactions, [:user_id, :status])
    create index(:transactions, [:user_id, :type])
    create index(:transactions, [:user_id, :inserted_at])
    create index(:transactions, [:status, :inserted_at])
    create index(:transactions, [:type, :status])
    create index(:transactions, [:reconciled, :processed_at])
    
    # Financial reporting indexes
    create index(:transactions, [:processed_at, :type], where: "status = 'completed'")
    create index(:transactions, [:processed_at, :amount], where: "status = 'completed'")
    
    # GIN index for gateway_response and metadata
    create index(:transactions, [:gateway_response], using: :gin)
    create index(:transactions, [:metadata], using: :gin)
  end
end