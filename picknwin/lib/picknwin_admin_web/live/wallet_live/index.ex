defmodule PicknwinAdminWeb.WalletLive.Index do
  use PicknwinAdminWeb, :live_view

  alias Picknwin.Wallets
  alias Picknwin.Wallets.Wallet

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Wallet Management")
     |> assign(:search_query, "")
     |> assign(:status_filter, "all")
     |> assign(:transaction_type_filter, "all")
     |> assign(:date_range_filter, "all")
     |> assign(:sort_by, "inserted_at")
     |> assign(:sort_order, "desc")
     |> assign(:page, 1)
     |> assign(:per_page, 25)
     |> assign(:selected_wallets, [])
     |> assign(:show_wallet_drawer, false)
     |> assign(:selected_wallet, nil)
     |> assign(:total_count, 0)
     |> load_wallets()}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Wallet")
    |> assign(:wallet, Wallets.get_wallet!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Wallet")
    |> assign(:wallet, %Wallet{})
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Wallet Management")
    |> assign(:wallet, nil)
  end

  @impl true
  def handle_info({PicknwinAdminWeb.WalletLive.FormComponent, {:saved, wallet}}, socket) do
    {:noreply, stream_insert(socket, :wallets, wallet)}
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    {:noreply,
     socket
     |> assign(:search_query, query)
     |> assign(:page, 1)
     |> load_wallets()}
  end

  def handle_event("filter_status", %{"status" => status}, socket) do
    {:noreply,
     socket
     |> assign(:status_filter, status)
     |> assign(:page, 1)
     |> load_wallets()}
  end

  def handle_event("filter_transaction_type", %{"transaction_type" => type}, socket) do
    {:noreply,
     socket
     |> assign(:transaction_type_filter, type)
     |> assign(:page, 1)
     |> load_wallets()}
  end

  def handle_event("filter_date_range", %{"date_range" => range}, socket) do
    {:noreply,
     socket
     |> assign(:date_range_filter, range)
     |> assign(:page, 1)
     |> load_wallets()}
  end

  def handle_event("sort", %{"field" => field}, socket) do
    {sort_by, sort_order} =
      if socket.assigns.sort_by == field do
        {field, if(socket.assigns.sort_order == "asc", do: "desc", else: "asc")}
      else
        {field, "asc"}
      end

    {:noreply,
     socket
     |> assign(:sort_by, sort_by)
     |> assign(:sort_order, sort_order)
     |> load_wallets()}
  end

  def handle_event("paginate", %{"page" => page}, socket) do
    page = String.to_integer(page)

    {:noreply,
     socket
     |> assign(:page, page)
     |> load_wallets()}
  end

  def handle_event("select_wallet", %{"id" => id}, socket) do
    wallet_id = String.to_integer(id)
    selected_wallets = socket.assigns.selected_wallets

    updated_selection =
      if wallet_id in selected_wallets do
        List.delete(selected_wallets, wallet_id)
      else
        [wallet_id | selected_wallets]
      end

    {:noreply, assign(socket, :selected_wallets, updated_selection)}
  end

  def handle_event("select_all_wallets", _params, socket) do
    wallet_ids = socket.assigns.wallets |> Enum.map(& &1.id)

    updated_selection =
      if length(socket.assigns.selected_wallets) == length(wallet_ids) do
        []
      else
        wallet_ids
      end

    {:noreply, assign(socket, :selected_wallets, updated_selection)}
  end

  def handle_event("bulk_action", %{"action" => action}, socket) do
    case action do
      "freeze" ->
        Wallets.bulk_freeze_wallets(socket.assigns.selected_wallets)
        {:noreply,
         socket
         |> put_flash(:info, "Selected wallets have been frozen")
         |> assign(:selected_wallets, [])
         |> load_wallets()}

      "unfreeze" ->
        Wallets.bulk_unfreeze_wallets(socket.assigns.selected_wallets)
        {:noreply,
         socket
         |> put_flash(:info, "Selected wallets have been unfrozen")
         |> assign(:selected_wallets, [])
         |> load_wallets()}

      "export" ->
        # TODO: Implement wallet export functionality
        {:noreply,
         socket
         |> put_flash(:info, "Wallet export started")
         |> assign(:selected_wallets, [])}

      _ ->
        {:noreply, socket}
    end
  end

  def handle_event("show_wallet_details", %{"id" => id}, socket) do
    wallet = Wallets.get_wallet_with_transactions!(id)

    {:noreply,
     socket
     |> assign(:show_wallet_drawer, true)
     |> assign(:selected_wallet, wallet)}
  end

  def handle_event("close_wallet_drawer", _params, socket) do
    {:noreply,
     socket
     |> assign(:show_wallet_drawer, false)
     |> assign(:selected_wallet, nil)}
  end

  def handle_event("add_funds", %{"id" => id, "amount" => amount}, socket) do
    case Wallets.add_funds(id, String.to_float(amount), "admin_credit") do
      {:ok, _transaction} ->
        {:noreply,
         socket
         |> put_flash(:info, "Funds added successfully")
         |> load_wallets()}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to add funds")}
    end
  end

  def handle_event("deduct_funds", %{"id" => id, "amount" => amount}, socket) do
    case Wallets.deduct_funds(id, String.to_float(amount), "admin_debit") do
      {:ok, _transaction} ->
        {:noreply,
         socket
         |> put_flash(:info, "Funds deducted successfully")
         |> load_wallets()}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to deduct funds")}
    end
  end

  def handle_event("freeze_wallet", %{"id" => id}, socket) do
    case Wallets.freeze_wallet(id) do
      {:ok, _wallet} ->
        {:noreply,
         socket
         |> put_flash(:info, "Wallet frozen successfully")
         |> load_wallets()}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to freeze wallet")}
    end
  end

  def handle_event("unfreeze_wallet", %{"id" => id}, socket) do
    case Wallets.unfreeze_wallet(id) do
      {:ok, _wallet} ->
        {:noreply,
         socket
         |> put_flash(:info, "Wallet unfrozen successfully")
         |> load_wallets()}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to unfreeze wallet")}
    end
  end

  def handle_event("delete", %{"id" => id}, socket) do
    wallet = Wallets.get_wallet!(id)
    {:ok, _} = Wallets.delete_wallet(wallet)

    {:noreply,
     socket
     |> put_flash(:info, "Wallet deleted successfully")
     |> stream_delete(:wallets, wallet)}
  end

  defp load_wallets(socket) do
    filters = %{
      search: socket.assigns.search_query,
      status: socket.assigns.status_filter,
      transaction_type: socket.assigns.transaction_type_filter,
      date_range: socket.assigns.date_range_filter
    }

    sort = %{
      field: socket.assigns.sort_by,
      order: socket.assigns.sort_order
    }

    pagination = %{
      page: socket.assigns.page,
      per_page: socket.assigns.per_page
    }

    {wallets, total_count} = Wallets.list_wallets_paginated(filters, sort, pagination)

    socket
    |> assign(:total_count, total_count)
    |> assign(:wallets, wallets)
    |> stream(:wallets, wallets, reset: true)
  end
end