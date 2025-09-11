defmodule PicknwinAdmin.Players.Player do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "players" do
    field :external_id, :string
    field :name, :string
    field :short_name, :string
    field :position, :string
    field :team, :string
    field :jersey_number, :integer
    field :country, :string
    field :age, :integer
    field :batting_style, :string
    field :bowling_style, :string
    field :credits, :decimal, default: Decimal.new("8.5")
    field :fantasy_points, :decimal, default: Decimal.new("0.0")
    field :selected_by_percentage, :decimal, default: Decimal.new("0.0")
    field :is_playing_eleven, :boolean, default: false
    field :is_captain_choice, :boolean, default: false
    field :is_vice_captain_choice, :boolean, default: false
    field :injury_status, :string
    field :form_rating, :decimal
    field :recent_performance, :map, default: %{}
    field :season_stats, :map, default: %{}
    field :metadata, :map, default: %{}
    
    # Relationships
    belongs_to :match, PicknwinAdmin.Matches.Match
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(player, attrs) do
    player
    |> cast(attrs, [
      :external_id, :name, :short_name, :position, :team, :jersey_number,
      :country, :age, :batting_style, :bowling_style, :credits, :fantasy_points,
      :selected_by_percentage, :is_playing_eleven, :is_captain_choice,
      :is_vice_captain_choice, :injury_status, :form_rating,
      :recent_performance, :season_stats, :metadata, :match_id
    ])
    |> validate_required([:external_id, :name, :position, :team, :match_id])
    |> validate_inclusion(:position, ["batsman", "bowler", "all_rounder", "wicket_keeper"])
    |> validate_inclusion(:batting_style, ["right_handed", "left_handed", nil])
    |> validate_inclusion(:bowling_style, [
      "right_arm_fast", "left_arm_fast", "right_arm_medium", "left_arm_medium",
      "right_arm_off_spin", "left_arm_orthodox", "right_arm_leg_spin", "left_arm_chinaman",
      nil
    ])
    |> validate_inclusion(:injury_status, ["fit", "doubtful", "injured", nil])
    |> validate_number(:credits, greater_than: 0, less_than_or_equal_to: 15)
    |> validate_number(:fantasy_points, greater_than_or_equal_to: 0)
    |> validate_number(:selected_by_percentage, greater_than_or_equal_to: 0, less_than_or_equal_to: 100)
    |> validate_number(:age, greater_than: 15, less_than: 50)
    |> validate_number(:jersey_number, greater_than: 0, less_than: 100)
    |> validate_number(:form_rating, greater_than_or_equal_to: 0, less_than_or_equal_to: 10)
    |> unique_constraint([:external_id, :match_id])
    |> foreign_key_constraint(:match_id)
  end

  @doc false
  def points_changeset(player, attrs) do
    player
    |> cast(attrs, [:fantasy_points])
    |> validate_number(:fantasy_points, greater_than_or_equal_to: 0)
  end

  @doc false
  def playing_eleven_changeset(player, attrs) do
    player
    |> cast(attrs, [:is_playing_eleven])
    |> validate_required([:is_playing_eleven])
  end

  @doc false
  def selection_changeset(player, attrs) do
    player
    |> cast(attrs, [:selected_by_percentage, :is_captain_choice, :is_vice_captain_choice])
    |> validate_number(:selected_by_percentage, greater_than_or_equal_to: 0, less_than_or_equal_to: 100)
  end

  # Helper functions
  def display_name(%__MODULE__{name: name}), do: name

  def short_display_name(%__MODULE__{short_name: short_name, name: name}) do
    short_name || name
  end

  def is_playing_eleven?(%__MODULE__{is_playing_eleven: true}), do: true
  def is_playing_eleven?(_), do: false

  def is_injured?(%__MODULE__{injury_status: "injured"}), do: true
  def is_injured?(_), do: false

  def is_doubtful?(%__MODULE__{injury_status: "doubtful"}), do: true
  def is_doubtful?(_), do: false

  def is_fit?(%__MODULE__{injury_status: status}) when status in ["fit", nil], do: true
  def is_fit?(_), do: false

  def position_badge_class(%__MODULE__{position: position}) do
    case position do
      "batsman" -> "bg-blue-100 text-blue-800"
      "bowler" -> "bg-red-100 text-red-800"
      "all_rounder" -> "bg-green-100 text-green-800"
      "wicket_keeper" -> "bg-purple-100 text-purple-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def injury_status_badge_class(%__MODULE__{injury_status: status}) do
    case status do
      "fit" -> "bg-green-100 text-green-800"
      "doubtful" -> "bg-yellow-100 text-yellow-800"
      "injured" -> "bg-red-100 text-red-800"
      _ -> "bg-gray-100 text-gray-800"
    end
  end

  def credits_display(%__MODULE__{credits: credits}) do
    Decimal.to_string(credits, :normal)
  end

  def points_display(%__MODULE__{fantasy_points: points}) do
    Decimal.to_string(points, :normal)
  end

  def selection_percentage_display(%__MODULE__{selected_by_percentage: percentage}) do
    "#{Decimal.to_string(percentage, :normal)}%"
  end

  def form_rating_display(%__MODULE__{form_rating: nil}), do: "N/A"
  def form_rating_display(%__MODULE__{form_rating: rating}) do
    Decimal.to_string(rating, :normal)
  end

  def form_rating_class(%__MODULE__{form_rating: nil}), do: "text-gray-500"
  def form_rating_class(%__MODULE__{form_rating: rating}) do
    cond do
      Decimal.compare(rating, Decimal.new("7.5")) != :lt -> "text-green-600"
      Decimal.compare(rating, Decimal.new("5.0")) != :lt -> "text-yellow-600"
      true -> "text-red-600"
    end
  end

  def captain_choice_indicator(%__MODULE__{is_captain_choice: true}), do: "⭐"
  def captain_choice_indicator(_), do: ""

  def vice_captain_choice_indicator(%__MODULE__{is_vice_captain_choice: true}), do: "🌟"
  def vice_captain_choice_indicator(_), do: ""

  def playing_eleven_indicator(%__MODULE__{is_playing_eleven: true}), do: "✅"
  def playing_eleven_indicator(_), do: "❌"

  def team_short_name(%__MODULE__{team: team}) do
    team
    |> String.split(" ")
    |> Enum.map(&String.first/1)
    |> Enum.join()
    |> String.upcase()
  end

  def recent_form(%__MODULE__{recent_performance: performance}) when map_size(performance) > 0 do
    performance
    |> Map.get("last_5_matches", [])
    |> Enum.take(5)
    |> Enum.map(fn match -> Map.get(match, "points", 0) end)
    |> Enum.sum()
    |> Kernel./(5)
    |> Float.round(1)
  end
  def recent_form(_), do: 0.0

  def season_average(%__MODULE__{season_stats: stats}) when map_size(stats) > 0 do
    matches_played = Map.get(stats, "matches_played", 0)
    total_points = Map.get(stats, "total_points", 0)
    
    if matches_played > 0 do
      Float.round(total_points / matches_played, 1)
    else
      0.0
    end
  end
  def season_average(_), do: 0.0
end