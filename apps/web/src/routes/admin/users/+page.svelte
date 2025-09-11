<script lang="ts">
	import { onMount } from 'svelte';
	import { adminAuthStore } from '$lib/stores/admin';
	import { AdminApiService } from '$lib/services/adminApi';
	import type { User } from '$lib/types';

	interface AdminUser extends User {
		kycStatus: 'pending' | 'verified' | 'rejected';
		walletBalance: number;
		totalDeposits: number;
		totalWithdrawals: number;
		isBanned: boolean;
		lastLoginAt: string;
	}

	let users: AdminUser[] = [];
	let loading = false;
	let searchTerm = '';
	let selectedKycStatus = '';
	let selectedRole = '';
	let showBanned = false;
	let showUserModal = false;
	let selectedUser: AdminUser | null = null;
	let banReason = '';

	// Pagination
	let currentPage = 1;
	let itemsPerPage = 20;
	let totalItems = 0;

	const kycStatuses = ['pending', 'verified', 'rejected'];
	const userRoles = ['user', 'admin', 'moderator', 'viewer', 'superadmin'];

	$: canEdit = $adminAuthStore.permissions.users?.update ?? false;
	$: canDelete = $adminAuthStore.permissions.users?.delete ?? false;
	$: canBan = $adminAuthStore.session?.user.role === 'superadmin' || $adminAuthStore.session?.user.role === 'admin';

	$: filteredUsers = users.filter(user => {
		const matchesSearch = !searchTerm || 
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesKyc = !selectedKycStatus || user.kycStatus === selectedKycStatus;
		const matchesRole = !selectedRole || user.role === selectedRole;
		const matchesBanned = !showBanned || user.isBanned;
		
		return matchesSearch && matchesKyc && matchesRole && (!showBanned || matchesBanned);
	});

	$: paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	$: totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

	onMount(() => {
		loadUsers();
	});

	async function loadUsers() {
		loading = true;
		try {
			// Mock data - in real app this would come from API
			const response = await AdminApiService.users.list();
			if (response.success && response.data) {
				users = response.data as AdminUser[];
				totalItems = users.length;
			}
		} catch (error) {
			console.error('Failed to load users:', error);
		} finally {
			loading = false;
		}
	}

	function openUserModal(user: AdminUser) {
		selectedUser = user;
		banReason = '';
		showUserModal = true;
	}

	async function updateKycStatus(userId: string, status: 'verified' | 'rejected') {
		try {
			await AdminApiService.users.updateKyc(userId, status === 'verified');
			loadUsers();
		} catch (error) {
			console.error('Failed to update KYC status:', error);
		}
	}

	async function toggleUserBan(userId: string, ban: boolean, reason?: string) {
		try {
			if (ban) {
				await AdminApiService.users.ban(userId, reason || 'No reason provided');
			} else {
				await AdminApiService.users.unban(userId);
			}
			showUserModal = false;
			loadUsers();
		} catch (error) {
			console.error('Failed to update user ban status:', error);
		}
	}

	async function deleteUser(userId: string) {
		if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
		
		try {
			await AdminApiService.users.delete(userId);
			loadUsers();
		} catch (error) {
			console.error('Failed to delete user:', error);
		}
	}

	function exportUsers() {
		const csv = [
			'id,name,email,role,kycStatus,walletBalance,totalDeposits,totalWithdrawals,isBanned,createdAt,lastLoginAt',
			...filteredUsers.map(user => 
				`${user.id},${user.name},${user.email},${user.role || 'user'},${user.kycStatus},${user.walletBalance},${user.totalDeposits},${user.totalWithdrawals},${user.isBanned},${user.createdAt},${user.lastLoginAt}`
			)
		].join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString();
	}

	function getKycStatusColor(status: string) {
		switch (status) {
			case 'verified': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function getRoleColor(role: string) {
		switch (role) {
			case 'superadmin': return 'bg-purple-100 text-purple-800';
			case 'admin': return 'bg-blue-100 text-blue-800';
			case 'moderator': return 'bg-indigo-100 text-indigo-800';
			case 'viewer': return 'bg-gray-100 text-gray-800';
			default: return 'bg-green-100 text-green-800';
		}
	}
</script>

<svelte:head>
	<title>Users Management - Dream11 Admin</title>
</svelte:head>

<div class="p-6">
	<div class="flex justify-between items-center mb-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Users</h1>
			<p class="text-gray-600">Manage user accounts, KYC status, and wallet information</p>
		</div>
		<div class="flex space-x-3">
			<button
				on:click={exportUsers}
				class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
			>
				Export CSV
			</button>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-white p-4 rounded-lg shadow mb-6">
		<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
				<input
					bind:value={searchTerm}
					type="text"
					placeholder="Search name or email..."
					class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
				<select bind:value={selectedKycStatus} class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
					<option value="">All Statuses</option>
					{#each kycStatuses as status}
						<option value={status}>{status}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
				<select bind:value={selectedRole} class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
					<option value="">All Roles</option>
					{#each userRoles as role}
						<option value={role}>{role}</option>
					{/each}
				</select>
			</div>
			<div class="flex items-end">
				<label class="flex items-center">
					<input bind:checked={showBanned} type="checkbox" class="mr-2" />
					<span class="text-sm font-medium text-gray-700">Show Banned Only</span>
				</label>
			</div>
			<div class="flex items-end">
				<button
					on:click={() => { searchTerm = ''; selectedKycStatus = ''; selectedRole = ''; showBanned = false; }}
					class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
				>
					Clear Filters
				</button>
			</div>
		</div>
	</div>

	<!-- Users Table -->
	<div class="bg-white rounded-lg shadow overflow-hidden">
		{#if loading}
			<div class="p-8 text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p class="mt-2 text-gray-600">Loading users...</p>
			</div>
		{:else if paginatedUsers.length === 0}
			<div class="p-8 text-center">
				<p class="text-gray-500">No users found</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each paginatedUsers as user}
							<tr class="hover:bg-gray-50 {user.isBanned ? 'bg-red-50' : ''}">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10">
											<div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
												<span class="text-sm font-medium text-gray-700">
													{user.name.charAt(0).toUpperCase()}
												</span>
											</div>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900">{user.name}</div>
											<div class="text-sm text-gray-500">{user.email}</div>
											<div class="text-xs text-gray-400">ID: {user.id}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getRoleColor(user.role || 'user')}">
										{user.role || 'user'}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getKycStatusColor(user.kycStatus)}">
										{user.kycStatus}
									</span>
									{#if user.kycStatus === 'pending' && canEdit}
										<div class="mt-1 flex space-x-1">
											<button
												on:click={() => updateKycStatus(user.id, 'verified')}
												class="text-xs text-green-600 hover:text-green-800"
											>
												Approve
											</button>
											<span class="text-xs text-gray-400">|</span>
											<button
												on:click={() => updateKycStatus(user.id, 'rejected')}
												class="text-xs text-red-600 hover:text-red-800"
											>
												Reject
											</button>
										</div>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									<div class="text-sm font-medium">₹{user.walletBalance.toLocaleString()}</div>
									<div class="text-xs text-gray-500">
										↗ ₹{user.totalDeposits.toLocaleString()} | ↙ ₹{user.totalWithdrawals.toLocaleString()}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if user.isBanned}
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
											Banned
										</span>
									{:else}
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											Active
										</span>
									{/if}
									<div class="text-xs text-gray-500 mt-1">
										Last: {formatDate(user.lastLoginAt)}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{formatDate(user.createdAt)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div class="flex justify-end space-x-2">
										<button
											on:click={() => openUserModal(user)}
											class="text-blue-600 hover:text-blue-900"
										>
											View
										</button>
										{#if canDelete && user.role !== 'superadmin'}
											<button
												on:click={() => deleteUser(user.id)}
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
							Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
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

<!-- User Details Modal -->
{#if showUserModal && selectedUser}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-2/3 max-w-4xl shadow-lg rounded-md bg-white">
			<div class="mt-3">
				<div class="flex justify-between items-center mb-6">
					<h3 class="text-lg font-medium text-gray-900">User Details</h3>
					<button
						on:click={() => showUserModal = false}
						class="text-gray-400 hover:text-gray-600"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- User Info -->
					<div class="bg-gray-50 p-4 rounded-lg">
						<h4 class="text-md font-semibold text-gray-900 mb-3">Personal Information</h4>
						<div class="space-y-2 text-sm">
							<div><strong>Name:</strong> {selectedUser.name}</div>
							<div><strong>Email:</strong> {selectedUser.email}</div>
							<div><strong>Role:</strong> <span class="capitalize">{selectedUser.role || 'user'}</span></div>
							<div><strong>User ID:</strong> {selectedUser.id}</div>
							<div><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</div>
							<div><strong>Last Login:</strong> {formatDate(selectedUser.lastLoginAt)}</div>
						</div>
					</div>

					<!-- Wallet Info -->
					<div class="bg-gray-50 p-4 rounded-lg">
						<h4 class="text-md font-semibold text-gray-900 mb-3">Wallet Summary</h4>
						<div class="space-y-2 text-sm">
							<div><strong>Current Balance:</strong> ₹{selectedUser.walletBalance.toLocaleString()}</div>
							<div><strong>Total Deposits:</strong> ₹{selectedUser.totalDeposits.toLocaleString()}</div>
							<div><strong>Total Withdrawals:</strong> ₹{selectedUser.totalWithdrawals.toLocaleString()}</div>
							<div><strong>Net Activity:</strong> ₹{(selectedUser.totalDeposits - selectedUser.totalWithdrawals).toLocaleString()}</div>
						</div>
					</div>

					<!-- KYC Status -->
					<div class="bg-gray-50 p-4 rounded-lg">
						<h4 class="text-md font-semibold text-gray-900 mb-3">KYC Status</h4>
						<div class="space-y-3">
							<div class="flex items-center space-x-2">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getKycStatusColor(selectedUser.kycStatus)}">
									{selectedUser.kycStatus}
								</span>
							</div>
							{#if selectedUser.kycStatus === 'pending' && canEdit}
								<div class="flex space-x-2">
									<button
										on:click={() => selectedUser && updateKycStatus(selectedUser.id, 'verified')}
										class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
									>
										Approve KYC
									</button>
									<button
										on:click={() => selectedUser && updateKycStatus(selectedUser.id, 'rejected')}
										class="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
									>
										Reject KYC
									</button>
								</div>
							{/if}
						</div>
					</div>

					<!-- Account Status -->
					<div class="bg-gray-50 p-4 rounded-lg">
						<h4 class="text-md font-semibold text-gray-900 mb-3">Account Status</h4>
						<div class="space-y-3">
							<div class="flex items-center space-x-2">
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {selectedUser.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
									{selectedUser.isBanned ? 'Banned' : 'Active'}
								</span>
							</div>
							{#if canBan && selectedUser.role !== 'superadmin'}
								{#if selectedUser.isBanned}
									<button
											on:click={() => selectedUser && toggleUserBan(selectedUser.id, false)}
											class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
										>
										Unban User
									</button>
								{:else}
									<div class="space-y-2">
										<input
											bind:value={banReason}
											type="text"
											placeholder="Ban reason..."
											class="w-full px-2 py-1 border border-gray-300 rounded text-xs"
										/>
										<button
											on:click={() => selectedUser && toggleUserBan(selectedUser.id, true, banReason)}
											class="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
										>
											Ban User
										</button>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				</div>

				<div class="flex justify-end pt-6">
					<button
						on:click={() => showUserModal = false}
						class="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}