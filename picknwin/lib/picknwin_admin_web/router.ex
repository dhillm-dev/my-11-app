defmodule PicknwinAdminWeb.Router do
  use PicknwinAdminWeb, :router

  import PicknwinAdminWeb.AdminAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {PicknwinAdminWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_admin
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  # Unauthenticated routes
  scope "/admin", PicknwinAdminWeb do
    pipe_through [:browser, :redirect_if_admin_is_authenticated]

    live_session :redirect_if_admin_is_authenticated,
      on_mount: [{PicknwinAdminWeb.AdminAuth, :redirect_if_admin_is_authenticated}] do
      live "/register", AdminRegistrationLive, :new
      live "/log_in", AdminLoginLive, :new
      live "/reset_password", AdminForgotPasswordLive, :new
      live "/reset_password/:token", AdminResetPasswordLive, :edit
    end

    post "/log_in", AdminSessionController, :create
  end

  # Authenticated admin routes
  scope "/admin", PicknwinAdminWeb do
    pipe_through [:browser, :require_authenticated_admin]

    live_session :require_authenticated_admin,
      on_mount: [{PicknwinAdminWeb.AdminAuth, :ensure_authenticated}] do
      live "/", DashboardLive, :index
      live "/settings", AdminSettingsLive, :edit
      live "/settings/confirm_email/:token", AdminSettingsLive, :confirm_email
      
      # Matches management
      live "/matches", MatchLive.Index, :index
      live "/matches/new", MatchLive.Index, :new
      live "/matches/:id/edit", MatchLive.Index, :edit
      live "/matches/:id", MatchLive.Show, :show
      live "/matches/:id/show/edit", MatchLive.Show, :edit
      
      # Contests management
      live "/contests", ContestLive.Index, :index
      live "/contests/new", ContestLive.Index, :new
      live "/contests/:id/edit", ContestLive.Index, :edit
      live "/contests/:id", ContestLive.Show, :show
      live "/contests/:id/show/edit", ContestLive.Show, :edit
      
      # Users management
      live "/users", UserLive.Index, :index
      live "/users/new", UserLive.Index, :new
      live "/users/:id/edit", UserLive.Index, :edit
      
      # Players management
      live "/players", PlayerLive.Index, :index
      live "/players/new", PlayerLive.Index, :new
      live "/players/:id/edit", PlayerLive.Index, :edit
      
      # Wallets management
      live "/wallets", WalletLive.Index, :index
      live "/wallets/new", WalletLive.Index, :new
      live "/wallets/:id/edit", WalletLive.Index, :edit
      
      # Reports
      live "/reports", ReportLive.Index, :index
      
      # Settings
      live "/settings", SettingLive.Index, :index
    end

    delete "/log_out", AdminSessionController, :delete
    live "/confirm/:token", AdminConfirmationLive, :edit
    live "/confirm", AdminConfirmationInstructionsLive, :new
  end

  # Public routes
  scope "/", PicknwinAdminWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  # scope "/api", PicknwinAdminWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:picknwin_admin, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: PicknwinAdminWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end