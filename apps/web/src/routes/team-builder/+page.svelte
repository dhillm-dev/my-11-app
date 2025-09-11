<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { teamsStore, matchesStore, contestsStore } from '$lib/stores';
	import { isAuthenticated } from '$lib/stores';
	import { _ } from 'svelte-i18n';
	import AIService from '$lib/services/aiService';
	import LoginModal from '$lib/components/LoginModal.svelte';

	let selectedMatch: any = null;
	let selectedContest: any = null;
	let availablePlayers: any[] = [];
	let selectedPlayers: any[] = [];
	let captain: any = null;
	let viceCaptain: any = null;
	let teamName = '';
	let credits = 100;
	let usedCredits = 0;
	let activeTab = 'GK'; // GK, DEF, MID, FWD

	// AI suggestions state
	let aiSuggestions: any = null;
	let isLoadingAI = false;
	let showAIPanel = false;
	let aiAnalysis: any = null;
	let selectedPlayerForAnalysis: any = null;

	// Login modal state
	let showLoginModal = false;
	let loginModalConfig = {
		title: 'Login Required',
		message: 'Please login to build your dream team.',
		actionText: 'Build Team'
	};

	const playerTypes = [
		{ key: 'GK', label: 'Goalkeeper', min: 1, max: 1 },
		{ key: 'DEF', label: 'Defender', min: 3, max: 5 },
		{ key: 'MID', label: 'Midfielder', min: 3, max: 5 },
		{ key: 'FWD', label: 'Forward', min: 1, max: 3 }
	];

	onMount(async () => {
		await Promise.all([
			matchesStore.loadMatches(),
			contestsStore.loadContests()
		]);

		// Get contest and match from URL params
		const contestId = $page.url.searchParams.get('contest');
		const matchId = $page.url.searchParams.get('match');

		if (contestId) {
			selectedContest = $contestsStore.contests?.find(c => c.id === contestId);
			if (selectedContest) {
				selectedMatch = $matchesStore.matches?.find(m => m.id === selectedContest.matchId);
			}
		} else if (matchId) {
			selectedMatch = $matchesStore.matches?.find(m => m.id === matchId);
		}

		if (selectedMatch) {
			loadPlayersForMatch();
		}
	});

	function loadPlayersForMatch() {
		if (!selectedMatch || !selectedMatch.players) return;

		// Get players from the match
		availablePlayers = selectedMatch.players;

		// Generate team name suggestion
		if (!teamName && selectedMatch.team1 && selectedMatch.team2) {
			teamName = `${selectedMatch.team1.slice(0, 3)}${selectedMatch.team2.slice(0, 3)}_T1`;
		}
	}

	function getPlayersByType(type: string) {
		return availablePlayers.filter(player => player.position === type);
	}

	function getSelectedPlayersByType(type: string) {
		return selectedPlayers.filter(player => player.position === type);
	}

	function togglePlayer(player: any) {
		// Check if user is authenticated
		if (!$isAuthenticated) {
			loginModalConfig = {
				title: 'Login Required',
				message: 'Please login to select players and build your team.',
				actionText: 'Select Players'
			};
			showLoginModal = true;
			return;
		}

		const isSelected = selectedPlayers.find(p => p.id === player.id);
		
		if (isSelected) {
			// Remove player
			selectedPlayers = selectedPlayers.filter(p => p.id !== player.id);
			if (captain?.id === player.id) captain = null;
			if (viceCaptain?.id === player.id) viceCaptain = null;
		} else {
			// Add player (check constraints)
			if (selectedPlayers.length >= 11) {
				alert('You can only select 11 players');
				return;
			}

			const typeConfig = playerTypes.find(t => t.key === player.position);
			if (!typeConfig) {
				alert('Invalid player position');
				return;
			}
			
			const currentCount = getSelectedPlayersByType(player.position).length;
			
			if (currentCount >= typeConfig.max) {
				alert(`You can only select ${typeConfig.max} ${typeConfig.label}s`);
				return;
			}

			if (usedCredits + player.credits > credits) {
				alert('Not enough credits remaining');
				return;
			}

			selectedPlayers = [...selectedPlayers, player];
		}

		// Recalculate credits
		usedCredits = selectedPlayers.reduce((sum, p) => sum + p.credits, 0);
	}

	function setCaptain(player: any) {
		// Check if user is authenticated
		if (!$isAuthenticated) {
			loginModalConfig = {
				title: 'Login Required',
				message: 'Please login to select captain and vice captain.',
				actionText: 'Select Captain'
			};
			showLoginModal = true;
			return;
		}

		if (captain?.id === player.id) {
			captain = null;
		} else {
			captain = player;
			if (viceCaptain?.id === player.id) {
				viceCaptain = null;
			}
		}
	}

	function setViceCaptain(player: any) {
		// Check if user is authenticated
		if (!$isAuthenticated) {
			loginModalConfig = {
				title: 'Login Required',
				message: 'Please login to select captain and vice captain.',
				actionText: 'Select Vice Captain'
			};
			showLoginModal = true;
			return;
		}

		if (viceCaptain?.id === player.id) {
			viceCaptain = null;
		} else {
			viceCaptain = player;
			if (captain?.id === player.id) {
				captain = null;
			}
		}
	}

	// AI suggestion functions
	async function getAISuggestions() {
		if (!selectedMatch || !availablePlayers.length) return;
		
		isLoadingAI = true;
		try {
			aiSuggestions = await AIService.generateTeamSuggestions(
				selectedMatch,
				availablePlayers,
				credits
			);
			showAIPanel = true;
		} catch (error) {
			console.error('AI suggestions failed:', error);
		} finally {
			isLoadingAI = false;
		}
	}

	async function getPlayerAnalysis(player: any) {
		if (!selectedMatch) return;
		
		selectedPlayerForAnalysis = player;
		try {
			aiAnalysis = await AIService.getPlayerAnalysis(player, selectedMatch);
		} catch (error) {
			console.error('Player analysis failed:', error);
		}
	}

	function applyAISuggestions() {
		if (!aiSuggestions) return;
		
		// Clear current selection
		selectedPlayers = [];
		captain = null;
		viceCaptain = null;
		
		// Apply AI suggestions
		selectedPlayers = [...aiSuggestions.suggestions];
		captain = aiSuggestions.captainSuggestion;
		viceCaptain = aiSuggestions.viceCaptainSuggestion;
		
		// Recalculate credits
		usedCredits = selectedPlayers.reduce((sum, p) => sum + p.credits, 0);
		
		showAIPanel = false;
	}

	function validateTeam() {
		if (selectedPlayers.length !== 11) {
			return 'Please select exactly 11 players';
		}

		for (const type of playerTypes) {
			const count = getSelectedPlayersByType(type.key).length;
			if (count < type.min) {
				return `Select at least ${type.min} ${type.label}${type.min > 1 ? 's' : ''}`;
			}
		}

		if (!captain) {
			return 'Please select a captain';
		}

		if (!viceCaptain) {
			return 'Please select a vice captain';
		}

		if (!teamName.trim()) {
			return 'Please enter a team name';
		}

		return null;
	}

	async function saveTeam() {
		// Check if user is authenticated
		if (!$isAuthenticated) {
			loginModalConfig = {
				title: 'Save Team',
				message: 'Please login to save your team and join contests.',
				actionText: 'Save Team'
			};
			showLoginModal = true;
			return;
		}

		const error = validateTeam();
		if (error) {
			alert(error);
			return;
		}

		const team = {
			id: Date.now().toString(),
			name: teamName,
			matchId: selectedMatch.id,
			contestId: selectedContest?.id,
			players: selectedPlayers,
			captain,
			viceCaptain,
			totalCredits: credits,
			creditsUsed: usedCredits,
			createdAt: new Date().toISOString()
		};

		await teamsStore.saveTeam(team);

		if (selectedContest) {
			// Join contest if coming from contest page
			await contestsStore.joinContest(selectedContest.id, team.id);
			goto('/contests');
		} else {
			goto('/dashboard');
		}
	}

	function getPlayerTeamName(player: any) {
		if (!selectedMatch) return '';
		return player.teamId === selectedMatch.team1Id ? selectedMatch.team1 : selectedMatch.team2;
	}
</script>

<svelte:head>
	<title>Team Builder - PickNWin</title>
	<meta name="description" content="Build your fantasy cricket team and compete" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 pb-20">
	<!-- Header -->
	<div class="bg-white/80 backdrop-blur-sm border-b-2 border-slate-200/60 p-6 shadow-xl shadow-slate-200/50">
		<div class="flex items-center justify-between mb-4">
			<button on:click={() => goto('/contests')} class="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 hover:scale-105 transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-slate-900 group">
				<svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<div class="text-center">
				<h1 class="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Create Team</h1>
				<div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto mt-2"></div>
			</div>
			<div class="w-12"></div>
		</div>

		{#if selectedMatch}
			<div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 p-4 shadow-lg shadow-slate-200/25">
				<div class="text-center">
					<div class="flex items-center justify-center space-x-4 mb-2">
						<div class="flex items-center space-x-2">
							<div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/25">
						<span class="text-white font-black text-xs">{selectedMatch.team1?.substring(0, 2) || 'T1'}</span>
					</div>
					<span class="font-black text-slate-900">{selectedMatch.team1 || 'Team 1'}</span>
						</div>
						<div class="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
							<span class="text-white font-bold text-xs">VS</span>
						</div>
						<div class="flex items-center space-x-2">
							<span class="font-black text-slate-900">{selectedMatch.team2 || 'Team 2'}</span>
					<div class="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-400/25">
						<span class="text-white font-black text-xs">{selectedMatch.team2?.substring(0, 2) || 'T2'}</span>
					</div>
						</div>
					</div>
					<p class="text-sm font-medium text-slate-600">{new Date(selectedMatch.startTime).toLocaleDateString()}</p>
					<div class="mt-2 flex items-center justify-center space-x-2">
						<span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Live Match</span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Team Stats -->
	<div class="bg-white/80 backdrop-blur-sm border-b-2 border-slate-200/60 p-6 shadow-xl shadow-slate-200/50">
		<div class="grid grid-cols-3 gap-4 mb-6">
			<div class="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 p-4 text-center hover:scale-105 transition-transform duration-300">
				<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-400/25">
					<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
					</svg>
				</div>
				<div class="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{selectedPlayers.length}/11</div>
				<div class="text-xs font-bold text-slate-600">Players</div>
				<div class="mt-2">
					<div class="w-full bg-slate-200 rounded-full h-2">
						<div class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300" style="width: {(selectedPlayers.length / 11) * 100}%"></div>
					</div>
				</div>
			</div>
			<div class="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 p-4 text-center hover:scale-105 transition-transform duration-300">
				<div class="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-lime-400/25">
					<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
					</svg>
				</div>
				<div class="text-2xl font-black bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">{credits - usedCredits}</div>
				<div class="text-xs font-bold text-slate-600">Credits Left</div>
				<div class="mt-2">
					<div class="w-full bg-slate-200 rounded-full h-2">
						<div class="bg-gradient-to-r from-lime-400 to-lime-500 h-2 rounded-full transition-all duration-300" style="width: {((credits - usedCredits) / credits) * 100}%"></div>
					</div>
				</div>
			</div>
			<div class="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 p-4 text-center hover:scale-105 transition-transform duration-300">
				<div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-400/25">
					<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="text-lg font-black text-slate-900 flex items-center justify-center space-x-2">
					<span class="{captain ? 'text-yellow-600' : 'text-slate-400'}">{captain ? '👑' : '👑'}</span>
					<span class="{viceCaptain ? 'text-blue-600' : 'text-slate-400'}">{viceCaptain ? '🥈' : '🥈'}</span>
				</div>
				<div class="text-xs font-bold text-slate-600">Captain/VC</div>
				<div class="mt-2 flex items-center justify-center space-x-1">
					<span class="text-xs font-bold px-2 py-1 rounded-full {captain ? 'text-yellow-600 bg-yellow-50' : 'text-slate-400 bg-slate-100'}">C</span>
					<span class="text-xs font-bold px-2 py-1 rounded-full {viceCaptain ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-100'}">VC</span>
				</div>
			</div>
		</div>

		<!-- Team Name Input -->
		<div class="mb-4">
			<div class="relative">
				<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
					<svg class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
					</svg>
				</div>
				<input
					type="text"
					bind:value={teamName}
					placeholder="Enter team name"
					maxlength="20"
					class="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 font-medium text-slate-900 placeholder-slate-500"
				/>
			</div>
		</div>


	</div>

	<!-- Player Type Tabs -->
	<div class="bg-white/80 backdrop-blur-sm border-b-2 border-slate-200/60 p-4 shadow-xl shadow-slate-200/50">
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
			{#each playerTypes as type}
				<button
					on:click={() => activeTab = type.key}
					class="px-4 py-4 text-sm font-black text-center rounded-3xl transition-all duration-300 border-2 shadow-lg hover:scale-105 {activeTab === type.key
						? 'border-emerald-500/60 text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-400/25'
						: 'border-slate-200/60 text-slate-600 bg-white/70 backdrop-blur-sm shadow-slate-200/50 hover:text-slate-900 hover:border-slate-300/60 hover:shadow-slate-300/60'}"
				>
					<div class="flex items-center justify-center space-x-2">
						<span>{type.label}</span>
						<span class="text-xs px-3 py-1 rounded-full font-bold {activeTab === type.key
							? 'bg-white/20 text-white'
							: 'bg-slate-100 text-slate-600'}">
							{getSelectedPlayersByType(type.key).length}/{type.max}
						</span>
					</div>
					<div class="mt-1">
						<div class="w-full bg-slate-200 rounded-full h-1 {activeTab === type.key ? 'bg-white/20' : ''}">
							<div class="h-1 rounded-full transition-all duration-300 {activeTab === type.key
								? 'bg-white'
								: 'bg-gradient-to-r from-emerald-400 to-green-500'}" style="width: {(getSelectedPlayersByType(type.key).length / type.max) * 100}%"></div>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Players List -->
	<div class="p-6">
		{#each getPlayersByType(activeTab) as player}
			{@const isSelected = selectedPlayers.find(p => p.id === player.id)}
			{@const isCaptain = captain?.id === player.id}
			{@const isViceCaptain = viceCaptain?.id === player.id}
			
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 mb-4 overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 hover:scale-[1.02] {isSelected ? 'ring-4 ring-emerald-500/30 border-emerald-400/60' : ''}">
				<div class="p-6">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<div class="flex items-center space-x-4">
								<div class="relative">
									<div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/25">
										<span class="text-xl font-black text-white">{player.name.charAt(0)}</span>
									</div>
									{#if isSelected}
										<div class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
											<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
											</svg>
										</div>
									{/if}
									{#if isCaptain}
										<div class="absolute -top-3 -left-1 text-2xl">👑</div>
									{/if}
									{#if isViceCaptain}
										<div class="absolute -top-3 -left-1 text-xl">🥈</div>
									{/if}
								</div>
								<div class="flex-1">
									<h3 class="font-black text-lg text-slate-900">{player.name}</h3>
									<div class="text-sm font-bold text-slate-600 flex items-center space-x-2 mt-1">
										<span class="bg-slate-100 px-3 py-1 rounded-full">{getPlayerTeamName(player)}</span>
										<span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{player.position}</span>
									</div>
									<div class="text-sm font-bold text-emerald-600 mt-2 flex items-center space-x-1">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
										</svg>
										<span>{player.credits} Credits</span>
									</div>
								</div>
							</div>
						</div>

						<div class="flex items-center space-x-3">
							<!-- Player Analysis Button -->
							<button
								on:click={() => getPlayerAnalysis(player)}
								class="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-purple-300/60 hover:scale-105 transition-all duration-300 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:border-purple-400/60"
								title="AI Analysis"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</button>

							<button
								on:click={() => togglePlayer(player)}
								class="w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg {isSelected ? 'border-emerald-500/60 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-400/25' : 'border-slate-300/60 bg-white/70 backdrop-blur-sm text-slate-600 hover:border-emerald-500/60 hover:text-emerald-600 shadow-slate-200/50 hover:shadow-emerald-300/60'}"
							>
								{#if isSelected}
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								{:else}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
									</svg>
								{/if}
							</button>
						</div>
					</div>

					<!-- Captain/Vice Captain Selection -->
					{#if isSelected}
						<div class="mt-6 pt-4 border-t-2 border-slate-100/60">
							<div class="flex space-x-3">
								<button
									on:click={() => setCaptain(player)}
									class="flex-1 py-3 px-4 rounded-2xl text-sm font-black transition-all duration-300 hover:scale-105 shadow-lg border-2 {isCaptain ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400/60 shadow-yellow-400/25' : 'bg-white/70 backdrop-blur-sm text-slate-700 border-slate-200/60 shadow-slate-200/50 hover:border-yellow-400/60 hover:text-yellow-600 hover:shadow-yellow-300/60'}"
								>
									<div class="flex items-center justify-center space-x-2">
										<span>👑</span>
										<span>{isCaptain ? 'Captain' : 'Make Captain'}</span>
									</div>
								</button>
								<button
									on:click={() => setViceCaptain(player)}
									class="flex-1 py-3 px-4 rounded-2xl text-sm font-black transition-all duration-300 hover:scale-105 shadow-lg border-2 {isViceCaptain ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-400/60 shadow-blue-400/25' : 'bg-white/70 backdrop-blur-sm text-slate-700 border-slate-200/60 shadow-slate-200/50 hover:border-blue-400/60 hover:text-blue-600 hover:shadow-blue-300/60'}"
								>
									<div class="flex items-center justify-center space-x-2">
										<span>🥈</span>
										<span>{isViceCaptain ? 'Vice Captain' : 'Make VC'}</span>
									</div>
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}

		{#if getPlayersByType(activeTab).length === 0}
			<div class="text-center py-8">
				<p class="text-slate-600">No {playerTypes.find(t => t.key === activeTab)?.label}s available</p>
			</div>
		{/if}
	</div>

	<!-- Save Team Button -->
	<div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t-2 border-slate-200/60 p-6 shadow-2xl shadow-slate-300/50">
		<div class="max-w-md mx-auto">
			<button
				on:click={saveTeam}
				disabled={selectedPlayers.length !== 11 || !captain || !viceCaptain || !teamName.trim()}
				class="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-6 rounded-3xl font-black text-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-400/25 hover:shadow-emerald-500/30 hover:scale-[1.02] border-2 border-emerald-400/20 disabled:hover:scale-100"
			>
				<div class="flex items-center justify-center space-x-3">
					<div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
						{#if selectedPlayers.length !== 11}
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
							</svg>
						{:else if !captain}
							<span class="text-lg">👑</span>
						{:else if !viceCaptain}
							<span class="text-lg">🥈</span>
						{:else if !teamName.trim()}
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
							</svg>
						{:else}
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						{/if}
					</div>
					<span>
						{#if selectedPlayers.length !== 11}
							Select {11 - selectedPlayers.length} more player{11 - selectedPlayers.length !== 1 ? 's' : ''}
						{:else if !captain}
							Select Captain
						{:else if !viceCaptain}
							Select Vice Captain
						{:else if !teamName.trim()}
							Enter Team Name
						{:else}
							Save Team
						{/if}
					</span>
					<div class="flex items-center space-x-1">
						<span class="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">✨ Ready</span>
					</div>
				</div>
			</button>
			
			<!-- Team Progress Indicator -->
			<div class="mt-4 flex items-center justify-center space-x-4 text-sm font-bold text-slate-600">
				<div class="flex items-center space-x-2">
					<div class="w-3 h-3 rounded-full {selectedPlayers.length === 11 ? 'bg-emerald-500' : 'bg-slate-300'}"></div>
					<span>11 Players</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-3 h-3 rounded-full {captain ? 'bg-yellow-500' : 'bg-slate-300'}"></div>
					<span>Captain</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-3 h-3 rounded-full {viceCaptain ? 'bg-blue-500' : 'bg-slate-300'}"></div>
					<span>Vice Captain</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-3 h-3 rounded-full {teamName.trim() ? 'bg-purple-500' : 'bg-slate-300'}"></div>
					<span>Team Name</span>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- AI Suggestions Panel -->
{#if showAIPanel && aiSuggestions}
	<div class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
		<div class="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-bold text-slate-900">🤖 AI Team Suggestions</h2>
					<button on:click={() => showAIPanel = false} class="p-2 hover:bg-slate-100 rounded-lg">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- AI Reasoning -->
				<div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
					<h3 class="font-semibold text-purple-900 mb-2">AI Analysis</h3>
					<p class="text-purple-800 text-sm">{aiSuggestions.reasoning}</p>
				</div>

				<!-- Suggested Team -->
				<div class="mb-6">
					<h3 class="font-semibold text-slate-900 mb-3">Suggested Team (11 Players)</h3>
					<div class="space-y-2">
						{#each aiSuggestions.suggestions as player, index}
							<div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
								<div class="flex items-center space-x-3">
									<div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
										<span class="text-xs font-medium">{player.name.charAt(0)}</span>
									</div>
									<div>
										<p class="font-medium text-slate-900">{player.name}</p>
										<p class="text-xs text-slate-600">{player.position} • {getPlayerTeamName(player)}</p>
									</div>
								</div>
								<div class="flex items-center space-x-2">
									{#if aiSuggestions.captainSuggestion.id === player.id}
										<span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">👑 C</span>
									{:else if aiSuggestions.viceCaptainSuggestion.id === player.id}
										<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">🥈 VC</span>
									{/if}
									<span class="text-sm font-medium text-slate-900">{player.credits}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex space-x-3">
					<button
						on:click={() => showAIPanel = false}
						class="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
					>
						Cancel
					</button>
					<button
						on:click={applyAISuggestions}
						class="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
					>
						Apply Suggestions
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Login Modal -->
<LoginModal
	bind:isOpen={showLoginModal}
	title={loginModalConfig.title}
	message={loginModalConfig.message}
	actionText={loginModalConfig.actionText}
	on:close={() => showLoginModal = false}
/>

<!-- Player Analysis Modal -->
{#if selectedPlayerForAnalysis && aiAnalysis}
	<div class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
		<div class="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-bold text-slate-900">📊 Player Analysis</h2>
					<button on:click={() => { selectedPlayerForAnalysis = null; aiAnalysis = null; }} class="p-2 hover:bg-slate-100 rounded-lg">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Player Info -->
				<div class="flex items-center space-x-4 mb-6">
					<div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
						<span class="text-lg font-bold text-slate-600">{selectedPlayerForAnalysis.name.charAt(0)}</span>
					</div>
					<div>
						<h3 class="text-lg font-bold text-slate-900">{selectedPlayerForAnalysis.name}</h3>
						<p class="text-slate-600">{selectedPlayerForAnalysis.position} • {getPlayerTeamName(selectedPlayerForAnalysis)}</p>
						<p class="text-sm text-slate-500">{selectedPlayerForAnalysis.credits} Credits</p>
					</div>
				</div>

				<!-- Recommendation Badge -->
				<div class="mb-4">
					<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {
						aiAnalysis.recommendation === 'highly_recommended' ? 'bg-green-100 text-green-800' :
						aiAnalysis.recommendation === 'recommended' ? 'bg-blue-100 text-blue-800' :
						aiAnalysis.recommendation === 'risky' ? 'bg-yellow-100 text-yellow-800' :
						'bg-red-100 text-red-800'
					}">
						{aiAnalysis.recommendation === 'highly_recommended' ? '🌟 Highly Recommended' :
						 aiAnalysis.recommendation === 'recommended' ? '👍 Recommended' :
						 aiAnalysis.recommendation === 'risky' ? '⚠️ Risky' : '❌ Avoid'}
					</span>
				</div>

				<!-- Analysis -->
				<div class="mb-6">
					<h4 class="font-semibold text-slate-900 mb-2">Analysis</h4>
					<p class="text-slate-700 text-sm">{aiAnalysis.analysis}</p>
				</div>

				<!-- Strengths -->
				{#if aiAnalysis.strengths.length > 0}
					<div class="mb-4">
						<h4 class="font-semibold text-green-800 mb-2">✅ Strengths</h4>
						<ul class="space-y-1">
							{#each aiAnalysis.strengths as strength}
								<li class="text-sm text-green-700">• {strength}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Weaknesses -->
				{#if aiAnalysis.weaknesses.length > 0}
					<div class="mb-6">
						<h4 class="font-semibold text-red-800 mb-2">⚠️ Concerns</h4>
						<ul class="space-y-1">
							{#each aiAnalysis.weaknesses as weakness}
								<li class="text-sm text-red-700">• {weakness}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Close Button -->
				<button
					on:click={() => { selectedPlayerForAnalysis = null; aiAnalysis = null; }}
					class="w-full py-3 px-4 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}