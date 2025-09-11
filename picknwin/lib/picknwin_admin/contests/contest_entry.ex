defmodule PicknwinAdmin.Contests.ContestEntry do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "contest_entries" do
    field :entry_number, :integer
    field :team_name, :string
    field :lineup, :map, default: %{}
    field :captain_id, :binary_id
    field :vice_captain_id, :binary_id
    field :total_points, :decimal, default: Decimal.new("0.0")
    field :rank, :integer
    field :prize_amount, :decimal, default: Decimal.new("0.0")
    field :is_winner, :boolean, default: false
    field :status, :string, default: "active"
    field :substitutions, :map, default: %{}
    field :metadata, :map, default: %{}
    
    # Relationships
    belongs_to :contest, PicknwinAdmin.Contests.Contest
    belongs_to :user, PicknwinAdmin.Users.User
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(contest_entry, attrs) do
    contest_entry
    |> cast(attrs, [
      :entry_number, :team_name, :lineup, :captain_id, :vice_captain_id,
      :total_points, :rank, :prize_amount, :is_winner, :status,
      :substitutions, :metadata, :contest_id, :user_id
    ])
    |> validate_required([:team_name, :lineup, :captain_id, :vice_captain_id, :contest_id, :user_id])
    |> validate_inclusion(:status, ["active", "disqualified", "withdrawn"])
    |> validate_number(:total_points, greater_than_or_equal_to: 0)
    |> validate_number(:prize_amount, greater_than_or_equal_to: 0)
    |> validate_lineup()
    |> validate_captain_selection()
    |> unique_constraint([:contest_id, :entry_number])
    |> foreign_key_constraint(:contest_id)
    |> foreign_key_constraint(:user_id)
  end

  @doc false
  def scoring_changeset(contest_entry, attrs) do
    contest_entry
    |> cast(attrs, [:total_points, :rank, :prize_amount, :is_winner])
    |> validate_number(:total_points, greater_than_or_equal_to: 0)
    |> validate_number(:rank, greater_than: 0)
    |> validate_number(:prize_amount, greater_than_or_equal_to: 0)
  end

  defp validate_lineup(changeset) do
    lineup = get_field(changeset, :lineup)
    
    if lineup && map_size(lineup) > 0 do
      # Basic lineup validation - can be expanded based on sport requirements
      required_positions = ["batsman", "bowler", "all_rounder", "wicket_keeper"]
      
      missing_positions = 
        required_positions
        |> Enum.reject(fn position -> Map.has_key?(lineup, position) end)
      
      if length(missing_positions) > 0 do
        add_error(changeset, :lineup, "missing required positions: #{Enum.join(missing_positions, ", ")}")
      else
        changeset
      end
    else
      add_error(changeset, :lineup, "cannot be empty")
    end
  end

  defp validate_captain_selection(changeset) do
    lineup = get_field(changeset, :lineup)
    captain_id = get_field(changeset, :captain_id)
    vice_captain_id = get_field(changeset, :vice_captain_id)
    
    cond do
      captain_id && vice_captain_id && captain_id == vice_captain_id ->
        add_error(changeset, :vice_captain_id, "cannot be the same as captain")
      
      lineup && captain_id && !player_in_lineup?(lineup, captain_id) ->
        add_error(changeset, :captain_id, "must be selected in lineup")
      
      lineup && vice_captain_id && !player_in_lineup?(lineup, vice_captain_id) ->
        add_error(changeset, :vice_captain_id, "must be selected in lineup")
      
      true ->
        changeset
    end
  end

  defp player_in_lineup?(lineup, player_id) do
    lineup
    |> Map.values()
    |> List.flatten()
    |> Enum.any?(fn player -> player["id"] == player_id end)
  end

  # Helper functions
  def display_name(%__MODULE__{team_name: name}), do: name

  def is_active?(%__MODULE__{status: "active"}), do: true
  def is_active?(_), do: false

  def is_disqualified?(%__MODULE__{status: "disqualified"}), do: true
  def is_disqualified?(_), do: false

  def is_withdrawn?(%__MODULE__{status: "withdrawn"}), do: true
  def is_withdrawn?(_), do: false

  def status_badge_class(%__MODULE__{status: status}) do
    case status do
      "active" -> "bg-green-100 text-green-800"
      "disqualified" -> "bg-red-100 text-red-800"
      "withdrawn" -> "bg-gray-100 text-gray-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def points_display(%__MODULE__{total_points: points}) do
    Decimal.to_string(points, :normal)
  end

  def prize_display(%__MODULE__{prize_amount: amount}) do
    if Decimal.compare(amount, Decimal.new(0)) == :gt do
      "₹#{Decimal.to_string(amount, :normal)}"
    else
      "-"
    end
  end

  def lineup_count(%__MODULE__{lineup: lineup}) do
    lineup
    |> Map.values()
    |> List.flatten()
    |> length()
  end
end