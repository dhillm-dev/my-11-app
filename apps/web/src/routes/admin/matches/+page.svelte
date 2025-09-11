<script lang="ts">
	import { onMount } from 'svelte';
	import { feedAdapter, type FeedMatch } from '$lib/services/feedAdapter';
	import { adminAuthStore } from '$lib/stores/admin';
	import { Button } from '$lib/components/ui';
	import { Search, Filter, RefreshCw, Eye, EyeOff, Ban, Calendar, Clock, Users, MapPin } from 'lucide-svelte';
	import MatchDetailDrawer from '$lib/components/admin/MatchDetailDrawer.svelte';
	import { _ } from 'svelte-i18n';

	// State
	let matches: FeedMatch[] = [];
	let filteredMatches: FeedMatch[] = [];
	let selectedMatches: string[] = [];
	let isLoading = false;
	let error = '';
	let showDetailDrawer = false;
	let selectedMatch: FeedMatch | null = null;

	// Filters
	let searchQuery = '';
	let dateFrom = '';
	let dateTo = '';
	let selectedLeagues: string[] = [];
	let selectedStatuses: string[] = [];
	let bigMatchesOnly = false;
	let showFilters = false;

	// Auto-curation settings (mock)
	let autoSettings = {
		autoCurateLeagues: ['EPL', 'LALIGA', 'UCL'],
		autoCurateHours: 72,
		popularityThreshold: 70,
		autoUnlistThreshold: 20
	};

	// Available options
	const leagues = ['EPL', 'LALIGA', 'UCL', 'BUNDESLIGA', 'SERIE_A', 'LIGUE_1'];
	const statuses = ['scheduled', 'live', 'finished'];
	const curationStates = ['feed_only', 'curated', 'blacklisted'];

	// Permissions
	$: canPublish = $adminAuthStore.session?.user.role === 'superadmin' || 
					$adminAuthStore.session?.user.role === 'admin';

	onMount(async () => {
		await loadMatches();
		// Set default date range (next 7 days)
		const now = new Date();
		const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		dateFrom = now.toISOString().split('T')[0];
		dateTo = nextWeek.toISOString().split('T')[0];
	});

	async function loadMatches() {
		isLoading = true;
		error = '';
		try {
			const from = dateFrom ? new Date(dateFrom) : new Date();
			const to = dateTo ? new Date(dateTo) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
			matches = await feedAdapter.listUpcoming(from, to);
			applyFilters();
		} catch (err) {
			error = 'Failed to load matches';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}

	function applyFilters() {
		filteredMatches = matches.filter(match => {
			// Search query
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				if (!match.home.toLowerCase().includes(query) && 
					!match.away.toLowerCase().includes(query) &&
					!match.league.toLowerCase().includes(query)) {
					return false;
				}
			}

			// League filter
			if (selectedLeagues.length > 0 && !selectedLeagues.includes(match.league)) {
				return false;
			}

			// Status filter
			if (selectedStatuses.length > 0 && !selectedStatuses.includes(match.status)) {
				return false;
			}

			// Big matches only
			if (bigMatchesOnly && match.popularity < autoSettings.popularityThreshold) {
				return false;
			}

			return true;
		});
	}

	// Reactive filtering
	$: if (searchQuery || selectedLeagues || selectedStatuses || bigMatchesOnly) {
		applyFilters();
	}

	function toggleMatchSelection(matchId: string) {
		if (selectedMatches.includes(matchId)) {
			selectedMatches = selectedMatches.filter(id => id !== matchId);
		} else {
			selectedMatches = [...selectedMatches, matchId];
		}
	}

	function selectAllMatches() {
		selectedMatches = filteredMatches.map(m => m.matchId);
	}

	function clearSelection() {
		selectedMatches = [];
	}

	async function bulkCurate() {
		if (!canPublish) return;
		feedAdapter.bulkUpdateCuration(selectedMatches, 'curated', $adminAuthStore.session?.user.name || 'Admin');
		await loadMatches();
		clearSelection();
	}

	async function bulkUncurate() {
		if (!canPublish) return;
		feedAdapter.bulkUpdateCuration(selectedMatches, 'feed_only', $adminAuthStore.session?.user.name || 'Admin');
		await loadMatches();
		clearSelection();
	}

	async function bulkBlacklist() {
		if (!canPublish) return;
		feedAdapter.bulkUpdateCuration(selectedMatches, 'blacklisted', $adminAuthStore.session?.user.name || 'Admin');
		await loadMatches();
		clearSelection();
	}

	async function refreshFeed() {
		isLoading = true;
		try {
			await feedAdapter.refreshFeed();
			await loadMatches();
		} finally {
			isLoading = false;
		}
	}

	function updateCurationState(matchId: string, state: 'feed_only' | 'curated' | 'blacklisted') {
		if (!canPublish) return;
		feedAdapter.updateCurationState(matchId, state, $adminAuthStore.session?.user.name || 'Admin');
		loadMatches();
	}

	function openMatchDetail(match: FeedMatch) {
		selectedMatch = match;
		showDetailDrawer = true;
	}

	function formatDateTime(date: Date): string {
		return new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getCurationStateColor(state: string): string {
		switch (state) {
			case 'curated': return 'text-green-600 bg-green-50';
			case 'blacklisted': return 'text-red-600 bg-red-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getPopularityColor(popularity: number): string {
		if (popularity >= 80) return 'text-green-600';
		if (popularity >= 60) return 'text-yellow-600';
		return 'text-gray-600';
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Match Curation</h1>
			<p class="text-gray-600 mt-1">Manage match visibility and curation states</p>
		</div>
		<div class="flex items-center gap-3">
			<Button variant="outline" on:click={() => showFilters = !showFilters}>
				<Filter class="w-4 h-4 mr-2" />
				Filters
			</Button>
			<Button variant="outline" on:click={refreshFeed} disabled={isLoading}>
				<RefreshCw class="w-4 h-4 mr-2 {isLoading ? 'animate-spin' : ''}" />
				Refresh Feed
			</Button>
		</div>
	</div>

	<!-- Filters Panel -->
	{#if showFilters}
		<div class="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Search -->
				<div>
					<label for="search-input" class="block text-sm font-medium text-gray-700 mb-2">Search</label>
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input 
							id="search-input"
							type="text" 
							bind:value={searchQuery}
							placeholder="Team or league..."
							class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<!-- Date Range -->
				<div>
					<label for="date-from" class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
					<input 
						id="date-from"
						type="date" 
						bind:value={dateFrom}
						on:change={loadMatches}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="date-to" class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
					<input 
						id="date-to"
						type="date" 
						bind:value={dateTo}
						on:change={loadMatches}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Big Matches Toggle -->
				<div class="flex items-center">
					<label class="flex items-center">
						<input 
							type="checkbox" 
							bind:checked={bigMatchesOnly}
							class="mr-2 rounded"
						/>
						<span class="text-sm font-medium text-gray-700">Big matches only (≥{autoSettings.popularityThreshold}%)</span>
					</label>
				</div>
			</div>

			<!-- League and Status Filters -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<span class="block text-sm font-medium text-gray-700 mb-2">Leagues</span>
					<div class="flex flex-wrap gap-2">
						{#each leagues as league}
							<label class="flex items-center">
								<input 
									type="checkbox" 
									bind:group={selectedLeagues}
									value={league}
									class="mr-1 rounded"
								/>
								<span class="text-sm text-gray-700">{league}</span>
							</label>
						{/each}
					</div>
				</div>

				<div>
					<span class="block text-sm font-medium text-gray-700 mb-2">Status</span>
					<div class="flex flex-wrap gap-2">
						{#each statuses as status}
							<label class="flex items-center">
								<input 
									type="checkbox" 
									bind:group={selectedStatuses}
									value={status}
									on:change={loadMatches}
									class="mr-2 rounded"
								/>
								<span class="text-sm capitalize">{status}</span>
							</label>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Bulk Actions -->
	{#if selectedMatches.length > 0}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-blue-900">
					{selectedMatches.length} match{selectedMatches.length === 1 ? '' : 'es'} selected
				</span>
				<div class="flex items-center gap-2">
					{#if canPublish}
						<Button size="sm" variant="outline" on:click={bulkCurate}>
							<Eye class="w-4 h-4 mr-1" />
							Curate
						</Button>
						<Button size="sm" variant="outline" on:click={bulkUncurate}>
							<EyeOff class="w-4 h-4 mr-1" />
							Uncurate
						</Button>
						<Button size="sm" variant="outline" on:click={bulkBlacklist}>
							<Ban class="w-4 h-4 mr-1" />
							Blacklist
						</Button>
					{/if}
					<Button size="sm" variant="ghost" on:click={clearSelection}>
						Clear
					</Button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Matches Table -->
	<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
		{#if isLoading}
			<div class="p-8 text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p class="mt-2 text-gray-600">Loading matches...</p>
			</div>
		{:else if error}
			<div class="p-8 text-center text-red-600">
				<p>{error}</p>
				<Button class="mt-4" on:click={loadMatches}>Retry</Button>
			</div>
		{:else if filteredMatches.length === 0}
			<div class="p-8 text-center text-gray-500">
				<p>No matches found matching your criteria.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-4 py-3 text-left">
								<input 
									type="checkbox" 
									on:change={selectedMatches.length === filteredMatches.length ? clearSelection : selectAllMatches}
									checked={selectedMatches.length === filteredMatches.length && filteredMatches.length > 0}
									class="rounded"
								/>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kickoff</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curation</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
							<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredMatches as match (match.matchId)}
							<tr class="hover:bg-gray-50 {selectedMatches.includes(match.matchId) ? 'bg-blue-50' : ''}">
								<td class="px-4 py-4">
									<input 
										type="checkbox" 
										checked={selectedMatches.includes(match.matchId)}
										on:change={() => toggleMatchSelection(match.matchId)}
										class="rounded"
									/>
								</td>
								<td class="px-4 py-4">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
										{match.league}
									</span>
								</td>
								<td class="px-4 py-4">
									<div class="flex items-center space-x-3">
										<div class="flex-shrink-0">
											<div class="flex items-center space-x-2">
												<img src={match.homeTeamLogo} alt={match.home} class="w-6 h-6 rounded" on:error={(e) => (e.target as HTMLImageElement).src = '/logos/default.png'} />
												<span class="text-sm font-medium text-gray-900">{match.home}</span>
											</div>
										</div>
										<div class="text-sm text-gray-500">vs</div>
										<div class="flex-shrink-0">
											<div class="flex items-center space-x-2">
												<img src={match.awayTeamLogo} alt={match.away} class="w-6 h-6 rounded" on:error={(e) => (e.target as HTMLImageElement).src = '/logos/default.png'} />
												<span class="text-sm font-medium text-gray-900">{match.away}</span>
											</div>
										</div>
									</div>
								</td>
								<td class="px-4 py-4">
									<div class="flex items-center text-sm text-gray-900">
										<Calendar class="w-4 h-4 mr-1 text-gray-400" />
										{formatDateTime(match.kickoff)}
									</div>
								</td>
								<td class="px-4 py-4">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
										{match.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
										  'bg-green-100 text-green-800'}">
										{match.status === 'completed' ? '✅ Completed' : 
										 '⏰ Upcoming'}
									</span>
								</td>
								<td class="px-4 py-4">
									<div class="flex items-center">
										<Users class="w-4 h-4 mr-1 text-gray-400" />
										<span class="text-sm font-medium {getPopularityColor(match.popularity)}">
											{Math.round(match.popularity)}%
										</span>
									</div>
								</td>
								<td class="px-4 py-4">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCurationStateColor(match.curationState)}">
										{match.curationState === 'curated' ? '✅ Curated' : 
										 match.curationState === 'blacklisted' ? '🚫 Blacklisted' : 
										 '📋 Feed Only'}
									</span>
								</td>
								<td class="px-4 py-4 text-sm text-gray-500">
									{match.source}
								</td>
								<td class="px-4 py-4 text-sm text-gray-500">
									<div class="flex items-center">
										<Clock class="w-4 h-4 mr-1" />
										{formatDateTime(match.lastUpdated)}
									</div>
								</td>
								<td class="px-4 py-4 text-right">
									<div class="flex items-center justify-end space-x-2">
										{#if canPublish}
											{#if match.curationState !== 'curated'}
												<button 
													on:click={() => updateCurationState(match.matchId, 'curated')}
													class="text-green-600 hover:text-green-900 p-1 rounded"
													title="Curate match"
												>
													<Eye class="w-4 h-4" />
												</button>
											{/if}
											{#if match.curationState !== 'feed_only'}
												<button 
													on:click={() => updateCurationState(match.matchId, 'feed_only')}
													class="text-gray-600 hover:text-gray-900 p-1 rounded"
													title="Reset to feed only"
												>
													<EyeOff class="w-4 h-4" />
												</button>
											{/if}
											{#if match.curationState !== 'blacklisted'}
												<button 
													on:click={() => updateCurationState(match.matchId, 'blacklisted')}
													class="text-red-600 hover:text-red-900 p-1 rounded"
													title="Blacklist match"
												>
													<Ban class="w-4 h-4" />
												</button>
											{/if}
										{/if}
										<button 
											on:click={() => openMatchDetail(match)}
											class="text-blue-600 hover:text-blue-900 p-1 rounded"
											title="View details"
										>
											<MapPin class="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Stats Summary -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<div class="bg-white p-4 rounded-lg border border-gray-200">
			<div class="text-2xl font-bold text-gray-900">{matches.length}</div>
			<div class="text-sm text-gray-600">Total Matches</div>
		</div>
		<div class="bg-white p-4 rounded-lg border border-gray-200">
			<div class="text-2xl font-bold text-green-600">{matches.filter(m => m.curationState === 'curated').length}</div>
			<div class="text-sm text-gray-600">Curated</div>
		</div>
		<div class="bg-white p-4 rounded-lg border border-gray-200">
			<div class="text-2xl font-bold text-red-600">{matches.filter(m => m.curationState === 'blacklisted').length}</div>
			<div class="text-sm text-gray-600">Blacklisted</div>
		</div>
		<div class="bg-white p-4 rounded-lg border border-gray-200">
			<div class="text-2xl font-bold text-gray-600">{matches.filter(m => m.curationState === 'feed_only').length}</div>
			<div class="text-sm text-gray-600">Feed Only</div>
		</div>
	</div>
</div>

<!-- Match Detail Drawer -->
{#if showDetailDrawer && selectedMatch}
	<MatchDetailDrawer 
		match={selectedMatch} 
		on:close={() => { showDetailDrawer = false; selectedMatch = null; }}
		on:update={() => loadMatches()}
	/>
{/if}