<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { adminAuthStore } from '$lib/stores/admin';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { AdminApiService } from '$lib/services/adminApi';

	// Props
	export let title = 'Admin Panel';

	// State
	let sidebarOpen = true;
	let searchQuery = '';
	let showUserMenu = false;
	let showSearchResults = false;
	let searchResults: any[] = [];

	// Navigation items
	const navItems = [
		{
			path: '/admin',
			label: 'Dashboard',
			icon: '📊',
			permission: 'read:dashboard'
		},
		{
			path: '/admin/contests',
			label: 'Contests',
			icon: '🏆',
			permission: 'read:contests'
		},
		{
			path: '/admin/matches',
			label: 'Matches',
			icon: '⚽',
			permission: 'read:matches'
		},
		{
			path: '/admin/players',
			label: 'Players',
			icon: '👤',
			permission: 'read:players'
		},
		{
			path: '/admin/users',
			label: 'Users',
			icon: '👥',
			permission: 'read:users'
		},
		{
			path: '/admin/wallet',
			label: 'Wallet',
			icon: '💰',
			permission: 'read:wallet'
		},
		{
			path: '/admin/reports',
			label: 'Reports',
			icon: '📈',
			permission: 'read:reports'
		},
		{
			path: '/admin/settings',
			label: 'Settings',
			icon: '⚙️',
			permission: 'write:settings'
		}
	];

	// Reactive statements
	$: currentPath = $page.url.pathname;
	$: filteredNavItems = navItems.filter(item => {
		const [resource, action] = item.permission.split('.');
		return ($adminAuthStore.permissions as any)[resource]?.[action] || false;
	});

	// Search functionality
	async function handleSearch() {
		if (searchQuery.length < 2) {
			showSearchResults = false;
			return;
		}

		// Mock global search across entities
		try {
			const [contests, matches, users] = await Promise.all([
				AdminApiService.getContests({ search: searchQuery, limit: 3 }),
				AdminApiService.getMatches({ search: searchQuery, limit: 3 }),
				AdminApiService.getUsers({ search: searchQuery, limit: 3 })
			]);

			searchResults = [
				...(contests.data?.contests || []).map(c => ({ type: 'contest', ...c })),
				...(matches.data?.matches || []).map(m => ({ type: 'match', ...m })),
				...(users.data?.users || []).map(u => ({ type: 'user', ...u }))
			];
			showSearchResults = true;
		} catch (error) {
			console.error('Search error:', error);
		}
	}

	function selectSearchResult(result: any) {
		switch (result.type) {
			case 'contest':
				goto(`/admin/contests/${result.id}`);
				break;
			case 'match':
				goto(`/admin/matches/${result.id}`);
				break;
			case 'user':
				goto(`/admin/users/${result.id}`);
				break;
		}
		searchQuery = '';
		showSearchResults = false;
	}

	function handleLogout() {
		adminAuthStore.logout();
		goto('/admin/login');
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	// Keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
			event.preventDefault();
			document.getElementById('global-search')?.focus();
		}
		if (event.key === 'Escape') {
			showSearchResults = false;
			showUserMenu = false;
		}
	}

	onMount(() => {
		AdminApiService.init();
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<aside 
		class="{sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col"
	>
		<!-- Logo -->
		<div class="p-4 border-b border-gray-200">
			{#if sidebarOpen}
				<h1 class="text-xl font-bold text-gray-900">Dream11 Admin</h1>
			{:else}
				<div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
					<span class="text-white font-bold text-sm">D</span>
				</div>
			{/if}
		</div>

		<!-- Navigation -->
		<nav class="flex-1 p-4 space-y-2">
			{#each filteredNavItems as item}
				<a
					href={item.path}
					class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
						{currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path))
							? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
							: 'text-gray-700 hover:bg-gray-50'
						}"
				>
					<span class="text-lg mr-3">{item.icon}</span>
					{#if sidebarOpen}
						<span>{item.label}</span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- User info -->
		<div class="p-4 border-t border-gray-200">
			{#if sidebarOpen && $adminAuthStore.session}
				<div class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
						<span class="text-sm font-medium text-gray-700">
							{$adminAuthStore.session.user.name.charAt(0).toUpperCase()}
						</span>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate">
							{$adminAuthStore.session.user.name}
						</p>
						<p class="text-xs text-gray-500 capitalize">
							{$adminAuthStore.session.user.role}
						</p>
					</div>
				</div>
			{/if}
		</div>
	</aside>

	<!-- Main content -->
	<div class="flex-1 flex flex-col overflow-hidden">
		<!-- Top bar -->
		<header class="bg-white border-b border-gray-200 px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<!-- Sidebar toggle -->
					<button
						on:click={toggleSidebar}
						class="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>

					<!-- Page title -->
					<h2 class="text-xl font-semibold text-gray-900">{title}</h2>
				</div>

				<div class="flex items-center space-x-4">
					<!-- Global search -->
					<div class="relative">
						<input
							id="global-search"
							type="text"
							bind:value={searchQuery}
							on:input={handleSearch}
							placeholder="Search... (Ctrl+K)"
							class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>

						<!-- Search results -->
						{#if showSearchResults && searchResults.length > 0}
							<div 
								class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
								transition:fly={{ y: -10, duration: 200 }}
							>
								{#each searchResults as result}
									<button
										on:click={() => selectSearchResult(result)}
										class="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
									>
										<div class="flex items-center space-x-3">
											<span class="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
												{result.type}
											</span>
											<span class="font-medium">
												{result.name || result.homeTeam + ' vs ' + result.awayTeam || result.email}
											</span>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Locale selector -->
					<select class="border border-gray-300 rounded px-3 py-1 text-sm">
						<option value="en">EN</option>
						<option value="nl">NL</option>
					</select>

					<!-- Admin menu -->
					<div class="relative">
						<button
							on:click={() => showUserMenu = !showUserMenu}
							class="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
						>
							{#if $adminAuthStore.session}
								<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
									<span class="text-white text-sm font-medium">
										{$adminAuthStore.session.user.name.charAt(0).toUpperCase()}
									</span>
								</div>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							{/if}
						</button>

						{#if showUserMenu}
							<div 
								class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
								transition:fly={{ y: -10, duration: 200 }}
							>
								<div class="p-3 border-b border-gray-100">
									{#if $adminAuthStore.session}
										<p class="font-medium text-gray-900">{$adminAuthStore.session.user.name}</p>
										<p class="text-sm text-gray-500">{$adminAuthStore.session.user.email}</p>
										<p class="text-xs text-blue-600 capitalize mt-1">{$adminAuthStore.session.user.role}</p>
									{/if}
								</div>
								<div class="p-1">
									<a href="/admin/profile" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
										Profile
									</a>
									<button
										on:click={handleLogout}
										class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
									>
										Sign out
									</button>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</header>

		<!-- Page content -->
		<main class="flex-1 overflow-auto p-6">
			<slot />
		</main>
	</div>
</div>

<style>
	/* Custom scrollbar for sidebar */
	aside {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e0 transparent;
	}
	
	aside::-webkit-scrollbar {
		width: 6px;
	}
	
	aside::-webkit-scrollbar-track {
		background: transparent;
	}
	
	aside::-webkit-scrollbar-thumb {
		background-color: #cbd5e0;
		border-radius: 3px;
	}
</style>