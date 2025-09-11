defmodule PicknwinApiWeb.HealthController do
  use PicknwinApiWeb, :controller

  def check(conn, _params) do
    json(conn, %{
      status: "ok",
      timestamp: DateTime.utc_now(),
      version: Application.spec(:picknwin_api, :vsn) |> to_string()
    })
  end
end