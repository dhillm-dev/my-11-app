defmodule PicknwinAdmin.Matches.Match do
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
    field :status, :string, default: "scheduled"
    field :curation_state, :string, default: "feed_only"
    field :popularity_score, :integer, default: 0
    field :is_big_match, :boolean, default: false
    field :lineup_confirmed, :boolean, default: false
    field :weather, :map
    field :odds, :map
    field :stats, :map
    field :metadata, :map, default: %{}
    
    # Curation tracking
    field :curated_at, :utc_datetime
    belongs_to :curated_by, PicknwinAdmin.Accounts.Admin, foreign_key: :curated_by_id, type: :binary_id
    field :blacklisted_at, :utc_datetime
    belongs_to :blacklisted_by, PicknwinAdmin.Accounts.Admin, foreign_key: :blacklisted_by_id, type: :binary_id
    field :blacklist_reason, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(match, attrs) do
    match
    |> cast(attrs, [
      :external_id, :sport, :league, :season, :home_team, :away_team,
      :home_team_logo, :away_team_logo, :venue, :kickoff, :status,
      :curation_state, :popularity_score, :is_big_match, :lineup_confirmed,
      :weather, :odds, :stats, :metadata, :curated_at, :curated_by_id,
      :blacklisted_at, :blacklisted_by_id, :blacklist_reason
    ])
    |> validate_required([:external_id, :sport, :league, :home_team, :away_team, :kickoff])
    |> validate_inclusion(:status, ["scheduled", "live", "finished", "cancelled", "postponed"])
    |> validate_inclusion(:curation_state, ["feed_only", "curated", "blacklisted"])
    |> validate_number(:popularity_score, greater_than_or_equal_to: 0)
    |> unique_constraint(:external_id)
    |> validate_kickoff_in_future()
  end

  @doc false
  def curation_changeset(match, attrs) do
    match
    |> cast(attrs, [:curation_state, :curated_at, :curated_by_id, :blacklisted_at, :blacklisted_by_id, :blacklist_reason])
    |> validate_inclusion(:curation_state, ["feed_only", "curated", "blacklisted"])
    |> validate_curation_fields()
  end

  defp validate_kickoff_in_future(changeset) do
    case get_field(changeset, :kickoff) do
      nil -> changeset
      kickoff ->
        if DateTime.compare(kickoff, DateTime.utc_now()) == :gt do
          changeset
        else
          add_error(changeset, :kickoff, "must be in the future")
        end
    end
  end

  defp validate_curation_fields(changeset) do
    curation_state = get_field(changeset, :curation_state)
    
    case curation_state do
      "curated" ->
        changeset
        |> validate_required([:curated_at, :curated_by_id])
        |> put_change(:blacklisted_at, nil)
        |> put_change(:blacklisted_by_id, nil)
        |> put_change(:blacklist_reason, nil)
        
      "blacklisted" ->
        changeset
        |> validate_required([:blacklisted_at, :blacklisted_by_id])
        |> put_change(:curated_at, nil)
        |> put_change(:curated_by_id, nil)
        
      "feed_only" ->
        changeset
        |> put_change(:curated_at, nil)
        |> put_change(:curated_by_id, nil)
        |> put_change(:blacklisted_at, nil)
        |> put_change(:blacklisted_by_id, nil)
        |> put_change(:blacklist_reason, nil)
        
      _ ->
        changeset
    end
  end

  # Helper functions
  def display_name(%__MODULE__{home_team: home, away_team: away}) do
    "#{home} vs #{away}"
  end

  def is_live?(%__MODULE__{status: "live"}), do: true
  def is_live?(_), do: false

  def is_upcoming?(%__MODULE__{status: "scheduled"}), do: true
  def is_upcoming?(_), do: false

  def is_finished?(%__MODULE__{status: "finished"}), do: true
  def is_finished?(_), do: false

  def is_curated?(%__MODULE__{curation_state: "curated"}), do: true
  def is_curated?(_), do: false

  def is_blacklisted?(%__MODULE__{curation_state: "blacklisted"}), do: true
  def is_blacklisted?(_), do: false

  def time_until_kickoff(%__MODULE__{kickoff: kickoff}) do
    DateTime.diff(kickoff, DateTime.utc_now(), :second)
  end

  def status_badge_class(%__MODULE__{status: status}) do
    case status do
      "scheduled" -> "bg-blue-100 text-blue-800"
      "live" -> "bg-red-100 text-red-800 animate-pulse"
      "finished" -> "bg-green-100 text-green-800"
      "cancelled" -> "bg-gray-100 text-gray-800"
      "postponed" -> "bg-yellow-100 text-yellow-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def curation_badge_class(%__MODULE__{curation_state: state}) do
    case state do
      "curated" -> "bg-green-100 text-green-800"
      "blacklisted" -> "bg-red-100 text-red-800"
      "feed_only" -> "bg-gray-100 text-gray-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end
end