<script lang="ts">
	import { onMount } from 'svelte';
	import { matchesStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { _ } from 'svelte-i18n';

	let upcomingMatches: any[] = [];
	let liveMatches: any[] = [];
	let completedMatches: any[] = [];
	let activeTab = 'upcoming'; // upcoming, live, completed
	let searchQuery = '';
	let filteredMatches: any[] = [];

	onMount(async () => {
		await matchesStore.loadMatches();
		
		// Mock data for matches
		upcomingMatches = [
			{
				id: 1,
				team1: 'Manchester United',
				team2: 'Liverpool',
				team1Short: 'MUN',
				team2Short: 'LIV',
				team1Logo: '🔴',
				team2Logo: '🔴',
				date: '2025-01-09',
				time: '15:30',
				league: 'Premier League',
				status: 'upcoming',
				contests: 45,
				prizePool: 50000
			},
			{
				id: 2,
				team1: 'Chelsea',
				team2: 'Arsenal',
				team1Short: 'CHE',
				team2Short: 'ARS',
				team1Logo: '🔵',
				team2Logo: '🔴',
				date: '2025-01-10',
				time: '17:00',
				league: 'Premier League',
				status: 'upcoming',
				contests: 38,
				prizePool: 35000
			},
			{
				id: 3,
				team1: 'Real Madrid',
				team2: 'Barcelona',
				team1Short: 'RM',
				team2Short: 'BAR',
				team1Logo: '⚪',
				team2Logo: '🔵',
				date: '2025-01-12',
				time: '20:00',
				league: 'La Liga',
				status: 'upcoming',
				contests: 67,
				prizePool: 100000
			}
		];

		liveMatches = [
			{
				id: 4,
				team1: 'Bayern Munich',
				team2: 'Borussia Dortmund',
				team1Short: 'BAY',
				team2Short: 'BVB',
				team1Logo: '🔴',
				team2Logo: '🟡',
				date: '2025-01-08',
				time: 'LIVE',
				league: 'Bundesliga',
				status: 'live',
				contests: 52,
				prizePool: 75000,
				score: '2-1'
			}
		];

		completedMatches = [
			{
				id: 5,
				team1: 'PSG',
				team2: 'Marseille',
				team1Short: 'PSG',
				team2Short: 'OM',
				team1Logo: '🔵',
				team2Logo: '⚪',
				date: '2025-01-07',
				time: 'FT',
				league: 'Ligue 1',
				status: 'completed',
				contests: 29,
				prizePool: 25000,
				score: '3-0'
			}
		];

		filterMatches();
	});

	$: {
		filterMatches();
	}

	function filterMatches() {
		let matches = [];
		
		switch (activeTab) {
			case 'upcoming':
				matches = upcomingMatches;
				break;
			case 'live':
				matches = liveMatches;
				break;
			case 'completed':
				matches = completedMatches;
				break;
		}

		if (searchQuery.trim()) {
			matches = matches.filter(match => 
				match.team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
				match.team2.toLowerCase().includes(searchQuery.toLowerCase()) ||
				match.league.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		filteredMatches = matches;
	}

	function viewContests(matchId: number) {
		goto(`/contests?match=${matchId}`);
	}

	function createTeam(matchId: number) {
		goto(`/team-builder?match=${matchId}`);
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { 
			weekday: 'short', 
			month: 'short', 
			day: 'numeric' 
		});
	}
</script>

<svelte:head>
	<title>Matches - PickNWin</title>
	<meta name="description" content="View upcoming, live and completed matches" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 pb-24">
	<!-- Header -->
	<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-8 mb-8 shadow-xl shadow-slate-200/50">
		<div class="text-center">
			<div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-400/25">
				<span class="text-3xl">⚽</span>
			</div>
			<h1 class="text-4xl font-black text-slate-900 mb-2">Matches</h1>
			<p class="text-slate-600 font-medium">View upcoming, live and completed matches</p>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-6 mb-8 shadow-xl shadow-slate-200/50">
		<div class="relative">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search matches, teams or leagues..."
				class="w-full px-6 py-4 pl-14 bg-white/90 border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 transition-all duration-300 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 font-medium text-slate-900 placeholder-slate-500"
			/>
			<div class="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-2 mb-8 shadow-xl shadow-slate-200/50">
		<div class="flex space-x-2">
			<button
				on:click={() => activeTab = 'upcoming'}
				class="flex-1 px-6 py-3 rounded-2xl font-bold transition-all duration-300 {activeTab === 'upcoming' ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg shadow-lime-400/25' : 'text-slate-600 hover:bg-slate-100'}"
			>
				Upcoming ({upcomingMatches.length})
			</button>
			<button
				on:click={() => activeTab = 'live'}
				class="flex-1 px-6 py-3 rounded-2xl font-bold transition-all duration-300 {activeTab === 'live' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-400/25' : 'text-slate-600 hover:bg-slate-100'}"
			>
				Live ({liveMatches.length})
			</button>
			<button
				on:click={() => activeTab = 'completed'}
				class="flex-1 px-6 py-3 rounded-2xl font-bold transition-all duration-300 {activeTab === 'completed' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-400/25' : 'text-slate-600 hover:bg-slate-100'}"
			>
				Completed ({completedMatches.length})
			</button>
		</div>
	</div>

	<!-- Matches List -->
	<div class="space-y-6">
		{#each filteredMatches as match}
			<div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center space-x-6">
						<div class="text-center relative">
							<div class="flex items-center space-x-4">
								<div class="text-center">
									<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-400/25">
										<span class="text-white font-black text-lg">{match.team1Short}</span>
									</div>
									<p class="font-black text-sm text-slate-900">{match.team1Short}</p>
								</div>
								<div class="flex flex-col items-center px-4">
									{#if match.status === 'live'}
										<div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-1 animate-pulse">
											<span class="text-white font-bold text-xs">●</span>
										</div>
										<span class="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">LIVE</span>
										{#if match.score}
											<span class="text-sm font-bold text-slate-700 mt-1">{match.score}</span>
										{/if}
									{:else if match.status === 'completed'}
										<div class="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mb-1">
											<span class="text-white font-bold text-xs">FT</span>
										</div>
										<span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">FINISHED</span>
										{#if match.score}
											<span class="text-sm font-bold text-slate-700 mt-1">{match.score}</span>
										{/if}
									{:else}
										<div class="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mb-1">
											<span class="text-white font-bold text-xs">VS</span>
										</div>
										<span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{match.time}</span>
									{/if}
								</div>
								<div class="text-center">
									<div class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-red-400/25">
										<span class="text-white font-black text-lg">{match.team2Short}</span>
									</div>
									<p class="font-black text-sm text-slate-900">{match.team2Short}</p>
								</div>
							</div>
						</div>
					</div>
					<div class="text-right">
						<div class="text-xs font-bold text-slate-500 mb-1">{match.league}</div>
						<div class="text-sm font-bold text-slate-700">{formatDate(match.date)}</div>
					</div>
				</div>

				<!-- Match Stats -->
				<div class="flex items-center justify-between mb-4 pt-4 border-t border-slate-200/60">
					<div class="flex space-x-6">
						<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 text-center">
						<div class="text-2xl font-black text-slate-900">{match.contests}</div>
						<div class="text-xs font-bold text-slate-500">Contests</div>
					</div>
					<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 text-center">
						<div class="text-2xl font-black text-green-600">€{match.prizePool.toLocaleString()}</div>
						<div class="text-xs font-bold text-slate-500">Prize Pool</div>
					</div>
					</div>
				</div>

				<!-- Action Buttons -->
				{#if match.status === 'upcoming'}
					<div class="flex space-x-4">
						<button
							on:click={() => viewContests(match.id)}
							class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-400/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
						>
							View Contests
						</button>
						<button
							on:click={() => createTeam(match.id)}
							class="flex-1 bg-gradient-to-r from-lime-500 to-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-lime-400/25 hover:shadow-lime-500/40 hover:scale-105 transition-all duration-300"
						>
							Create Team
						</button>
					</div>
				{:else if match.status === 'live'}
					<div class="flex space-x-4">
						<button
							on:click={() => viewContests(match.id)}
							class="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-400/25 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300"
						>
							Watch Live
						</button>
					</div>
				{:else}
					<div class="flex space-x-4">
						<button
							class="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-slate-400/25 cursor-not-allowed opacity-75"
							disabled
						>
							Match Finished
						</button>
					</div>
				{/if}
			</div>
		{/each}

		{#if filteredMatches.length === 0}
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-12 text-center shadow-xl shadow-slate-200/50">
				<div class="w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
					<span class="text-3xl">🔍</span>
				</div>
				<h3 class="text-2xl font-black text-slate-900 mb-2">No matches found</h3>
				<p class="text-slate-600 font-medium mb-6">Try adjusting your search or check back later</p>
				<button
					on:click={() => { searchQuery = ''; activeTab = 'upcoming'; }}
					class="bg-gradient-to-r from-lime-500 to-green-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-lime-400/25 hover:shadow-lime-500/40 hover:scale-105 transition-all duration-300"
				>
					Clear Filters
				</button>
			</div>
		{/if}
	</div>
</div>