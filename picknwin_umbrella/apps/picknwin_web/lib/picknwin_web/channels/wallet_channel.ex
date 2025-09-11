defmodule PicknwinWeb.WalletChannel do
  @moduledoc """
  Phoenix channel for real-time wallet updates.
  
  Topics:
  - "wallet:user:<user_id>" - User wallet balance and transaction updates
  """
  use PicknwinWeb, :channel
  
  alias Picknwin.Wallets
  
  @doc """
  Join user wallet channel for balance and transaction updates.
  Only the wallet owner can join their own wallet channel.
  """
  def join("wallet:user:" <> user_id, _payload, socket) do
    current_user_id = socket.assigns[:current_user_id]
    
    cond do
      is_nil(current_user_id) ->
        {:error, %{reason: "Authentication required"}}
      
      current_user_id != user_id ->
        {:error, %{reason: "Unauthorized"}}
      
      true ->
        case Wallets.get_wallet(user_id) do
          {:ok, wallet} ->
            socket = assign(socket, :user_id, user_id)
            send(self(), :after_join)
            {:ok, %{wallet: wallet}, socket}
          
          {:error, :not_found} ->
            {:error, %{reason: "Wallet not found"}}
          
          {:error, reason} ->
            {:error, %{reason: to_string(reason)}}
        end
    end
  end
  
  def join("wallet:" <> _rest, _payload, _socket) do
    {:error, %{reason: "Invalid wallet topic"}}
  end
  
  @doc """
  Handle wallet balance requests.
  """
  def handle_in("get_balance", _payload, socket) do
    user_id = socket.assigns.user_id
    
    case Wallets.get_balance(user_id) do
      {:ok, balance} ->
        {:reply, {:ok, balance}, socket}
      
      {:error, reason} ->
        {:reply, {:error, %{reason: to_string(reason)}}, socket}
    end
  end
  
  @doc """
  Handle transaction history requests.
  """
  def handle_in("get_transactions", %{"limit" => limit, "offset" => offset}, socket) 
      when is_integer(limit) and is_integer(offset) do
    user_id = socket.assigns.user_id
    
    case Wallets.get_transactions(user_id, limit: limit, offset: offset) do
      {:ok, transactions} ->
        {:reply, {:ok, %{transactions: transactions}}, socket}
      
      {:error, reason} ->
        {:reply, {:error, %{reason: to_string(reason)}}, socket}
    end
  end
  
  def handle_in("get_transactions", _payload, socket) do
    # Default to recent 50 transactions
    handle_in("get_transactions", %{"limit" => 50, "offset" => 0}, socket)
  end
  
  @doc """
  Handle pending withdrawals requests.
  """
  def handle_in("get_pending_withdrawals", _payload, socket) do
    user_id = socket.assigns.user_id
    
    case Wallets.get_pending_withdrawals(user_id) do
      {:ok, withdrawals} ->
        {:reply, {:ok, %{withdrawals: withdrawals}}, socket}
      
      {:error, reason} ->
        {:reply, {:error, %{reason: to_string(reason)}}, socket}
    end
  end
  
  @doc """
  Send initial wallet data after joining.
  """
  def handle_info(:after_join, socket) do
    user_id = socket.assigns.user_id
    
    case Wallets.get_wallet_summary(user_id) do
      {:ok, summary} ->
        push(socket, "wallet_summary", summary)
      
      {:error, _reason} ->
        # Log error but don't disconnect
        :ok
    end
    
    {:noreply, socket}
  end
  
  @doc """
  Broadcast balance update to user's wallet channel.
  """
  def broadcast_balance_update(user_id, balance_data) do
    PicknwinWeb.Endpoint.broadcast!(
      "wallet:user:#{user_id}",
      "balance_update",
      %{
        balance: balance_data.balance,
        bonus_balance: balance_data.bonus_balance,
        winnings_balance: balance_data.winnings_balance,
        updated_at: DateTime.utc_now()
      }
    )
  end
  
  @doc """
  Broadcast new transaction to user's wallet channel.
  """
  def broadcast_transaction(user_id, transaction) do
    PicknwinWeb.Endpoint.broadcast!(
      "wallet:user:#{user_id}",
      "new_transaction",
      %{
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status,
        created_at: transaction.inserted_at
      }
    )
  end
  
  @doc """
  Broadcast payout notification to user's wallet channel.
  """
  def broadcast_payout(user_id, payout_data) do
    PicknwinWeb.Endpoint.broadcast!(
      "wallet:user:#{user_id}",
      "payout_received",
      %{
        contest_id: payout_data.contest_id,
        amount: payout_data.amount,
        rank: payout_data.rank,
        prize_tier: payout_data.prize_tier,
        contest_name: payout_data.contest_name,
        timestamp: DateTime.utc_now()
      }
    )
  end
  
  @doc """
  Broadcast withdrawal status update.
  """
  def broadcast_withdrawal_update(user_id, withdrawal) do
    PicknwinWeb.Endpoint.broadcast!(
      "wallet:user:#{user_id}",
      "withdrawal_update",
      %{
        id: withdrawal.id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        updated_at: withdrawal.updated_at,
        reason: withdrawal.reason
      }
    )
  end
  
  @doc """
  Broadcast deposit confirmation.
  """
  def broadcast_deposit_confirmation(user_id, deposit) do
    PicknwinWeb.Endpoint.broadcast!(
      "wallet:user:#{user_id}",
      "deposit_confirmed",
      %{
        id: deposit.id,
        amount: deposit.amount,
        payment_method: deposit.payment_method,
        transaction_id: deposit.transaction_id,
        timestamp: DateTime.utc_now()
      }
    )
  end
end