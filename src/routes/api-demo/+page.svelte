<script lang="ts">
	import { onMount } from 'svelte';
	import { sofaScoreAdapter } from '$lib/services/sofascoreAdapter';
	import { unifiedFeedService } from '$lib/services/unifiedFeedService';
	import type { SofaScoreSearchResult, SofaScorePlayer, SofaScoreTeam } from '$lib/services/sofascoreAdapter';
	import type { EnhancedFeedMatch, EnhancedFeedPlayer, ServiceStats } from '$lib/services/unifiedFeedService';

	// Component state
	let searchQuery = 'messi';
	let searchResults: SofaScoreSearchResult | null = null;
	let liveMatches: EnhancedFeedMatch[] = [];
	let popularPlayers: EnhancedFeedPlayer[] = [];
	let serviceStats: ServiceStats | null = null;
	let loading = false;
	let error = '';
	let activeTab = 'search';

	// Demo functions
	async function searchPlayers() {
		if (!searchQuery.trim()) return;
		
		loading = true;
		error = '';
		
		try {
			searchResults = await sofaScoreAdapter.search(searchQuery, 'all');
		} catch (err) {
			error = `Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
			console.error('Search error:', err);
		} finally {
			loading = false;
		}
	}

	async function loadLiveMatches() {
		loading = true;
		error = '';
		
		try {
			liveMatches = await unifiedFeedService.getLiveMatches();
		} catch (err) {
			error = `Failed to load live matches: ${err instanceof Error ? err.message : 'Unknown error'}`;
			console.error('Live matches error:', err);
		} finally {
			loading = false;
		}
	}

	async function loadPopularPlayers() {
		loading = true;
		error = '';
		
		try {
			popularPlayers = await unifiedFeedService.searchPlayers('', 15);
		} catch (err) {
			error = `Failed to load popular players: ${err instanceof Error ? err.message : 'Unknown error'}`;
			console.error('Popular players error:', err);
		} finally {
			loading = false;
		}
	}

	async function loadServiceStats() {
		serviceStats = unifiedFeedService.getStats();
	}

	function clearCache() {
		unifiedFeedService.clearCache();
		alert('Cache cleared successfully!');
		loadServiceStats();
	}

	function resetStats() {
		unifiedFeedService.resetStats();
		loadServiceStats();
	}

	// Handle enter key in search
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchPlayers();
		}
	}

	// Load initial data
	onMount(() => {
		loadServiceStats();
		searchPlayers(); // Search for Messi by default
	});
</script>

<svelte:head>
	<title>SofaScore API Demo - PickNWin</title>
	<meta name="description" content="Demo of SofaScore API integration for real sports data" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
	<div class="container mx-auto px-4 max-w-6xl">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">SofaScore API Demo</h1>
			<p class="text-lg text-gray-600">Real sports data integration for PickNWin fantasy platform</p>
		</div>

		<!-- Service Stats Card -->
		{#if serviceStats}
			<div class="bg-white rounded-lg shadow-md p-6 mb-8">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-xl font-semibold text-gray-800">Service Statistics</h2>
					<div class="space-x-2">
						<button 
							on:click={loadServiceStats}
							class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
						>
							Refresh
						</button>
						<button 
							on:click={clearCache}
							class="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
						>
							Clear Cache
						</button>
						<button 
							on:click={resetStats}
							class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
						>
							Reset Stats
						</button>
					</div>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">{serviceStats.totalRequests}</div>
						<div class="text-sm text-gray-600">Total Requests</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">{serviceStats.cacheHits}</div>
						<div class="text-sm text-gray-600">Cache Hits</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">{serviceStats.sofascoreRequests}</div>
						<div class="text-sm text-gray-600">SofaScore API</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-600">{Math.round(serviceStats.averageResponseTime)}ms</div>
						<div class="text-sm text-gray-600">Avg Response</div>
					</div>
				</div>
				{#if serviceStats.lastError}
					<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded">
						<div class="text-sm text-red-800">
							<strong>Last Error:</strong> {serviceStats.lastError}
							{#if serviceStats.lastErrorTime}
								<span class="text-red-600">({serviceStats.lastErrorTime.toLocaleTimeString()})</span>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Tab Navigation -->
		<div class="bg-white rounded-lg shadow-md mb-8">
			<div class="border-b border-gray-200">
				<nav class="flex space-x-8 px-6">
					<button 
						class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'search' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
						on:click={() => activeTab = 'search'}
					>
						Player Search
					</button>
					<button 
						class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'live' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
						on:click={() => { activeTab = 'live'; loadLiveMatches(); }}
					>
						Live Matches
					</button>
					<button 
						class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'popular' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
						on:click={() => { activeTab = 'popular'; loadPopularPlayers(); }}
					>
						Popular Players
					</button>
				</nav>
			</div>

			<div class="p-6">
				<!-- Search Tab -->
				{#if activeTab === 'search'}
					<div class="space-y-6">
						<!-- Search Input -->
						<div class="flex space-x-4">
							<input 
								bind:value={searchQuery}
								on:keydown={handleKeydown}
								placeholder="Search for players or teams..."
								class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<button 
								on:click={searchPlayers}
								disabled={loading}
								class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? 'Searching...' : 'Search'}
							</button>
						</div>

						<!-- Search Results -->
						{#if searchResults}
							<div class="space-y-4">
								<h3 class="text-lg font-semibold text-gray-800">
									Search Results ({searchResults.results.length})
								</h3>
								<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{#each searchResults.results as result}
										<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
											{#if result.type === 'player'}
												{@const player = result.entity as SofaScorePlayer}
												<div class="flex items-center space-x-3">
													<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
														<span class="text-blue-600 font-semibold text-lg">⚽</span>
													</div>
													<div class="flex-1">
														<h4 class="font-semibold text-gray-900">{player.name}</h4>
														<p class="text-sm text-gray-600">{player.team?.name || 'No team'}</p>
														<p class="text-xs text-gray-500">
															{player.position || 'Unknown position'} • {player.country.name}
														</p>
														<div class="flex items-center space-x-2 mt-1">
															<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Player</span>
															<span class="text-xs text-gray-500">{player.userCount.toLocaleString()} followers</span>
														</div>
													</div>
												</div>
											{:else}
												{@const team = result.entity as SofaScoreTeam}
												<div class="flex items-center space-x-3">
													<div class="w-12 h-12 rounded-full flex items-center justify-center" 
														 style="background-color: {team.teamColors.primary}">
														<span class="text-white font-semibold text-sm">{team.nameCode}</span>
													</div>
													<div class="flex-1">
														<h4 class="font-semibold text-gray-900">{team.name}</h4>
														<p class="text-sm text-gray-600">{team.country.name}</p>
														<div class="flex items-center space-x-2 mt-1">
															<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Team</span>
															<span class="text-xs text-gray-500">{team.userCount.toLocaleString()} followers</span>
														</div>
													</div>
												</div>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>

				<!-- Live Matches Tab -->
				{:else if activeTab === 'live'}
					<div class="space-y-6">
						<div class="flex justify-between items-center">
							<h3 class="text-lg font-semibold text-gray-800">Live Matches</h3>
							<button 
								on:click={loadLiveMatches}
								disabled={loading}
								class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
							>
								{loading ? 'Loading...' : 'Refresh'}
							</button>
						</div>

						{#if liveMatches.length > 0}
							<div class="grid gap-4 md:grid-cols-2">
								{#each liveMatches as match}
									<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div class="flex justify-between items-center mb-2">
											<span class="text-sm font-medium text-gray-600">{match.league}</span>
											<span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full animate-pulse">
												🔴 LIVE
											</span>
										</div>
										<div class="flex justify-between items-center">
											<div class="text-center flex-1">
												<div class="font-semibold text-gray-900">{match.home}</div>
											</div>
											<div class="text-center px-4">
												<div class="text-lg font-bold text-gray-800">VS</div>
											</div>
											<div class="text-center flex-1">
												<div class="font-semibold text-gray-900">{match.away}</div>
											</div>
										</div>
										<div class="mt-3 flex justify-between items-center text-sm text-gray-600">
											<span>Source: {match.dataSource}</span>
											<span>Confidence: {match.confidenceScore}%</span>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-center py-8 text-gray-500">
								<div class="text-4xl mb-2">⚽</div>
								<p>No live matches found</p>
								<p class="text-sm">Check back later or try refreshing</p>
							</div>
						{/if}
					</div>

				<!-- Popular Players Tab -->
				{:else if activeTab === 'popular'}
					<div class="space-y-6">
						<div class="flex justify-between items-center">
							<h3 class="text-lg font-semibold text-gray-800">Popular Players</h3>
							<button 
								on:click={loadPopularPlayers}
								disabled={loading}
								class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
							>
								{loading ? 'Loading...' : 'Refresh'}
							</button>
						</div>

						{#if popularPlayers.length > 0}
							<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{#each popularPlayers as player}
									<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div class="flex items-center space-x-3">
											<div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
												<span class="text-white font-semibold text-lg">⭐</span>
											</div>
											<div class="flex-1">
												<h4 class="font-semibold text-gray-900">{player.name}</h4>
												<p class="text-sm text-gray-600">{player.team}</p>
												<div class="flex items-center justify-between mt-2">
													<span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
														{player.position}
													</span>
													<span class="text-sm font-semibold text-green-600">
														{player.credits} CR
													</span>
												</div>
												<div class="flex items-center justify-between mt-1 text-xs text-gray-500">
													<span>Source: {player.dataSource}</span>
													<span>{player.confidenceScore}% confidence</span>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-center py-8 text-gray-500">
								<div class="text-4xl mb-2">👥</div>
								<p>No popular players loaded</p>
								<p class="text-sm">Click refresh to load trending players</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
				<div class="flex items-center">
					<div class="text-red-400 mr-3">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
					</div>
					<div>
						<h3 class="text-sm font-medium text-red-800">Error</h3>
						<p class="text-sm text-red-700 mt-1">{error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- API Info -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 mb-3">About This Demo</h3>
			<div class="text-sm text-blue-800 space-y-2">
				<p>This demo showcases the integration of the SofaScore API with the PickNWin fantasy sports platform.</p>
				<p><strong>Features demonstrated:</strong></p>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>Real-time player and team search</li>
					<li>Live match data integration</li>
					<li>Intelligent caching and fallback systems</li>
					<li>Service monitoring and statistics</li>
					<li>Hybrid data sources (mock + real API)</li>
				</ul>
				<p class="mt-3"><strong>API Source:</strong> SofaScore via RapidAPI</p>
			</div>
		</div>
	</div>
</div>

<style>
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: .5;
		}
	}
</style>