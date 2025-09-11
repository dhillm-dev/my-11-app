defmodule Picknwin.Contests.Entry do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "contest_entries" do
    field :entry_number, :integer
    field :team_name, :string
    field :total_points, :decimal, default: Decimal.new("0.00")
    field :rank, :integer
    field :prize_amount, :decimal, default: Decimal.new("0.00")
    field :is_paid, :boolean, default: false
    field :paid_at, :utc_datetime
    field :metadata, :map, default: %{}

    belongs_to :contest, Picknwin.Contests.Contest
    belongs_to :user, Picknwin.Accounts.User
    belongs_to :team, Picknwin.Teams.Team

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(entry, attrs) do
    entry
    |> cast(attrs, [
      :entry_number, :team_name, :total_points, :rank, :prize_amount,
      :is_paid, :paid_at, :metadata, :contest_id, :user_id, :team_id
    ])
    |> validate_required([:contest_id, :user_id, :team_id])
    |> unique_constraint([:contest_id, :entry_number])
    |> unique_constraint([:contest_id, :team_id])
    |> foreign_key_constraint(:contest_id)
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:team_id)
    |> validate_number(:total_points, greater_than_or_equal_to: 0)
    |> validate_number(:prize_amount, greater_than_or_equal_to: 0)
  end

  @doc false
  def scoring_changeset(entry, attrs) do
    entry
    |> cast(attrs, [:total_points, :rank])
    |> validate_number(:total_points, greater_than_or_equal_to: 0)
    |> validate_number(:rank, greater_than: 0)
  end

  @doc false
  def prize_changeset(entry, attrs) do
    entry
    |> cast(attrs, [:prize_amount, :is_paid, :paid_at])
    |> validate_number(:prize_amount, greater_than_or_equal_to: 0)
  end

  def by_contest_query(contest_id) do
    from e in __MODULE__,
      where: e.contest_id == ^contest_id
  end

  def by_user_query(user_id) do
    from e in __MODULE__,
      where: e.user_id == ^user_id
  end

  def leaderboard_query(contest_id) do
    from e in __MODULE__,
      where: e.contest_id == ^contest_id,
      order_by: [desc: e.total_points, asc: e.inserted_at]
  end

  def winners_query(contest_id) do
    from e in __MODULE__,
      where: e.contest_id == ^contest_id,
      where: e.prize_amount > 0,
      order_by: [asc: e.rank]
  end
end