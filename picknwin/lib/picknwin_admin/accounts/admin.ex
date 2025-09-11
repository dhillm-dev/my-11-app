defmodule PicknwinAdmin.Accounts.Admin do
  use Ecto.Schema
  import Ecto.Changeset

  @roles [:superadmin, :admin, :moderator, :viewer]

  schema "admins" do
    field :email, :string
    field :password, :string, virtual: true, redact: true
    field :hashed_password, :string, redact: true
    field :confirmed_at, :naive_datetime
    field :role, Ecto.Enum, values: @roles, default: :viewer
    field :first_name, :string
    field :last_name, :string
    field :is_active, :boolean, default: true
    field :last_login_at, :naive_datetime
    field :created_by_id, :id

    timestamps(type: :utc_datetime)
  end

  @doc """
  A admin changeset for registration.

  It is important to validate the length of both email and password.
  Otherwise databases may truncate the email without warnings, which
  could lead to unpredictable or insecure behaviour. Long passwords may
  also be very expensive to hash for certain algorithms.

  ## Options

    * `:hash_password` - Hashes the password so it can be stored securely
      in the database and ensures the password field is cleared to prevent
      leaks in the logs. If password hashing is not needed and clearing the
      password field is not desired (like when using this changeset for
      validations on a LiveView form), this option can be set to `false`.
      Defaults to `true`.

    * `:validate_email` - Validates the uniqueness of the email, in case
      you don't want to validate the uniqueness of the email (like when
      using this changeset for validations on a LiveView form before
      submitting the form), this option can be set to `false`.
      Defaults to `true`.
  """
  def registration_changeset(admin, attrs, opts \\ []) do
    admin
    |> cast(attrs, [:email, :password, :role, :first_name, :last_name])
    |> validate_email(opts)
    |> validate_password(opts)
    |> validate_required([:first_name, :last_name])
    |> validate_role()
  end

  defp validate_email(changeset, opts) do
    changeset
    |> validate_required([:email])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have the @ sign and no spaces")
    |> validate_length(:email, max: 160)
    |> maybe_validate_unique_email(opts)
  end

  defp validate_password(changeset, opts) do
    changeset
    |> validate_required([:password])
    |> validate_length(:password, min: 12, max: 72)
    # Examples of additional password validation:
    # |> validate_format(:password, ~r/[a-z]/, message: "at least one lower case character")
    # |> validate_format(:password, ~r/[A-Z]/, message: "at least one upper case character")
    # |> validate_format(:password, ~r/[!?@#$%^&*_0-9]/, message: "at least one digit or punctuation character")
    |> maybe_hash_password(opts)
  end

  defp validate_role(changeset) do
    changeset
    |> validate_required([:role])
    |> validate_inclusion(:role, @roles)
  end

  defp maybe_hash_password(changeset, opts) do
    hash_password? = Keyword.get(opts, :hash_password, true)
    password = get_change(changeset, :password)

    if hash_password? && password && changeset.valid? do
      changeset
      # If using Bcrypt, then further validate it is at most 72 bytes long
      |> validate_length(:password, max: 72, count: :bytes)
      # Hashing could be done with `Ecto.Changeset.prepare_changes/2`, but that
      # would keep the database transaction open longer and hurt performance.
      |> put_change(:hashed_password, Bcrypt.hash_pwd_salt(password))
      |> delete_change(:password)
    else
      changeset
    end
  end

  defp maybe_validate_unique_email(changeset, opts) do
    if Keyword.get(opts, :validate_email, true) do
      changeset
      |> unsafe_validate_unique(:email, PicknwinAdmin.Repo)
      |> unique_constraint(:email)
    else
      changeset
    end
  end

  @doc """
  A admin changeset for changing the email.

  It requires the email to change otherwise an error is added.
  """
  def email_changeset(admin, attrs, opts \\ []) do
    admin
    |> cast(attrs, [:email])
    |> validate_email(opts)
    |> case do
      %{changes: %{email: _}} = changeset -> changeset
      %{} = changeset -> add_error(changeset, :email, "did not change")
    end
  end

  @doc """
  A admin changeset for changing the password.

  ## Options

    * `:hash_password` - Hashes the password so it can be stored securely
      in the database and ensures the password field is cleared to prevent
      leaks in the logs. If password hashing is not needed and clearing the
      password field is not desired (like when using this changeset for
      validations on a LiveView form), this option can be set to `false`.
      Defaults to `true`.
  """
  def password_changeset(admin, attrs, opts \\ []) do
    admin
    |> cast(attrs, [:password])
    |> validate_confirmation(:password, message: "does not match password")
    |> validate_password(opts)
  end

  @doc """
  A admin changeset for updating profile information.
  """
  def profile_changeset(admin, attrs) do
    admin
    |> cast(attrs, [:first_name, :last_name])
    |> validate_required([:first_name, :last_name])
    |> validate_length(:first_name, min: 1, max: 50)
    |> validate_length(:last_name, min: 1, max: 50)
  end

  @doc """
  A admin changeset for updating role (superadmin only).
  """
  def role_changeset(admin, attrs) do
    admin
    |> cast(attrs, [:role, :is_active])
    |> validate_role()
  end

  @doc """
  Confirms the account by setting `confirmed_at`.
  """
  def confirm_changeset(admin) do
    now = NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second)
    change(admin, confirmed_at: now)
  end

  @doc """
  Updates the last login timestamp.
  """
  def login_changeset(admin) do
    now = NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second)
    change(admin, last_login_at: now)
  end

  @doc """
  Verifies the password.

  If there is no admin or the admin doesn't have a password, we call
  `Bcrypt.no_user_verify/0` to avoid timing attacks.
  """
  def valid_password?(%PicknwinAdmin.Accounts.Admin{hashed_password: hashed_password}, password)
      when is_binary(hashed_password) and byte_size(password) > 0 do
    Bcrypt.verify_pass(password, hashed_password)
  end

  def valid_password?(_, _) do
    Bcrypt.no_user_verify()
    false
  end

  @doc """
  Validates the current password otherwise adds an error to the changeset.
  """
  def validate_current_password(changeset, password) do
    if valid_password?(changeset.data, password) do
      changeset
    else
      add_error(changeset, :current_password, "is not valid")
    end
  end

  @doc """
  Returns the full name of the admin.
  """
  def full_name(%PicknwinAdmin.Accounts.Admin{first_name: first_name, last_name: last_name}) do
    "#{first_name} #{last_name}"
  end

  @doc """
  Returns true if the admin has the given role or higher.
  """
  def has_role?(%PicknwinAdmin.Accounts.Admin{role: admin_role}, required_role) do
    role_level(admin_role) >= role_level(required_role)
  end

  @doc """
  Returns true if the admin can perform the given action.
  """
  def can?(%PicknwinAdmin.Accounts.Admin{} = admin, action) do
    case action do
      :manage_admins -> has_role?(admin, :superadmin)
      :manage_users -> has_role?(admin, :admin)
      :manage_contests -> has_role?(admin, :admin)
      :manage_matches -> has_role?(admin, :moderator)
      :view_reports -> has_role?(admin, :moderator)
      :manage_wallet -> has_role?(admin, :admin)
      :view_dashboard -> has_role?(admin, :viewer)
      _ -> false
    end
  end

  defp role_level(:superadmin), do: 4
  defp role_level(:admin), do: 3
  defp role_level(:moderator), do: 2
  defp role_level(:viewer), do: 1
  defp role_level(_), do: 0
end