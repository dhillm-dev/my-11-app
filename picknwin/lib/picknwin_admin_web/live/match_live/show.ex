defmodule PicknwinAdminWeb.MatchLive.Show do
  use PicknwinAdminWeb, :live_view

  alias PicknwinAdmin.Matches
  alias PicknwinAdmin.Matches.Match

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, _, socket) do
    match = Matches.get_match!(id)
    
    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:match, match)}
  end

  @impl true
  def handle_info({PicknwinAdminWeb.MatchLive.FormComponent, {:saved, match}}, socket) do
    {:noreply, assign(socket, :match, match)}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    match = Matches.get_match!(id)
    {:ok, _} = Matches.delete_match(match)

    {:noreply,
     socket
     |> put_flash(:info, "Match deleted successfully")
     |> push_navigate(to: ~p"/admin/matches")}
  end

  @impl true
  def handle_event("curate", %{"status" => status}, socket) do
    case Matches.curate_match(socket.assigns.match, status, socket.assigns.current_user.id) do
      {:ok, match} ->
        {:noreply,
         socket
         |> assign(:match, match)
         |> put_flash(:info, "Match #{status} successfully")}

      {:error, %Ecto.Changeset{} = changeset} ->
        errors = Enum.map(changeset.errors, fn {field, {msg, _}} -> "#{field}: #{msg}" end)
        {:noreply, put_flash(socket, :error, "Failed to update match: #{Enum.join(errors, ", ")}")}
    end
  end

  defp page_title(:show), do: "Show Match"
  defp page_title(:edit), do: "Edit Match"
end