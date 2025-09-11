defmodule Picknwin.Contests.Contest do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "contests" do
    field :title, :string
    field :description, :string
    field :entry_fee, :decimal
    field :prize_pool, :decimal
    field :max_entries, :integer
    field :current_entries, :integer, default: 0
    field :multi_entry, :boolean, default: false
    field :max_entries_per_user, :integer, default: 1
    field :visibility, Ecto.Enum, values: [:public, :private, :invite_only], default: :public
    field :region, :string
    field :status, Ecto.Enum, values: [
      :draft, :published, :locked, :live, :finished, :cancelled
    ], default: :draft
    field :template, :string
    field :scoring_preset, :string, default: "standard"
    field :prize_structure, :map, default: %{}
    field :rules, :map, default: %{}
    field :metadata, :map, default: %{}
    
    # Lifecycle timestamps
    field :published_at, :utc_datetime
    field :locked_at, :utc_datetime
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime
    field :cancelled_at, :utc_datetime
    field :cancel_reason, :string
    
    # Admin fields
    field :created_by_id, :binary_id
    field :published_by_id, :binary_id
    field :locked_by_id, :binary_id
    field :cancelled_by_id, :binary_id

    belongs_to :match, Picknwin.Matches.Match
    belongs_to :created_by, Picknwin.Accounts.User, foreign_key: :created_by_id, define_field: false
    belongs_to :published_by, Picknwin.Accounts.User, foreign_key: :published_by_id, define_field: false
    belongs_to :locked_by, Picknwin.Accounts.User, foreign_key: :locked_by_id, define_field: false
    belongs_to :cancelled_by, Picknwin.Accounts.User, foreign_key: :cancelled_by_id, define_field: false
    
    has_many :entries, Picknwin.Contests.Entry
    has_many :participants, through: [:entries, :user]

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(contest, attrs) do
    contest
    |> cast(attrs, [
      :title, :description, :entry_fee, :prize_pool, :max_entries,
      :multi_entry, :max_entries_per_user, :visibility, :region,
      :template, :scoring_preset, :prize_structure, :rules, :metadata,
      :match_id, :created_by_id
    ])
    |> validate_required([
      :title, :entry_fee, :prize_pool, :max_entries, :match_id, :created_by_id
    ])
    |> validate_number(:entry_fee, greater_than_or_equal_to: 0)
    |> validate_number(:prize_pool, greater_than: 0)
    |> validate_number(:max_entries, greater_than: 0)
    |> validate_number(:max_entries_per_user, greater_than: 0)
    |> validate_inclusion(:visibility, [:public, :private, :invite_only])
    |> validate_inclusion(:status, [:draft, :published, :locked, :live, :finished, :cancelled])
    |> foreign_key_constraint(:match_id)
    |> foreign_key_constraint(:created_by_id)
    |> validate_multi_entry_logic()
  end

  @doc false
  def status_changeset(contest, new_status, actor) do
    contest
    |> cast(%{status: new_status}, [:status])
    |> validate_required([:status])
    |> validate_status_transition(contest.status, new_status)
    |> put_status_fields(new_status, actor)
  end

  @doc false
  def entry_changeset(contest, entry_change) do
    new_count = contest.current_entries + entry_change
    
    contest
    |> cast(%{current_entries: new_count}, [:current_entries])
    |> validate_number(:current_entries, greater_than_or_equal_to: 0)
    |> validate_max_entries()
  end

  defp validate_multi_entry_logic(changeset) do
    multi_entry = get_field(changeset, :multi_entry)
    max_entries_per_user = get_field(changeset, :max_entries_per_user)
    
    if multi_entry && max_entries_per_user == 1 do
      add_error(changeset, :max_entries_per_user, "must be greater than 1 for multi-entry contests")
    else
      changeset
    end
  end

  defp validate_status_transition(changeset, current_status, new_status) do
    valid_transitions = %{
      :draft => [:published, :cancelled],
      :published => [:locked, :cancelled],
      :locked => [:live, :cancelled],
      :live => [:finished],
      :finished => [],
      :cancelled => []
    }
    
    if new_status in Map.get(valid_transitions, current_status, []) do
      changeset
    else
      add_error(changeset, :status, "invalid status transition from #{current_status} to #{new_status}")
    end
  end

  defp put_status_fields(changeset, new_status, actor) do
    now = DateTime.utc_now()
    
    case new_status do
      :published ->
        changeset
        |> put_change(:published_at, now)
        |> put_change(:published_by_id, actor.id)
      
      :locked ->
        changeset
        |> put_change(:locked_at, now)
        |> put_change(:locked_by_id, actor.id)
      
      :live ->
        changeset
        |> put_change(:started_at, now)
      
      :finished ->
        changeset
        |> put_change(:finished_at, now)
      
      :cancelled ->
        changeset
        |> put_change(:cancelled_at, now)
        |> put_change(:cancelled_by_id, actor.id)
      
      _ -> changeset
    end
  end

  defp validate_max_entries(changeset) do
    current_entries = get_field(changeset, :current_entries)
    max_entries = get_field(changeset, :max_entries)
    
    if current_entries > max_entries do
      add_error(changeset, :current_entries, "cannot exceed max entries")
    else
      changeset
    end
  end

  # Query helpers

  def published_query do
    from c in __MODULE__,
      where: c.status == :published
  end

  def public_query do
    from c in __MODULE__,
      where: c.visibility == :public
  end

  def by_match_query(match_id) do
    from c in __MODULE__,
      where: c.match_id == ^match_id
  end

  def by_region_query(region) do
    from c in __MODULE__,
      where: c.region == ^region
  end

  def by_entry_fee_range_query(min_fee, max_fee) do
    from c in __MODULE__,
      where: c.entry_fee >= ^min_fee and c.entry_fee <= ^max_fee
  end

  def available_query do
    from c in __MODULE__,
      where: c.status == :published,
      where: c.current_entries < c.max_entries
  end

  def template_presets do
    %{
      "Free" => %{
        entry_fee: Decimal.new("0.00"),
        prize_pool: Decimal.new("100.00"),
        max_entries: 1000,
        multi_entry: false,
        visibility: :public,
        scoring_preset: "standard"
      },
      "Starter" => %{
        entry_fee: Decimal.new("1.00"),
        prize_pool: Decimal.new("500.00"),
        max_entries: 500,
        multi_entry: false,
        visibility: :public,
        scoring_preset: "standard"
      },
      "Classic" => %{
        entry_fee: Decimal.new("5.00"),
        prize_pool: Decimal.new("2000.00"),
        max_entries: 400,
        multi_entry: true,
        max_entries_per_user: 3,
        visibility: :public,
        scoring_preset: "standard"
      },
      "High Roller" => %{
        entry_fee: Decimal.new("25.00"),
        prize_pool: Decimal.new("5000.00"),
        max_entries: 200,
        multi_entry: true,
        max_entries_per_user: 5,
        visibility: :public,
        scoring_preset: "premium"
      }
    }
  end
end