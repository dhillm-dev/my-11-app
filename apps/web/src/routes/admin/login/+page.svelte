<script lang="ts">
	import { goto } from '$app/navigation';
	import { adminAuthStore } from '$lib/stores/admin';
	import { onMount } from 'svelte';

	// Form state
	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	// Demo credentials for different roles
	const demoCredentials = [
		{ role: 'superadmin', email: 'superadmin@dream11.com', password: 'admin123' },
		{ role: 'admin', email: 'admin@dream11.com', password: 'admin123' },
		{ role: 'moderator', email: 'moderator@dream11.com', password: 'admin123' },
		{ role: 'viewer', email: 'viewer@dream11.com', password: 'admin123' }
	];

	async function handleLogin() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		try {
			const result = await adminAuthStore.login(email, password);
			if (result.success) {
				goto('/admin');
			} else {
				error = result.error || 'Login failed';
			}
		} catch (err) {
			error = 'An unexpected error occurred';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}

	function fillDemoCredentials(creds: { email: string; password: string }) {
		email = creds.email;
		password = creds.password;
	}

	// Redirect if already authenticated
	onMount(() => {
		if ($adminAuthStore.isAuthenticated) {
			goto('/admin');
		}
	});
</script>

<svelte:head>
	<title>Admin Login - Dream11</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="flex justify-center">
			<div class="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
				<span class="text-white text-2xl font-bold">D</span>
			</div>
		</div>
		<h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
			Admin Panel Login
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Sign in to access the Dream11 admin dashboard
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">
						Email address
					</label>
					<div class="mt-1">
						<input
							id="email"
							name="email"
							type="email"
							bind:value={email}
							autocomplete="email"
							required
							class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter your email"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						Password
					</label>
					<div class="mt-1">
						<input
							id="password"
							name="password"
							type="password"
							bind:value={password}
							autocomplete="current-password"
							required
							class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter your password"
						/>
					</div>
				</div>

				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-md p-3">
						<div class="flex">
							<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p class="ml-2 text-sm text-red-600">{error}</p>
						</div>
					</div>
				{/if}

				<div>
					<button
						type="submit"
						disabled={loading}
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if loading}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Signing in...
						{:else}
							Sign in
						{/if}
					</button>
				</div>
			</form>

			<!-- Demo credentials -->
			<div class="mt-8">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300" />
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-white text-gray-500">Demo Accounts</span>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-2 gap-3">
					{#each demoCredentials as creds}
						<button
							on:click={() => fillDemoCredentials(creds)}
							class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 capitalize"
						>
							{creds.role}
						</button>
					{/each}
				</div>

				<div class="mt-4 text-center">
					<p class="text-xs text-gray-500">
						Click any role above to auto-fill credentials
					</p>
				</div>
			</div>
		</div>
	</div>
</div>