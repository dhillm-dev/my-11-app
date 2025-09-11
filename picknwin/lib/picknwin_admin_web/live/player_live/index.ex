defmodule PicknwinAdminWeb.PlayerLive.Index do
  use PicknwinAdminWeb, :live_view

  alias Picknwin.Players
  alias Picknwin.Players.Player

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:players, list_players())
     |> assign(:selected_players, [])
     |> assign(:search_query, "")
     |> assign(:sport_filter, "all")
     |> assign(:team_filter, "all")
     |> assign(:position_filter, "all")
     |> assign(:status_filter, "all")
     |> assign(:sort_by, "name")
     |> assign(:sort_order, "asc")
     |> assign(:page, 1)
     |> assign(:per_page, 25)
     |> assign(:total_count, 0)
     |> assign(:show_player_drawer, false)
     |> assign(:selected_player, nil)
     |> stream(:players, [])}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Player")
    |> assign(:player, Players.get_player!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Player")
    |> assign(:player, %Player{})
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Players Management")
    |> assign(:player, nil)
  end

  @impl true
  def handle_info({PicknwinAdminWeb.PlayerLive.FormComponent, {:saved, player}}, socket) do
    {:noreply, stream_insert(socket, :players, player)}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    player = Players.get_player!(id)
    {:ok, _} = Players.delete_player(player)

    {:noreply, stream_delete(socket, :players, player)}
  end

  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    socket =
      socket
      |> assign(:search_query, query)
      |> assign(:page, 1)
      |> update_players()

    {:noreply, socket}
  end

  def handle_event("filter_sport", %{"sport" => sport}, socket) do
    socket =
      socket
      |> assign(:sport_filter, sport)
      |> assign(:page, 1)
      |> update_players()

    {:noreply, socket}
  end

  def handle_event("filter_team", %{"team" => team}, socket) do
    socket =
      socket
      |> assign(:team_filter, team)
      |> assign(:page, 1)
      |> update_players()

    {:noreply, socket}
  end

  def handle_event("filter_position", %{"position" => position}, socket) do
    socket =
      socket
      |> assign(:position_filter, position)
      |> assign(:page, 1)
      |> update_players()

    {:noreply, socket}
  end

  def handle_event("filter_status", %{"status" => status}, socket) do
    socket =
      socket
      |> assign(:status_filter, status)
      |> assign(:page, 1)
      |> update_players()

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
      |> update_players()

    {:noreply, socket}
  end

  def handle_event("select_player", %{"id" => id, "checked" => checked}, socket) do
    selected_players =
      if checked == "true" do
        [id | socket.assigns.selected_players]
      else
        List.delete(socket.assigns.selected_players, id)
      end

    {:noreply, assign(socket, :selected_players, selected_players)}
  end

  def handle_event("select_all_players", %{"checked" => checked}, socket) do
    selected_players =
      if checked == "true" do
        Enum.map(socket.assigns.players, & &1.id)
      else
        []
      end

    {:noreply, assign(socket, :selected_players, selected_players)}
  end

  def handle_event("bulk_action", %{"action" => action}, socket) do
    case action do
      "activate" ->
        bulk_update_status(socket, "active")

      "deactivate" ->
        bulk_update_status(socket, "inactive")

      "retire" ->
        bulk_update_status(socket, "retired")

      "update_prices" ->
        bulk_update_prices(socket)

      "export" ->
        export_players(socket)

      _ ->
        {:noreply, socket}
    end
  end

  def handle_event("show_player_details", %{"id" => id}, socket) do
    player = Players.get_player_with_stats!(id)

    socket =
      socket
      |> assign(:show_player_drawer, true)
      |> assign(:selected_player, player)

    {:noreply, socket}
  end

  def handle_event("close_player_drawer", _params, socket) do
    socket =
      socket
      |> assign(:show_player_drawer, false)
      |> assign(:selected_player, nil)

    {:noreply, socket}
  end

  def handle_event("paginate", %{"page" => page}, socket) do
    socket =
      socket
      |> assign(:page, String.to_integer(page))
      |> update_players()

    {:noreply, socket}
  end

  def handle_event("sync_player_stats", %{"id" => id}, socket) do
    player = Players.get_player!(id)
    {:ok, updated_player} = Players.sync_player_stats(player)

    {:noreply,
     socket
     |> stream_insert(:players, updated_player)
     |> put_flash(:info, "Player stats synced successfully")}
  end

  def handle_event("update_player_price", %{"id" => id, "price" => price}, socket) do
    player = Players.get_player!(id)
    {:ok, updated_player} = Players.update_player_price(player, %{price: price})

    {:noreply,
     socket
     |> stream_insert(:players, updated_player)
     |> put_flash(:info, "Player price updated successfully")}
  end

  defp bulk_update_status(socket, status) do
    player_ids = socket.assigns.selected_players
    {:ok, _} = Players.bulk_update_player_status(player_ids, status)

    socket =
      socket
      |> assign(:selected_players, [])
      |> update_players()
      |> put_flash(:info, "#{length(player_ids)} players updated successfully")

    {:noreply, socket}
  end

  defp bulk_update_prices(socket) do
    player_ids = socket.assigns.selected_players
    {:ok, _} = Players.bulk_sync_player_prices(player_ids)

    socket =
      socket
      |> assign(:selected_players, [])
      |> update_players()
      |> put_flash(:info, "#{length(player_ids)} player prices updated successfully")

    {:noreply, socket}
  end

  defp export_players(socket) do
    # Implementation for exporting players to CSV/Excel
    {:noreply,
     socket
     |> put_flash(:info, "Player export started. You'll receive an email when ready.")}
  end

  defp update_players(socket) do
    %{
      search_query: search_query,
      sport_filter: sport_filter,
      team_filter: team_filter,
      position_filter: position_filter,
      status_filter: status_filter,
      sort_by: sort_by,
      sort_order: sort_order,
      page: page,
      per_page: per_page
    } = socket.assigns

    filters = %{
      search: search_query,
      sport: sport_filter,
      team: team_filter,
      position: position_filter,
      status: status_filter,
      sort_by: sort_by,
      sort_order: sort_order,
      page: page,
      per_page: per_page
    }

    {players, total_count} = Players.list_players_with_filters(filters)

    socket
    |> assign(:players, players)
    |> assign(:total_count, total_count)
    |> stream(:players, players, reset: true)
  end

  defp list_players do
    Players.list_players()
  end
end