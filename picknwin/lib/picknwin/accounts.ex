defmodule Picknwin.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Picknwin.Repo
  alias Picknwin.Accounts.User
  alias Picknwin.Audit

  @doc """
  Returns the list of users.
  """
  def list_users(opts \\\ []) do
    User
    |> apply_filters(opts)
    |> Repo.all()
  end

  @doc """
  Gets a single user.
  """
  def get_user!(id), do: Repo.get!(User, id)

  def get_user(id), do: Repo.get(User, id)

  @doc """
  Gets a user by email.
  """
  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: email)
  end

  @doc """
  Gets a user by username.
  """
  def get_user_by_username(username) when is_binary(username) do
    Repo.get_by(User, username: username)
  end

  @doc """
  Gets a user by email and password.
  """
  def get_user_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    user = get_user_by_email(email)
    if User.verify_password(user, password), do: user
  end

  @doc """
  Creates a user.
  """
  def create_user(attrs \\\ %{}) do
    %User{}
    |> User.registration_changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, user} ->
        Audit.log_action("user_created", %{user_id: user.id}, user)
        {:ok, user}
      error -> error
    end
  end

  @doc """
  Updates a user.
  """
  def update_user(%User{} = user, attrs, actor \\\ nil) do
    old_attrs = Map.take(user, [:role, :status, :kyc_status])
    
    user
    |> User.changeset(attrs)
    |> Repo.update()
    |> case do
      {:ok, updated_user} ->
        new_attrs = Map.take(updated_user, [:role, :status, :kyc_status])
        if old_attrs != new_attrs do
          Audit.log_action("user_updated", %{
            user_id: user.id,
            changes: %{before: old_attrs, after: new_attrs}
          }, actor || user)
        end
        {:ok, updated_user}
      error -> error
    end
  end

  @doc """
  Updates user by admin.
  """
  def admin_update_user(%User{} = user, attrs, %User{} = admin) do
    old_attrs = Map.take(user, [:role, :status, :kyc_status])
    
    user
    |> User.admin_changeset(attrs)
    |> Repo.update()
    |> case do
      {:ok, updated_user} ->
        new_attrs = Map.take(updated_user, [:role, :status, :kyc_status])
        Audit.log_action("admin_user_updated", %{
          target_user_id: user.id,
          changes: %{before: old_attrs, after: new_attrs}
        }, admin)
        {:ok, updated_user}
      error -> error
    end
  end

  @doc """
  Updates user balance.
  """
  def update_balance(%User{} = user, attrs, reason \\\ "balance_update") do
    old_balance = %{balance: user.balance, bonus_balance: user.bonus_balance}
    
    user
    |> User.balance_changeset(attrs)
    |> Repo.update()
    |> case do
      {:ok, updated_user} ->
        new_balance = %{balance: updated_user.balance, bonus_balance: updated_user.bonus_balance}
        Audit.log_action(reason, %{
          user_id: user.id,
          balance_change: %{before: old_balance, after: new_balance}
        }, user)
        {:ok, updated_user}
      error -> error
    end
  end

  @doc """
  Deletes a user.
  """
  def delete_user(%User{} = user, %User{} = admin) do
    Repo.delete(user)
    |> case do
      {:ok, deleted_user} ->
        Audit.log_action("user_deleted", %{deleted_user_id: user.id}, admin)
        {:ok, deleted_user}
      error -> error
    end
  end

  @doc """
  Records user login.
  """
  def record_login(%User{} = user) do
    user
    |> User.changeset(%{
      last_login_at: DateTime.utc_now(),
      login_count: user.login_count + 1
    })
    |> Repo.update()
  end

  @doc """
  Checks if user has required role.
  """
  def has_role?(%User{} = user, required_roles) when is_list(required_roles) do
    user.role in required_roles
  end

  def has_role?(%User{} = user, required_role) when is_atom(required_role) do
    user.role == required_role
  end

  @doc """
  Gets users with admin privileges.
  """
  def list_admins do
    User
    |> where([u], u.role in ^User.admin_roles())
    |> Repo.all()
  end

  defp apply_filters(query, []), do: query
  defp apply_filters(query, [{:role, role} | rest]) do
    query
    |> where([u], u.role == ^role)
    |> apply_filters(rest)
  end
  defp apply_filters(query, [{:status, status} | rest]) do
    query
    |> where([u], u.status == ^status)
    |> apply_filters(rest)
  end
  defp apply_filters(query, [{:search, term} | rest]) when is_binary(term) do
    search_term = "%#{term}%"
    query
    |> where([u], 
      ilike(u.email, ^search_term) or 
      ilike(u.username, ^search_term) or 
      ilike(u.first_name, ^search_term) or 
      ilike(u.last_name, ^search_term)
    )
    |> apply_filters(rest)
  end
  defp apply_filters(query, [_unknown | rest]), do: apply_filters(query, rest)
end