defmodule PicknwinAdminWeb.UserLive.FormComponent do
  use PicknwinAdminWeb, :live_component

  alias Picknwin.Accounts

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @title %>
        <:subtitle>Use this form to manage user records in your database.</:subtitle>
      </.header>

      <.simple_form
        for={@form}
        id="user-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
      >
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Personal Information -->
          <div class="sm:col-span-2">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          </div>
          
          <.input field={@form[:first_name]} type="text" label="First Name" required />
          <.input field={@form[:last_name]} type="text" label="Last Name" required />
          <.input field={@form[:username]} type="text" label="Username" required />
          <.input field={@form[:email]} type="email" label="Email" required />
          
          <.input field={@form[:phone]} type="tel" label="Phone Number" />
          <.input field={@form[:date_of_birth]} type="date" label="Date of Birth" />
          
          <!-- Account Settings -->
          <div class="sm:col-span-2 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
          </div>
          
          <%= if @action == :new do %>
            <.input field={@form[:password]} type="password" label="Password" required />
            <.input field={@form[:password_confirmation]} type="password" label="Confirm Password" required />
          <% end %>
          
          <.input field={@form[:status]} type="select" label="Status" options={[
            {"Active", "active"},
            {"Inactive", "inactive"},
            {"Suspended", "suspended"},
            {"Pending", "pending"}
          ]} required />
          
          <.input field={@form[:role]} type="select" label="Role" options={[
            {"User", "user"},
            {"Premium", "premium"},
            {"VIP", "vip"}
          ]} required />
          
          <!-- Verification Status -->
          <div class="sm:col-span-2 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Verification Status</h3>
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:is_verified]} type="checkbox" label="Email Verified" />
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:phone_verified]} type="checkbox" label="Phone Verified" />
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:kyc_verified]} type="checkbox" label="KYC Verified" />
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:is_active]} type="checkbox" label="Account Active" />
          </div>
          
          <!-- Profile Information -->
          <div class="sm:col-span-2 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
          </div>
          
          <.input field={@form[:avatar_url]} type="url" label="Avatar URL" />
          
          <.input field={@form[:country]} type="text" label="Country" />
          
          <.input field={@form[:state]} type="text" label="State/Province" />
          
          <.input field={@form[:city]} type="text" label="City" />
          
          <div class="sm:col-span-2">
            <.input field={@form[:bio]} type="textarea" label="Bio" rows="3" />
          </div>
          
          <!-- Preferences -->
          <div class="sm:col-span-2 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
          </div>
          
          <.input field={@form[:preferred_language]} type="select" label="Preferred Language" options={[
            {"English", "en"},
            {"Spanish", "es"},
            {"French", "fr"},
            {"German", "de"},
            {"Hindi", "hi"}
          ]} />
          
          <.input field={@form[:timezone]} type="select" label="Timezone" options={[
            {"UTC", "UTC"},
            {"America/New_York", "America/New_York"},
            {"America/Los_Angeles", "America/Los_Angeles"},
            {"Europe/London", "Europe/London"},
            {"Asia/Kolkata", "Asia/Kolkata"}
          ]} />
          
          <!-- Notification Settings -->
          <div class="sm:col-span-2 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:email_notifications]} type="checkbox" label="Email Notifications" />
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:sms_notifications]} type="checkbox" label="SMS Notifications" />
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:push_notifications]} type="checkbox" label="Push Notifications" />
          </div>
          
          <div class="flex items-center">
            <.input field={@form[:marketing_emails]} type="checkbox" label="Marketing Emails" />
          </div>
          
          <!-- Additional Information -->
          <div class="sm:col-span-2 mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          </div>
          
          <.input field={@form[:referral_code]} type="text" label="Referral Code" />
          
          <.input field={@form[:referred_by]} type="text" label="Referred By (User ID)" />
          
          <div class="sm:col-span-2">
            <.input field={@form[:notes]} type="textarea" label="Admin Notes" rows="3" 
              placeholder="Internal notes about this user..." />
          </div>
          
          <div class="sm:col-span-2">
            <.input field={@form[:metadata]} type="textarea" label="Metadata (JSON)" rows="3" 
              placeholder='{"source": "web", "campaign": "summer2024"}' />
          </div>
        </div>

        <:actions>
          <.button phx-disable-with="Saving..." class="bg-indigo-600 hover:bg-indigo-700">
            <.icon name="hero-check" class="-ml-1 mr-2 h-4 w-4" />
            Save User
          </.button>
          
          <.button
            type="button"
            phx-click="cancel"
            phx-target={@myself}
            class="ml-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end

  @impl true
  def update(%{user: user} = assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign_new(:form, fn ->
       to_form(Accounts.change_user(user))
     end)}
  end

  @impl true
  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset = Accounts.change_user(socket.assigns.user, user_params)
    {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
  end

  def handle_event("save", %{"user" => user_params}, socket) do
    save_user(socket, socket.assigns.action, user_params)
  end

  def handle_event("cancel", _params, socket) do
    {:noreply, push_patch(socket, to: socket.assigns.patch)}
  end

  defp save_user(socket, :edit, user_params) do
    case Accounts.update_user(socket.assigns.user, user_params) do
      {:ok, user} ->
        notify_parent({:saved, user})

        {:noreply,
         socket
         |> put_flash(:info, "User updated successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp save_user(socket, :new, user_params) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        notify_parent({:saved, user})

        {:noreply,
         socket
         |> put_flash(:info, "User created successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp notify_parent(msg), do: send(self(), {__MODULE__, msg})
end