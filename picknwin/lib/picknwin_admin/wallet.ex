defmodule PicknwinAdmin.Wallet do
  @moduledoc """
  The Wallet context for managing user transactions and balances.
  """

  import Ecto.Query, warn: false
  alias PicknwinAdmin.Repo
  alias PicknwinAdmin.Wallet.Transaction
  alias PicknwinAdmin.Users.User

  @doc """
  Returns the list of transactions with optional filtering and pagination.
  """
  def list_transactions(opts \\[]) do
    Transaction
    |> apply_filters(opts)
    |> apply_sorting(opts)
    |> apply_pagination(opts)
    |> Repo.all()
    |> Repo.preload([:user, :processed_by])
  end

  @doc """
  Gets the total count of transactions with optional filtering.
  """
  def count_transactions(opts \\[]) do
    Transaction
    |> apply_filters(opts)
    |> Repo.aggregate(:count, :id)
  end

  @doc """
  Gets a single transaction.
  """
  def get_transaction!(id) do
    Transaction
    |> Repo.get!(id)
    |> Repo.preload([:user, :processed_by])
  end

  @doc """
  Gets transactions for a specific user.
  """
  def get_user_transactions(user_id, opts \\[]) do
    Transaction
    |> where([t], t.user_id == ^user_id)
    |> apply_filters(opts)
    |> apply_sorting(opts)
    |> apply_pagination(opts)
    |> Repo.all()
    |> Repo.preload([:user, :processed_by])
  end

  @doc """
  Creates a transaction.
  """
  def create_transaction(attrs \\ %{}) do
    %Transaction{}
    |> Transaction.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a transaction.
  """
  def update_transaction(%Transaction{} = transaction, attrs) do
    transaction
    |> Transaction.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates transaction status.
  """
  def update_transaction_status(%Transaction{} = transaction, status, admin_id) do
    transaction
    |> Transaction.status_changeset(%{
      status: status,
      processed_by_id: admin_id,
      processed_at: DateTime.utc_now()
    })
    |> Repo.update()
  end

  @doc """
  Processes a pending transaction.
  """
  def process_transaction(%Transaction{} = transaction, admin_id) do
    Repo.transaction(fn ->
      with {:ok, updated_transaction} <- update_transaction_status(transaction, "completed", admin_id),
           {:ok, _user} <- update_user_balance(transaction) do
        updated_transaction
      else
        {:error, reason} -> Repo.rollback(reason)
      end
    end)
  end

  @doc """
  Rejects a pending transaction.
  """
  def reject_transaction(%Transaction{} = transaction, admin_id, reason) do
    transaction
    |> Transaction.status_changeset(%{
      status: "failed",
      processed_by_id: admin_id,
      processed_at: DateTime.utc_now(),
      failure_reason: reason
    })
    |> Repo.update()
  end

  @doc """
  Creates a manual adjustment transaction.
  """
  def create_manual_adjustment(user_id, amount, balance_type, reason, admin_id) do
    transaction_type = if Decimal.positive?(amount), do: "credit_adjustment", else: "debit_adjustment"
    
    attrs = %{
      user_id: user_id,
      type: transaction_type,
      amount: Decimal.abs(amount),
      balance_type: balance_type,
      status: "completed",
      description: reason,
      processed_by_id: admin_id,
      processed_at: DateTime.utc_now(),
      metadata: %{"manual_adjustment" => true, "reason" => reason}
    }
    
    Repo.transaction(fn ->
      with {:ok, transaction} <- create_transaction(attrs),
           {:ok, _user} <- update_user_balance(transaction) do
        transaction
      else
        {:error, reason} -> Repo.rollback(reason)
      end
    end)
  end

  @doc """
  Bulk processes transactions.
  """
  def bulk_process_transactions(transaction_ids, status, admin_id) do
    now = DateTime.utc_now()
    
    Repo.transaction(fn ->
      transactions = 
        from(t in Transaction, where: t.id in ^transaction_ids and t.status == "pending")
        |> Repo.all()
      
      Enum.each(transactions, fn transaction ->
        case status do
          "completed" -> process_transaction(transaction, admin_id)
          "failed" -> reject_transaction(transaction, admin_id, "Bulk rejection")
        end
      end)
      
      length(transactions)
    end)
  end

  @doc """
  Gets transaction statistics.
  """
  def get_transaction_stats(opts \\[]) do
    query = Transaction
    |> apply_date_filter(opts)
    
    from(t in query,
      select: %{
        total_transactions: count(t.id),
        pending_transactions: count(t.id) |> filter(t.status == "pending"),
        completed_transactions: count(t.id) |> filter(t.status == "completed"),
        failed_transactions: count(t.id) |> filter(t.status == "failed"),
        total_amount: sum(t.amount),
        deposits: sum(t.amount) |> filter(t.type in ["deposit", "bonus_deposit"]),
        withdrawals: sum(t.amount) |> filter(t.type == "withdrawal"),
        winnings: sum(t.amount) |> filter(t.type == "contest_winning")
      }
    )
    |> Repo.one()
  end

  @doc """
  Gets daily transaction summary.
  """
  def get_daily_transaction_summary(days \\ 30) do
    start_date = DateTime.utc_now() |> DateTime.add(-days * 24 * 60 * 60, :second)
    
    from(t in Transaction,
      where: t.inserted_at >= ^start_date,
      group_by: fragment("DATE(?)", t.inserted_at),
      select: %{
        date: fragment("DATE(?)", t.inserted_at),
        total_transactions: count(t.id),
        total_amount: sum(t.amount),
        deposits: sum(t.amount) |> filter(t.type in ["deposit", "bonus_deposit"]),
        withdrawals: sum(t.amount) |> filter(t.type == "withdrawal")
      },
      order_by: [desc: fragment("DATE(?)", t.inserted_at)]
    )
    |> Repo.all()
  end

  @doc """
  Gets pending withdrawals for admin review.
  """
  def get_pending_withdrawals(opts \\[]) do
    Transaction
    |> where([t], t.type == "withdrawal" and t.status == "pending")
    |> apply_sorting(opts)
    |> apply_pagination(opts)
    |> Repo.all()
    |> Repo.preload([:user])
  end

  @doc """
  Gets large transactions for monitoring.
  """
  def get_large_transactions(threshold \\ 10000, opts \\[]) do
    Transaction
    |> where([t], t.amount >= ^threshold)
    |> apply_filters(opts)
    |> apply_sorting(opts)
    |> apply_pagination(opts)
    |> Repo.all()
    |> Repo.preload([:user, :processed_by])
  end

  # Private helper functions
  defp update_user_balance(%Transaction{} = transaction) do
    user = Repo.get!(User, transaction.user_id)
    
    balance_field = case transaction.balance_type do
      "deposit" -> :deposit_balance
      "bonus" -> :bonus_balance
      "winning" -> :winning_balance
    end
    
    current_balance = Map.get(user, balance_field)
    
    new_balance = case transaction.type do
      type when type in ["deposit", "bonus_deposit", "contest_winning", "credit_adjustment"] ->
        Decimal.add(current_balance, transaction.amount)
      type when type in ["withdrawal", "contest_entry", "debit_adjustment"] ->
        Decimal.sub(current_balance, transaction.amount)
      _ -> current_balance
    end
    
    if Decimal.negative?(new_balance) do
      {:error, "Insufficient balance"}
    else
      user
      |> Ecto.Changeset.change(%{balance_field => new_balance})
      |> Repo.update()
    end
  end

  defp apply_filters(query, opts) do
    Enum.reduce(opts, query, fn
      {:search, search_term}, query when is_binary(search_term) and search_term != "" ->
        search_pattern = "%#{search_term}%"
        join(query, :left, [t], u in User, on: t.user_id == u.id)
        |> where([t, u], 
          ilike(u.email, ^search_pattern) or
          ilike(u.username, ^search_pattern) or
          ilike(t.reference_id, ^search_pattern) or
          ilike(t.description, ^search_pattern)
        )
      
      {:user_id, user_id}, query when not is_nil(user_id) ->
        where(query, [t], t.user_id == ^user_id)
      
      {:type, type}, query when is_binary(type) and type != "" ->
        where(query, [t], t.type == ^type)
      
      {:status, status}, query when is_binary(status) and status != "" ->
        where(query, [t], t.status == ^status)
      
      {:balance_type, balance_type}, query when is_binary(balance_type) and balance_type != "" ->
        where(query, [t], t.balance_type == ^balance_type)
      
      {:amount_min, min_amount}, query when is_number(min_amount) ->
        where(query, [t], t.amount >= ^min_amount)
      
      {:amount_max, max_amount}, query when is_number(max_amount) ->
        where(query, [t], t.amount <= ^max_amount)
      
      _, query -> query
    end)
    |> apply_date_filter(opts)
  end

  defp apply_date_filter(query, opts) do
    Enum.reduce(opts, query, fn
      {:date_from, date}, query when not is_nil(date) ->
        where(query, [t], t.inserted_at >= ^date)
      
      {:date_to, date}, query when not is_nil(date) ->
        where(query, [t], t.inserted_at <= ^date)
      
      _, query -> query
    end)
  end

  defp apply_sorting(query, opts) do
    case Keyword.get(opts, :sort_by, "inserted_at_desc") do
      "amount" -> order_by(query, [t], asc: t.amount)
      "amount_desc" -> order_by(query, [t], desc: t.amount)
      "type" -> order_by(query, [t], asc: t.type)
      "status" -> order_by(query, [t], asc: t.status)
      "inserted_at" -> order_by(query, [t], asc: t.inserted_at)
      "inserted_at_desc" -> order_by(query, [t], desc: t.inserted_at)
      "processed_at" -> order_by(query, [t], asc: t.processed_at)
      "processed_at_desc" -> order_by(query, [t], desc: t.processed_at)
      _ -> order_by(query, [t], desc: t.inserted_at)
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