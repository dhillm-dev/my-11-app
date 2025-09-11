defmodule PicknwinAdminWeb.ContestLive.Index do
  use PicknwinAdminWeb, :live_view

  alias PicknwinAdmin.Contests
  alias PicknwinAdmin.Contests.Contest
  alias PicknwinAdmin.Matches

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      Phoenix.PubSub.subscribe(PicknwinAdmin.PubSub, "contests")
    end

    {:ok,
     socket
     |> assign(:contests, [])
     |> assign(:selected_contests, MapSet.new())
     |> assign(:show_filters, false)
     |> assign(:show_detail_drawer, false)
     |> assign(:selected_contest, nil)
     |> assign(:stats, %{})
     |> assign(:filters, %{
       "search" => "",
       "status" => "all",
       "type" => "all",
       "match_id" => "all",
       "sort_by" => "inserted_at",
       "sort_order" => "desc"
     })
     |> assign(:pagination, %{
       "page" => 1,
       "per_page" => 20,
       "total_pages" => 0,
       "total_count" => 0
     })
     |> load_contests()
     |> load_stats()}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Contest")
    |> assign(:contest, Contests.get_contest!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Contest")
    |> assign(:contest, %Contest{})
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Contests")
    |> assign(:contest, nil)
  end

  @impl true
  def handle_info({PicknwinAdminWeb.ContestLive.FormComponent, {:saved, contest}}, socket) do
    {:noreply,
     socket
     |> load_contests()
     |> load_stats()
     |> put_flash(:info, "Contest saved successfully")}
  end

  @impl true
  def handle_info({:contest_updated, contest}, socket) do
    {:noreply,
     socket
     |> load_contests()
     |> load_stats()}
  end

  @impl true
  def handle_event("toggle_filters", _, socket) do
    {:noreply, assign(socket, :show_filters, !socket.assigns.show_filters)}
  end

  @impl true
  def handle_event("filter", %{"filters" => filters}, socket) do
    {:noreply,
     socket
     |> assign(:filters, Map.merge(socket.assigns.filters, filters))
     |> assign(:pagination, Map.put(socket.assigns.pagination, "page", 1))
     |> load_contests()}
  end

  @impl true
  def handle_event("sort", %{"field" => field}, socket) do
    current_sort = socket.assigns.filters["sort_by"]
    current_order = socket.assigns.filters["sort_order"]
    
    new_order = if current_sort == field and current_order == "asc", do: "desc", else: "asc"
    
    filters = Map.merge(socket.assigns.filters, %{"sort_by" => field, "sort_order" => new_order})
    
    {:noreply,
     socket
     |> assign(:filters, filters)
     |> load_contests()}
  end

  @impl true
  def handle_event("paginate", %{"page" => page}, socket) do
    page = String.to_integer(page)
    
    {:noreply,
     socket
     |> assign(:pagination, Map.put(socket.assigns.pagination, "page", page))
     |> load_contests()}
  end

  @impl true
  def handle_event("select_contest", %{"id" => id, "checked" => checked}, socket) do
    contest_id = String.to_integer(id)
    selected_contests = 
      if checked == "true" do
        MapSet.put(socket.assigns.selected_contests, contest_id)
      else
        MapSet.delete(socket.assigns.selected_contests, contest_id)
      end
    
    {:noreply, assign(socket, :selected_contests, selected_contests)}
  end

  @impl true
  def handle_event("select_all_contests", %{"checked" => checked}, socket) do
    selected_contests = 
      if checked == "true" do
        socket.assigns.contests
        |> Enum.map(& &1.id)
        |> MapSet.new()
      else
        MapSet.new()
      end
    
    {:noreply, assign(socket, :selected_contests, selected_contests)}
  end

  @impl true
  def handle_event("bulk_action", %{"action" => action}, socket) do
    contest_ids = MapSet.to_list(socket.assigns.selected_contests)
    
    case action do
      "publish" ->
        case Contests.bulk_publish_contests(contest_ids, socket.assigns.current_admin.id) do
          {:ok, count} ->
            {:noreply,
             socket
             |> assign(:selected_contests, MapSet.new())
             |> load_contests()
             |> load_stats()
             |> put_flash(:info, "#{count} contests published successfully")}
          
          {:error, reason} ->
            {:noreply, put_flash(socket, :error, "Failed to publish contests: #{reason}")}
        end
      
      "cancel" ->
        case Contests.bulk_cancel_contests(contest_ids, socket.assigns.current_admin.id) do
          {:ok, count} ->
            {:noreply,
             socket
             |> assign(:selected_contests, MapSet.new())
             |> load_contests()
             |> load_stats()
             |> put_flash(:info, "#{count} contests cancelled successfully")}
          
          {:error, reason} ->
            {:noreply, put_flash(socket, :error, "Failed to cancel contests: #{reason}")}
        end
      
      "delete" ->
        case Contests.bulk_delete_contests(contest_ids) do
          {:ok, count} ->
            {:noreply,
             socket
             |> assign(:selected_contests, MapSet.new())
             |> load_contests()
             |> load_stats()
             |> put_flash(:info, "#{count} contests deleted successfully")}
          
          {:error, reason} ->
            {:noreply, put_flash(socket, :error, "Failed to delete contests: #{reason}")}
        end
      
      _ ->
        {:noreply, put_flash(socket, :error, "Unknown action: #{action}")}
    end
  end

  @impl true
  def handle_event("show_contest_details", %{"id" => id}, socket) do
    contest = Contests.get_contest_with_details!(id)
    
    {:noreply,
     socket
     |> assign(:selected_contest, contest)
     |> assign(:show_detail_drawer, true)}
  end

  @impl true
  def handle_event("close_detail_drawer", _, socket) do
    {:noreply,
     socket
     |> assign(:show_detail_drawer, false)
     |> assign(:selected_contest, nil)}
  end

  @impl true
  def handle_event("publish_contest", %{"id" => id}, socket) do
    contest = Contests.get_contest!(id)
    
    case Contests.publish_contest(contest, socket.assigns.current_admin.id) do
      {:ok, _contest} ->
        {:noreply,
         socket
         |> load_contests()
         |> load_stats()
         |> put_flash(:info, "Contest published successfully")}
      
      {:error, %Ecto.Changeset{} = changeset} ->
        errors = Enum.map(changeset.errors, fn {field, {msg, _}} -> "#{field}: #{msg}" end)
        {:noreply, put_flash(socket, :error, "Failed to publish contest: #{Enum.join(errors, ", ")}")}
    end
  end

  @impl true
  def handle_event("cancel_contest", %{"id" => id}, socket) do
    contest = Contests.get_contest!(id)
    
    case Contests.cancel_contest(contest, socket.assigns.current_admin.id) do
      {:ok, _contest} ->
        {:noreply,
         socket
         |> load_contests()
         |> load_stats()
         |> put_flash(:info, "Contest cancelled successfully")}
      
      {:error, %Ecto.Changeset{} = changeset} ->
        errors = Enum.map(changeset.errors, fn {field, {msg, _}} -> "#{field}: #{msg}" end)
        {:noreply, put_flash(socket, :error, "Failed to cancel contest: #{Enum.join(errors, ", ")}")}
    end
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    contest = Contests.get_contest!(id)
    {:ok, _} = Contests.delete_contest(contest)

    {:noreply,
     socket
     |> load_contests()
     |> load_stats()
     |> put_flash(:info, "Contest deleted successfully")}
  end

  defp load_contests(socket) do
    filters = socket.assigns.filters
    pagination = socket.assigns.pagination
    
    opts = [
      page: pagination["page"],
      per_page: pagination["per_page"],
      search: filters["search"],
      status: (if filters["status"] != "all", do: filters["status"]),
      type: (if filters["type"] != "all", do: filters["type"]),
      match_id: (if filters["match_id"] != "all", do: String.to_integer(filters["match_id"])),
      sort_by: String.to_atom(filters["sort_by"]),
      sort_order: String.to_atom(filters["sort_order"])
    ]
    |> Enum.reject(fn {_k, v} -> is_nil(v) end)
    
    result = Contests.list_contests(opts)
    
    assign(socket, :contests, result.entries)
    |> assign(:pagination, %{
      "page" => result.page_number,
      "per_page" => result.page_size,
      "total_pages" => result.total_pages,
      "total_count" => result.total_entries
    })
  end

  defp load_stats(socket) do
    stats = Contests.get_contest_stats()
    assign(socket, :stats, stats)
  end
end