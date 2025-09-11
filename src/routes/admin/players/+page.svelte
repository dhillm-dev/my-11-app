<script lang="ts">
	import { onMount } from 'svelte';
	import { adminAuthStore } from '$lib/stores/admin';
	import { AdminApiService } from '$lib/services/adminApi';
	import type { AdminPlayer } from '$lib/types';

	let players: AdminPlayer[] = [];
	let loading = false;
	let searchTerm = '';
	let selectedPosition = '';
	let selectedTeam = '';
	let showCreateModal = false;
	let showImportModal = false;
	let editingPlayer: AdminPlayer | null = null;
	let importData = '';
	let importType: 'csv' | 'json' = 'csv';
	let importErrors: string[] = [];

	// Pagination
	let currentPage = 1;
	let itemsPerPage = 20;
	let totalItems = 0;

	// Form data
	let formData = {
		name: '',
		team: '',
		position: 'GK' as 'GK' | 'DEF' | 'MID' | 'FWD',
		price: 0,
		points: 0,
		isActive: true,
		injuryStatus: 'fit' as 'fit' | 'injured' | 'doubtful'
	};

	const positions = [
		{ label: 'Goalkeeper', value: 'GK' },
		{ label: 'Defender', value: 'DEF' },
		{ label: 'Midfielder', value: 'MID' },
		{ label: 'Forward', value: 'FWD' }
	];
	const teams = ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United', 'Tottenham'];
	const injuryStatuses = ['fit', 'injured', 'doubtful'];

	$: canEdit = $adminAuthStore.permissions.players?.update ?? false;
	$: canDelete = $adminAuthStore.permissions.players?.delete ?? false;
	$: canCreate = $adminAuthStore.permissions.players?.create ?? false;
	$: canImport = $adminAuthStore.permissions.players?.create ?? false;

	$: filteredPlayers = players.filter(player => {
		const matchesSearch = !searchTerm || 
			player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			player.team.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesPosition = !selectedPosition || player.position === selectedPosition;
		const matchesTeam = !selectedTeam || player.team === selectedTeam;
		
		return matchesSearch && matchesPosition && matchesTeam;
	});

	$: paginatedPlayers = filteredPlayers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	$: totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);

	onMount(() => {
		loadPlayers();
	});

	async function loadPlayers() {
		loading = true;
		try {
			players = await AdminApiService.players.list();
			totalItems = players.length;
		} catch (error) {
			console.error('Failed to load players:', error);
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		resetForm();
		showCreateModal = true;
	}

	function openEditModal(player: AdminPlayer) {
		editingPlayer = player;
		formData = {
			name: player.name,
			team: player.team,
			position: player.position,
			price: player.price,
			points: player.points,
			isActive: player.isActive,
			injuryStatus: (player.injuryStatus || 'fit') as 'fit' | 'injured' | 'doubtful'
		};
		showCreateModal = true;
	}

	function resetForm() {
		editingPlayer = null;
		formData = {
			name: '',
			team: '',
			position: 'GK' as 'GK' | 'DEF' | 'MID' | 'FWD',
			price: 0,
			points: 0,
			isActive: true,
			injuryStatus: 'fit' as 'fit' | 'injured' | 'doubtful'
		};
	}

	async function savePlayer() {
		try {
			if (editingPlayer) {
				await AdminApiService.players.update(editingPlayer.id, formData);
			} else {
				await AdminApiService.players.create(formData);
			}

			showCreateModal = false;
			resetForm();
			loadPlayers();
		} catch (error) {
			console.error('Failed to save player:', error);
		}
	}

	async function deletePlayer(playerId: string) {
		if (!confirm('Are you sure you want to delete this player?')) return;
		
		try {
			await AdminApiService.players.delete(playerId);
			loadPlayers();
		} catch (error) {
			console.error('Failed to delete player:', error);
		}
	}

	function openImportModal() {
		importData = '';
		importErrors = [];
		showImportModal = true;
	}

	async function importPlayers() {
		try {
			importErrors = [];
			let parsedData;

			if (importType === 'csv') {
				const lines = importData.trim().split('\n');
				const headers = lines[0].split(',').map(h => h.trim());
				
				parsedData = lines.slice(1).map((line, index) => {
					const values = line.split(',').map(v => v.trim());
					const player: any = {};
					
					headers.forEach((header, i) => {
						player[header] = values[i] || '';
					});
					
					if (!player.name || !player.team || !player.position) {
						importErrors.push(`Row ${index + 2}: Missing required fields`);
						return null;
					}
					
					return {
						name: player.name,
						team: player.team,
						position: player.position,
						price: parseFloat(player.price) || 0,
						points: parseFloat(player.points) || 0,
						isActive: player.isActive !== 'false',
						injuryStatus: player.injuryStatus || 'fit'
					};
				}).filter(Boolean);
			} else {
				parsedData = JSON.parse(importData);
				if (!Array.isArray(parsedData)) {
					throw new Error('JSON data must be an array');
				}
			}

			if (importErrors.length === 0 && parsedData.length > 0) {
				await AdminApiService.players.bulkCreate(parsedData);
				showImportModal = false;
				loadPlayers();
			}
		} catch (error) {
			importErrors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	function exportPlayers() {
		const csv = [
			'name,team,position,price,points,isActive,injuryStatus',
			...filteredPlayers.map(player => 
				`${player.name},${player.team},${player.position},${player.price},${player.points},${player.isActive},${player.injuryStatus}`
			)
		].join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `players-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function getInjuryStatusColor(status: string) {
		switch (status) {
			case 'fit': return 'bg-green-100 text-green-800';
			case 'injured': return 'bg-red-100 text-red-800';
			case 'doubtful': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>Players Management - Dream11 Admin</title>
</svelte:head>

<div class="p-6">
	<div class="flex justify-between items-center mb-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Players</h1>
			<p class="text-gray-600">Manage football players and their stats</p>
		</div>
		<div class="flex space-x-3">
			{#if canImport}
				<button
					on:click={openImportModal}
					class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
				>
					Bulk Import
				</button>
			{/if}
			<button
				on:click={exportPlayers}
				class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
			>
				Export CSV
			</button>
			{#if canCreate}
				<button
					on:click={openCreateModal}
					class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
				>
					Add Player
				</button>
			{/if}
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-white p-4 rounded-lg shadow mb-6">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
				<input
					bind:value={searchTerm}
					type="text"
					placeholder="Search players or teams..."
					class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
				<select bind:value={selectedPosition} class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
					<option value="">All Positions</option>
					{#each positions as position}
						<option value={position}>{position}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Team</label>
				<select bind:value={selectedTeam} class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
					<option value="">All Teams</option>
					{#each teams as team}
						<option value={team}>{team}</option>
					{/each}
				</select>
			</div>
			<div class="flex items-end">
				<button
					on:click={() => { searchTerm = ''; selectedPosition = ''; selectedTeam = ''; }}
					class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
				>
					Clear Filters
				</button>
			</div>
		</div>
	</div>

	<!-- Players Table -->
	<div class="bg-white rounded-lg shadow overflow-hidden">
		{#if loading}
			<div class="p-8 text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p class="mt-2 text-gray-600">Loading players...</p>
			</div>
		{:else if paginatedPlayers.length === 0}
			<div class="p-8 text-center">
				<p class="text-gray-500">No players found</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each paginatedPlayers as player}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{player.name}</div>
									<div class="text-xs text-gray-500">ID: {player.id}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{player.team}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{player.position}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									₹{player.price.toFixed(1)}M
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{player.points}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex flex-col space-y-1">
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {player.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
											{player.isActive ? 'Active' : 'Inactive'}
										</span>
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getInjuryStatusColor(player.injuryStatus || 'healthy')}">
										{player.injuryStatus || 'Healthy'}
									</span>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div class="flex justify-end space-x-2">
										{#if canEdit}
											<button
												on:click={() => openEditModal(player)}
												class="text-blue-600 hover:text-blue-900"
											>
												Edit
											</button>
										{/if}
										{#if canDelete}
											<button
												on:click={() => deletePlayer(player.id)}
												class="text-red-600 hover:text-red-900"
											>
												Delete
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
						<div class="text-sm text-gray-700">
							Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPlayers.length)} of {filteredPlayers.length} results
						</div>
						<div class="flex space-x-2">
							<button
								on:click={() => currentPage = Math.max(1, currentPage - 1)}
								disabled={currentPage === 1}
								class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
							>
								Previous
							</button>
							<span class="px-3 py-1 text-sm">
								Page {currentPage} of {totalPages}
							</span>
							<button
								on:click={() => currentPage = Math.min(totalPages, currentPage + 1)}
								disabled={currentPage === totalPages}
								class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
							>
								Next
							</button>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Create/Edit Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
			<div class="mt-3">
				<h3 class="text-lg font-medium text-gray-900 mb-4">
					{editingPlayer ? 'Edit Player' : 'Create Player'}
				</h3>
				
				<form on:submit|preventDefault={savePlayer} class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700">Name</label>
						<input bind:value={formData.name} type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Team</label>
						<select bind:value={formData.team} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
							<option value="">Select Team</option>
							{#each teams as team}
								<option value={team}>{team}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Position</label>
						<select bind:value={formData.position} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
						<option value="">Select Position</option>
						{#each positions as position}
							<option value={position.value}>{position.label}</option>
						{/each}
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Price (₹M)</label>
						<input bind:value={formData.price} type="number" step="0.1" min="0" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Points</label>
						<input bind:value={formData.points} type="number" min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Injury Status</label>
						<select bind:value={formData.injuryStatus} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
							{#each injuryStatuses as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
					</div>

					<div class="flex items-center">
						<input bind:checked={formData.isActive} type="checkbox" class="mr-2" />
						<label class="text-sm font-medium text-gray-700">Active Player</label>
					</div>

					<div class="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							on:click={() => { showCreateModal = false; resetForm(); }}
							class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
						>
							{editingPlayer ? 'Update' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Import Modal -->
{#if showImportModal}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
			<div class="mt-3">
				<h3 class="text-lg font-medium text-gray-900 mb-4">Bulk Import Players</h3>
				
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Import Type</label>
						<div class="flex space-x-4">
							<label class="flex items-center">
								<input bind:group={importType} value="csv" type="radio" class="mr-2" />
								CSV
							</label>
							<label class="flex items-center">
								<input bind:group={importType} value="json" type="radio" class="mr-2" />
								JSON
							</label>
						</div>
					</div>

					{#if importType === 'csv'}
						<div class="bg-gray-50 p-3 rounded text-sm">
							<strong>CSV Format:</strong><br/>
							name,team,position,price,points,isActive,injuryStatus<br/>
							Mohamed Salah,Liverpool,Forward,12.5,150,true,fit
						</div>
					{:else}
						<div class="bg-gray-50 p-3 rounded text-sm">
							<strong>JSON Format:</strong><br/>
							[{'{"name": "Mohamed Salah", "team": "Liverpool", "position": "Forward", "price": 12.5, "points": 150, "isActive": true, "injuryStatus": "fit"}'}]
						</div>
					{/if}

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Data</label>
						<textarea
							bind:value={importData}
							rows="10"
							class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
							placeholder={importType === 'csv' ? 'Paste CSV data here...' : 'Paste JSON data here...'}
						></textarea>
					</div>

					{#if importErrors.length > 0}
						<div class="bg-red-50 border border-red-200 rounded p-3">
							<h4 class="text-sm font-medium text-red-800 mb-2">Import Errors:</h4>
							<ul class="text-sm text-red-700 space-y-1">
								{#each importErrors as error}
									<li>• {error}</li>
								{/each}
							</ul>
						</div>
					{/if}

					<div class="flex justify-end space-x-3 pt-4">
						<button
							on:click={() => { showImportModal = false; importData = ''; importErrors = []; }}
							class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							on:click={importPlayers}
							disabled={!importData.trim()}
							class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
						>
							Import
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}