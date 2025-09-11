defmodule PicknwinAdminWeb.PlayerLive.FormComponent do
  use PicknwinAdminWeb, :live_component

  alias Picknwin.Players

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @title %>
        <:subtitle>Use this form to manage player records in your database.</:subtitle>
      </.header>

      <.simple_form
        for={@form}
        id="player-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
      >
        <!-- Basic Information -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            <p class="mt-1 text-sm text-gray-500">Essential player details and identification.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <.input field={@form[:name]} type="text" label="Full Name" required />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:jersey_number]} type="number" label="Jersey Number" />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:sport]}
                  type="select"
                  label="Sport"
                  options={[
                    {"Cricket", "cricket"},
                    {"Football", "football"},
                    {"Basketball", "basketball"},
                    {"Baseball", "baseball"},
                    {"Soccer", "soccer"}
                  ]}
                  required
                />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:team]} type="text" label="Team" required />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:position]}
                  type="select"
                  label="Position"
                  options={position_options(@form[:sport].value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <!-- Personal Details -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Details</h3>
            <p class="mt-1 text-sm text-gray-500">Additional player information and demographics.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <.input field={@form[:date_of_birth]} type="date" label="Date of Birth" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:nationality]} type="text" label="Nationality" />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:batting_style]}
                  type="select"
                  label="Batting Style"
                  options={[
                    {"", ""},
                    {"Right-handed", "right_handed"},
                    {"Left-handed", "left_handed"}
                  ]}
                />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:bowling_style]}
                  type="select"
                  label="Bowling Style"
                  options={[
                    {"", ""},
                    {"Right-arm Fast", "right_arm_fast"},
                    {"Left-arm Fast", "left_arm_fast"},
                    {"Right-arm Medium", "right_arm_medium"},
                    {"Left-arm Medium", "left_arm_medium"},
                    {"Right-arm Spin", "right_arm_spin"},
                    {"Left-arm Spin", "left_arm_spin"}
                  ]}
                />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:height]} type="number" label="Height (cm)" step="0.1" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:weight]} type="number" label="Weight (kg)" step="0.1" />
              </div>
            </div>
          </div>
          
          <!-- Fantasy Settings -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Fantasy Settings</h3>
            <p class="mt-1 text-sm text-gray-500">Pricing and fantasy sports configuration.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <.input field={@form[:price]} type="number" label="Fantasy Price" step="0.01" required />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:base_price]} type="number" label="Base Price" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:status]}
                  type="select"
                  label="Status"
                  options={[
                    {"Active", "active"},
                    {"Inactive", "inactive"},
                    {"Injured", "injured"},
                    {"Retired", "retired"},
                    {"Suspended", "suspended"}
                  ]}
                  required
                />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:image_url]} type="url" label="Profile Image URL" />
              </div>
              
              <div class="sm:col-span-3">
                <.input
                  field={@form[:is_captain_eligible]}
                  type="checkbox"
                  label="Eligible for Captain"
                />
              </div>
            </div>
          </div>
          
          <!-- Statistics -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Statistics</h3>
            <p class="mt-1 text-sm text-gray-500">Performance metrics and career statistics.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <.input field={@form[:total_points]} type="number" label="Total Points" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:matches_played]} type="number" label="Matches Played" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:avg_points]} type="number" label="Average Points" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:recent_form]} type="number" label="Recent Form (%)" step="0.1" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:selection_percentage]} type="number" label="Selection %" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:captain_percentage]} type="number" label="Captain %" step="0.01" />
              </div>
            </div>
          </div>
          
          <!-- Career Information -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Career Information</h3>
            <p class="mt-1 text-sm text-gray-500">Professional career details and achievements.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <.input field={@form[:debut_date]} type="date" label="Debut Date" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:career_span]} type="text" label="Career Span" placeholder="e.g., 2015-Present" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:international_caps]} type="number" label="International Caps" />
              </div>
              
              <div class="sm:col-span-6">
                <.input field={@form[:achievements]} type="textarea" label="Achievements" rows="3" />
              </div>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Additional Information</h3>
            <p class="mt-1 text-sm text-gray-500">Extra details and metadata.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <.input field={@form[:external_id]} type="text" label="External ID" placeholder="Third-party system ID" />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:api_source]} type="text" label="API Source" placeholder="Data source" />
              </div>
              
              <div class="sm:col-span-6">
                <.input field={@form[:bio]} type="textarea" label="Biography" rows="4" />
              </div>
              
              <div class="sm:col-span-6">
                <.input field={@form[:notes]} type="textarea" label="Admin Notes" rows="3" />
              </div>
            </div>
          </div>
        </div>

        <:actions>
          <.button phx-disable-with="Saving..." class="bg-indigo-600 hover:bg-indigo-700">
            Save Player
          </.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end

  @impl true
  def update(%{player: player} = assigns, socket) do
    changeset = Players.change_player(player)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  @impl true
  def handle_event("validate", %{"player" => player_params}, socket) do
    changeset =
      socket.assigns.player
      |> Players.change_player(player_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"player" => player_params}, socket) do
    save_player(socket, socket.assigns.action, player_params)
  end

  defp save_player(socket, :edit, player_params) do
    case Players.update_player(socket.assigns.player, player_params) do
      {:ok, player} ->
        notify_parent({:saved, player})

        {:noreply,
         socket
         |> put_flash(:info, "Player updated successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_player(socket, :new, player_params) do
    case Players.create_player(player_params) do
      {:ok, player} ->
        notify_parent({:saved, player})

        {:noreply,
         socket
         |> put_flash(:info, "Player created successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp notify_parent(msg), do: send(self(), {__MODULE__, msg})

  # Helper function to get position options based on sport
  defp position_options("cricket") do
    [
      {"Batsman", "batsman"},
      {"Bowler", "bowler"},
      {"All Rounder", "all_rounder"},
      {"Wicket Keeper", "wicket_keeper"}
    ]
  end

  defp position_options("football") do
    [
      {"Quarterback", "quarterback"},
      {"Running Back", "running_back"},
      {"Wide Receiver", "wide_receiver"},
      {"Tight End", "tight_end"},
      {"Offensive Line", "offensive_line"},
      {"Defensive Line", "defensive_line"},
      {"Linebacker", "linebacker"},
      {"Cornerback", "cornerback"},
      {"Safety", "safety"},
      {"Kicker", "kicker"},
      {"Punter", "punter"}
    ]
  end

  defp position_options("basketball") do
    [
      {"Point Guard", "point_guard"},
      {"Shooting Guard", "shooting_guard"},
      {"Small Forward", "small_forward"},
      {"Power Forward", "power_forward"},
      {"Center", "center"}
    ]
  end

  defp position_options("baseball") do
    [
      {"Pitcher", "pitcher"},
      {"Catcher", "catcher"},
      {"First Base", "first_base"},
      {"Second Base", "second_base"},
      {"Third Base", "third_base"},
      {"Shortstop", "shortstop"},
      {"Left Field", "left_field"},
      {"Center Field", "center_field"},
      {"Right Field", "right_field"},
      {"Designated Hitter", "designated_hitter"}
    ]
  end

  defp position_options("soccer") do
    [
      {"Goalkeeper", "goalkeeper"},
      {"Defender", "defender"},
      {"Midfielder", "midfielder"},
      {"Forward", "forward"}
    ]
  end

  defp position_options(_) do
    [
      {"Player", "player"}
    ]
  end
end