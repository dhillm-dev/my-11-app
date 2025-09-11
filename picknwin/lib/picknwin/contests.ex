defmodule Picknwin.Contests do
  @moduledoc """
  The Contests context.
  """

  import Ecto.Query, warn: false
  alias Picknwin.Repo
  alias Picknwin.Contests.{Contest, Entry}
  alias Picknwin.Matches
  alias Picknwin.Audit

  @doc """
  Returns the list of contests.
  """
  def list_contests(opts \\\ []) do
    Contest
    |> apply_contest_filters(opts)
    |> Repo.all()
  end

  @doc """
  Returns published contests only.
  """
  def list_published_contests(opts \\\ []) do
    Contest.published_query()
    |> Contest.public_query()
    |> apply_contest_filters(opts)
    |> Repo.all()
  end

  @doc """
  Returns available contests (published and not full).
  """
  def list_available_contests(opts \\\ []) do
    Contest.available_query()
    |> apply_contest_filters(opts)
    |> Repo.all()
  end

  @doc """
  Gets a single contest.
  """
  def get_contest!(id), do: Repo.get!(Contest, id)

  def get_contest(id), do: Repo.get(Contest, id)

  @doc """
  Gets contest with preloaded associations.
  """
  def get_contest_with_match!(id) do
    Contest
    |> where([c], c.id == ^id)
    |> preload([:match, :entries])
    |> Repo.one!()
  end

  @doc """
  Creates a contest.
  """
  def create_contest(attrs \\\ %{}, creator) do
    attrs = Map.put(attrs, :created_by_id, creator.id)
    
    %Contest{}
    |> Contest.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, contest} ->
        Audit.log_action("contest_created", %{
          contest_id: contest.id,
          match_id: contest.match_id,
          template: contest.template
        }, creator)
        {:ok, contest}
      error -> error
    end
  end

  @doc """
  Creates contest from template.
  """
  def create_contest_from_template(match_id, template_name, creator, overrides \\\ %{}) do
    template = Contest.template_presets()[template_name]
    
    if template do
      attrs = 
        template
        |> Map.put(:match_id, match_id)
        |> Map.put(:template, template_name)
        |> Map.merge(overrides)
      
      create_contest(attrs, creator)
    else
      {:error, "Invalid template: #{template_name}"}
    end
  end

  @doc """
  Updates a contest.
  """
  def update_contest(%Contest{} = contest, attrs, actor) do
    contest
    |> Contest.changeset(attrs)
    |> Repo.update()
    |> case do
      {:ok, updated_contest} ->
        Audit.log_action("contest_updated", %{
          contest_id: contest.id,
          changes: attrs
        }, actor)
        {:ok, updated_contest}
      error -> error
    end
  end

  @doc """
  Updates contest status.
  """
  def update_contest_status(%Contest{} = contest, new_status, actor) do
    # Validate business rules
    with :ok <- validate_status_change(contest, new_status) do
      old_status = contest.status
      
      contest
      |> Contest.status_changeset(new_status, actor)
      |> Repo.update()
      |> case do
        {:ok, updated_contest} ->
          Audit.log_action("contest_status_changed", %{
            contest_id: contest.id,
            status_change: %{before: old_status, after: new_status}
          }, actor)
          {:ok, updated_contest}
        error -> error
      end
    end
  end

  @doc """
  Publishes a contest.
  """
  def publish_contest(%Contest{} = contest, actor) do
    with :ok <- validate_contest_for_publication(contest) do
      update_contest_status(contest, :published, actor)
    end
  end

  @doc """
  Locks a contest.
  """
  def lock_contest(%Contest{} = contest, actor) do
    update_contest_status(contest, :locked, actor)
  end

  @doc """
  Cancels a contest.
  """
  def cancel_contest(%Contest{} = contest, actor, reason \\\ nil) do
    attrs = if reason, do: %{cancel_reason: reason}, else: %{}
    
    contest
    |> Contest.changeset(attrs)
    |> Contest.status_changeset(:cancelled, actor)
    |> Repo.update()
    |> case do
      {:ok, cancelled_contest} ->
        Audit.log_action("contest_cancelled", %{
          contest_id: contest.id,
          reason: reason
        }, actor)
        {:ok, cancelled_contest}
      error -> error
    end
  end

  @doc """
  Deletes a contest.
  """
  def delete_contest(%Contest{} = contest, actor) do
    if contest.current_entries == 0 do
      Repo.delete(contest)
      |> case do
        {:ok, deleted_contest} ->
          Audit.log_action("contest_deleted", %{
            contest_id: contest.id
          }, actor)
          {:ok, deleted_contest}
        error -> error
      end
    else
      {:error, "Cannot delete contest with entries"}
    end
  end

  @doc """
  Clones a contest.
  """
  def clone_contest(%Contest{} = original, attrs \\\ %{}, creator) do
    clone_attrs = 
      original
      |> Map.take([
        :title, :description, :entry_fee, :prize_pool, :max_entries,
        :multi_entry, :max_entries_per_user, :visibility, :region,
        :template, :scoring_preset, :prize_structure, :rules
      ])
      |> Map.put(:title, "#{original.title} (Copy)")
      |> Map.put(:status, :draft)
      |> Map.put(:current_entries, 0)
      |> Map.merge(attrs)
    
    create_contest(clone_attrs, creator)
  end

  # Entry functions

  @doc """
  Creates a contest entry.
  """
  def create_entry(contest_id, user_id, team_id) do
    contest = get_contest!(contest_id)
    
    with :ok <- validate_entry_creation(contest, user_id) do
      entry_number = contest.current_entries + 1
      
      Multi.new()
      |> Multi.insert(:entry, Entry.changeset(%Entry{}, %{
        contest_id: contest_id,
        user_id: user_id,
        team_id: team_id,
        entry_number: entry_number
      }))
      |> Multi.update(:contest, Contest.entry_changeset(contest, 1))
      |> Repo.transaction()
      |> case do
        {:ok, %{entry: entry}} ->
          Audit.log_action("contest_entry_created", %{
            contest_id: contest_id,
            entry_id: entry.id,
            team_id: team_id
          }, %{id: user_id})
          {:ok, entry}
        {:error, _operation, changeset, _changes} ->
          {:error, changeset}
      end
    end
  end

  @doc """
  Gets contest entries.
  """
  def list_entries(contest_id, opts \\\ []) do
    Entry.by_contest_query(contest_id)
    |> apply_entry_filters(opts)
    |> Repo.all()
  end

  @doc """
  Gets contest leaderboard.
  """
  def get_leaderboard(contest_id) do
    Entry.leaderboard_query(contest_id)
    |> preload([:user, :team])
    |> Repo.all()
  end

  @doc """
  Updates entry scoring.
  """
  def update_entry_scoring(entry_id, points) do
    entry = Repo.get!(Entry, entry_id)
    
    entry
    |> Entry.scoring_changeset(%{total_points: points})
    |> Repo.update()
  end

  # Validation helpers

  defp validate_contest_for_publication(contest) do
    match = Matches.get_match!(contest.match_id)
    
    cond do
      match.curation_state != :curated ->
        {:error, "Match must be curated before publishing contest"}
      
      DateTime.compare(match.kickoff, DateTime.utc_now()) != :gt ->
        {:error, "Cannot publish contest for past matches"}
      
      true -> :ok
    end
  end

  defp validate_status_change(contest, new_status) do
    # Add business logic validation here
    :ok
  end

  defp validate_entry_creation(contest, user_id) do
    cond do
      contest.status != :published ->
        {:error, "Contest is not published"}
      
      contest.current_entries >= contest.max_entries ->
        {:error, "Contest is full"}
      
      !contest.multi_entry && user_has_entry?(contest.id, user_id) ->
        {:error, "User already has an entry in this contest"}
      
      true -> :ok
    end
  end

  defp user_has_entry?(contest_id, user_id) do
    Entry
    |> where([e], e.contest_id == ^contest_id and e.user_id == ^user_id)
    |> Repo.exists?()
  end

  # Filter helpers

  defp apply_contest_filters(query, []), do: query
  defp apply_contest_filters(query, [{:match_id, match_id} | rest]) do
    query
    |> Contest.by_match_query(match_id)
    |> apply_contest_filters(rest)
  end
  defp apply_contest_filters(query, [{:region, region} | rest]) do
    query
    |> Contest.by_region_query(region)
    |> apply_contest_filters(rest)
  end
  defp apply_contest_filters(query, [{:entry_fee_range, {min, max}} | rest]) do
    query
    |> Contest.by_entry_fee_range_query(min, max)
    |> apply_contest_filters(rest)
  end
  defp apply_contest_filters(query, [{:status, status} | rest]) do
    query
    |> where([c], c.status == ^status)
    |> apply_contest_filters(rest)
  end
  defp apply_contest_filters(query, [_unknown | rest]), do: apply_contest_filters(query, rest)

  defp apply_entry_filters(query, []), do: query
  defp apply_entry_filters(query, [{:user_id, user_id} | rest]) do
    query
    |> Entry.by_user_query(user_id)
    |> apply_entry_filters(rest)
  end
  defp apply_entry_filters(query, [_unknown | rest]), do: apply_entry_filters(query, rest)
end