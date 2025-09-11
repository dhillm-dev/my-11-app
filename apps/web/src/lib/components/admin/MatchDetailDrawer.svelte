<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { feedAdapter, type FeedMatch, type FeedPlayer } from '$lib/services/feedAdapter';
	import { Button } from '$lib/components/ui';
	import { X, MapPin, Users, Clock, TrendingUp, AlertCircle, Eye, EyeOff, Ban } from 'lucide-svelte';
	import { adminAuthStore } from '$lib/stores/admin';
	import { onMount } from 'svelte';

	export let match: FeedMatch;

	const dispatch = createEventDispatcher();

	let players: FeedPlayer[] = [];
	let isLoadingPlayers = false;
	let showAuditTrail = false;

	// Permissions
	$: canPublish = $adminAuthStore.session?.user.role === 'superadmin' || 
					$adminAuthStore.session?.user.role === 'admin';

	onMount(async () => {
		await loadPlayers();
	});

	async function loadPlayers() {
		isLoadingPlayers = true;
		try {
			players = await feedAdapter.getPlayers(match.matchId);
		} catch (error) {
			console.error('Failed to load players:', error);
		} finally {
			isLoadingPlayers = false;
		}
	}

	function updateCurationState(state: 'feed_only' | 'curated' | 'blacklisted') {
		if (!canPublish) return;
		feedAdapter.updateCurationState(match.matchId, state, $adminAuthStore.session?.user.name || 'Admin');
		// Update local match object
		match.curationState = state;
		match.lastUpdated = new Date();
		dispatch('update');
	}

	function formatDateTime(date: Date): string {
		return new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).format(date);
	}

	function getCurationStateColor(state: string): string {
		switch (state) {
			case 'curated': return 'text-green-600 bg-green-50 border-green-200';
			case 'blacklisted': return 'text-red-600 bg-red-50 border-red-200';
			default: return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	}

	function getInjuryStatusColor(status: string): string {
		switch (status) {
			case 'fit': return 'text-green-600 bg-green-50';
			case 'doubtful': return 'text-yellow-600 bg-yellow-50';
			case 'injured': return 'text-red-600 bg-red-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getPositionPlayers(position: string) {
		return players.filter(p => p.role === position);
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<!-- Backdrop -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-50" on:click={() => dispatch('close')}></div>

<!-- Drawer -->
<div class="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl z-50 overflow-y-auto">
	<!-- Header -->
	<div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
		<div>
			<h2 class="text-xl font-semibold text-gray-900">Match Details</h2>
			<p class="text-sm text-gray-600 mt-1">{match.home} vs {match.away}</p>
		</div>
		<button 
			on:click={() => dispatch('close')}
			class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<X class="w-5 h-5" />
		</button>
	</div>

	<div class="p-6 space-y-6">
		<!-- Match Overview -->
		<div class="bg-white border border-gray-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Match Overview</h3>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Teams -->
				<div class="space-y-4">
					<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<div class="flex items-center space-x-3">
							<img src={match.homeTeamLogo} alt={match.home} class="w-8 h-8 rounded" on:error={(e) => (e.target as HTMLImageElement).src = '/logos/default.png'} />
							<span class="font-medium text-gray-900">{match.home}</span>
						</div>
						{#if match.odds}
							<span class="text-sm font-medium text-gray-600">{match.odds.home.toFixed(2)}</span>
						{/if}
					</div>
					
					<div class="text-center text-sm text-gray-500 font-medium">VS</div>
					
					<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<div class="flex items-center space-x-3">
							<img src={match.awayTeamLogo} alt={match.away} class="w-8 h-8 rounded" on:error={(e) => (e.target as HTMLImageElement).src = '/logos/default.png'} />
							<span class="font-medium text-gray-900">{match.away}</span>
						</div>
						{#if match.odds}
							<span class="text-sm font-medium text-gray-600">{match.odds.away.toFixed(2)}</span>
						{/if}
					</div>
				</div>

				<!-- Match Info -->
				<div class="space-y-4">
					<div class="flex items-center space-x-3">
						<MapPin class="w-5 h-5 text-gray-400" />
						<div>
							<div class="text-sm font-medium text-gray-900">{match.venue || 'Venue TBD'}</div>
							<div class="text-xs text-gray-500">{match.league}</div>
						</div>
					</div>

					<div class="flex items-center space-x-3">
						<Clock class="w-5 h-5 text-gray-400" />
						<div>
							<div class="text-sm font-medium text-gray-900">{formatDateTime(match.kickoff)}</div>
							<div class="text-xs text-gray-500">Kickoff Time</div>
						</div>
					</div>

					<div class="flex items-center space-x-3">
						<Users class="w-5 h-5 text-gray-400" />
						<div>
							<div class="text-sm font-medium text-gray-900">{Math.round(match.popularity)}% Popularity</div>
							<div class="text-xs text-gray-500">Fan Interest Score</div>
						</div>
					</div>

					<div class="flex items-center space-x-3">
						<TrendingUp class="w-5 h-5 text-gray-400" />
						<div>
							<div class="text-sm font-medium text-gray-900">{match.lineupStatus || 'Unknown'}</div>
							<div class="text-xs text-gray-500">Lineup Status</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Odds Section -->
			{#if match.odds}
				<div class="mt-6 pt-6 border-t border-gray-200">
					<h4 class="text-sm font-medium text-gray-900 mb-3">Betting Odds</h4>
					<div class="grid grid-cols-3 gap-4">
						<div class="text-center p-3 bg-gray-50 rounded-lg">
							<div class="text-xs text-gray-500 mb-1">Home Win</div>
							<div class="text-lg font-semibold text-gray-900">{match.odds.home.toFixed(2)}</div>
						</div>
						<div class="text-center p-3 bg-gray-50 rounded-lg">
							<div class="text-xs text-gray-500 mb-1">Draw</div>
							<div class="text-lg font-semibold text-gray-900">{match.odds.draw.toFixed(2)}</div>
						</div>
						<div class="text-center p-3 bg-gray-50 rounded-lg">
							<div class="text-xs text-gray-500 mb-1">Away Win</div>
							<div class="text-lg font-semibold text-gray-900">{match.odds.away.toFixed(2)}</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Curation Controls -->
		{#if canPublish}
			<div class="bg-white border border-gray-200 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Curation Controls</h3>
				
				<div class="flex items-center justify-between mb-4">
					<div>
						<div class="text-sm font-medium text-gray-900">Current State</div>
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {getCurationStateColor(match.curationState)}">
							{match.curationState === 'curated' ? '✅ Curated' : 
							 match.curationState === 'blacklisted' ? '🚫 Blacklisted' : 
							 '📋 Feed Only'}
						</span>
					</div>
					<div class="text-xs text-gray-500">
						Last updated: {formatDateTime(match.lastUpdated)}
					</div>
				</div>

				<div class="flex items-center gap-3">
					{#if match.curationState !== 'curated'}
						<Button variant="outline" on:click={() => updateCurationState('curated')}>
							<Eye class="w-4 h-4 mr-2" />
							Curate Match
						</Button>
					{/if}
					{#if match.curationState !== 'feed_only'}
						<Button variant="outline" on:click={() => updateCurationState('feed_only')}>
							<EyeOff class="w-4 h-4 mr-2" />
							Reset to Feed Only
						</Button>
					{/if}
					{#if match.curationState !== 'blacklisted'}
						<Button variant="outline" on:click={() => updateCurationState('blacklisted')}>
							<Ban class="w-4 h-4 mr-2" />
							Blacklist Match
						</Button>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Players Section -->
		<div class="bg-white border border-gray-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Squad Information</h3>
			
			{#if isLoadingPlayers}
				<div class="text-center py-8">
					<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
					<p class="mt-2 text-sm text-gray-600">Loading players...</p>
				</div>
			{:else if players.length === 0}
				<div class="text-center py-8 text-gray-500">
					<AlertCircle class="w-8 h-8 mx-auto mb-2" />
					<p>No player data available</p>
				</div>
			{:else}
				<div class="space-y-6">
					{#each ['goalkeeper', 'defender', 'midfielder', 'forward'] as position}
						{@const positionPlayers = getPositionPlayers(position)}
						{#if positionPlayers.length > 0}
							<div>
								<h4 class="text-sm font-medium text-gray-900 mb-3 capitalize">
									{position}s ({positionPlayers.length})
								</h4>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
									{#each positionPlayers as player}
										<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div class="flex items-center space-x-3">
												<div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
													{player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
												</div>
												<div class="flex-1 min-w-0">
													<div class="text-sm font-medium text-gray-900 truncate">{player.name}</div>
													<div class="text-xs text-gray-500">{player.team}</div>
												</div>
											</div>
											<div class="text-right">
												<div class="text-sm font-medium text-gray-900">{player.credits.toFixed(1)}cr</div>
												<div class="flex items-center space-x-2">
													<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {getInjuryStatusColor(player.meta.injuryStatus || 'fit')}">
														{player.meta.injuryStatus || 'fit'}
													</span>
													<span class="text-xs text-gray-500">Form: {player.meta.form.toFixed(1)}</span>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		<!-- Audit Trail -->
		<div class="bg-white border border-gray-200 rounded-lg p-6">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-900">Audit Trail</h3>
				<Button variant="ghost" size="sm" on:click={() => showAuditTrail = !showAuditTrail}>
					{showAuditTrail ? 'Hide' : 'Show'} History
				</Button>
			</div>
			
			{#if showAuditTrail}
				{#if match.auditTrail.length === 0}
					<div class="text-center py-4 text-gray-500">
						<p class="text-sm">No audit entries yet</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each match.auditTrail.slice().reverse() as entry}
							<div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
								<div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
								<div class="flex-1 min-w-0">
									<div class="text-sm font-medium text-gray-900">{entry.what}</div>
									<div class="text-xs text-gray-500 mt-1">
										By {entry.who} • {formatDateTime(entry.when)}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{:else}
				<div class="text-sm text-gray-600">
					{match.auditTrail.length} audit {match.auditTrail.length === 1 ? 'entry' : 'entries'} available
				</div>
			{/if}
		</div>
	</div>
</div>