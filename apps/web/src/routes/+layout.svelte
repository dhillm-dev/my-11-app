<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { user, isAuthenticated } from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { userActions } from '$lib/stores';
	import { _, locale, locales } from 'svelte-i18n';
	import '$lib/i18n';
	import type { LayoutData } from './$types';
	
	// Lenis smooth scroll integration
    import { createLenis, startRaf } from '$lib/lenis';
    import { createScrollOptimizer } from '$lib/scroll-performance';
    
    // GSAP ScrollTrigger sync
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    gsap.registerPlugin(ScrollTrigger);

	let { children }: { children: any } = $props();
	
	// Lenis cleanup functions
    let stopRaf = () => {};
    let gsapCleanup = () => {};
    let scrollOptimizer: ReturnType<typeof createScrollOptimizer> | null = null;

	// Check authentication on app load
	onMount(() => {
		userActions.loadFromStorage();
		
		// Initialize Lenis smooth scroll with ultra-smooth settings
		const lenis = createLenis({
			// Ultra-smooth configuration overrides
			wheelMultiplier: 0.6,
			lerp: 0.04,
			duration: 2.2,
			touchInertiaMultiplier: 40,
			syncTouchLerp: 0.06
		});
		
		if (lenis) {
			// Initialize scroll performance optimizer
			scrollOptimizer = createScrollOptimizer(lenis);
			
			// Start custom raf loop
			stopRaf = startRaf(lenis);
			
			// GSAP ScrollTrigger integration
			lenis.on('scroll', ScrollTrigger.update);
			
			// Add GSAP ticker for smooth integration
			const ticker = (time: number) => {
				// GSAP gives seconds, Lenis expects ms
				lenis.raf(time * 1000);
			};
			
			gsap.ticker.add(ticker);
			gsap.ticker.lagSmoothing(0);
			
			// Setup cleanup function
			gsapCleanup = () => {
				gsap.ticker.lagSmoothing(1000, 16); // restore defaults
				gsap.ticker.remove(ticker);
			};
		}
	});
	
	onDestroy(() => {
		stopRaf();
		gsapCleanup();
		scrollOptimizer?.destroy();
	});



	// Logout function
	function handleLogout() {
		userActions.logout();
		goto('/');
	}

	// Check if current route is auth page
	let isAuthPage = $derived($page.url.pathname.startsWith('/auth'));
	let showMobileNavigation = $derived($isAuthenticated && !isAuthPage);
	let showHeader = $derived(!isAuthPage);

	// Profile menu state
	let showProfileMenu = $state(false);
	// Mobile menu state
	let showMobileMenu = $state(false);

	function isActiveRoute(path: string): boolean {
		return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	}




</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="min-h-screen bg-white text-slate-900">
	<!-- Header Navigation -->
	{#if showHeader}
		<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16">
					<!-- Logo -->
					<a href="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
						<div class="relative">
							<div class="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl shadow-lg shadow-lime-400/25 flex items-center justify-center hover:shadow-lime-400/40 transition-shadow duration-200">
								<span class="text-white font-black text-lg">P</span>
							</div>
						</div>
						<h1 class="text-xl font-black text-slate-900 tracking-tight hover:text-lime-600 transition-colors duration-200">PickNWin</h1>
					</a>

					<!-- Desktop Navigation -->
					<nav class="hidden md:flex items-center space-x-8">
						<a href="/contests" class="text-slate-600 hover:text-slate-900 font-medium transition-colors">Contests</a>
						<a href="/how-to-play" class="text-slate-600 hover:text-slate-900 font-medium transition-colors">How to Play</a>
					</nav>

					<!-- Mobile Menu Button -->
					<button 
						onclick={() => showMobileMenu = !showMobileMenu}
						class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
						aria-label="Toggle mobile menu"
					>
						<svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if showMobileMenu}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							{:else}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							{/if}
						</svg>
					</button>

					<!-- Right Side -->
					<div class="hidden md:flex items-center space-x-4">
						{#if $isAuthenticated && $user}
							<!-- Wallet Pill -->
							<a href="/wallet" class="hidden sm:flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full px-4 py-2 transition-colors">
								<svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
								</svg>
								<span class="text-emerald-700 font-semibold">€{$user.balance.toLocaleString()}</span>
							</a>

							<!-- Profile Menu -->
							<div class="relative">
								<button 
									onclick={() => showProfileMenu = !showProfileMenu}
									class="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-50 transition-colors"
								>
									<div class="w-8 h-8 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center">
										<span class="text-white font-medium text-sm">{$user.name.charAt(0).toUpperCase()}</span>
									</div>
									<span class="hidden sm:block text-sm font-medium text-slate-700">{$user.name}</span>
									<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
									</svg>
								</button>

								<!-- Profile Dropdown -->
								{#if showProfileMenu}
									<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
										<a href="/profile" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</a>
										<a href="/wallet" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 sm:hidden">Wallet</a>
										<hr class="my-1 border-slate-200">
										<button onclick={handleLogout} class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
									</div>
								{/if}
							</div>
						{:else}
							<!-- Guest Auth Buttons -->
							<div class="flex items-center space-x-3">
								<a href="/auth/login" class="text-slate-600 hover:text-slate-900 font-medium transition-colors">Login</a>
								<a href="/auth/register" class="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">Register</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</header>

		<!-- Mobile Menu Overlay -->
		{#if showMobileMenu}
			<div 
				class="md:hidden fixed inset-0 z-40 bg-black/50" 
				role="button"
				tabindex="0"
				onclick={() => showMobileMenu = false}
				onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? showMobileMenu = false : null}
				aria-label="Close mobile menu"
			></div>
			<div class="md:hidden fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg">
				<div class="px-4 py-6 space-y-4">
					<!-- Mobile Navigation Links -->
					<div class="space-y-2">
						<a href="/contests" onclick={() => showMobileMenu = false} class="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">Contests</a>
						<a href="/how-to-play" onclick={() => showMobileMenu = false} class="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">How to Play</a>
					</div>

					{#if $isAuthenticated && $user}
						<!-- Mobile User Section -->
						<div class="border-t border-slate-200 pt-4">
							<!-- User Info -->
							<div class="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-lg mb-3">
								<div class="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center">
									<span class="text-white font-medium">{$user.name.charAt(0).toUpperCase()}</span>
								</div>
								<div>
									<div class="font-medium text-slate-900">{$user.name}</div>
									<div class="text-sm text-emerald-600 font-semibold">€{$user.balance.toLocaleString()}</div>
								</div>
							</div>

							<!-- Mobile User Actions -->
							<div class="space-y-2">
								<a href="/wallet" onclick={() => showMobileMenu = false} class="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">Wallet</a>
								<a href="/profile" onclick={() => showMobileMenu = false} class="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">Profile</a>
								<button onclick={() => { handleLogout(); showMobileMenu = false; }} class="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">Logout</button>
							</div>
						</div>
					{:else}
						<!-- Mobile Guest Actions -->
						<div class="border-t border-slate-200 pt-4 space-y-3">
							<a href="/auth/login" onclick={() => showMobileMenu = false} class="block px-4 py-3 text-center text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors border border-slate-200">Login</a>
							<a href="/auth/register" onclick={() => showMobileMenu = false} class="block px-4 py-3 text-center bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-semibold transition-colors shadow-sm">Register</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/if}

	<!-- Main Content -->
	<main class="min-h-screen bg-white text-slate-900 {showMobileNavigation ? 'pb-20' : ''}">
		{@render children()}
	</main>

	<!-- Bottom Navigation (Mobile) - Only for authenticated users -->
	{#if showMobileNavigation}
		<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg md:hidden">
			<div class="flex items-center justify-around py-2">
				<a href="/dashboard" class="flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 {isActiveRoute('/dashboard') ? 'text-lime-600' : 'text-slate-500 hover:text-slate-700'}">
					<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.25-8.25a1.125 1.125 0 0 1 1.59 0L20.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
					</svg>
					<span class="text-xs font-medium">Home</span>
				</a>
				<a href="/contests" class="flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 {isActiveRoute('/contests') ? 'text-lime-600' : 'text-slate-500 hover:text-slate-700'}">
					<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.5c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v4.127c0 2.49.824 4.916 2.343 6.75l.071.108c.054.082.12.15.196.196l.108.071c.497.497 1.042.625 1.407.625.365 0 .91-.128 1.407-.625l.108-.071A8.817 8.817 0 0 0 15.75 8.627V4.5Z" />
					</svg>
					<span class="text-xs font-medium">Contests</span>
				</a>
				<a href="/wallet" class="flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 {isActiveRoute('/wallet') ? 'text-lime-600' : 'text-slate-500 hover:text-slate-700'}">
					<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
					</svg>
					<span class="text-xs font-medium">Wallet</span>
				</a>
				<a href="/profile" class="flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 {isActiveRoute('/profile') ? 'text-lime-600' : 'text-slate-500 hover:text-slate-700'}">
					<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
					</svg>
					<span class="text-xs font-medium">Profile</span>
				</a>
			</div>
		</nav>
	{/if}
</div>

<style>
	:global(html, body, #svelte) {
		height: 100%;
		margin: 0;
		padding: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	:global(html, body) {
		background-color: white;
		color: rgb(15 23 42); /* text-slate-900 */
	}

	:global(*) {
		box-sizing: border-box;
	}

	/* Adjust main content for desktop sidebar */
	@media (min-width: 768px) {
		:global(.main-content) {
			margin-left: 16rem; /* 64 * 0.25rem = 16rem */
		}
	}
</style>
