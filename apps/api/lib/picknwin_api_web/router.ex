defmodule PicknwinApiWeb.Router do
  use PicknwinApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {PicknwinApiWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/api", PicknwinApiWeb do
    pipe_through :api

    # Health check endpoint
    get "/health", HealthController, :check

    # Authentication endpoints
    post "/auth/login", AuthController, :login
    post "/auth/register", AuthController, :register
    delete "/auth/logout", AuthController, :logout
    get "/auth/me", AuthController, :me

    # Game endpoints
    resources "/games", GameController, except: [:new, :edit]
    get "/games/:id/matches", GameController, :matches

    # Match endpoints
    resources "/matches", MatchController, except: [:new, :edit]
    post "/matches/:id/join", MatchController, :join
    delete "/matches/:id/leave", MatchController, :leave

    # User endpoints
    resources "/users", UserController, except: [:new, :edit]
    get "/users/:id/matches", UserController, :matches
    get "/users/:id/stats", UserController, :stats
  end

  # Enable LiveDashboard in development
  if Application.compile_env(:picknwin_api, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: PicknwinApiWeb.Telemetry
    end
  end
end