defmodule PicknwinAdminWeb.DashboardLive do
  use PicknwinAdminWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:page_title, "Dashboard")
      |> assign(:breadcrumbs, [])
      |> assign_stats()

    {:ok, socket}
  end

  @impl true
  def handle_event("refresh", _params, socket) do
    {:noreply, assign_stats(socket)}
  end

  defp assign_stats(socket) do
    # Mock data for now - will be replaced with real data from contexts
    stats = %{
      active_contests: 42,
      total_entries: 1_234,
      gross_gaming_revenue: 15_678.90,
      total_payouts: 12_345.67,
      active_users: 567,
      pending_kyc: 23
    }

    recent_incidents = [
      %{
        id: 1,
        type: "warning",
        message: "High contest entry volume detected",
        timestamp: DateTime.utc_now() |> DateTime.add(-300, :second)
      },
      %{
        id: 2,
        type: "info",
        message: "Daily payout batch completed successfully",
        timestamp: DateTime.utc_now() |> DateTime.add(-1800, :second)
      },
      %{
        id: 3,
        type: "error",
        message: "Feed adapter timeout for match ID 12345",
        timestamp: DateTime.utc_now() |> DateTime.add(-3600, :second)
      }
    ]

    socket
    |> assign(:stats, stats)
    |> assign(:recent_incidents, recent_incidents)
  end
end