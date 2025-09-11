<script lang="ts">
	import { delay } from '$lib/utils';

	let email = '';
	let isLoading = false;
	let isSuccess = false;
	let error = '';

	async function handleForgotPassword() {
		if (!email.trim()) {
			error = 'Please enter your email address';
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = 'Please enter a valid email address';
			return;
		}

		error = '';
		isLoading = true;

		// Simulate API call
		await delay(1500);
		
		isLoading = false;
		isSuccess = true;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleForgotPassword();
		}
	}
</script>

<svelte:head>
	<title>Forgot Password - PickNWin</title>
	<meta name="description" content="Reset your PickNWin account password" />
</svelte:head>

<div class="space-y-6">
	{#if !isSuccess}
		<div class="text-center">
			<h2 class="text-2xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
			<p class="text-slate-600">No worries, we'll send you reset instructions</p>
		</div>

		<form on:submit|preventDefault={handleForgotPassword} class="space-y-4">
			<div class="space-y-2">
				<label for="email" class="text-sm font-medium text-slate-700">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="Enter your email address"
					disabled={isLoading}
					on:keypress={handleKeyPress}
					class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>

			{#if error}
				<div class="bg-red-50 border border-red-200 rounded-lg p-3">
					<div class="flex items-center space-x-2">
						<svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
						<p class="text-sm text-red-700">{error}</p>
					</div>
				</div>
			{/if}

			<button
				type="submit"
				disabled={isLoading}
				class="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
			>
				{#if isLoading}
					<div class="flex items-center justify-center space-x-2">
						<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Sending Instructions...</span>
					</div>
				{:else}
					Send Reset Instructions
				{/if}
			</button>
		</form>
	{:else}
		<!-- Success State -->
		<div class="text-center space-y-4">
			<div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
				</svg>
			</div>
			
			<h2 class="text-2xl font-bold text-slate-900">Check Your Email</h2>
			<p class="text-slate-600 max-w-sm mx-auto">
				We've sent password reset instructions to <strong>{email}</strong>
			</p>
			
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
				<h4 class="text-sm font-medium text-blue-800 mb-2">What's next?</h4>
				<ul class="text-sm text-blue-700 space-y-1">
					<li>• Check your email inbox (and spam folder)</li>
					<li>• Click the reset link in the email</li>
					<li>• Create a new password</li>
					<li>• Sign in with your new password</li>
				</ul>
			</div>
			
			<button
				on:click={() => { isSuccess = false; email = ''; }}
				class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
			>
				Try Different Email
			</button>
		</div>
	{/if}

	<div class="text-center space-y-4">
		<a href="/auth/login" class="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors">
			<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
			</svg>
			Back to Sign In
		</a>
	</div>
</div>