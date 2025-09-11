defmodule PicknwinAdminWeb.SettingLive.Index do
  use PicknwinAdminWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Settings")
     |> assign(:settings, %{})
     |> assign(:selected_category, "general")
     |> assign(:form, nil)
     |> assign(:saving, false)
     |> load_settings()}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Settings")
  end

  @impl true
  def handle_event("select_category", %{"category" => category}, socket) do
    {:noreply,
     socket
     |> assign(:selected_category, category)
     |> load_category_settings(category)}
  end

  def handle_event("save_settings", %{"settings" => settings_params}, socket) do
    case save_settings(socket.assigns.selected_category, settings_params) do
      {:ok, _settings} ->
        {:noreply,
         socket
         |> put_flash(:info, "Settings updated successfully")
         |> assign(:saving, false)
         |> load_settings()}

      {:error, reason} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to update settings: #{reason}")
         |> assign(:saving, false)}
    end
  end

  def handle_event("reset_settings", %{"category" => category}, socket) do
    case reset_category_settings(category) do
      {:ok, _settings} ->
        {:noreply,
         socket
         |> put_flash(:info, "Settings reset to defaults")
         |> load_settings()}

      {:error, reason} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to reset settings: #{reason}")}
    end
  end

  def handle_event("export_settings", _params, socket) do
    case export_all_settings() do
      {:ok, file_path} ->
        {:noreply,
         socket
         |> put_flash(:info, "Settings exported successfully")
         |> push_event("download", %{url: file_path})}

      {:error, reason} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to export settings: #{reason}")}
    end
  end

  def handle_event("import_settings", %{"file" => file}, socket) do
    case import_settings_from_file(file) do
      {:ok, _settings} ->
        {:noreply,
         socket
         |> put_flash(:info, "Settings imported successfully")
         |> load_settings()}

      {:error, reason} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to import settings: #{reason}")}
    end
  end

  def handle_event("validate_settings", %{"settings" => settings_params}, socket) do
    # Real-time validation as user types
    {:noreply, socket}
  end

  defp load_settings(socket) do
    # Mock settings data - replace with actual settings loading logic
    settings = %{
      "general" => %{
        "app_name" => "PicknWin Admin",
        "app_description" => "Dream11 Fantasy Sports Admin Panel",
        "timezone" => "UTC",
        "date_format" => "YYYY-MM-DD",
        "time_format" => "24h",
        "language" => "en",
        "maintenance_mode" => false,
        "debug_mode" => false
      },
      "platform" => %{
        "min_contest_entry_fee" => 10.0,
        "max_contest_entry_fee" => 10000.0,
        "platform_fee_percentage" => 15.0,
        "max_teams_per_user" => 10,
        "contest_join_deadline_minutes" => 15,
        "auto_refund_cancelled_contests" => true,
        "allow_late_team_edits" => false,
        "enable_private_contests" => true
      },
      "payment" => %{
        "payment_gateway" => "stripe",
        "min_deposit_amount" => 10.0,
        "max_deposit_amount" => 50000.0,
        "min_withdrawal_amount" => 50.0,
        "max_withdrawal_amount" => 100000.0,
        "withdrawal_processing_days" => 3,
        "auto_withdrawal_enabled" => false,
        "payment_verification_required" => true
      },
      "notifications" => %{
        "email_notifications_enabled" => true,
        "sms_notifications_enabled" => true,
        "push_notifications_enabled" => true,
        "contest_reminder_enabled" => true,
        "result_announcement_enabled" => true,
        "promotional_emails_enabled" => false,
        "admin_alert_emails" => "admin@picknwin.com"
      },
      "security" => %{
        "session_timeout_minutes" => 60,
        "max_login_attempts" => 5,
        "account_lockout_duration_minutes" => 30,
        "password_min_length" => 8,
        "require_password_complexity" => true,
        "two_factor_auth_required" => false,
        "ip_whitelist_enabled" => false,
        "audit_log_retention_days" => 90
      },
      "api" => %{
        "rate_limit_per_minute" => 1000,
        "api_key_expiry_days" => 365,
        "webhook_timeout_seconds" => 30,
        "enable_api_versioning" => true,
        "cors_enabled" => true,
        "allowed_origins" => "*",
        "api_documentation_public" => false
      }
    }

    socket
    |> assign(:settings, settings)
    |> load_category_settings(socket.assigns.selected_category)
  end

  defp load_category_settings(socket, category) do
    category_settings = Map.get(socket.assigns.settings, category, %{})
    assign(socket, :category_settings, category_settings)
  end

  defp save_settings(category, settings_params) do
    # Mock save functionality - replace with actual settings save logic
    {:ok, settings_params}
  end

  defp reset_category_settings(category) do
    # Mock reset functionality - replace with actual reset logic
    {:ok, %{}}
  end

  defp export_all_settings() do
    # Mock export functionality - replace with actual export logic
    {:ok, "/exports/settings_#{DateTime.utc_now() |> DateTime.to_unix()}.json"}
  end

  defp import_settings_from_file(file) do
    # Mock import functionality - replace with actual import logic
    {:ok, %{}}
  end

  defp setting_categories do
    [
      {"General", "general", "hero-cog-6-tooth"},
      {"Platform", "platform", "hero-trophy"},
      {"Payment", "payment", "hero-credit-card"},
      {"Notifications", "notifications", "hero-bell"},
      {"Security", "security", "hero-shield-check"},
      {"API", "api", "hero-code-bracket"}
    ]
  end

  defp get_setting_field_type(key) do
    cond do
      String.ends_with?(key, "_enabled") or String.ends_with?(key, "_mode") or String.ends_with?(key, "_required") -> "checkbox"
      String.contains?(key, "amount") or String.contains?(key, "fee") or String.contains?(key, "percentage") -> "number"
      String.contains?(key, "minutes") or String.contains?(key, "days") or String.contains?(key, "seconds") -> "number"
      String.contains?(key, "email") -> "email"
      key in ["timezone", "language", "payment_gateway", "date_format", "time_format"] -> "select"
      String.contains?(key, "description") -> "textarea"
      true -> "text"
    end
  end

  defp get_select_options(key) do
    case key do
      "timezone" -> [
        {"UTC", "UTC"},
        {"America/New_York", "America/New_York"},
        {"America/Los_Angeles", "America/Los_Angeles"},
        {"Europe/London", "Europe/London"},
        {"Asia/Kolkata", "Asia/Kolkata"}
      ]
      "language" -> [
        {"English", "en"},
        {"Spanish", "es"},
        {"French", "fr"},
        {"German", "de"}
      ]
      "payment_gateway" -> [
        {"Stripe", "stripe"},
        {"PayPal", "paypal"},
        {"Razorpay", "razorpay"}
      ]
      "date_format" -> [
        {"YYYY-MM-DD", "YYYY-MM-DD"},
        {"MM/DD/YYYY", "MM/DD/YYYY"},
        {"DD/MM/YYYY", "DD/MM/YYYY"}
      ]
      "time_format" -> [
        {"24 Hour", "24h"},
        {"12 Hour", "12h"}
      ]
      _ -> []
    end
  end
end