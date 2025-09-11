<script lang="ts">
	import { onMount } from 'svelte';
	import { contestsStore, matchesStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { walletStore } from '$lib/stores/wallet';
	import { isAuthenticated } from '$lib/stores';
	import LoginModal from '$lib/components/LoginModal.svelte';

	let searchQuery = '';
	let selectedFilter = 'all'; // all, free, paid, mega
	let selectedMatch = 'all';
	let filteredContests: any[] = [];
	let availableMatches: any[] = [];
	let showLoginModal = false;
	let loginModalConfig = {
		title: 'Login Required',
		message: 'Please login to join contests and start winning.',
		actionText: 'Join Contest'
	};

	onMount(async () => {
		await Promise.all([
			contestsStore.loadContests(),
			matchesStore.loadMatches()
		]);

		availableMatches = $matchesStore.matches.filter(match => match.status === 'upcoming');
		filterContests();
	});

	$: {
		// Reactive filtering when search or filters change
		filterContests();
	}

	function filterContests() {
		if (!$contestsStore.contests) return;

		let contests = [...$contestsStore.contests];

		// Filter by search query
		if (searchQuery.trim()) {
			contests = contests.filter(contest => 
				contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				contest.matchTitle.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Filter by contest type
		if (selectedFilter !== 'all') {
			contests = contests.filter(contest => {
				switch (selectedFilter) {
					case 'free':
						return contest.entryFee === 0;
					case 'paid':
						return contest.entryFee > 0 && contest.entryFee <= 100;
					case 'mega':
						return contest.entryFee > 100;
					default:
						return true;
				}
			});
		}

		// Filter by match
		if (selectedMatch !== 'all') {
			contests = contests.filter(contest => contest.matchId === selectedMatch);
		}

		// Sort by prize pool (highest first)
		contests.sort((a, b) => b.prizePool - a.prizePool);

		filteredContests = contests;
	}

	function joinContest(contest: any) {
		// Check if user is authenticated
		if (!$isAuthenticated) {
			loginModalConfig = {
				title: 'Join Contest',
				message: 'Create an account or login to join this contest.',
				actionText: 'Join Contest'
			};
			showLoginModal = true;
			return;
		}

		if (contest.isJoined) {
			goto(`/team-builder?contest=${contest.id}`);
		} else {
			// Show join confirmation or go to team builder
			goto(`/team-builder?contest=${contest.id}&join=true`);
		}
	}

	function getContestBadge(contest: any) {
		if (contest.entryFee === 0) return { text: 'FREE', class: 'bg-green-100 text-green-700' };
		if (contest.entryFee > 100) return { text: 'MEGA', class: 'bg-purple-100 text-purple-700' };
		return { text: 'PAID', class: 'bg-blue-100 text-blue-700' };
	}

	function getProgressPercentage(contest: any) {
		return Math.min((contest.participants / contest.maxParticipants) * 100, 100);
	}
</script>

<svelte:head>
	<title>Contests - PickNWin</title>
	<meta name="description" content="Join exciting fantasy cricket contests and win big prizes" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 pb-24">
	<!-- Header -->
	<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-8 mb-8 shadow-xl shadow-slate-200/50">
		<div class="text-center">
			<div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-400/25">
				<svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
				</svg>
			</div>
			<h1 class="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Contests</h1>
			<p class="text-slate-600 font-medium">Join contests and compete with other players</p>
			<div class="flex items-center justify-center space-x-4 mt-4">
				<div class="flex items-center space-x-2">
					<div class="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
					<span class="text-sm font-bold text-slate-600">Live Contests</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
					<span class="text-sm font-bold text-slate-600">Instant Join</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="mb-6">
		<div class="relative">
			<div class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center">
				<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search contests or matches..."
				class="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 font-medium text-slate-900 placeholder-slate-500"
			/>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-6 mb-8 shadow-xl shadow-slate-200/50">
		<div class="flex items-center space-x-4 mb-4">
			<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
				<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-900">Filter Contests</h3>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="relative">
				<label for="contest-type-select" class="block text-sm font-bold text-slate-700 mb-2">Contest Type</label>
				<select
					id="contest-type-select"
					bind:value={selectedFilter}
					class="w-full px-4 py-3 bg-white/90 border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 font-medium text-slate-900"
				>
					<option value="all">All Contests</option>
					<option value="free">Free</option>
					<option value="paid">Paid</option>
					<option value="mega">Mega</option>
				</select>
			</div>

			<div class="relative">
				<label for="match-select" class="block text-sm font-bold text-slate-700 mb-2">Match</label>
				<select
					id="match-select"
					bind:value={selectedMatch}
					class="w-full px-4 py-3 bg-white/90 border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 font-medium text-slate-900"
				>
					<option value="all">All Matches</option>
					{#each availableMatches as match}
						<option value={match.id}>{match.team1} vs {match.team2}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Contest Stats -->
	<div class="grid grid-cols-3 gap-4 mb-8">
		<div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 text-center shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
			<div class="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-lime-400/25 group-hover:scale-110 transition-transform duration-300">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="text-3xl font-black bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent mb-1">{filteredContests.length}</div>
			<div class="text-sm font-bold text-slate-600">Available</div>
		</div>
		<div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 text-center shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
			<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-400/25 group-hover:scale-110 transition-transform duration-300">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">{filteredContests.filter(c => c.isJoined).length}</div>
			<div class="text-sm font-bold text-slate-600">Joined</div>
		</div>
		<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-6 text-center shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 group">
			<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-400/25 group-hover:scale-110 transition-transform duration-300">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
				€{filteredContests.reduce((sum, c) => sum + (c.isJoined ? c.prizePool : 0), 0).toLocaleString()}
			</div>
			<div class="text-sm font-bold text-slate-600">Prize Pool</div>
		</div>
	</div>

	<!-- Contest List -->
	<div class="space-y-6">
		{#each filteredContests as contest}
			<div class="bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] group relative">
				<!-- Contest Header -->
				<div class="p-6 border-b border-slate-200/60">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-400/25">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.455-1.746-.721-2.517zm.286 1.961a.75.75 0 01.848.06 28.424 28.424 0 014.132 3.624 28.731 28.731 0 01-2.875 1.433.75.75 0 01-.84-.24c-1.005-1.275-2.478-2.438-4.26-3.468a29.663 29.663 0 01.995-1.409zm11.957-9.065a.75.75 0 00-.5-.865A39.537 39.537 0 0014 2.5c-.394 0-.787.036-1.177.11a.75.75 0 00-.57 1.05 28.37 28.37 0 013.832 5.545.75.75 0 001.177.225A39.627 39.627 0 0018.243 4.355z" clip-rule="evenodd" />
								</svg>
							</div>
							<h3 class="text-xl font-black text-slate-900">{contest.title}</h3>
						</div>
						<div class="flex items-center space-x-2">
							{#if contest.isJoined}
								<span class="text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-2xl font-bold shadow-lg shadow-emerald-400/25">
									✓ Joined
								</span>
							{/if}
							<span class="text-xs px-3 py-1.5 rounded-2xl font-bold shadow-lg {getContestBadge(contest).class}">
								{getContestBadge(contest).text}
							</span>
						</div>
					</div>
					<div class="flex items-center space-x-2">
						<div class="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center">
							<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
							</svg>
						</div>
						<p class="text-sm font-bold text-slate-600">{contest.matchTitle}</p>
					</div>
				</div>

				<!-- Contest Details -->
				<div class="p-6">
					<div class="grid grid-cols-2 gap-6 mb-6">
						<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30">
							<div class="flex items-center space-x-2 mb-2">
								<div class="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
									<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
									</svg>
								</div>
								<p class="text-xs font-bold text-emerald-700">Prize Pool</p>
							</div>
							<p class="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">€{contest.prizePool.toLocaleString()}</p>
						</div>
						<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30">
							<div class="flex items-center space-x-2 mb-2">
								<div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
									<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
									</svg>
								</div>
								<p class="text-xs font-bold text-blue-700">Entry Fee</p>
							</div>
							<p class="text-2xl font-black text-slate-900">
								{contest.entryFee === 0 ? 'FREE' : `€${contest.entryFee}`}
							</p>
						</div>
					</div>

					<!-- Progress Bar -->
					<div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border-2 border-slate-200/60 mb-6">
						<div class="flex items-center justify-between text-sm font-bold text-slate-700 mb-3">
							<span>{contest.participants} joined</span>
							<span>{contest.maxParticipants} spots</span>
						</div>
						<div class="w-full bg-slate-300 rounded-2xl h-3 shadow-inner">
							<div 
								class="bg-gradient-to-r from-lime-400 to-lime-500 h-3 rounded-2xl transition-all duration-500 shadow-lg shadow-lime-400/25"
								style="width: {getProgressPercentage(contest)}%"
							></div>
						</div>
					</div>

					<!-- Winnings Breakdown -->
					<div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200/60 mb-6">
						<div class="flex items-center space-x-2 mb-3">
							<div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
								<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424z" clip-rule="evenodd" />
								</svg>
							</div>
							<h4 class="text-sm font-bold text-purple-700">Winnings</h4>
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between text-sm">
								<span class="font-bold text-slate-700">1st Prize:</span>
								<span class="font-black text-slate-900">€{Math.floor(contest.prizePool * 0.4).toLocaleString()}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="font-bold text-slate-700">Winnings up to:</span>
								<span class="font-black text-slate-900">{Math.floor(contest.maxParticipants * 0.3)} ranks</span>
							</div>
						</div>
					</div>

					<!-- Action Button -->
					<button
					on:click={() => joinContest(contest)}
					class="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 {contest.isJoined ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-[4px_4px_8px_#64748b,inset_-2px_-2px_4px_#475569] hover:shadow-[6px_6px_12px_#64748b,inset_-3px_-3px_6px_#475569]' : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[4px_4px_8px_#10b981,inset_-2px_-2px_4px_#059669] hover:shadow-[6px_6px_12px_#10b981,inset_-3px_-3px_6px_#059669]'}"
				>
						<div class="flex items-center justify-center space-x-2">
							{#if contest.isJoined}
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								<span>View Team</span>
							{:else}
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
								</svg>
								<span>Join Contest {contest.entryFee > 0 ? `(€${contest.entryFee})` : '(FREE)'}</span>
							{/if}
						</div>
					</button>
				</div>
			</div>
		{/each}

		{#if filteredContests.length === 0}
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-12 text-center shadow-xl shadow-slate-200/50">
				<div class="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-400/25">
					<svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
					</svg>
				</div>
				<h3 class="text-2xl font-black text-slate-900 mb-3">No contests found</h3>
				<p class="text-slate-600 font-medium mb-8 max-w-md mx-auto">Try adjusting your filters or search terms to find the perfect contest for you</p>
				<button
					on:click={() => { searchQuery = ''; selectedFilter = 'all'; selectedMatch = 'all'; }}
					class="bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl shadow-lime-400/25 hover:shadow-lime-500/40 hover:scale-105"
				>
					<div class="flex items-center space-x-2">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
						</svg>
						<span>Clear Filters</span>
					</div>
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- Login Modal -->
<LoginModal
	bind:isOpen={showLoginModal}
	title={loginModalConfig.title}
	message={loginModalConfig.message}
	actionText={loginModalConfig.actionText}
	on:close={() => showLoginModal = false}
/>