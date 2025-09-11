defmodule PicknwinAdminWeb.ContestLive.FormComponent do
  use PicknwinAdminWeb, :live_component

  alias PicknwinAdmin.Contests
  alias PicknwinAdmin.Matches

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @title %>
        <:subtitle>Use this form to manage contest records in your database.</:subtitle>
      </.header>

      <.simple_form
        for={@form}
        id="contest-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
      >
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <.input field={@form[:name]} type="text" label="Contest Name" required />
          
          <.input
            field={@form[:type]}
            type="select"
            label="Contest Type"
            prompt="Choose a type"
            options={[
              {"Free", "free"},
              {"Paid", "paid"},
              {"Private", "private"}
            ]}
            required
          />
        </div>

        <.input field={@form[:description]} type="textarea" label="Description" rows="3" />

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <.input
            field={@form[:match_id]}
            type="select"
            label="Match"
            prompt="Choose a match"
            options={@match_options}
            required
          />
          
          <.input
            field={@form[:status]}
            type="select"
            label="Status"
            prompt="Choose status"
            options={[
              {"Draft", "draft"},
              {"Published", "published"},
              {"Live", "live"},
              {"Completed", "completed"},
              {"Cancelled", "cancelled"}
            ]}
            required
          />
        </div>

        <!-- Entry and Prize Configuration -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Entry & Prize Configuration</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <.input
              field={@form[:entry_fee]}
              type="number"
              label="Entry Fee ($)"
              min="0"
              step="0.01"
              required
            />
            
            <.input
              field={@form[:max_entries]}
              type="number"
              label="Max Entries"
              min="1"
              required
            />
            
            <.input
              field={@form[:total_prize_pool]}
              type="number"
              label="Total Prize Pool ($)"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
            <.input
              field={@form[:first_prize]}
              type="number"
              label="First Prize ($)"
              min="0"
              step="0.01"
            />
            
            <.input
              field={@form[:winner_percentage]}
              type="number"
              label="Winner Percentage (%)"
              min="1"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        <!-- Registration Timeline -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Registration Timeline</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <.input
              field={@form[:registration_start]}
              type="datetime-local"
              label="Registration Start"
              required
            />
            
            <.input
              field={@form[:registration_end]}
              type="datetime-local"
              label="Registration End"
              required
            />
          </div>
        </div>

        <!-- Contest Rules -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Contest Rules</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <.input
              field={@form[:salary_cap]}
              type="number"
              label="Salary Cap"
              min="0"
              step="0.01"
            />
            
            <.input
              field={@form[:min_team_size]}
              type="number"
              label="Min Team Size"
              min="1"
              max="15"
            />
            
            <.input
              field={@form[:max_team_size]}
              type="number"
              label="Max Team Size"
              min="1"
              max="15"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
            <.input
              field={@form[:captain_multiplier]}
              type="number"
              label="Captain Multiplier"
              min="1"
              step="0.1"
            />
            
            <.input
              field={@form[:vice_captain_multiplier]}
              type="number"
              label="Vice Captain Multiplier"
              min="1"
              step="0.1"
            />
          </div>

          <div class="mt-4">
            <label class="flex items-center">
              <.input field={@form[:allow_multiple_entries]} type="checkbox" class="mr-2" />
              <span class="text-sm text-gray-700">Allow Multiple Entries per User</span>
            </label>
          </div>

          <div class="mt-4">
            <label class="flex items-center">
              <.input field={@form[:is_private]} type="checkbox" class="mr-2" />
              <span class="text-sm text-gray-700">Private Contest</span>
            </label>
          </div>
        </div>

        <!-- Additional Settings -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Settings</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <.input
              field={@form[:invite_code]}
              type="text"
              label="Invite Code (for private contests)"
            />
            
            <.input
              field={@form[:auto_create_teams]}
              type="select"
              label="Auto Create Teams"
              options={[
                {"Disabled", false},
                {"Enabled", true}
              ]}
            />
          </div>

          <.input field={@form[:rules]} type="textarea" label="Contest Rules" rows="4" />
          <.input field={@form[:metadata]} type="textarea" label="Metadata (JSON)" rows="3" />
        </div>

        <!-- Form Actions -->
        <:actions>
          <.button phx-disable-with="Saving..." class="w-full sm:w-auto">
            Save Contest
          </.button>
          
          <.button
            type="button"
            phx-click={JS.patch(@patch)}
            class="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 ml-0 sm:ml-3 mt-3 sm:mt-0"
          >
            Cancel
          </.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end

  @impl true
  def update(%{contest: contest} = assigns, socket) do
    changeset = Contests.change_contest(contest)
    match_options = load_match_options()

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:match_options, match_options)
     |> assign_form(changeset)}
  end

  @impl true
  def handle_event("validate", %{"contest" => contest_params}, socket) do
    changeset =
      socket.assigns.contest
      |> Contests.change_contest(contest_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"contest" => contest_params}, socket) do
    save_contest(socket, socket.assigns.action, contest_params)
  end

  defp save_contest(socket, :edit, contest_params) do
    case Contests.update_contest(socket.assigns.contest, contest_params) do
      {:ok, contest} ->
        notify_parent({:saved, contest})

        {:noreply,
         socket
         |> put_flash(:info, "Contest updated successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_contest(socket, :new, contest_params) do
    # Add the current admin as the created_by
    contest_params = Map.put(contest_params, "created_by_id", socket.assigns.current_admin.id)
    
    case Contests.create_contest(contest_params) do
      {:ok, contest} ->
        notify_parent({:saved, contest})

        {:noreply,
         socket
         |> put_flash(:info, "Contest created successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp notify_parent(msg), do: send(self(), {__MODULE__, msg})

  defp load_match_options do
    Matches.list_matches(status: ["upcoming", "live"], limit: 100)
    |> Enum.map(fn match ->
      display_name = "#{match.home_team} vs #{match.away_team} - #{Calendar.strftime(match.kickoff, "%b %d, %Y")}"
      {display_name, match.id}
    end)
  end
end