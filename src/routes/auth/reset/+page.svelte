<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Input } from '$lib/components/ui';
	import { delay } from '$lib/utils';
	import { onMount } from 'svelte';

	let token = '';
	let password = '';
	let confirmPassword = '';
	let isLoading = false;
	let isSuccess = false;
	let error = '';
	let isValidToken = true;

	onMount(() => {
		// Get token from URL params
		token = $page.url.searchParams.get('token') || '';
		
		// Validate token (in real app, this would be an API call)
		if (!token) {
			isValidToken = false;
			error = 'Invalid or missing reset token';
		}
	});

	function validateForm() {
		if (!password) {
			return 'Please enter a new password';
		}
		
		if (password.length < 6) {
			return 'Password must be at least 6 characters long';
		}
		
		if (password !== confirmPassword) {
			return 'Passwords do not match';
		}
		
		return null;
	}

	async function handleResetPassword() {
		const validationError = validateForm();
		if (validationError) {
			error = validationError;
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
			handleResetPassword();
		}
	}

	function goToLogin() {
		goto('/auth/login');
	}
</script>

<svelte:head>
	<title>Reset Password - PicknWin</title>
	<meta name="description" content="Create a new password for your PicknWin account" />
</svelte:head>

<div class="space-y-6">
	{#if !isValidToken}
		<!-- Invalid Token State -->
		<div class="text-center space-y-4">
			<div class="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
				</svg>
			</div>
			
			<h2 class="text-2xl font-bold text-slate-900 dark:text-white">Invalid Reset Link</h2>
			<p class="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
				This password reset link is invalid or has expired. Please request a new one.
			</p>
			
			<div class="space-y-3">
				<Button
					on:click={() => goto('/auth/forgot')}
					class="neumorphic-button bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
				>
					Request New Reset Link
				</Button>
				
				<Button
					on:click={goToLogin}
					variant="outline"
					class="neumorphic-button-outline"
				>
					Back to Sign In
				</Button>
			</div>
		</div>
	{:else if !isSuccess}
		<!-- Reset Form -->
		<div class="text-center">
			<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Password</h2>
			<p class="text-slate-600 dark:text-slate-400">Enter a strong password for your account</p>
		</div>

		<form on:submit|preventDefault={handleResetPassword} class="space-y-4">
			<div class="space-y-2">
				<label for="password" class="text-sm font-medium text-slate-700 dark:text-slate-300">
					New Password
				</label>
				<Input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Enter new password (min. 6 characters)"
					disabled={isLoading}
					on:keypress={handleKeyPress}
					class="neumorphic-input"
				/>
			</div>

			<div class="space-y-2">
				<label for="confirmPassword" class="text-sm font-medium text-slate-700 dark:text-slate-300">
					Confirm New Password
				</label>
				<Input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					placeholder="Confirm your new password"
					disabled={isLoading}
					on:keypress={handleKeyPress}
					class="neumorphic-input"
				/>
			</div>

			<!-- Password Requirements -->
			<div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
				<h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password Requirements:</h4>
				<ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1">
					<li class="flex items-center space-x-2">
						<div class="w-1.5 h-1.5 rounded-full {password.length >= 6 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}"></div>
						<span class={password.length >= 6 ? 'text-green-600 dark:text-green-400' : ''}>At least 6 characters</span>
					</li>
					<li class="flex items-center space-x-2">
						<div class="w-1.5 h-1.5 rounded-full {password === confirmPassword && password ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}"></div>
						<span class={password === confirmPassword && password ? 'text-green-600 dark:text-green-400' : ''}>Passwords match</span>
					</li>
				</ul>
			</div>

			{#if error}
				<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
					<div class="flex items-center space-x-2">
						<svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
						<p class="text-sm text-red-700 dark:text-red-300">{error}</p>
					</div>
				</div>
			{/if}

			<Button
				type="submit"
				disabled={isLoading}
				class="w-full neumorphic-button bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 transition-all duration-200"
			>
				{#if isLoading}
					<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Updating Password...
				{:else}
					Update Password
				{/if}
			</Button>
		</form>
	{:else}
		<!-- Success State -->
		<div class="text-center space-y-4">
			<div class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
				</svg>
			</div>
			
			<h2 class="text-2xl font-bold text-slate-900 dark:text-white">Password Updated!</h2>
			<p class="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
				Your password has been successfully updated. You can now sign in with your new password.
			</p>
			
			<Button
				on:click={goToLogin}
				class="neumorphic-button bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
			>
				Sign In Now
			</Button>
		</div>
	{/if}

	{#if isValidToken && !isSuccess}
		<div class="text-center">
			<a href="/auth/login" class="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
				</svg>
				Back to Sign In
			</a>
		</div>
	{/if}
</div>

<style>
	.neumorphic-input {
		@apply border-0 bg-slate-50 dark:bg-slate-700;
		box-shadow: 
			inset 4px 4px 8px rgba(148, 163, 184, 0.2),
			inset -4px -4px 8px rgba(255, 255, 255, 0.8);
	}
	
	:global(.dark) .neumorphic-input {
		box-shadow: 
			inset 4px 4px 8px rgba(0, 0, 0, 0.3),
			inset -4px -4px 8px rgba(71, 85, 105, 0.1);
	}
	
	.neumorphic-button {
		box-shadow: 
			4px 4px 8px rgba(148, 163, 184, 0.2),
			-4px -4px 8px rgba(255, 255, 255, 0.8);
	}
	
	.neumorphic-button:hover {
		box-shadow: 
			2px 2px 4px rgba(148, 163, 184, 0.3),
			-2px -2px 4px rgba(255, 255, 255, 0.9);
	}
	
	.neumorphic-button-outline {
		@apply bg-white dark:bg-slate-800 border-0;
		box-shadow: 
			4px 4px 8px rgba(148, 163, 184, 0.2),
			-4px -4px 8px rgba(255, 255, 255, 0.8);
	}
	
	.neumorphic-button-outline:hover {
		box-shadow: 
			2px 2px 4px rgba(148, 163, 184, 0.3),
			-2px -2px 4px rgba(255, 255, 255, 0.9);
	}
	
	:global(.dark) .neumorphic-button {
		box-shadow: 
			4px 4px 8px rgba(0, 0, 0, 0.3),
			-4px -4px 8px rgba(71, 85, 105, 0.1);
	}
	
	:global(.dark) .neumorphic-button:hover {
		box-shadow: 
			2px 2px 4px rgba(0, 0, 0, 0.4),
			-2px -2px 4px rgba(71, 85, 105, 0.2);
	}
	
	:global(.dark) .neumorphic-button-outline {
		box-shadow: 
			4px 4px 8px rgba(0, 0, 0, 0.3),
			-4px -4px 8px rgba(71, 85, 105, 0.1);
	}
	
	:global(.dark) .neumorphic-button-outline:hover {
		box-shadow: 
			2px 2px 4px rgba(0, 0, 0, 0.4),
			-2px -2px 4px rgba(71, 85, 105, 0.2);
	}
</style>