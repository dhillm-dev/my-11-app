<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userActions, isLoading, walletStore } from '$lib/stores';
	import { onMount } from 'svelte';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';
	let acceptTerms = false;
	let showSuccessToast = false;
	let showOnboardingModal = false;
	let selectedLanguage = 'en';
	let selectedLeagues: string[] = [];

	const availableLeagues = [
		{ id: 'ipl', name: 'Indian Premier League', sport: 'Cricket' },
		{ id: 'epl', name: 'English Premier League', sport: 'Football' },
		{ id: 'laliga', name: 'La Liga', sport: 'Football' },
		{ id: 'nba', name: 'NBA', sport: 'Basketball' },
		{ id: 'bbl', name: 'Big Bash League', sport: 'Cricket' }
	];

	$: returnTo = $page.url.searchParams.get('returnTo');

	function validateForm() {
		if (!name.trim()) {
			return 'Please enter your full name';
		}
		
		if (!email.trim()) {
			return 'Please enter your email address';
		}
		
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return 'Please enter a valid email address';
		}
		
		if (!password) {
			return 'Please enter a password';
		}
		
		if (password.length < 6) {
			return 'Password must be at least 6 characters long';
		}
		
		if (password !== confirmPassword) {
			return 'Passwords do not match';
		}
		
		if (!acceptTerms) {
			return 'Please accept the terms and conditions';
		}
		
		return null;
	}

	async function handleRegister() {
		const validationError = validateForm();
		if (validationError) {
			error = validationError;
			return;
		}

		error = '';
		const result = await userActions.register(email, password, name);
		
		if (result.success) {
			// Add welcome bonus to wallet
			walletStore.addTransaction({
				id: Date.now().toString(),
				userId: 'user-' + Date.now(),
				type: 'signup_bonus',
				amount: 1200,
				description: 'Welcome Bonus',
				status: 'completed',
				createdAt: new Date(),
				timestamp: new Date().toISOString()
			});

			// Show success toast
			showSuccessToast = true;
			setTimeout(() => {
				showSuccessToast = false;
				showOnboardingModal = true;
			}, 2000);
		} else {
			error = result.error || 'Registration failed';
		}
	}

	function completeOnboarding() {
		showOnboardingModal = false;
		if (returnTo) {
			goto(returnTo, { replaceState: true });
		} else {
			goto('/dashboard', { replaceState: true });
		}
	}

	function toggleLeague(leagueId: string) {
		if (selectedLeagues.includes(leagueId)) {
			selectedLeagues = selectedLeagues.filter(id => id !== leagueId);
		} else {
			selectedLeagues = [...selectedLeagues, leagueId];
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleRegister();
		}
	}
</script>

<svelte:head>
	<title>Sign Up - PickNWin</title>
	<meta name="description" content="Create your PickNWin account and get €1200 welcome bonus" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<!-- Main Registration Card -->
		<div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 p-8 space-y-8">
			<!-- Header -->
			<div class="text-center space-y-3">
				<div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl shadow-lg shadow-lime-400/25 mb-4 animate-pulse">
					<svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
				</div>
				<h1 class="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Create Account</h1>
				<p class="text-slate-500 font-medium">Join thousands of fantasy cricket players</p>
			</div>

			<!-- Welcome Bonus Banner -->
			<div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100/60 rounded-2xl p-5 shadow-lg shadow-blue-100/50 relative overflow-hidden">
				<!-- Decorative elements -->
				<div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-lime-200/30 to-emerald-200/30 rounded-full -translate-y-10 translate-x-10"></div>
				<div class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-8 -translate-x-8"></div>
				
				<div class="flex items-center space-x-4 relative">
					<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-lime-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-500/25">
						<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="flex-1">
						<h4 class="text-lg font-bold text-blue-800 mb-1">€1200 Welcome Bonus!</h4>
						<p class="text-sm text-blue-700 leading-relaxed">
							Get free credits instantly when you create your account
						</p>
					</div>
				</div>
			</div>

			<form on:submit|preventDefault={handleRegister} class="space-y-6">
				<div class="grid grid-cols-1 gap-6">
					<!-- Full Name -->
					<div class="space-y-3">
						<label for="name" class="text-sm font-bold text-slate-700 flex items-center space-x-2">
							<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							<span>Full Name</span>
						</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							placeholder="Enter your full name"
							disabled={$isLoading}
							on:keypress={handleKeyPress}
							class="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-400/20 focus:border-lime-400 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 placeholder-slate-400"
						/>
					</div>

					<!-- Email -->
					<div class="space-y-3">
						<label for="email" class="text-sm font-bold text-slate-700 flex items-center space-x-2">
							<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
							<span>Email Address</span>
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="Enter your email address"
							disabled={$isLoading}
							on:keypress={handleKeyPress}
							class="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-400/20 focus:border-lime-400 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 placeholder-slate-400"
						/>
					</div>

					<!-- Password -->
					<div class="space-y-3">
						<label for="password" class="text-sm font-bold text-slate-700 flex items-center space-x-2">
							<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
							<span>Password</span>
						</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Create a password (min. 6 characters)"
							disabled={$isLoading}
							on:keypress={handleKeyPress}
						class="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-400/20 focus:border-lime-400 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 placeholder-slate-400"
						/>
					</div>

					<!-- Confirm Password -->
					<div class="space-y-3">
						<label for="confirmPassword" class="text-sm font-bold text-slate-700 flex items-center space-x-2">
							<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Confirm Password</span>
						</label>
						<input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							placeholder="Confirm your password"
							disabled={$isLoading}
						on:keypress={handleKeyPress}
						class="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 placeholder-slate-400"
						/>
					</div>
				</div>

				<!-- Terms Checkbox -->
				<div class="flex items-start space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border-2 border-slate-200/60 shadow-lg">
					<div class="flex-shrink-0 mt-1">
						<input
							id="acceptTerms"
							type="checkbox"
							bind:checked={acceptTerms}
							disabled={$isLoading}
							class="h-5 w-5 text-lime-600 focus:ring-lime-500 border-2 border-slate-300 rounded-lg shadow-sm transition-all duration-200"
						/>
					</div>
					<label for="acceptTerms" class="text-sm text-slate-700 font-medium leading-relaxed">
						I agree to the
						<a href="/terms" class="text-lime-600 hover:text-lime-700 font-bold underline decoration-2 underline-offset-2 transition-colors">
							Terms of Service
						</a>
						and
						<a href="/privacy" class="text-blue-600 hover:text-blue-700 font-bold underline decoration-2 underline-offset-2 transition-colors">
							Privacy Policy
						</a>
					</label>
				</div>

			{#if error}
				<div class="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 rounded-2xl shadow-lg backdrop-blur-sm">
					<div class="flex items-center space-x-3">
						<div class="flex-shrink-0">
							<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<p class="text-sm font-medium text-red-700">{error}</p>
					</div>
				</div>
			{/if}

			<button
				type="submit"
				disabled={$isLoading || !acceptTerms}
				class="w-full bg-gradient-to-r from-lime-500 via-lime-600 to-green-600 text-black py-4 px-6 rounded-2xl font-bold text-lg shadow-xl shadow-lime-500/25 hover:shadow-lime-500/40 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-lime-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3"
			>
				{#if $isLoading}
					<svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							class="opacity-25"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					<span>Creating Account...</span>
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
					<span>Create Account & Get €1200</span>
				{/if}
			</button>
		</form>

			<div class="mt-4 py-8 border-t-2 border-slate-200/60 backdrop-blur-sm rounded-xl shadow-lg flex justify-center items-center min-h-[80px]">
				<div class="text-center">
					<p class="text-sm text-slate-600 font-medium text-center">
					Already have an account?
					<a href="/auth/login" class="text-lime-600 hover:text-lime-700 font-bold ml-2 hover:scale-105 inline-block transition-all duration-200">
						Sign in →
				</a>
			</p>
			</div>
		</div>
	</div>
	</div>
</div>

<!-- Success Toast -->
{#if showSuccessToast}
	<div class="fixed top-4 right-4 z-50 bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-lime-500/25 flex items-center space-x-3 animate-pulse">
		<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
		</svg>
		<div>
			<p class="font-bold">Account Created Successfully!</p>
			<p class="text-sm opacity-90">€1200 bonus added to your wallet</p>
		</div>
	</div>
{/if}

<!-- Onboarding Modal -->
{#if showOnboardingModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
		<div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
			<div class="text-center">
				<div class="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-slate-900 mb-2">Welcome to PickNWin!</h2>
				<p class="text-slate-600">Let's personalize your experience</p>
			</div>

			<!-- Language Selection -->
			<div class="space-y-3">
				<h3 class="font-semibold text-slate-900">Choose your language</h3>
				<div class="grid grid-cols-2 gap-3">
					<button
						on:click={() => selectedLanguage = 'en'}
						class="p-3 rounded-xl border-2 transition-all duration-200 {selectedLanguage === 'en' ? 'border-lime-400 bg-lime-50' : 'border-slate-200 hover:border-slate-300'}"
					>
						<div class="text-2xl mb-1">🇺🇸</div>
						<div class="font-medium text-sm">English</div>
					</button>
					<button
						on:click={() => selectedLanguage = 'nl'}
						class="p-3 rounded-xl border-2 transition-all duration-200 {selectedLanguage === 'nl' ? 'border-lime-400 bg-lime-50' : 'border-slate-200 hover:border-slate-300'}"
					>
						<div class="text-2xl mb-1">🇳🇱</div>
						<div class="font-medium text-sm">Nederlands</div>
					</button>
				</div>
			</div>

			<!-- Favorite Leagues -->
			<div class="space-y-3">
				<h3 class="font-semibold text-slate-900">Select your favorite leagues</h3>
				<div class="space-y-2 max-h-40 overflow-y-auto">
					{#each availableLeagues as league}
						<button
							on:click={() => toggleLeague(league.id)}
							class="w-full p-3 rounded-xl border-2 text-left transition-all duration-200 {selectedLeagues.includes(league.id) ? 'border-lime-400 bg-lime-50' : 'border-slate-200 hover:border-slate-300'}"
						>
							<div class="font-medium text-sm">{league.name}</div>
							<div class="text-xs text-slate-500">{league.sport}</div>
						</button>
					{/each}
				</div>
			</div>

			<button
				on:click={completeOnboarding}
				class="w-full bg-gradient-to-r from-lime-500 to-lime-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-200"
			>
				Continue to Dashboard
			</button>
		</div>
	</div>
{/if}