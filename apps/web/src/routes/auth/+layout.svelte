<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/stores';

	// Redirect if already authenticated
	onMount(() => {
		const unsubscribe = isAuthenticated.subscribe((authenticated) => {
			if (authenticated) {
				goto('/dashboard', { replaceState: true });
			}
		});

		return unsubscribe;
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
	<!-- Background Pattern -->
	<div class="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 opacity-40"></div>
	
	<div class="relative z-10 w-full max-w-md">
		<!-- Logo and Brand -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-500 shadow-lg mb-4 animate-pulse">
				<span class="text-white font-bold text-2xl">P</span>
			</div>
			<h1 class="text-3xl font-bold text-slate-900 mb-2">PickNWin</h1>
			<p class="text-slate-600">Fantasy Cricket Made Easy</p>
		</div>

		<!-- Bonus Banner -->
		<div class="mb-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-200 text-center">
			<div class="flex items-center justify-center space-x-2">
				<svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
				<span class="text-amber-800 font-semibold">Get €1200 bonus on signup!</span>
			</div>
		</div>

		<!-- Auth Form Container -->
		<div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
			<slot />
		</div>

		<!-- Footer -->
		<div class="text-center mt-8 text-sm text-slate-500">
			<p>&copy; 2024 PickNWin. All rights reserved.</p>
			<div class="flex justify-center space-x-4 mt-2">
				<a href="/privacy" class="hover:text-emerald-600 transition-colors">Privacy</a>
				<a href="/terms" class="hover:text-emerald-600 transition-colors">Terms</a>
				<a href="/support" class="hover:text-emerald-600 transition-colors">Support</a>
			</div>
		</div>
	</div>
</div>