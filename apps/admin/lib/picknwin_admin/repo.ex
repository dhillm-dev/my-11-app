defmodule PicknwinAdmin.Repo do
  use Ecto.Repo,
    otp_app: :picknwin_admin,
    adapter: Ecto.Adapters.Postgres
end