defmodule PicknwinAdmin.Contests.Contest do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "contests" do
    field :name, :string
    field :description, :string
    field :type, :string, default: "public"
    field :template, :string, default: "classic"
    field :entry_fee, :decimal, default: Decimal.new("0.00")
    field :max_entries, :integer
    field :total_spots, :integer
    field :entries_count, :integer, default: 0
    field :prize_pool, :decimal
    field :first_prize, :decimal
    field :prize_distribution, :map, default: %{}
    field :status, :string, default: "draft"
    field :visibility, :string, default: "public"
    field :is_guaranteed, :boolean, default: false
    field :is_mega, :boolean, default: false
    field :is_featured, :boolean, default: false
    field :auto_create_teams, :boolean, default: false
    field :allow_multi_entry, :boolean, default: true
    field :max_entries_per_user, :integer, default: 1
    field :salary_cap, :decimal, default: Decimal.new("100.0")
    field :captain_multiplier, :decimal, default: Decimal.new("2.0")
    field :vice_captain_multiplier, :decimal, default: Decimal.new("1.5")
    field :lineup_requirements, :map, default: %{}
    field :rules, :map, default: %{}
    field :metadata, :map, default: %{}
    
    # Lifecycle timestamps
    field :registration_opens_at, :utc_datetime
    field :registration_closes_at, :utc_datetime
    field :starts_at, :utc_datetime
    field :ends_at, :utc_datetime
    field :results_declared_at, :utc_datetime
    field :prizes_distributed_at, :utc_datetime
    
    # Admin tracking
    field :published_at, :utc_datetime
    field :cancelled_at, :utc_datetime
    field :cancellation_reason, :string
    
    # Relationships
    belongs_to :match, PicknwinAdmin.Matches.Match
    belongs_to :created_by, PicknwinAdmin.Accounts.Admin, foreign_key: :created_by_id
    belongs_to :published_by, PicknwinAdmin.Accounts.Admin, foreign_key: :published_by_id
    belongs_to :cancelled_by, PicknwinAdmin.Accounts.Admin, foreign_key: :cancelled_by_id
    
    has_many :entries, PicknwinAdmin.Contests.ContestEntry

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(contest, attrs) do
    contest
    |> cast(attrs, [
      :name, :description, :type, :template, :entry_fee, :max_entries,
      :total_spots, :entries_count, :prize_pool, :first_prize, :prize_distribution,
      :status, :visibility, :is_guaranteed, :is_mega, :is_featured,
      :auto_create_teams, :allow_multi_entry, :max_entries_per_user,
      :salary_cap, :captain_multiplier, :vice_captain_multiplier,
      :lineup_requirements, :rules, :metadata, :match_id,
      :registration_opens_at, :registration_closes_at, :starts_at, :ends_at,
      :results_declared_at, :prizes_distributed_at, :created_by_id,
      :published_by_id, :published_at, :cancelled_by_id, :cancelled_at,
      :cancellation_reason
    ])
    |> validate_required([:name, :max_entries, :total_spots, :prize_pool, :match_id])
    |> validate_inclusion(:type, ["public", "private", "head_to_head"])
    |> validate_inclusion(:template, ["classic", "mega", "grand_league", "winner_takes_all"])
    |> validate_inclusion(:status, ["draft", "live", "completed", "cancelled"])
    |> validate_inclusion(:visibility, ["public", "private"])
    |> validate_number(:entry_fee, greater_than_or_equal_to: 0)
    |> validate_number(:max_entries, greater_than: 0)
    |> validate_number(:total_spots, greater_than: 0)
    |> validate_number(:prize_pool, greater_than: 0)
    |> validate_number(:max_entries_per_user, greater_than: 0)
    |> validate_number(:salary_cap, greater_than: 0)
    |> validate_number(:captain_multiplier, greater_than: 1)
    |> validate_number(:vice_captain_multiplier, greater_than: 1)
    |> validate_entries_vs_spots()
    |> validate_prize_distribution()
    |> validate_timeline()
    |> foreign_key_constraint(:match_id)
    |> foreign_key_constraint(:created_by_id)
  end

  @doc false
  def status_changeset(contest, attrs) do
    contest
    |> cast(attrs, [:status, :published_at, :published_by_id, :cancelled_at, :cancelled_by_id, :cancellation_reason])
    |> validate_inclusion(:status, ["draft", "live", "completed", "cancelled"])
    |> validate_status_transition()
  end

  defp validate_entries_vs_spots(changeset) do
    max_entries = get_field(changeset, :max_entries)
    total_spots = get_field(changeset, :total_spots)
    
    if max_entries && total_spots && max_entries > total_spots do
      add_error(changeset, :max_entries, "cannot be greater than total spots")
    else
      changeset
    end
  end

  defp validate_prize_distribution(changeset) do
    prize_pool = get_field(changeset, :prize_pool)
    prize_distribution = get_field(changeset, :prize_distribution) || %{}
    
    if prize_pool && map_size(prize_distribution) > 0 do
      total_distributed = 
        prize_distribution
        |> Map.values()
        |> Enum.map(&Decimal.new/1)
        |> Enum.reduce(Decimal.new(0), &Decimal.add/2)
      
      if Decimal.compare(total_distributed, prize_pool) == :gt do
        add_error(changeset, :prize_distribution, "total distributed prizes cannot exceed prize pool")
      else
        changeset
      end
    else
      changeset
    end
  end

  defp validate_timeline(changeset) do
    registration_opens = get_field(changeset, :registration_opens_at)
    registration_closes = get_field(changeset, :registration_closes_at)
    starts_at = get_field(changeset, :starts_at)
    ends_at = get_field(changeset, :ends_at)
    
    changeset
    |> validate_datetime_order(:registration_opens_at, :registration_closes_at, registration_opens, registration_closes)
    |> validate_datetime_order(:registration_closes_at, :starts_at, registration_closes, starts_at)
    |> validate_datetime_order(:starts_at, :ends_at, starts_at, ends_at)
  end

  defp validate_datetime_order(changeset, field1, field2, datetime1, datetime2) do
    if datetime1 && datetime2 && DateTime.compare(datetime1, datetime2) != :lt do
      add_error(changeset, field2, "must be after #{field1}")
    else
      changeset
    end
  end

  defp validate_status_transition(changeset) do
    old_status = changeset.data.status
    new_status = get_change(changeset, :status)
    
    case {old_status, new_status} do
      {"draft", "live"} -> changeset
      {"draft", "cancelled"} -> changeset
      {"live", "completed"} -> changeset
      {"live", "cancelled"} -> changeset
      {same, same} -> changeset
      {nil, _} -> changeset
      _ -> add_error(changeset, :status, "invalid status transition from #{old_status} to #{new_status}")
    end
  end

  # Helper functions
  def display_name(%__MODULE__{name: name}), do: name

  def is_draft?(%__MODULE__{status: "draft"}), do: true
  def is_draft?(_), do: false

  def is_live?(%__MODULE__{status: "live"}), do: true
  def is_live?(_), do: false

  def is_completed?(%__MODULE__{status: "completed"}), do: true
  def is_completed?(_), do: false

  def is_cancelled?(%__MODULE__{status: "cancelled"}), do: true
  def is_cancelled?(_), do: false

  def is_full?(%__MODULE__{entries_count: count, max_entries: max}) when count >= max, do: true
  def is_full?(_), do: false

  def fill_percentage(%__MODULE__{entries_count: count, max_entries: max}) do
    if max > 0, do: Float.round(count / max * 100, 1), else: 0.0
  end

  def status_badge_class(%__MODULE__{status: status}) do
    case status do
      "draft" -> "bg-gray-100 text-gray-800"
      "live" -> "bg-green-100 text-green-800"
      "completed" -> "bg-blue-100 text-blue-800"
      "cancelled" -> "bg-red-100 text-red-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def type_badge_class(%__MODULE__{type: type}) do
    case type do
      "public" -> "bg-blue-100 text-blue-800"
      "private" -> "bg-purple-100 text-purple-800"
      "head_to_head" -> "bg-orange-100 text-orange-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def registration_status(%__MODULE__{} = contest) do
    now = DateTime.utc_now()
    
    cond do
      contest.registration_opens_at && DateTime.compare(now, contest.registration_opens_at) == :lt ->
        "not_opened"
      contest.registration_closes_at && DateTime.compare(now, contest.registration_closes_at) == :gt ->
        "closed"
      is_full?(contest) ->
        "full"
      true ->
        "open"
    end
  end
end