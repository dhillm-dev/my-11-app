defmodule PicknwinAdminWeb.WalletLive.FormComponent do
  use PicknwinAdminWeb, :live_component

  alias Picknwin.Wallets

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @title %>
        <:subtitle>Use this form to manage wallet records in your database.</:subtitle>
      </.header>

      <.simple_form
        for={@form}
        id="wallet-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
      >
        <!-- Basic Information -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            <p class="mt-1 text-sm text-gray-500">Essential wallet details and user association.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <.input field={@form[:user_id]} type="number" label="User ID" required />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:user_email]} type="email" label="User Email" placeholder="For reference only" />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:status]}
                  type="select"
                  label="Status"
                  options={[
                    {"Active", "active"},
                    {"Frozen", "frozen"},
                    {"Suspended", "suspended"},
                    {"Closed", "closed"}
                  ]}
                  required
                />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:currency]}
                  type="select"
                  label="Currency"
                  options={[
                    {"USD", "USD"},
                    {"EUR", "EUR"},
                    {"GBP", "GBP"},
                    {"INR", "INR"}
                  ]}
                  required
                />
              </div>
              
              <div class="sm:col-span-2">
                <.input
                  field={@form[:wallet_type]}
                  type="select"
                  label="Wallet Type"
                  options={[
                    {"Main", "main"},
                    {"Bonus", "bonus"},
                    {"Promotional", "promotional"}
                  ]}
                  required
                />
              </div>
            </div>
          </div>
          
          <!-- Balance Information -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Balance Information</h3>
            <p class="mt-1 text-sm text-gray-500">Current wallet balances and limits.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <.input field={@form[:balance]} type="number" label="Current Balance" step="0.01" required />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:bonus_balance]} type="number" label="Bonus Balance" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:locked_balance]} type="number" label="Locked Balance" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:total_deposited]} type="number" label="Total Deposited" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:total_withdrawn]} type="number" label="Total Withdrawn" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:total_winnings]} type="number" label="Total Winnings" step="0.01" />
              </div>
            </div>
          </div>
          
          <!-- Limits and Restrictions -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Limits and Restrictions</h3>
            <p class="mt-1 text-sm text-gray-500">Transaction limits and wallet restrictions.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <.input field={@form[:daily_deposit_limit]} type="number" label="Daily Deposit Limit" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:daily_withdrawal_limit]} type="number" label="Daily Withdrawal Limit" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:monthly_deposit_limit]} type="number" label="Monthly Deposit Limit" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:monthly_withdrawal_limit]} type="number" label="Monthly Withdrawal Limit" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:max_balance_limit]} type="number" label="Max Balance Limit" step="0.01" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:min_withdrawal_amount]} type="number" label="Min Withdrawal Amount" step="0.01" />
              </div>
            </div>
          </div>
          
          <!-- Security and Verification -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Security and Verification</h3>
            <p class="mt-1 text-sm text-gray-500">Security settings and verification status.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <.input
                  field={@form[:is_verified]}
                  type="checkbox"
                  label="Verified Wallet"
                />
              </div>
              
              <div class="sm:col-span-3">
                <.input
                  field={@form[:requires_kyc]}
                  type="checkbox"
                  label="Requires KYC"
                />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:verification_level]} type="number" label="Verification Level" min="0" max="5" />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:risk_score]} type="number" label="Risk Score" min="0" max="100" />
              </div>
              
              <div class="sm:col-span-6">
                <.input field={@form[:freeze_reason]} type="textarea" label="Freeze Reason" rows="3" />
              </div>
            </div>
          </div>
          
          <!-- Transaction History -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Transaction Statistics</h3>
            <p class="mt-1 text-sm text-gray-500">Transaction counts and activity metrics.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <.input field={@form[:total_transactions]} type="number" label="Total Transactions" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:successful_transactions]} type="number" label="Successful Transactions" />
              </div>
              
              <div class="sm:col-span-2">
                <.input field={@form[:failed_transactions]} type="number" label="Failed Transactions" />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:last_transaction_at]} type="datetime-local" label="Last Transaction" />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:last_transaction_type]} type="text" label="Last Transaction Type" />
              </div>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Additional Information</h3>
            <p class="mt-1 text-sm text-gray-500">Extra details and metadata.</p>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <.input field={@form[:external_wallet_id]} type="text" label="External Wallet ID" />
              </div>
              
              <div class="sm:col-span-3">
                <.input field={@form[:payment_provider]} type="text" label="Payment Provider" />
              </div>
              
              <div class="sm:col-span-6">
                <.input field={@form[:metadata]} type="textarea" label="Metadata (JSON)" rows="4" />
              </div>
              
              <div class="sm:col-span-6">
                <.input field={@form[:admin_notes]} type="textarea" label="Admin Notes" rows="3" />
              </div>
            </div>
          </div>
        </div>

        <:actions>
          <.button phx-disable-with="Saving..." class="bg-indigo-600 hover:bg-indigo-700">
            Save Wallet
          </.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end

  @impl true
  def update(%{wallet: wallet} = assigns, socket) do
    changeset = Wallets.change_wallet(wallet)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  @impl true
  def handle_event("validate", %{"wallet" => wallet_params}, socket) do
    changeset =
      socket.assigns.wallet
      |> Wallets.change_wallet(wallet_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"wallet" => wallet_params}, socket) do
    save_wallet(socket, socket.assigns.action, wallet_params)
  end

  defp save_wallet(socket, :edit, wallet_params) do
    case Wallets.update_wallet(socket.assigns.wallet, wallet_params) do
      {:ok, wallet} ->
        notify_parent({:saved, wallet})

        {:noreply,
         socket
         |> put_flash(:info, "Wallet updated successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_wallet(socket, :new, wallet_params) do
    case Wallets.create_wallet(wallet_params) do
      {:ok, wallet} ->
        notify_parent({:saved, wallet})

        {:noreply,
         socket
         |> put_flash(:info, "Wallet created successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp notify_parent(msg), do: send(self(), {__MODULE__, msg})
end