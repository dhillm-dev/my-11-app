defmodule PicknwinAdminWeb.UserLive.Index do
  use PicknwinAdminWeb, :live_view

  alias Picknwin.Accounts
  alias Picknwin.Accounts.User

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:users, list_users())
     |> assign(:selected_users, [])
     |> assign(:search_query, "")
     |> assign(:status_filter, "all")
     |> assign(:role_filter, "all")
     |> assign(:sort_by, "inserted_at")
     |> assign(:sort_order, "desc")
     |> assign(:page, 1)
     |> assign(:per_page, 25)
     |> assign(:total_count, 0)
     |> assign(:show_user_drawer, false)
     |> assign(:selected_user, nil)
     |> stream(:users, [])}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit User")
    |> assign(:user, Accounts.get_user!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New User")
    |> assign(:user, %User{})
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Users Management")
    |> assign(:user, nil)
  end

  @impl true
  def handle_info({PicknwinAdminWeb.UserLive.FormComponent, {:saved, user}}, socket) do
    {:noreply, stream_insert(socket, :users, user)}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    user = Accounts.get_user!(id)
    {:ok, _} = Accounts.delete_user(user)

    {:noreply, stream_delete(socket, :users, user)}
  end

  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    socket =
      socket
      |> assign(:search_query, query)
      |> assign(:page, 1)
      |> update_users()

    {:noreply, socket}
  end

  def handle_event("filter_status", %{"status" => status}, socket) do
    socket =
      socket
      |> assign(:status_filter, status)
      |> assign(:page, 1)
      |> update_users()

    {:noreply, socket}
  end

  def handle_event("filter_role", %{"role" => role}, socket) do
    socket =
      socket
      |> assign(:role_filter, role)
      |> assign(:page, 1)
      |> update_users()

    {:noreply, socket}
  end

  def handle_event("sort", %{"field" => field}, socket) do
    {sort_by, sort_order} =
      if socket.assigns.sort_by == field do
        {field, if(socket.assigns.sort_order == "asc", do: "desc", else: "asc")}
      else
        {field, "asc"}
      end

    socket =
      socket
      |> assign(:sort_by, sort_by)
      |> assign(:sort_order, sort_order)
      |> update_users()

    {:noreply, socket}
  end

  def handle_event("select_user", %{"id" => id, "checked" => checked}, socket) do
    selected_users =
      if checked == "true" do
        [id | socket.assigns.selected_users]
      else
        List.delete(socket.assigns.selected_users, id)
      end

    {:noreply, assign(socket, :selected_users, selected_users)}
  end

  def handle_event("select_all_users", %{"checked" => checked}, socket) do
    selected_users =
      if checked == "true" do
        Enum.map(socket.assigns.users, & &1.id)
      else
        []
      end

    {:noreply, assign(socket, :selected_users, selected_users)}
  end

  def handle_event("bulk_action", %{"action" => action}, socket) do
    case action do
      "activate" ->
        bulk_update_status(socket, "active")

      "deactivate" ->
        bulk_update_status(socket, "inactive")

      "suspend" ->
        bulk_update_status(socket, "suspended")

      "delete" ->
        bulk_delete_users(socket)

      "export" ->
        export_users(socket)

      _ ->
        {:noreply, socket}
    end
  end

  def handle_event("show_user_details", %{"id" => id}, socket) do
    user = Accounts.get_user_with_details!(id)

    socket =
      socket
      |> assign(:show_user_drawer, true)
      |> assign(:selected_user, user)

    {:noreply, socket}
  end

  def handle_event("close_user_drawer", _params, socket) do
    socket =
      socket
      |> assign(:show_user_drawer, false)
      |> assign(:selected_user, nil)

    {:noreply, socket}
  end

  def handle_event("paginate", %{"page" => page}, socket) do
    socket =
      socket
      |> assign(:page, String.to_integer(page))
      |> update_users()

    {:noreply, socket}
  end

  def handle_event("verify_user", %{"id" => id}, socket) do
    user = Accounts.get_user!(id)
    {:ok, updated_user} = Accounts.verify_user(user)

    {:noreply, stream_insert(socket, :users, updated_user)}
  end

  def handle_event("reset_password", %{"id" => id}, socket) do
    user = Accounts.get_user!(id)
    {:ok, _} = Accounts.send_password_reset_instructions(user)

    {:noreply,
     socket
     |> put_flash(:info, "Password reset instructions sent to #{user.email}")}
  end

  defp bulk_update_status(socket, status) do
    user_ids = socket.assigns.selected_users
    {:ok, _} = Accounts.bulk_update_user_status(user_ids, status)

    socket =
      socket
      |> assign(:selected_users, [])
      |> update_users()
      |> put_flash(:info, "#{length(user_ids)} users updated successfully")

    {:noreply, socket}
  end

  defp bulk_delete_users(socket) do
    user_ids = socket.assigns.selected_users
    {:ok, _} = Accounts.bulk_delete_users(user_ids)

    socket =
      socket
      |> assign(:selected_users, [])
      |> update_users()
      |> put_flash(:info, "#{length(user_ids)} users deleted successfully")

    {:noreply, socket}
  end

  defp export_users(socket) do
    # Implementation for exporting users to CSV/Excel
    {:noreply,
     socket
     |> put_flash(:info, "User export started. You'll receive an email when ready.")}
  end

  defp update_users(socket) do
    %{
      search_query: search_query,
      status_filter: status_filter,
      role_filter: role_filter,
      sort_by: sort_by,
      sort_order: sort_order,
      page: page,
      per_page: per_page
    } = socket.assigns

    filters = %{
      search: search_query,
      status: status_filter,
      role: role_filter,
      sort_by: sort_by,
      sort_order: sort_order,
      page: page,
      per_page: per_page
    }

    {users, total_count} = Accounts.list_users_with_filters(filters)

    socket
    |> assign(:users, users)
    |> assign(:total_count, total_count)
    |> stream(:users, users, reset: true)
  end

  defp list_users do
    Accounts.list_users()
  end
end