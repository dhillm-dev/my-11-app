defmodule PicknwinAdminWeb.ContestLive.Show do
  use PicknwinAdminWeb, :live_view

  alias PicknwinAdmin.Contests
  alias PicknwinAdmin.Contests.Contest

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, _, socket) do
    contest = Contests.get_contest_with_details!(id)
    
    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:contest, contest)
     |> assign(:entries, [])
     |> load_entries()}
  end

  @impl true
  def handle_info({PicknwinAdminWeb.ContestLive.FormComponent, {:saved, contest}}, socket) do
    {:noreply, assign(socket, :contest, contest)}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    contest = Contests.get_contest!(id)
    {:ok, _} = Contests.delete_contest(contest)

    {:noreply,
     socket
     |> put_flash(:info, "Contest deleted successfully")
     |> push_navigate(to: ~p"/admin/contests")}
  end

  @impl true
  def handle_event("publish_contest", _, socket) do
    case Contests.publish_contest(socket.assigns.contest, socket.assigns.current_admin.id) do
      {:ok, contest} ->
        {:noreply,
         socket
         |> assign(:contest, contest)
         |> put_flash(:info, "Contest published successfully")}

      {:error, %Ecto.Changeset{} = changeset} ->
        errors = Enum.map(changeset.errors, fn {field, {msg, _}} -> "#{field}: #{msg}" end)
        {:noreply, put_flash(socket, :error, "Failed to publish contest: #{Enum.join(errors, ", ")}")}
    end
  end

  @impl true
  def handle_event("cancel_contest", _, socket) do
    case Contests.cancel_contest(socket.assigns.contest, socket.assigns.current_admin.id) do
      {:ok, contest} ->
        {:noreply,
         socket
         |> assign(:contest, contest)
         |> put_flash(:info, "Contest cancelled successfully")}

      {:error, %Ecto.Changeset{} = changeset} ->
        errors = Enum.map(changeset.errors, fn {field, {msg, _}} -> "#{field}: #{msg}" end)
        {:noreply, put_flash(socket, :error, "Failed to cancel contest: #{Enum.join(errors, ", ")}")}
    end
  end

  @impl true
  def handle_event("calculate_prizes", _, socket) do
    case Contests.calculate_and_distribute_prizes(socket.assigns.contest.id) do
      {:ok, _results} ->
        {:noreply,
         socket
         |> load_entries()
         |> put_flash(:info, "Prizes calculated and distributed successfully")}

      {:error, reason} ->
        {:noreply, put_flash(socket, :error, "Failed to calculate prizes: #{reason}")}
    end
  end

  @impl true
  def handle_event("export_entries", _, socket) do
    # This would typically generate a CSV or Excel file
    {:noreply, put_flash(socket, :info, "Export functionality coming soon")}
  end

  defp load_entries(socket) do
    entries = Contests.list_contest_entries(socket.assigns.contest.id, limit: 50)
    assign(socket, :entries, entries)
  end

  defp page_title(:show), do: "Show Contest"
  defp page_title(:edit), do: "Edit Contest"
end