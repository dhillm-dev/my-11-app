defmodule PicknwinAdminWeb.MatchLive.Index do
  use PicknwinAdminWeb, :live_view

  alias PicknwinAdmin.Matches
  alias PicknwinAdmin.Matches.Match

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Matches")
     |> assign(:matches, [])
     |> assign(:selected_matches, MapSet.new())
     |> assign(:show_detail_drawer, false)
     |> assign(:detail_match, nil)
     |> assign(:filters, %{
       search: "",
       sport: "",
       league: "",
       status: "",
       curation_status: "",
       date_from: nil,
       date_to: nil
     })
     |> assign(:sort_by, "kickoff_desc")
     |> assign(:page, 1)
     |> assign(:per_page, 20)
     |> assign(:total_count, 0)
     |> assign(:stats, %{})
     |> load_matches()
     |> load_stats()}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Match")
    |> assign(:match, Matches.get_match!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Match")
    |> assign(:match, %Match{})
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Matches")
    |> assign(:match, nil)
  end

  @impl true
  def handle_info({PicknwinAdminWeb.MatchLive.FormComponent, {:saved, match}}, socket) do
    {:noreply,
     socket
     |> put_flash(:info, "Match #{match.home_team} vs #{match.away_team} saved successfully")
     |> load_matches()
     |> load_stats()}
  end

  @impl true
  def handle_event("filter", %{"filters" => filter_params}, socket) do
    filters = Map.merge(socket.assigns.filters, filter_params)
    
    {:noreply,
     socket
     |> assign(:filters, filters)
     |> assign(:page, 1)
     |> load_matches()}
  end

  def handle_event("clear_filters", _params, socket) do
    {:noreply,
     socket
     |> assign(:filters, %{
       search: "",
       sport: "",
       league: "",
       status: "",
       curation_status: "",
       date_from: nil,
       date_to: nil
     })
     |> assign(:page, 1)
     |> load_matches()}
  end

  def handle_event("sort", %{"sort_by" => sort_by}, socket) do
    {:noreply,
     socket
     |> assign(:sort_by, sort_by)
     |> assign(:page, 1)
     |> load_matches()}
  end

  def handle_event("paginate", %{"page" => page}, socket) do
    {:noreply,
     socket
     |> assign(:page, String.to_integer(page))
     |> load_matches()}
  end

  def handle_event("select_match", %{"match_id" => match_id}, socket) do
    selected_matches = 
      if MapSet.member?(socket.assigns.selected_matches, match_id) do
        MapSet.delete(socket.assigns.selected_matches, match_id)
      else
        MapSet.put(socket.assigns.selected_matches, match_id)
      end
    
    {:noreply, assign(socket, :selected_matches, selected_matches)}
  end

  def handle_event("select_all", _params, socket) do
    match_ids = Enum.map(socket.assigns.matches, & &1.id) |> MapSet.new()
    {:noreply, assign(socket, :selected_matches, match_ids)}
  end

  def handle_event("deselect_all", _params, socket) do
    {:noreply, assign(socket, :selected_matches, MapSet.new())}
  end

  def handle_event("bulk_action", %{"action" => action}, socket) do
    selected_ids = MapSet.to_list(socket.assigns.selected_matches)
    
    case action do
      "curate" -> bulk_curate_matches(socket, selected_ids)
      "blacklist" -> bulk_blacklist_matches(socket, selected_ids)
      "activate" -> bulk_activate_matches(socket, selected_ids)
      "delete" -> bulk_delete_matches(socket, selected_ids)
      _ -> {:noreply, socket}
    end
  end

  def handle_event("show_detail", %{"match_id" => match_id}, socket) do
    match = Matches.get_match!(match_id)
    
    {:noreply,
     socket
     |> assign(:show_detail_drawer, true)
     |> assign(:detail_match, match)}
  end

  def handle_event("close_detail", _params, socket) do
    {:noreply,
     socket
     |> assign(:show_detail_drawer, false)
     |> assign(:detail_match, nil)}
  end

  def handle_event("curate_match", %{"match_id" => match_id, "status" => status}, socket) do
    match = Matches.get_match!(match_id)
    
    case Matches.curate_match(match, %{curation_status: status}) do
      {:ok, _match} ->
        {:noreply,
         socket
         |> put_flash(:info, "Match curation updated successfully")
         |> load_matches()
         |> load_stats()}
      
      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to update match curation")}
    end
  end

  def handle_event("delete", %{"id" => id}, socket) do
    match = Matches.get_match!(id)
    {:ok, _} = Matches.delete_match(match)

    {:noreply,
     socket
     |> put_flash(:info, "Match deleted successfully")
     |> load_matches()
     |> load_stats()}
  end

  defp bulk_curate_matches(socket, match_ids) do
    case Matches.bulk_curate_matches(match_ids, "curated") do
      {count, _} when count > 0 ->
        {:noreply,
         socket
         |> put_flash(:info, "#{count} matches curated successfully")
         |> assign(:selected_matches, MapSet.new())
         |> load_matches()
         |> load_stats()}
      
      _ ->
        {:noreply, put_flash(socket, :error, "Failed to curate matches")}
    end
  end

  defp bulk_blacklist_matches(socket, match_ids) do
    case Matches.bulk_curate_matches(match_ids, "blacklisted") do
      {count, _} when count > 0 ->
        {:noreply,
         socket
         |> put_flash(:info, "#{count} matches blacklisted successfully")
         |> assign(:selected_matches, MapSet.new())
         |> load_matches()
         |> load_stats()}
      
      _ ->
        {:noreply, put_flash(socket, :error, "Failed to blacklist matches")}
    end
  end

  defp bulk_activate_matches(socket, match_ids) do
    case Matches.bulk_curate_matches(match_ids, "pending") do
      {count, _} when count > 0 ->
        {:noreply,
         socket
         |> put_flash(:info, "#{count} matches activated successfully")
         |> assign(:selected_matches, MapSet.new())
         |> load_matches()
         |> load_stats()}
      
      _ ->
        {:noreply, put_flash(socket, :error, "Failed to activate matches")}
    end
  end

  defp bulk_delete_matches(socket, match_ids) do
    case Matches.bulk_delete_matches(match_ids) do
      {count, _} when count > 0 ->
        {:noreply,
         socket
         |> put_flash(:info, "#{count} matches deleted successfully")
         |> assign(:selected_matches, MapSet.new())
         |> load_matches()
         |> load_stats()}
      
      _ ->
        {:noreply, put_flash(socket, :error, "Failed to delete matches")}
    end
  end

  defp load_matches(socket) do
    filters = socket.assigns.filters
    opts = [
      search: filters.search,
      sport: filters.sport,
      league: filters.league,
      status: filters.status,
      curation_status: filters.curation_status,
      date_from: filters.date_from,
      date_to: filters.date_to,
      sort_by: socket.assigns.sort_by,
      page: socket.assigns.page,
      per_page: socket.assigns.per_page
    ]
    
    matches = Matches.list_matches(opts)
    total_count = Matches.count_matches(opts)
    
    socket
    |> assign(:matches, matches)
    |> assign(:total_count, total_count)
  end

  defp load_stats(socket) do
    stats = Matches.get_match_stats()
    assign(socket, :stats, stats)
  end

  defp total_pages(total_count, per_page) do
    ceil(total_count / per_page)
  end
end