defmodule Picknwin.Matches.Player do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "players" do
    field :external_id, :string
    field :name, :string
    field :position, :string
    field :jersey_number, :integer
    field :team, :string  # "home" or "away"
    field :is_starter, :boolean, default: false
    field :is_captain, :boolean, default: false
    field :is_vice_captain, :boolean, default: false
    field :fantasy_price, :decimal
    field :projected_points, :decimal
    field :actual_points, :decimal
    field :stats, :map, default: %{}
    field :injury_status, :string
    field :availability, Ecto.Enum, values: [
      :available, :doubtful, :injured, :suspended
    ], default: :available
    field :metadata, :map, default: %{}

    belongs_to :match, Picknwin.Matches.Match
    has_many :team_selections, Picknwin.Teams.Selection

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(player, attrs) do
    player
    |> cast(attrs, [
      :external_id, :name, :position, :jersey_number, :team,
      :is_starter, :is_captain, :is_vice_captain, :fantasy_price,
      :projected_points, :actual_points, :stats, :injury_status,
      :availability, :metadata, :match_id
    ])
    |> validate_required([:external_id, :name, :position, :team, :match_id])
    |> validate_inclusion(:team, ["home", "away"])
    |> validate_inclusion(:availability, [:available, :doubtful, :injured, :suspended])
    |> validate_number(:jersey_number, greater_than: 0, less_than: 100)
    |> validate_number(:fantasy_price, greater_than: 0)
    |> unique_constraint([:external_id, :match_id])
    |> foreign_key_constraint(:match_id)
  end

  @doc false
  def scoring_changeset(player, attrs) do
    player
    |> cast(attrs, [:actual_points, :stats])
    |> validate_number(:actual_points, greater_than_or_equal_to: 0)
  end

  def starters_query do
    from p in __MODULE__,
      where: p.is_starter == true
  end

  def by_team_query(team) do
    from p in __MODULE__,
      where: p.team == ^team
  end

  def available_query do
    from p in __MODULE__,
      where: p.availability == :available
  end

  def by_position_query(position) do
    from p in __MODULE__,
      where: p.position == ^position
  end
end