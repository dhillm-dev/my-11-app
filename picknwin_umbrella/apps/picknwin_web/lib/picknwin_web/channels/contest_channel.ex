defmodule PicknwinWeb.ContestChannel do
  @moduledoc """
  Phoenix channel for real-time contest updates.
  
  Topics:
  - "contest:lobby:<id>" - Contest status and lock updates
  - "contest:leaderboard:<id>" - Real-time leaderboard updates
  """
  use PicknwinWeb, :channel
  
  alias Picknwin.Contests
  alias Picknwin.Leaderboard
  
  @doc """
  Join contest lobby for status updates.
  """
  def join("contest:lobby:" <> contest_id, _payload, socket) do
    case Contests.get_contest(contest_id) do
      {:ok, contest} ->
        socket = assign(socket, :contest_id, contest_id)
        send(self(), :after_join)
        {:ok, %{contest: contest}, socket}
      
      {:error, :not_found} ->
        {:error, %{reason: "Contest not found"}}
      
      {:error, reason} ->
        {:error, %{reason: to_string(reason)}}
    end
  end
  
  @doc """
  Join contest leaderboard for real-time ranking updates.
  """
  def join("contest:leaderboard:" <> contest_id, _payload, socket) do
    case Contests.get_contest(contest_id) do
      {:ok, contest} ->
        case contest.status do
          status when status in [:live, :completed] ->
            socket = assign(socket, :contest_id, contest_id)
            send(self(), :send_initial_leaderboard)
            {:ok, socket}
          
          _ ->
            {:error, %{reason: "Contest not started"}}
        end
      
      {:error, :not_found} ->
        {:error, %{reason: "Contest not found"}}
    end
  end
  
  def join("contest:" <> _rest, _payload, _socket) do
    {:error, %{reason: "Invalid contest topic"}}
  end
  
  @doc """
  Handle contest status requests.
  """
  def handle_in("get_status", _payload, socket) do
    contest_id = socket.assigns.contest_id
    
    case Contests.get_contest_status(contest_id) do
      {:ok, status} ->
        {:reply, {:ok, status}, socket}
      
      {:error, reason} ->
        {:reply, {:error, %{reason: to_string(reason)}}, socket}
    end
  end
  
  @doc """
  Handle leaderboard requests.
  """
  def handle_in("get_leaderboard", %{"limit" => limit}, socket) when is_integer(limit) do
    contest_id = socket.assigns.contest_id
    
    case Leaderboard.get_top_entries(contest_id, limit) do
      {:ok, entries} ->
        {:reply, {:ok, %{leaderboard: entries}}, socket}
      
      {:error, reason} ->
        {:reply, {:error, %{reason: to_string(reason)}}, socket}
    end
  end
  
  def handle_in("get_leaderboard", _payload, socket) do
    # Default to top 100
    handle_in("get_leaderboard", %{"limit" => 100}, socket)
  end
  
  @doc """
  Handle user rank requests.
  """
  def handle_in("get_user_rank", %{"user_id" => user_id}, socket) do
    contest_id = socket.assigns.contest_id
    
    case Leaderboard.get_user_rank(contest_id, user_id) do
      {:ok, rank_info} ->
        {:reply, {:ok, rank_info}, socket}
      
      {:error, reason} ->
        {:reply, {:error, %{reason: to_string(reason)}}, socket}
    end
  end
  
  @doc """
  Send initial data after joining.
  """
  def handle_info(:after_join, socket) do
    contest_id = socket.assigns.contest_id
    
    case Contests.get_contest_status(contest_id) do
      {:ok, status} ->
        push(socket, "status_update", status)
      
      {:error, _reason} ->
        # Log error but don't disconnect
        :ok
    end
    
    {:noreply, socket}
  end
  
  @doc """
  Send initial leaderboard after joining.
  """
  def handle_info(:send_initial_leaderboard, socket) do
    contest_id = socket.assigns.contest_id
    
    case Leaderboard.get_top_entries(contest_id, 100) do
      {:ok, entries} ->
        push(socket, "leaderboard_update", %{leaderboard: entries, type: "full"})
      
      {:error, _reason} ->
        # Log error but don't disconnect
        :ok
    end
    
    {:noreply, socket}
  end
  
  @doc """
  Broadcast contest status change to all lobby subscribers.
  """
  def broadcast_status_change(contest_id, status) do
    PicknwinWeb.Endpoint.broadcast!(
      "contest:lobby:#{contest_id}",
      "status_update",
      status
    )
  end
  
  @doc """
  Broadcast leaderboard update to all leaderboard subscribers.
  """
  def broadcast_leaderboard_update(contest_id, update_type, data) do
    PicknwinWeb.Endpoint.broadcast!(
      "contest:leaderboard:#{contest_id}",
      "leaderboard_update",
      Map.put(data, :type, update_type)
    )
  end
  
  @doc """
  Broadcast individual rank change.
  """
  def broadcast_rank_change(contest_id, user_id, rank_data) do
    PicknwinWeb.Endpoint.broadcast!(
      "contest:leaderboard:#{contest_id}",
      "rank_update",
      Map.put(rank_data, :user_id, user_id)
    )
  end
  
  @doc """
  Broadcast points update for a user.
  """
  def broadcast_points_update(contest_id, user_id, points_data) do
    PicknwinWeb.Endpoint.broadcast!(
      "contest:leaderboard:#{contest_id}",
      "points_update",
      %{
        user_id: user_id,
        points: points_data.total_points,
        breakdown: points_data.breakdown,
        timestamp: DateTime.utc_now()
      }
    )
  end
end