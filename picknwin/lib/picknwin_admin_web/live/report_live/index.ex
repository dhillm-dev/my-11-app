defmodule PicknwinAdminWeb.ReportLive.Index do
  use PicknwinAdminWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Reports")
     |> assign(:reports, [])
     |> assign(:filters, %{})
     |> assign(:date_range, %{from: Date.utc_today() |> Date.add(-30), to: Date.utc_today()})
     |> assign(:selected_report_type, "overview")
     |> assign(:export_format, "csv")
     |> assign(:loading, false)
     |> assign(:report_data, nil)
     |> load_reports()}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Reports")
  end

  @impl true
  def handle_event("filter", %{"filters" => filters}, socket) do
    {:noreply,
     socket
     |> assign(:filters, filters)
     |> load_reports()}
  end

  def handle_event("date_range_change", %{"date_range" => date_range}, socket) do
    {:noreply,
     socket
     |> assign(:date_range, parse_date_range(date_range))
     |> load_reports()}
  end

  def handle_event("select_report_type", %{"type" => type}, socket) do
    {:noreply,
     socket
     |> assign(:selected_report_type, type)
     |> assign(:report_data, nil)
     |> load_report_data(type)}
  end

  def handle_event("generate_report", _params, socket) do
    {:noreply,
     socket
     |> assign(:loading, true)
     |> load_report_data(socket.assigns.selected_report_type)}
  end

  def handle_event("export_report", %{"format" => format}, socket) do
    case export_report_data(socket.assigns.report_data, format) do
      {:ok, file_path} ->
        {:noreply,
         socket
         |> put_flash(:info, "Report exported successfully. Download will start shortly.")
         |> push_event("download", %{url: file_path})}

      {:error, reason} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to export report: #{reason}")}
    end
  end

  def handle_event("schedule_report", params, socket) do
    case schedule_report(params) do
      {:ok, _schedule} ->
        {:noreply,
         socket
         |> put_flash(:info, "Report scheduled successfully")}

      {:error, reason} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to schedule report: #{reason}")}
    end
  end

  defp load_reports(socket) do
    # Mock data - replace with actual report loading logic
    reports = [
      %{
        id: 1,
        name: "User Activity Report",
        type: "user_activity",
        last_generated: ~N[2024-01-15 10:30:00],
        status: "completed"
      },
      %{
        id: 2,
        name: "Contest Performance Report",
        type: "contest_performance",
        last_generated: ~N[2024-01-14 15:45:00],
        status: "completed"
      },
      %{
        id: 3,
        name: "Financial Summary",
        type: "financial",
        last_generated: ~N[2024-01-13 09:15:00],
        status: "completed"
      }
    ]

    assign(socket, :reports, reports)
  end

  defp load_report_data(socket, report_type) do
    # Mock data generation - replace with actual report data logic
    report_data = case report_type do
      "overview" ->
        %{
          total_users: 15420,
          active_users: 8930,
          total_contests: 245,
          active_contests: 12,
          total_revenue: 125000.50,
          growth_rate: 15.2
        }

      "user_activity" ->
        %{
          daily_active_users: 2340,
          weekly_active_users: 8930,
          monthly_active_users: 15420,
          user_retention_rate: 68.5,
          avg_session_duration: "12m 34s"
        }

      "contest_performance" ->
        %{
          total_contests_created: 245,
          completed_contests: 233,
          avg_participants: 156,
          most_popular_sport: "Cricket",
          prize_pool_distributed: 89500.00
        }

      "financial" ->
        %{
          total_revenue: 125000.50,
          total_expenses: 45000.25,
          net_profit: 79999.25,
          avg_revenue_per_user: 8.11,
          payment_success_rate: 98.7
        }

      _ ->
        %{}
    end

    socket
    |> assign(:report_data, report_data)
    |> assign(:loading, false)
  end

  defp parse_date_range(%{"from" => from, "to" => to}) do
    %{
      from: Date.from_iso8601!(from),
      to: Date.from_iso8601!(to)
    }
  end

  defp export_report_data(report_data, format) do
    # Mock export functionality - replace with actual export logic
    case format do
      "csv" -> {:ok, "/exports/report_#{DateTime.utc_now() |> DateTime.to_unix()}.csv"}
      "pdf" -> {:ok, "/exports/report_#{DateTime.utc_now() |> DateTime.to_unix()}.pdf"}
      "xlsx" -> {:ok, "/exports/report_#{DateTime.utc_now() |> DateTime.to_unix()}.xlsx"}
      _ -> {:error, "Unsupported format"}
    end
  end

  defp schedule_report(params) do
    # Mock scheduling functionality - replace with actual scheduling logic
    {:ok, %{id: :rand.uniform(1000), scheduled_at: DateTime.utc_now()}}
  end

  defp report_types do
    [
      {"Overview", "overview"},
      {"User Activity", "user_activity"},
      {"Contest Performance", "contest_performance"},
      {"Financial Summary", "financial"},
      {"Player Statistics", "player_stats"},
      {"Match Analytics", "match_analytics"}
    ]
  end

  defp export_formats do
    [
      {"CSV", "csv"},
      {"PDF", "pdf"},
      {"Excel", "xlsx"}
    ]
  end
end