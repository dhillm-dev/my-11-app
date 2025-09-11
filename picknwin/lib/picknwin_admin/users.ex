defmodule PicknwinAdmin.Users do
  @moduledoc """
  The Users context.
  """

  import Ecto.Query, warn: false
  alias PicknwinAdmin.Repo
  alias PicknwinAdmin.Users.User

  @doc """
  Returns the list of users with optional filtering and pagination.
  """
  def list_users(opts \\[]) do
    User
    |> apply_filters(opts)
    |> apply_sorting(opts)
    |> apply_pagination(opts)
    |> Repo.all()
  end

  @doc """
  Gets the total count of users with optional filtering.
  """
  def count_users(opts \\[]) do
    User
    |> apply_filters(opts)
    |> Repo.aggregate(:count, :id)
  end

  @doc """
  Gets a single user.
  """
  def get_user!(id) do
    Repo.get!(User, id)
  end

  @doc """
  Gets a user by email.
  """
  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  @doc """
  Gets a user by username.
  """
  def get_user_by_username(username) do
    Repo.get_by(User, username: username)
  end

  @doc """
  Creates a user.
  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.
  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates user status.
  """
  def update_user_status(%User{} = user, status, admin_id) do
    user
    |> User.status_changeset(%{
      status: status,
      status_changed_by_id: admin_id,
      status_changed_at: DateTime.utc_now()
    })
    |> Repo.update()
  end

  @doc """
  Updates user balance.
  """
  def update_user_balance(%User{} = user, balance_type, amount, admin_id) do
    current_balance = get_balance(user, balance_type)
    new_balance = Decimal.add(current_balance, amount)
    
    balance_updates = %{
      "#{balance_type}_balance" => new_balance,
      "balance_updated_by_id" => admin_id,
      "balance_updated_at" => DateTime.utc_now()
    }
    
    user
    |> User.balance_changeset(balance_updates)
    |> Repo.update()
  end

  @doc """
  Updates user KYC status.
  """
  def update_kyc_status(%User{} = user, kyc_status, admin_id) do
    user
    |> User.kyc_changeset(%{
      kyc_status: kyc_status,
      kyc_verified_by_id: admin_id,
      kyc_verified_at: DateTime.utc_now()
    })
    |> Repo.update()
  end

  @doc """
  Deletes a user.
  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Bulk updates user statuses.
  """
  def bulk_update_status(user_ids, status, admin_id) do
    now = DateTime.utc_now()
    
    from(u in User, where: u.id in ^user_ids)
    |> Repo.update_all(set: [
      status: status,
      status_changed_by_id: admin_id,
      status_changed_at: now,
      updated_at: now
    ])
  end

  @doc """
  Gets user statistics.
  """
  def get_user_stats do
    from(u in User,
      select: %{
        total_users: count(u.id),
        active_users: count(u.id) |> filter(u.status == "active"),
        suspended_users: count(u.id) |> filter(u.status == "suspended"),
        banned_users: count(u.id) |> filter(u.status == "banned"),
        verified_users: count(u.id) |> filter(u.kyc_status == "verified"),
        pending_kyc: count(u.id) |> filter(u.kyc_status == "pending"),
        total_deposit_balance: sum(u.deposit_balance),
        total_bonus_balance: sum(u.bonus_balance),
        total_winning_balance: sum(u.winning_balance)
      }
    )
    |> Repo.one()
  end

  @doc """
  Gets users registered in a date range.
  """
  def get_users_by_date_range(start_date, end_date) do
    from(u in User,
      where: u.inserted_at >= ^start_date and u.inserted_at <= ^end_date,
      order_by: [desc: u.inserted_at]
    )
    |> Repo.all()
  end

  @doc """
  Gets top users by balance.
  """
  def get_top_users_by_balance(balance_type \\ "total", limit \\ 10) do
    query = case balance_type do
      "deposit" -> from(u in User, order_by: [desc: u.deposit_balance])
      "bonus" -> from(u in User, order_by: [desc: u.bonus_balance])
      "winning" -> from(u in User, order_by: [desc: u.winning_balance])
      "total" -> from(u in User, order_by: [desc: fragment("? + ? + ?", u.deposit_balance, u.bonus_balance, u.winning_balance)])
    end
    
    query
    |> limit(^limit)
    |> Repo.all()
  end

  @doc """
  Gets recently active users.
  """
  def get_recently_active_users(limit \\ 20) do
    from(u in User,
      where: not is_nil(u.last_login_at),
      order_by: [desc: u.last_login_at],
      limit: ^limit
    )
    |> Repo.all()
  end

  @doc """
  Searches users by various criteria.
  """
  def search_users(search_term) when is_binary(search_term) and search_term != "" do
    search_pattern = "%#{search_term}%"
    
    from(u in User,
      where: 
        ilike(u.email, ^search_pattern) or
        ilike(u.username, ^search_pattern) or
        ilike(u.name, ^search_pattern) or
        ilike(u.phone, ^search_pattern),
      order_by: [desc: u.inserted_at]
    )
    |> Repo.all()
  end
  def search_users(_), do: []

  # Private helper functions
  defp get_balance(%User{} = user, "deposit"), do: user.deposit_balance
  defp get_balance(%User{} = user, "bonus"), do: user.bonus_balance
  defp get_balance(%User{} = user, "winning"), do: user.winning_balance

  defp apply_filters(query, opts) do
    Enum.reduce(opts, query, fn
      {:search, search_term}, query when is_binary(search_term) and search_term != "" ->
        search_pattern = "%#{search_term}%"
        where(query, [u], 
          ilike(u.email, ^search_pattern) or
          ilike(u.username, ^search_pattern) or
          ilike(u.name, ^search_pattern) or
          ilike(u.phone, ^search_pattern)
        )
      
      {:status, status}, query when is_binary(status) and status != "" ->
        where(query, [u], u.status == ^status)
      
      {:role, role}, query when is_binary(role) and role != "" ->
        where(query, [u], u.role == ^role)
      
      {:kyc_status, kyc_status}, query when is_binary(kyc_status) and kyc_status != "" ->
        where(query, [u], u.kyc_status == ^kyc_status)
      
      {:country, country}, query when is_binary(country) and country != "" ->
        where(query, [u], u.country == ^country)
      
      {:region, region}, query when is_binary(region) and region != "" ->
        where(query, [u], u.region == ^region)
      
      {:registered_after, date}, query when not is_nil(date) ->
        where(query, [u], u.inserted_at >= ^date)
      
      {:registered_before, date}, query when not is_nil(date) ->
        where(query, [u], u.inserted_at <= ^date)
      
      {:last_login_after, date}, query when not is_nil(date) ->
        where(query, [u], u.last_login_at >= ^date)
      
      {:last_login_before, date}, query when not is_nil(date) ->
        where(query, [u], u.last_login_at <= ^date)
      
      {:min_balance, amount}, query when is_number(amount) ->
        where(query, [u], fragment("? + ? + ?", u.deposit_balance, u.bonus_balance, u.winning_balance) >= ^amount)
      
      {:max_balance, amount}, query when is_number(amount) ->
        where(query, [u], fragment("? + ? + ?", u.deposit_balance, u.bonus_balance, u.winning_balance) <= ^amount)
      
      _, query -> query
    end)
  end

  defp apply_sorting(query, opts) do
    case Keyword.get(opts, :sort_by, "inserted_at_desc") do
      "name" -> order_by(query, [u], asc: u.name)
      "name_desc" -> order_by(query, [u], desc: u.name)
      "email" -> order_by(query, [u], asc: u.email)
      "email_desc" -> order_by(query, [u], desc: u.email)
      "username" -> order_by(query, [u], asc: u.username)
      "username_desc" -> order_by(query, [u], desc: u.username)
      "status" -> order_by(query, [u], asc: u.status)
      "kyc_status" -> order_by(query, [u], asc: u.kyc_status)
      "balance" -> order_by(query, [u], desc: fragment("? + ? + ?", u.deposit_balance, u.bonus_balance, u.winning_balance))
      "balance_asc" -> order_by(query, [u], asc: fragment("? + ? + ?", u.deposit_balance, u.bonus_balance, u.winning_balance))
      "last_login" -> order_by(query, [u], desc: u.last_login_at)
      "last_login_asc" -> order_by(query, [u], asc: u.last_login_at)
      "inserted_at" -> order_by(query, [u], asc: u.inserted_at)
      "inserted_at_desc" -> order_by(query, [u], desc: u.inserted_at)
      _ -> order_by(query, [u], desc: u.inserted_at)
    end
  end

  defp apply_pagination(query, opts) do
    page = Keyword.get(opts, :page, 1)
    per_page = Keyword.get(opts, :per_page, 20)
    offset = (page - 1) * per_page
    
    query
    |> limit(^per_page)
    |> offset(^offset)
  end
end