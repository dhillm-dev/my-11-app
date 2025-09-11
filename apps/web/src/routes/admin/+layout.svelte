<script lang="ts">
	import { page } from '$app/stores';
	import { adminAuthStore } from '$lib/stores/admin';
	import { requireAdminAuth } from '$lib/guards/adminGuard';
	import AdminLayout from '$lib/components/admin/AdminLayout.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Check authentication on mount
	onMount(() => {
		// Skip auth check for login page
		if ($page.url.pathname === '/admin/login') {
			return;
		}

		// Check if user is authenticated
		if (!$adminAuthStore.isAuthenticated) {
			goto('/admin/login');
			return;
		}

		// Verify admin role
		const session = $adminAuthStore.session;
		if (!session || !['superadmin', 'admin', 'moderator', 'viewer'].includes(session.user.role || '')) {
			goto('/admin/login');
			return;
		}
	});

	// Reactive page title based on current route
	$: pageTitle = getPageTitle($page.url.pathname);

	function getPageTitle(pathname: string): string {
		const routes: Record<string, string> = {
			'/admin': 'Dashboard',
			'/admin/contests': 'Contests Management',
			'/admin/matches': 'Matches Management',
			'/admin/players': 'Players Management',
			'/admin/users': 'Users Management',
			'/admin/wallet': 'Wallet Management',
			'/admin/reports': 'Reports & Analytics',
			'/admin/settings': 'System Settings',
			'/admin/login': 'Admin Login',
			'/admin/unauthorized': 'Unauthorized Access'
		};

		// Check for exact match first
		if (routes[pathname]) {
			return routes[pathname];
		}

		// Check for partial matches (e.g., /admin/contests/123)
		for (const [route, title] of Object.entries(routes)) {
			if (pathname.startsWith(route) && route !== '/admin') {
				return title;
			}
		}

		return 'Admin Panel';
	}
</script>

{#if $page.url.pathname === '/admin/login'}
	<!-- Login page without layout -->
	<slot />
{:else if $adminAuthStore.isAuthenticated}
	<!-- Admin layout for authenticated users -->
	<AdminLayout title={pageTitle}>
		<slot />
	</AdminLayout>
{:else}
	<!-- Loading state while checking authentication -->
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-4 text-gray-600">Checking authentication...</p>
		</div>
	</div>
{/if}