defmodule Picknwin.Repo do
  use Ecto.Repo,
    otp_app: :picknwin,
    adapter: Ecto.Adapters.Postgres
end