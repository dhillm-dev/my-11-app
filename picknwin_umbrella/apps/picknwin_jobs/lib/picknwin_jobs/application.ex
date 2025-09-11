defmodule PicknwinJobs.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Oban configuration
      {Oban, oban_config()}
    ]

    opts = [strategy: :one_for_one, name: PicknwinJobs.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp oban_config do
    Application.fetch_env!(:picknwin_jobs, Oban)
  end
end