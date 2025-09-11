defmodule PicknwinAdmin.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :email, :string
    field :username, :string
    field :password_hash, :string
    field :name, :string
    field :phone, :string
    field :date_of_birth, :date
    field :gender, :string
    field :country, :string
    field :state, :string
    field :city, :string
    field :region, :string
    field :role, :string, default: "user"
    field :status, :string, default: "active"
    field :avatar_url, :string
    
    # Balance fields
    field :deposit_balance, :decimal, default: Decimal.new("0.00")
    field :bonus_balance, :decimal, default: Decimal.new("0.00")
    field :winning_balance, :decimal, default: Decimal.new("0.00")
    
    # KYC fields
    field :kyc_status, :string, default: "pending"
    field :kyc_documents, :map, default: %{}
    field :kyc_verified_at, :utc_datetime
    field :kyc_verified_by_id, :binary_id
    
    # Activity tracking
    field :last_login_at, :utc_datetime
    field :login_count, :integer, default: 0
    field :last_login_ip, :string
    field :last_activity_at, :utc_datetime
    
    # Preferences
    field :preferences, :map, default: %{}
    field :notification_settings, :map, default: %{}
    field :privacy_settings, :map, default: %{}
    
    # Admin tracking
    field :status_changed_at, :utc_datetime
    field :status_changed_by_id, :binary_id
    field :balance_updated_at, :utc_datetime
    field :balance_updated_by_id, :binary_id
    field :notes, :text
    field :metadata, :map, default: %{}
    
    # Relationships
    belongs_to :status_changed_by, PicknwinAdmin.Accounts.Admin, foreign_key: :status_changed_by_id, define_field: false
    belongs_to :balance_updated_by, PicknwinAdmin.Accounts.Admin, foreign_key: :balance_updated_by_id, define_field: false
    belongs_to :kyc_verified_by, PicknwinAdmin.Accounts.Admin, foreign_key: :kyc_verified_by_id, define_field: false
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [
      :email, :username, :password_hash, :name, :phone, :date_of_birth,
      :gender, :country, :state, :city, :region, :role, :status, :avatar_url,
      :deposit_balance, :bonus_balance, :winning_balance, :kyc_status,
      :kyc_documents, :last_login_at, :login_count, :last_login_ip,
      :last_activity_at, :preferences, :notification_settings,
      :privacy_settings, :notes, :metadata
    ])
    |> validate_required([:email, :username, :name])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+\.[^\s]+$/)
    |> validate_length(:username, min: 3, max: 20)
    |> validate_format(:username, ~r/^[a-zA-Z0-9_]+$/)
    |> validate_length(:name, min: 2, max: 100)
    |> validate_format(:phone, ~r/^\+?[1-9]\d{1,14}$/)
    |> validate_inclusion(:gender, ["male", "female", "other", nil])
    |> validate_inclusion(:role, ["user", "premium_user", "vip_user"])
    |> validate_inclusion(:status, ["active", "suspended", "banned", "inactive"])
    |> validate_inclusion(:kyc_status, ["pending", "submitted", "verified", "rejected"])
    |> validate_number(:deposit_balance, greater_than_or_equal_to: 0)
    |> validate_number(:bonus_balance, greater_than_or_equal_to: 0)
    |> validate_number(:winning_balance, greater_than_or_equal_to: 0)
    |> validate_number(:login_count, greater_than_or_equal_to: 0)
    |> validate_age()
    |> unique_constraint(:email)
    |> unique_constraint(:username)
    |> unique_constraint(:phone)
  end

  @doc false
  def status_changeset(user, attrs) do
    user
    |> cast(attrs, [:status, :status_changed_at, :status_changed_by_id, :notes])
    |> validate_inclusion(:status, ["active", "suspended", "banned", "inactive"])
    |> validate_status_transition()
  end

  @doc false
  def balance_changeset(user, attrs) do
    user
    |> cast(attrs, [:deposit_balance, :bonus_balance, :winning_balance, :balance_updated_at, :balance_updated_by_id])
    |> validate_number(:deposit_balance, greater_than_or_equal_to: 0)
    |> validate_number(:bonus_balance, greater_than_or_equal_to: 0)
    |> validate_number(:winning_balance, greater_than_or_equal_to: 0)
  end

  @doc false
  def kyc_changeset(user, attrs) do
    user
    |> cast(attrs, [:kyc_status, :kyc_documents, :kyc_verified_at, :kyc_verified_by_id])
    |> validate_inclusion(:kyc_status, ["pending", "submitted", "verified", "rejected"])
    |> validate_kyc_transition()
  end

  @doc false
  def activity_changeset(user, attrs) do
    user
    |> cast(attrs, [:last_login_at, :login_count, :last_login_ip, :last_activity_at])
    |> validate_number(:login_count, greater_than_or_equal_to: 0)
  end

  defp validate_age(changeset) do
    case get_field(changeset, :date_of_birth) do
      nil -> changeset
      dob ->
        age = Date.diff(Date.utc_today(), dob) |> div(365)
        if age < 18 do
          add_error(changeset, :date_of_birth, "must be at least 18 years old")
        else
          changeset
        end
    end
  end

  defp validate_status_transition(changeset) do
    old_status = changeset.data.status
    new_status = get_change(changeset, :status)
    
    case {old_status, new_status} do
      {"active", "suspended"} -> changeset
      {"active", "banned"} -> changeset
      {"active", "inactive"} -> changeset
      {"suspended", "active"} -> changeset
      {"suspended", "banned"} -> changeset
      {"inactive", "active"} -> changeset
      {"banned", "active"} -> changeset  # Only superadmin should allow this
      {same, same} -> changeset
      {nil, _} -> changeset
      _ -> add_error(changeset, :status, "invalid status transition from #{old_status} to #{new_status}")
    end
  end

  defp validate_kyc_transition(changeset) do
    old_status = changeset.data.kyc_status
    new_status = get_change(changeset, :kyc_status)
    
    case {old_status, new_status} do
      {"pending", "submitted"} -> changeset
      {"submitted", "verified"} -> changeset
      {"submitted", "rejected"} -> changeset
      {"rejected", "submitted"} -> changeset
      {"verified", "rejected"} -> changeset  # In case of fraud detection
      {same, same} -> changeset
      {nil, _} -> changeset
      _ -> add_error(changeset, :kyc_status, "invalid KYC status transition from #{old_status} to #{new_status}")
    end
  end

  # Helper functions
  def display_name(%__MODULE__{name: name}), do: name

  def full_display_name(%__MODULE__{name: name, username: username}) do
    "#{name} (@#{username})"
  end

  def is_active?(%__MODULE__{status: "active"}), do: true
  def is_active?(_), do: false

  def is_suspended?(%__MODULE__{status: "suspended"}), do: true
  def is_suspended?(_), do: false

  def is_banned?(%__MODULE__{status: "banned"}), do: true
  def is_banned?(_), do: false

  def is_kyc_verified?(%__MODULE__{kyc_status: "verified"}), do: true
  def is_kyc_verified?(_), do: false

  def is_kyc_pending?(%__MODULE__{kyc_status: "pending"}), do: true
  def is_kyc_pending?(_), do: false

  def total_balance(%__MODULE__{deposit_balance: deposit, bonus_balance: bonus, winning_balance: winning}) do
    Decimal.add(deposit, Decimal.add(bonus, winning))
  end

  def status_badge_class(%__MODULE__{status: status}) do
    case status do
      "active" -> "bg-green-100 text-green-800"
      "suspended" -> "bg-yellow-100 text-yellow-800"
      "banned" -> "bg-red-100 text-red-800"
      "inactive" -> "bg-gray-100 text-gray-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def kyc_status_badge_class(%__MODULE__{kyc_status: status}) do
    case status do
      "verified" -> "bg-green-100 text-green-800"
      "submitted" -> "bg-blue-100 text-blue-800"
      "pending" -> "bg-yellow-100 text-yellow-800"
      "rejected" -> "bg-red-100 text-red-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def role_badge_class(%__MODULE__{role: role}) do
    case role do
      "user" -> "bg-blue-100 text-blue-800"
      "premium_user" -> "bg-purple-100 text-purple-800"
      "vip_user" -> "bg-yellow-100 text-yellow-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def balance_display(%__MODULE__{} = user, balance_type) do
    balance = case balance_type do
      :deposit -> user.deposit_balance
      :bonus -> user.bonus_balance
      :winning -> user.winning_balance
      :total -> total_balance(user)
    end
    
    "₹#{Decimal.to_string(balance, :normal)}"
  end

  def age(%__MODULE__{date_of_birth: nil}), do: nil
  def age(%__MODULE__{date_of_birth: dob}) do
    Date.diff(Date.utc_today(), dob) |> div(365)
  end

  def days_since_registration(%__MODULE__{inserted_at: inserted_at}) do
    DateTime.diff(DateTime.utc_now(), inserted_at, :day)
  end

  def days_since_last_login(%__MODULE__{last_login_at: nil}), do: nil
  def days_since_last_login(%__MODULE__{last_login_at: last_login}) do
    DateTime.diff(DateTime.utc_now(), last_login, :day)
  end

  def activity_status(%__MODULE__{} = user) do
    case days_since_last_login(user) do
      nil -> "never_logged_in"
      days when days <= 1 -> "very_active"
      days when days <= 7 -> "active"
      days when days <= 30 -> "inactive"
      _ -> "dormant"
    end
  end

  def activity_status_class(%__MODULE__{} = user) do
    case activity_status(user) do
      "very_active" -> "text-green-600"
      "active" -> "text-blue-600"
      "inactive" -> "text-yellow-600"
      "dormant" -> "text-red-600"
      "never_logged_in" -> "text-gray-600"
    end
  end
end