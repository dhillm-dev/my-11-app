defmodule Picknwin.Matches.Match do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "matches" do
    field :external_id, :string
    field :sport, :string
    field :league, :string
    field :season, :string
    field :home_team, :string
    field :away_team, :string
    field :home_team_logo, :string
    field :away_team_logo, :string
    field :venue, :string
    field :kickoff, :utc_datetime
    field :status, Ecto.Enum, values: [
      :scheduled, :live, :finished, :postponed, :cancelled
    ], default: :scheduled
    field :curation_state, Ecto.Enum, values: [
      :feed_only, :curated, :blacklisted
    ], default: :feed_only
    field :popularity_score, :integer, default: 0
    field :is_big_match, :boolean, default: false
    field :lineup_confirmed, :boolean, default: false
    field :weather, :map
    field :odds, :map
    field :stats, :map
    field :metadata, :map, default: %{}
    field :curated_at, :utc_datetime
    field :curated_by_id, :binary_id
    field :blacklisted_at, :utc_datetime
    field :blacklisted_by_id, :binary_id
    field :blacklist_reason, :string

    has_many :contests, Picknwin.Contests.Contest
    has_many :players, Picknwin.Matches.Player
    belongs_to :curated_by, Picknwin.Accounts.User, foreign_key: :curated_by_id, define_field: false
    belongs_to :blacklisted_by, Picknwin.Accounts.User, foreign_key: :blacklisted_by_id, define_field: false

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(match, attrs) do
    match
    |> cast(attrs, [
      :external_id, :sport, :league, :season, :home_team, :away_team,
      :home_team_logo, :away_team_logo, :venue, :kickoff, :status,
      :popularity_score, :is_big_match, :lineup_confirmed, :weather,
      :odds, :stats, :metadata
    ])
    |> validate_required([
      :external_id, :sport, :league, :home_team, :away_team, :kickoff
    ])
    |> unique_constraint(:external_id)
    |> validate_inclusion(:sport, ["football", "basketball", "tennis", "cricket"])
    |> validate_number(:popularity_score, greater_than_or_equal_to: 0)
  end

  @doc false
  def curation_changeset(match, attrs, curator) do
    match
    |> cast(attrs, [:curation_state, :blacklist_reason])
    |> validate_required([:curation_state])
    |> validate_inclusion(:curation_state, [:feed_only, :curated, :blacklisted])
    |> put_curation_fields(curator)
    |> validate_blacklist_reason()
  end

  defp put_curation_fields(changeset, curator) do
    case get_change(changeset, :curation_state) do
      :curated ->
        changeset
        |> put_change(:curated_at, DateTime.utc_now())
        |> put_change(:curated_by_id, curator.id)
        |> put_change(:blacklisted_at, nil)
        |> put_change(:blacklisted_by_id, nil)
        |> put_change(:blacklist_reason, nil)
      
      :blacklisted ->
        changeset
        |> put_change(:blacklisted_at, DateTime.utc_now())
        |> put_change(:blacklisted_by_id, curator.id)
        |> put_change(:curated_at, nil)
        |> put_change(:curated_by_id, nil)
      
      :feed_only ->
        changeset
        |> put_change(:curated_at, nil)
        |> put_change(:curated_by_id, nil)
        |> put_change(:blacklisted_at, nil)
        |> put_change(:blacklisted_by_id, nil)
        |> put_change(:blacklist_reason, nil)
      
      _ -> changeset
    end
  end

  defp validate_blacklist_reason(changeset) do
    case get_change(changeset, :curation_state) do
      :blacklisted ->
        validate_required(changeset, [:blacklist_reason])
      _ -> changeset
    end
  end

  def upcoming_query do
    from m in __MODULE__,
      where: m.kickoff > ^DateTime.utc_now(),
      where: m.status == :scheduled,
      order_by: [asc: m.kickoff]
  end

  def curated_query do
    from m in __MODULE__,
      where: m.curation_state == :curated
  end

  def big_matches_query do
    from m in __MODULE__,
      where: m.is_big_match == true
  end

  def by_league_query(league) do
    from m in __MODULE__,
      where: m.league == ^league
  end

  def by_date_range_query(start_date, end_date) do
    from m in __MODULE__,
      where: m.kickoff >= ^start_date and m.kickoff <= ^end_date
  end
end