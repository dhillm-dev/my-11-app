<script lang="ts">
	import { onMount } from 'svelte';
	import { AdminApiService } from '$lib/services/adminApi';
	import { adminAuthStore } from '$lib/stores/admin';
	import { goto } from '$app/navigation';

	// State
	let kpis = {
		activeContests: 0,
		totalEntries: 0,
		ggr: 0,
		payouts: 0,
		activeUsers: 0
	};
	let loading = true;
	let recentActivity: any[] = [];
	let liveIncidents: any[] = [];

	// Quick actions based on user role
	$: quickActions = getQuickActions($adminAuthStore.session?.user.role);

	function getQuickActions(role?: string) {
		const actions = [
			{
				title: 'Create Contest',
				description: 'Set up a new contest',
				icon: '🏆',
				action: () => goto('/admin/contests/new'),
				roles: ['superadmin', 'admin', 'moderator']
			},
			{
				title: 'Add Match',
				description: 'Create a new match',
				icon: '⚽',
				action: () => goto('/admin/matches/new'),
				roles: ['superadmin', 'admin', 'moderator']
			},
			{
				title: 'Manage Users',
				description: 'View and manage users',
				icon: '👥',
				action: () => goto('/admin/users'),
				roles: ['superadmin', 'admin', 'moderator', 'viewer']
			},
			{
				title: 'Wallet Transactions',
				description: 'Process wallet operations',
				icon: '💰',
				action: () => goto('/admin/wallet'),
				roles: ['superadmin', 'admin']
			},
			{
				title: 'View Reports',
				description: 'Analytics and insights',
				icon: '📈',
				action: () => goto('/admin/reports'),
				roles: ['superadmin', 'admin', 'moderator', 'viewer']
			},
			{
				title: 'System Settings',
				description: 'Configure system settings',
				icon: '⚙️',
				action: () => goto('/admin/settings'),
				roles: ['superadmin']
			}
		];

		return actions.filter(action => 
			!role || action.roles.includes(role)
		);
	}

	async function loadDashboardData() {
		try {
			loading = true;
			
			// Load KPIs
			const kpiResponse = await AdminApiService.getDashboardKPIs();
			if (kpiResponse.success && kpiResponse.data) {
				kpis = kpiResponse.data;
			}

			// Load recent audit logs for activity
			const auditResponse = await AdminApiService.getAuditLogs({ limit: 5 });
			if (auditResponse.success && auditResponse.data) {
				recentActivity = auditResponse.data.logs;
			}

			// Mock live incidents
			liveIncidents = [
				{
					id: 1,
					type: 'warning',
					message: 'High contest fill rate detected',
					timestamp: new Date(Date.now() - 5 * 60 * 1000)
				},
				{
					id: 2,
					type: 'info',
					message: 'Lineup available for MUN vs LIV',
					timestamp: new Date(Date.now() - 15 * 60 * 1000)
				}
			];
		} catch (error) {
			console.error('Failed to load dashboard data:', error);
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR'
		}).format(amount);
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('en-US').format(num);
	}

	function getRelativeTime(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	}

	onMount(() => {
		loadDashboardData();
		
		// Refresh data every 30 seconds
		const interval = setInterval(loadDashboardData, 30000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Dashboard - Dream11 Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Welcome Section -->
	<div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
		<h1 class="text-2xl font-bold mb-2">
			Welcome back, {$adminAuthStore.session?.user.name || 'Admin'}!
		</h1>
		<p class="text-blue-100">
			Here's what's happening with your platform today.
		</p>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
			{#each Array(5) as _}
				<div class="bg-white p-6 rounded-lg shadow animate-pulse">
					<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
					<div class="h-8 bg-gray-200 rounded w-1/2"></div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- KPI Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
			<div class="bg-white p-6 rounded-lg shadow">
				<div class="flex items-center">
					<div class="p-2 bg-green-100 rounded-lg">
						<span class="text-2xl">🏆</span>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Active Contests</p>
						<p class="text-2xl font-bold text-gray-900">{formatNumber(kpis.activeContests)}</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-lg shadow">
				<div class="flex items-center">
					<div class="p-2 bg-blue-100 rounded-lg">
						<span class="text-2xl">🎯</span>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Total Entries</p>
						<p class="text-2xl font-bold text-gray-900">{formatNumber(kpis.totalEntries)}</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-lg shadow">
				<div class="flex items-center">
					<div class="p-2 bg-purple-100 rounded-lg">
						<span class="text-2xl">💰</span>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">GGR</p>
						<p class="text-2xl font-bold text-gray-900">{formatCurrency(kpis.ggr)}</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-lg shadow">
				<div class="flex items-center">
					<div class="p-2 bg-orange-100 rounded-lg">
						<span class="text-2xl">💸</span>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Payouts</p>
						<p class="text-2xl font-bold text-gray-900">{formatCurrency(kpis.payouts)}</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-lg shadow">
				<div class="flex items-center">
					<div class="p-2 bg-indigo-100 rounded-lg">
						<span class="text-2xl">👥</span>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Active Users</p>
						<p class="text-2xl font-bold text-gray-900">{formatNumber(kpis.activeUsers)}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Quick Actions -->
		<div class="lg:col-span-1">
			<div class="bg-white rounded-lg shadow">
				<div class="p-6 border-b border-gray-200">
					<h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
				</div>
				<div class="p-6 space-y-4">
					{#each quickActions as action}
						<button
							on:click={action.action}
							class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
						>
							<span class="text-2xl mr-3">{action.icon}</span>
							<div>
								<p class="font-medium text-gray-900">{action.title}</p>
								<p class="text-sm text-gray-500">{action.description}</p>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="lg:col-span-1">
			<div class="bg-white rounded-lg shadow">
				<div class="p-6 border-b border-gray-200">
					<h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
				</div>
				<div class="p-6">
					{#if recentActivity.length > 0}
						<div class="space-y-4">
							{#each recentActivity as activity}
								<div class="flex items-start space-x-3">
									<div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
									<div class="flex-1 min-w-0">
										<p class="text-sm text-gray-900">
											<span class="font-medium">{activity.adminName}</span>
											{activity.action} {activity.resource}
											{#if activity.resourceId}
												<span class="text-gray-500">#{activity.resourceId.slice(-6)}</span>
											{/if}
										</p>
										<p class="text-xs text-gray-500">
											{getRelativeTime(activity.timestamp)}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-gray-500 text-center py-4">No recent activity</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Live Incidents -->
		<div class="lg:col-span-1">
			<div class="bg-white rounded-lg shadow">
				<div class="p-6 border-b border-gray-200">
					<h3 class="text-lg font-medium text-gray-900">Live Incidents</h3>
				</div>
				<div class="p-6">
					{#if liveIncidents.length > 0}
						<div class="space-y-4">
							{#each liveIncidents as incident}
								<div class="flex items-start space-x-3">
									<div class="w-2 h-2 rounded-full mt-2 {incident.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}"></div>
									<div class="flex-1 min-w-0">
										<p class="text-sm text-gray-900">{incident.message}</p>
										<p class="text-xs text-gray-500">
											{getRelativeTime(incident.timestamp)}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-gray-500 text-center py-4">No active incidents</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>