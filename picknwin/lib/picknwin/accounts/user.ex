defmodule Picknwin.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "users" do
    field :email, :string
    field :username, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    field :first_name, :string
    field :last_name, :string
    field :phone, :string
    field :date_of_birth, :date
    field :country, :string
    field :region, :string
    field :role, Ecto.Enum, values: [:user, :moderator, :admin, :superadmin], default: :user
    field :status, Ecto.Enum, values: [:active, :suspended, :banned], default: :active
    field :email_verified, :boolean, default: false
    field :phone_verified, :boolean, default: false
    field :kyc_status, Ecto.Enum, values: [:pending, :verified, :rejected], default: :pending
    field :balance, :decimal, default: Decimal.new("0.00")
    field :bonus_balance, :decimal, default: Decimal.new("0.00")
    field :last_login_at, :utc_datetime
    field :login_count, :integer, default: 0
    field :preferences, :map, default: %{}
    field :metadata, :map, default: %{}

    has_many :contest_entries, Picknwin.Contests.Entry
    has_many :teams, Picknwin.Teams.Team
    has_many :transactions, Picknwin.Wallet.Transaction
    has_many :audit_logs, Picknwin.Audit.Log, foreign_key: :user_id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [
      :email, :username, :password, :first_name, :last_name, :phone,
      :date_of_birth, :country, :region, :role, :status, :email_verified,
      :phone_verified, :kyc_status, :balance, :bonus_balance, :preferences, :metadata
    ])
    |> validate_required([:email, :username, :password, :first_name, :last_name])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+\.[^\s]+$/)
    |> validate_length(:username, min: 3, max: 20)
    |> validate_length(:password, min: 8)
    |> unique_constraint(:email)
    |> unique_constraint(:username)
    |> hash_password()
  end

  @doc false
  def registration_changeset(user, attrs) do
    user
    |> changeset(attrs)
    |> validate_required([:email, :username, :password, :first_name, :last_name, :country])
  end

  @doc false
  def admin_changeset(user, attrs) do
    user
    |> cast(attrs, [:role, :status, :kyc_status, :email_verified, :phone_verified])
    |> validate_inclusion(:role, [:user, :moderator, :admin, :superadmin])
    |> validate_inclusion(:status, [:active, :suspended, :banned])
  end

  @doc false
  def balance_changeset(user, attrs) do
    user
    |> cast(attrs, [:balance, :bonus_balance])
    |> validate_number(:balance, greater_than_or_equal_to: 0)
    |> validate_number(:bonus_balance, greater_than_or_equal_to: 0)
  end

  defp hash_password(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, password_hash: Bcrypt.hash_pwd_salt(password))
  end

  defp hash_password(changeset), do: changeset

  def verify_password(user, password) do
    Bcrypt.verify_pass(password, user.password_hash)
  end

  def admin_roles, do: [:admin, :superadmin]
  def moderator_roles, do: [:moderator, :admin, :superadmin]

  def can_publish?(user), do: user.role in [:admin, :superadmin]
  def can_moderate?(user), do: user.role in moderator_roles()
  def is_admin?(user), do: user.role in admin_roles()
end