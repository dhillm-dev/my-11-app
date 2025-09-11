defmodule Picknwin.Audit.Log do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "audit_logs" do
    field :action, :string
    field :resource_type, :string
    field :resource_id, :string
    field :changes, :map
    field :metadata, :map, default: %{}
    field :ip_address, :string
    field :user_agent, :string
    field :session_id, :string

    belongs_to :user, Picknwin.Accounts.User

    timestamps(type: :utc_datetime, updated_at: false)
  end

  @doc false
  def changeset(log, attrs) do
    log
    |> cast(attrs, [
      :action, :resource_type, :resource_id, :changes, :metadata,
      :ip_address, :user_agent, :session_id, :user_id
    ])
    |> validate_required([:action])
    |> foreign_key_constraint(:user_id)
  end

  def by_user_query(user_id) do
    from l in __MODULE__,
      where: l.user_id == ^user_id
  end

  def by_action_query(action) do
    from l in __MODULE__,
      where: l.action == ^action
  end

  def by_resource_query(resource_type, resource_id) do
    from l in __MODULE__,
      where: l.resource_type == ^resource_type and l.resource_id == ^resource_id
  end

  def recent_query(limit \\\ 100) do
    from l in __MODULE__,
      order_by: [desc: l.inserted_at],
      limit: ^limit
  end

  def by_date_range_query(start_date, end_date) do
    from l in __MODULE__,
      where: l.inserted_at >= ^start_date and l.inserted_at <= ^end_date
  end
end