defmodule PicknwinAdmin.Wallet.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "transactions" do
    field :reference_id, :string
    field :type, :string
    field :amount, :decimal
    field :balance_type, :string
    field :status, :string, default: "pending"
    field :description, :string
    field :gateway, :string
    field :gateway_transaction_id, :string
    field :gateway_response, :map, default: %{}
    field :processed_at, :utc_datetime
    field :failure_reason, :string
    field :metadata, :map, default: %{}
    
    # Relationships
    belongs_to :user, PicknwinAdmin.Users.User
    belongs_to :processed_by, PicknwinAdmin.Accounts.Admin, foreign_key: :processed_by_id
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [
      :reference_id, :type, :amount, :balance_type, :status, :description,
      :gateway, :gateway_transaction_id, :gateway_response, :processed_at,
      :failure_reason, :metadata, :user_id, :processed_by_id
    ])
    |> validate_required([:type, :amount, :balance_type, :user_id])
    |> validate_inclusion(:type, [
      "deposit", "withdrawal", "bonus_deposit", "contest_entry", "contest_winning",
      "refund", "credit_adjustment", "debit_adjustment", "cashback", "referral_bonus"
    ])
    |> validate_inclusion(:balance_type, ["deposit", "bonus", "winning"])
    |> validate_inclusion(:status, ["pending", "processing", "completed", "failed", "cancelled"])
    |> validate_inclusion(:gateway, ["razorpay", "paytm", "phonepe", "upi", "netbanking", "manual", nil])
    |> validate_number(:amount, greater_than: 0)
    |> validate_transaction_rules()
    |> generate_reference_id()
    |> unique_constraint(:reference_id)
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:processed_by_id)
  end

  @doc false
  def status_changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:status, :processed_at, :processed_by_id, :failure_reason, :gateway_response])
    |> validate_inclusion(:status, ["pending", "processing", "completed", "failed", "cancelled"])
    |> validate_status_transition()
  end

  defp validate_transaction_rules(changeset) do
    type = get_field(changeset, :type)
    balance_type = get_field(changeset, :balance_type)
    
    case {type, balance_type} do
      # Deposits can only go to deposit balance
      {"deposit", "deposit"} -> changeset
      {"deposit", _} -> add_error(changeset, :balance_type, "deposits must go to deposit balance")
      
      # Bonus deposits can only go to bonus balance
      {"bonus_deposit", "bonus"} -> changeset
      {"bonus_deposit", _} -> add_error(changeset, :balance_type, "bonus deposits must go to bonus balance")
      
      # Contest winnings can only go to winning balance
      {"contest_winning", "winning"} -> changeset
      {"contest_winning", _} -> add_error(changeset, :balance_type, "contest winnings must go to winning balance")
      
      # Withdrawals can only be from deposit or winning balance
      {"withdrawal", balance} when balance in ["deposit", "winning"] -> changeset
      {"withdrawal", _} -> add_error(changeset, :balance_type, "withdrawals can only be from deposit or winning balance")
      
      # Contest entries can be from any balance type
      {"contest_entry", _} -> changeset
      
      # Adjustments and other types are flexible
      _ -> changeset
    end
  end

  defp validate_status_transition(changeset) do
    old_status = changeset.data.status
    new_status = get_change(changeset, :status)
    
    case {old_status, new_status} do
      {"pending", "processing"} -> changeset
      {"pending", "completed"} -> changeset
      {"pending", "failed"} -> changeset
      {"pending", "cancelled"} -> changeset
      {"processing", "completed"} -> changeset
      {"processing", "failed"} -> changeset
      {same, same} -> changeset
      {nil, _} -> changeset
      _ -> add_error(changeset, :status, "invalid status transition from #{old_status} to #{new_status}")
    end
  end

  defp generate_reference_id(changeset) do
    if get_field(changeset, :reference_id) do
      changeset
    else
      type = get_field(changeset, :type)
      timestamp = DateTime.utc_now() |> DateTime.to_unix()
      random = :crypto.strong_rand_bytes(4) |> Base.encode16(case: :lower)
      
      prefix = case type do
        "deposit" -> "DEP"
        "withdrawal" -> "WTH"
        "bonus_deposit" -> "BON"
        "contest_entry" -> "ENT"
        "contest_winning" -> "WIN"
        "refund" -> "REF"
        "credit_adjustment" -> "CRA"
        "debit_adjustment" -> "DRA"
        "cashback" -> "CBK"
        "referral_bonus" -> "RFB"
        _ -> "TXN"
      end
      
      reference_id = "#{prefix}#{timestamp}#{random}"
      put_change(changeset, :reference_id, reference_id)
    end
  end

  # Helper functions
  def display_reference(%__MODULE__{reference_id: ref}), do: ref

  def is_pending?(%__MODULE__{status: "pending"}), do: true
  def is_pending?(_), do: false

  def is_processing?(%__MODULE__{status: "processing"}), do: true
  def is_processing?(_), do: false

  def is_completed?(%__MODULE__{status: "completed"}), do: true
  def is_completed?(_), do: false

  def is_failed?(%__MODULE__{status: "failed"}), do: true
  def is_failed?(_), do: false

  def is_cancelled?(%__MODULE__{status: "cancelled"}), do: true
  def is_cancelled?(_), do: false

  def is_credit_transaction?(%__MODULE__{type: type}) do
    type in ["deposit", "bonus_deposit", "contest_winning", "refund", "credit_adjustment", "cashback", "referral_bonus"]
  end

  def is_debit_transaction?(%__MODULE__{type: type}) do
    type in ["withdrawal", "contest_entry", "debit_adjustment"]
  end

  def type_display(%__MODULE__{type: type}) do
    case type do
      "deposit" -> "Deposit"
      "withdrawal" -> "Withdrawal"
      "bonus_deposit" -> "Bonus Deposit"
      "contest_entry" -> "Contest Entry"
      "contest_winning" -> "Contest Winning"
      "refund" -> "Refund"
      "credit_adjustment" -> "Credit Adjustment"
      "debit_adjustment" -> "Debit Adjustment"
      "cashback" -> "Cashback"
      "referral_bonus" -> "Referral Bonus"
      _ -> String.capitalize(String.replace(type, "_", " "))
    end
  end

  def status_badge_class(%__MODULE__{status: status}) do
    case status do
      "pending" -> "bg-yellow-100 text-yellow-800"
      "processing" -> "bg-blue-100 text-blue-800"
      "completed" -> "bg-green-100 text-green-800"
      "failed" -> "bg-red-100 text-red-800"
      "cancelled" -> "bg-gray-100 text-gray-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def type_badge_class(%__MODULE__{} = transaction) do
    if is_credit_transaction?(transaction) do
      "bg-green-100 text-green-800"
    else
      "bg-red-100 text-red-800"
    end
  end

  def balance_type_display(%__MODULE__{balance_type: balance_type}) do
    case balance_type do
      "deposit" -> "Deposit Balance"
      "bonus" -> "Bonus Balance"
      "winning" -> "Winning Balance"
      _ -> String.capitalize(String.replace(balance_type, "_", " "))
    end
  end

  def amount_display(%__MODULE__{amount: amount}) do
    "₹#{Decimal.to_string(amount, :normal)}"
  end

  def amount_with_sign(%__MODULE__{} = transaction) do
    sign = if is_credit_transaction?(transaction), do: "+", else: "-"
    "#{sign}#{amount_display(transaction)}"
  end

  def gateway_display(%__MODULE__{gateway: nil}), do: "Manual"
  def gateway_display(%__MODULE__{gateway: gateway}) do
    String.capitalize(gateway)
  end

  def processing_time(%__MODULE__{inserted_at: inserted_at, processed_at: nil}) do
    seconds = DateTime.diff(DateTime.utc_now(), inserted_at, :second)
    format_duration(seconds)
  end
  def processing_time(%__MODULE__{inserted_at: inserted_at, processed_at: processed_at}) do
    seconds = DateTime.diff(processed_at, inserted_at, :second)
    format_duration(seconds)
  end

  defp format_duration(seconds) when seconds < 60, do: "#{seconds}s"
  defp format_duration(seconds) when seconds < 3600 do
    minutes = div(seconds, 60)
    "#{minutes}m"
  end
  defp format_duration(seconds) do
    hours = div(seconds, 3600)
    "#{hours}h"
  end

  def can_be_processed?(%__MODULE__{status: "pending"}), do: true
  def can_be_processed?(_), do: false

  def can_be_cancelled?(%__MODULE__{status: status}) when status in ["pending", "processing"], do: true
  def can_be_cancelled?(_), do: false
end