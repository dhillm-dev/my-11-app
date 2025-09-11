defmodule PicknwinApi.Repo do
  use Ecto.Repo,
    otp_app: :picknwin_api,
    adapter: Ecto.Adapters.Postgres
end