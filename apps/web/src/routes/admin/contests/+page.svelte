<script lang="ts">
	import { onMount } from 'svelte';
	import { adminAuthStore } from '$lib/stores/admin';
	import { feedAdapter, type FeedMatch } from '$lib/services/feedAdapter';
	import { Button } from '$lib/components/ui';
	import { Plus, Search, Filter, MoreHorizontal, Eye, Lock, Play, Trophy, Trash2, Copy, Settings, Users, DollarSign, Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { AdminApiService } from '$lib/services/adminApi';

	interface Contest {
		id: string;
		matchId: string;
		match?: FeedMatch;
		title: string;
		entryFee: number;
		prizePool: number;
		maxEntries: number;
		currentEntries: number;
		multiEntry: boolean;
		visibility: 'public' | 'private';
		region: string;
		scoringPreset: string;
		template: 'Free' | 'Starter' | 'Classic' | 'High Roller';
		status: 'draft' | 'published' | 'locked' | 'finished';
		publishedAt?: Date;
		lockedAt?: Date;
		finishedAt?: Date;
		createdAt: Date;
		createdBy: string;
		auditTrail: Array<{
			who: string;
			what: string;
			when: Date;
			before?: any;
			after?: any;
		}>;
	}

	interface ContestTemplate {
		name: 'Free' | 'Starter' | 'Classic' | 'High Roller';
		entryFee: number;
		prizePool: number;
		maxEntries: number;
		multiEntry: boolean;
		visibility: 'public' | 'private';
		scoringPreset: string;
	}

	// State
	let contests: Contest[] = [];
	let curatedMatches: FeedMatch[] = [];
	let isLoading = false;
	let searchQuery = '';
	let statusFilter = 'all';
	let selectedContests = new Set<string>();
	let showCreateModal = false;
	let showSettingsModal = false;
	let selectedContest: Contest | null = null;
	let showContestDetail = false;

	// Pagination
	let currentPage = 1;
	let totalPages = 1;
	let itemsPerPage = 10;
	let pageSize = 10;
	let totalContests = 0;

	// Permissions
	$: canPublish = $adminAuthStore.session?.user.role === 'superadmin' || 
					$adminAuthStore.session?.user.role === 'admin';
	$: canCreate = $adminAuthStore.session?.user.role === 'superadmin' || 
				   $adminAuthStore.session?.user.role === 'admin' ||
				   $adminAuthStore.session?.user.role === 'moderator';
	$: canEdit = $adminAuthStore.session?.user.role === 'superadmin' || 
				 $adminAuthStore.session?.user.role === 'admin' ||
				 $adminAuthStore.session?.user.role === 'moderator';
	$: canDelete = $adminAuthStore.session?.user.role === 'superadmin' || 
				   $adminAuthStore.session?.user.role === 'admin';
	$: showBulkActions = selectedContests.size > 0;
	let loading = false;

	// Contest templates
	const contestTemplates: ContestTemplate[] = [
		{
			name: 'Free',
			entryFee: 0,
			prizePool: 100,
			maxEntries: 1000,
			multiEntry: false,
			visibility: 'public',
			scoringPreset: 'standard'
		},
		{
			name: 'Starter',
			entryFee: 1,
			prizePool: 50,
			maxEntries: 100,
			multiEntry: true,
			visibility: 'public',
			scoringPreset: 'standard'
		},
		{
			name: 'Classic',
			entryFee: 5,
			prizePool: 250,
			maxEntries: 100,
			multiEntry: true,
			visibility: 'public',
			scoringPreset: 'premium'
		},
		{
			name: 'High Roller',
			entryFee: 25,
			prizePool: 1000,
			maxEntries: 50,
			multiEntry: true,
			visibility: 'private',
			scoringPreset: 'premium'
		}
	];

	// Create contest form
	let createForm = {
		matchId: '',
		title: '',
		template: 'Free' as ContestTemplate['name'],
		entryFee: 0,
		prizePool: 100,
		maxEntries: 1000,
		multiEntry: false,
		visibility: 'public' as 'public' | 'private',
		region: 'EU',
		scoringPreset: 'standard'
	};

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			// Load curated matches
			const allMatches = await feedAdapter.listUpcoming(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
			curatedMatches = allMatches.filter(m => m.curationState === 'curated');
			
			// Load contests (mock data)
			contests = generateMockContests();
		} catch (error) {
			console.error('Failed to load data:', error);
		} finally {
			isLoading = false;
		}
	}

	function generateMockContests(): Contest[] {
		const mockContests: Contest[] = [];
		const statuses: Contest['status'][] = ['draft', 'published', 'locked', 'finished'];
		const templates: ContestTemplate['name'][] = ['Free', 'Starter', 'Classic', 'High Roller'];
		
		for (let i = 0; i < 25; i++) {
			const template = templates[Math.floor(Math.random() * templates.length)];
			const templateData = contestTemplates.find(t => t.name === template)!;
			const status = statuses[Math.floor(Math.random() * statuses.length)];
			const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
			
			mockContests.push({
				id: `contest_${i + 1}`,
				matchId: curatedMatches[Math.floor(Math.random() * Math.max(1, curatedMatches.length))]?.matchId || 'match_1',
				title: `${template} Contest ${i + 1}`,
				entryFee: templateData.entryFee,
				prizePool: templateData.prizePool,
				maxEntries: templateData.maxEntries,
				currentEntries: Math.floor(Math.random() * templateData.maxEntries * 0.8),
				multiEntry: templateData.multiEntry,
				visibility: templateData.visibility,
				region: 'EU',
				scoringPreset: templateData.scoringPreset,
				template,
				status,
				publishedAt: status !== 'draft' ? new Date(createdAt.getTime() + 60000) : undefined,
				lockedAt: ['locked', 'finished'].includes(status) ? new Date(createdAt.getTime() + 120000) : undefined,
				finishedAt: status === 'finished' ? new Date(createdAt.getTime() + 180000) : undefined,
				createdAt,
				createdBy: $adminAuthStore.session?.user.name || 'Admin',
				auditTrail: [{
					who: $adminAuthStore.session?.user.name || 'Admin',
					what: 'Contest created',
					when: createdAt
				}]
			});
		}
		
		return mockContests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	}

	// Filtering
	$: filteredContests = contests.filter(contest => {
		const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							  contest.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'all' || contest.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	// Update pagination when filtered contests change
	$: {
		totalContests = filteredContests.length;
		totalPages = Math.ceil(totalContests / pageSize);
	}

	async function loadContests() {
		// This function is called by pagination - just reload the data
		await loadData();
	}

	function toggleContestSelection(contestId: string) {
		if (selectedContests.has(contestId)) {
			selectedContests.delete(contestId);
		} else {
			selectedContests.add(contestId);
		}
		selectedContests = selectedContests; // Trigger reactivity
	}

	function toggleSelectAll() {
		if (selectedContests.size === contests.length) {
			selectedContests.clear();
		} else {
			contests.forEach(contest => selectedContests.add(contest.id));
		}
		selectedContests = selectedContests; // Trigger reactivity
	}

	async function publishContest(contestId: string) {
		try {
			const response = await AdminApiService.publishContest(contestId);
			if (response.success) {
				showToast('Contest published successfully', 'success');
				loadContests();
			} else {
				showToast(response.error || 'Failed to publish contest', 'error');
			}
		} catch (error) {
			showToast('Failed to publish contest', 'error');
		}
	}

	async function lockContest(contestId: string) {
		try {
			const response = await AdminApiService.lockContest(contestId);
			if (response.success) {
				showToast('Contest locked successfully', 'success');
				loadContests();
			} else {
				showToast(response.error || 'Failed to lock contest', 'error');
			}
		} catch (error) {
			showToast('Failed to lock contest', 'error');
		}
	}

	async function deleteContest(contestId: string) {
		if (!confirm('Are you sure you want to delete this contest?')) {
			return;
		}

		try {
			const response = await AdminApiService.deleteContest(contestId);
			if (response.success) {
				showToast('Contest deleted successfully', 'success');
				loadContests();
			} else {
				showToast(response.error || 'Failed to delete contest', 'error');
			}
		} catch (error) {
			showToast('Failed to delete contest', 'error');
		}
	}

	async function bulkPublish() {
		if (!confirm(`Publish ${selectedContests.size} selected contests?`)) {
			return;
		}

		try {
			const promises = Array.from(selectedContests).map(id => AdminApiService.publishContest(id));
			await Promise.all(promises);
			showToast(`${selectedContests.size} contests published successfully`, 'success');
			selectedContests.clear();
			selectedContests = selectedContests;
			loadContests();
		} catch (error) {
			showToast('Failed to publish contests', 'error');
		}
	}

	async function bulkLock() {
		if (!confirm(`Lock ${selectedContests.size} selected contests?`)) {
			return;
		}

		try {
			const promises = Array.from(selectedContests).map(id => AdminApiService.lockContest(id));
			await Promise.all(promises);
			showToast(`${selectedContests.size} contests locked successfully`, 'success');
			selectedContests.clear();
			selectedContests = selectedContests;
			loadContests();
		} catch (error) {
			showToast('Failed to lock contests', 'error');
		}
	}

	async function bulkDelete() {
		if (!confirm(`Delete ${selectedContests.size} selected contests? This action cannot be undone.`)) {
			return;
		}

		try {
			const promises = Array.from(selectedContests).map(id => AdminApiService.deleteContest(id));
			await Promise.all(promises);
			showToast(`${selectedContests.size} contests deleted successfully`, 'success');
			selectedContests.clear();
			selectedContests = selectedContests;
			loadContests();
		} catch (error) {
			showToast('Failed to delete contests', 'error');
		}
	}

	function cloneContest(contest: Contest) {
		goto(`/admin/contests/new?clone=${contest.id}`);
	}

	function exportCSV() {
		const csvContent = [
			['ID', 'Title', 'Match ID', 'Prize Pool', 'Entry Fee', 'Max Entries', 'Current Entries', 'Status', 'Created At'].join(','),
			...contests.map(contest => [
				contest.id,
				`"${contest.title}"`,
				contest.matchId,
				contest.prizePool,
				contest.entryFee,
				contest.maxEntries,
				contest.currentEntries,
				contest.status,
				contest.createdAt.toISOString()
			].join(','))
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `contests-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function showToast(message: string, type: 'success' | 'error') {
		// Mock toast notification - in real app would use a toast library
		console.log(`${type.toUpperCase()}: ${message}`);
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR'
		}).format(amount);
	}

	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'open':
				return 'bg-green-100 text-green-800';
			case 'closed':
				return 'bg-red-100 text-red-800';
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'finished':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function handleSearch() {
		// Search is handled reactively by filteredContests
	}

	function handleStatusFilter() {
		// Status filter is handled reactively by filteredContests
	}

	onMount(() => {
		loadContests();
	});
</script>

<svelte:head>
	<title>Contests Management - Dream11 Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Contests Management</h1>
			<p class="text-gray-600">Manage contests, publish, lock, and track performance</p>
		</div>
		{#if canCreate}
			<button
				on:click={() => goto('/admin/contests/new')}
				class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span>Create Contest</span>
			</button>
		{/if}
	</div>

	<!-- Filters and Search -->
	<div class="bg-white p-6 rounded-lg shadow">
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					on:input={handleSearch}
					placeholder="Search contests..."
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>
			<div>
				<select
					bind:value={statusFilter}
					on:change={handleStatusFilter}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					<option value="all">All Status</option>
					<option value="draft">Draft</option>
					<option value="open">Open</option>
					<option value="closed">Closed</option>
					<option value="finished">Finished</option>
				</select>
			</div>
			<button
				on:click={exportCSV}
				class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<span>Export CSV</span>
			</button>
		</div>
	</div>

	<!-- Bulk Actions -->
	{#if showBulkActions}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<div class="flex items-center justify-between">
				<span class="text-blue-800 font-medium">
					{selectedContests.size} contest{selectedContests.size !== 1 ? 's' : ''} selected
				</span>
				<div class="flex space-x-2">
					{#if canEdit}
						<button
							on:click={bulkPublish}
							class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
						>
							Publish
						</button>
						<button
							on:click={bulkLock}
							class="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
						>
							Lock
						</button>
					{/if}
					{#if canDelete}
						<button
							on:click={bulkDelete}
							class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
						>
							Delete
						</button>
					{/if}
					<button
						on:click={() => { selectedContests.clear(); selectedContests = selectedContests; }}
					class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
				>
					Clear
				</button>
			</div>
			</div>
		</div>
	{/if}

	<!-- Contests Table -->
	<div class="bg-white rounded-lg shadow overflow-hidden">
		{#if loading}
			<div class="p-8 text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p class="mt-2 text-gray-600">Loading contests...</p>
			</div>
		{:else if contests.length === 0}
			<div class="p-8 text-center">
				<p class="text-gray-500">No contests found</p>
				{#if canCreate}
					<button
						on:click={() => goto('/admin/contests/new')}
						class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
					>
						Create First Contest
					</button>
				{/if}
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left">
								<input
									type="checkbox"
									checked={selectedContests.size === contests.length && contests.length > 0}
									on:change={toggleSelectAll}
									class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Contest
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Prize Pool
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Entries
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each contests as contest}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4">
									<input
										type="checkbox"
										checked={selectedContests.has(contest.id)}
										on:change={() => toggleContestSelection(contest.id)}
										class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
								</td>
								<td class="px-6 py-4">
									<div>
										<div class="text-sm font-medium text-gray-900">{contest.title}</div>
										<div class="text-sm text-gray-500">Match: {contest.matchId}</div>
										<div class="text-sm text-gray-500">Entry: {formatCurrency(contest.entryFee)}</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-gray-900">
									{formatCurrency(contest.prizePool)}
								</td>
								<td class="px-6 py-4 text-sm text-gray-900">
									{contest.currentEntries} / {contest.maxEntries}
									<div class="w-full bg-gray-200 rounded-full h-2 mt-1">
										<div 
											class="bg-blue-600 h-2 rounded-full" 
											style="width: {(contest.currentEntries / contest.maxEntries) * 100}%"
										></div>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusBadgeClass(contest.status)}">
										{contest.status}
									</span>
								</td>
								<td class="px-6 py-4 text-sm font-medium">
									<div class="flex space-x-2">
										{#if canEdit}
											<button
												on:click={() => goto(`/admin/contests/${contest.id}`)}
												class="text-blue-600 hover:text-blue-900"
												title="Edit"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
												</svg>
											</button>
											{#if contest.status === 'draft'}
												<button
													on:click={() => publishContest(contest.id)}
													class="text-green-600 hover:text-green-900"
													title="Publish"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
												</button>
											{:else if contest.status === 'published'}
												<button
													on:click={() => lockContest(contest.id)}
													class="text-orange-600 hover:text-orange-900"
													title="Lock"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
													</svg>
												</button>
											{/if}
											<button
												on:click={() => cloneContest(contest)}
												class="text-purple-600 hover:text-purple-900"
												title="Clone"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
											</button>
										{/if}
										{#if canDelete}
										<button
											on:click={() => deleteContest(contest.id)}
											class="text-red-600 hover:text-red-900"
											title="Delete"
											aria-label="Delete contest"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
					<div class="flex items-center justify-between">
						<div class="flex-1 flex justify-between sm:hidden">
							<button
								disabled={currentPage === 1}
								on:click={() => { currentPage--; loadContests(); }}
								class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Previous
							</button>
							<button
								disabled={currentPage === totalPages}
								on:click={() => { currentPage++; loadContests(); }}
								class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Next
							</button>
						</div>
						<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p class="text-sm text-gray-700">
									Showing <span class="font-medium">{(currentPage - 1) * pageSize + 1}</span>
									to <span class="font-medium">{Math.min(currentPage * pageSize, totalContests)}</span>
									of <span class="font-medium">{totalContests}</span> results
								</p>
							</div>
							<div>
								<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
									<button
										disabled={currentPage === 1}
										on:click={() => { currentPage--; loadContests(); }}
										class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										Previous
									</button>
									<button
										disabled={currentPage === totalPages}
										on:click={() => { currentPage++; loadContests(); }}
										class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										Next
									</button>
								</nav>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>