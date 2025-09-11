<script lang="ts">
	import { onMount } from 'svelte';

	interface TestResult {
		success: boolean;
		testType: string;
		testDescription: string;
		query?: string;
		result?: any;
		error?: {
			message: string;
			type: string;
			stack?: string;
		};
		meta: {
			responseTime: number;
			timestamp: string;
			cacheStats?: any;
			resultCount?: number;
			apiProvider: string;
			apiKey: string;
		};
	}

	let testResults: TestResult[] = [];
	let isLoading = false;
	let searchQuery = 'messi';
	let selectedTest = 'search';

	const testTypes = [
		{ value: 'search', label: 'Search Players/Teams', description: 'Search for players or teams by name' },
		{ value: 'live', label: 'Live Matches', description: 'Get currently live matches' },
		{ value: 'popular', label: 'Popular Players', description: 'Get trending/popular players' },
		{ value: 'today', label: 'Today\'s Matches', description: 'Get matches scheduled for today' }
	];

	async function runTest(testType: string, query?: string) {
		isLoading = true;
		try {
			const params = new URLSearchParams({ type: testType });
			if (query && testType === 'search') {
				params.set('query', query);
			}

			const response = await fetch(`/api/rapidapi-test?${params}`);
			const result: TestResult = await response.json();
			
			testResults = [result, ...testResults.slice(0, 9)]; // Keep last 10 results
		} catch (error) {
			console.error('Test failed:', error);
			testResults = [{
				success: false,
				testType,
				testDescription: `${testType} test`,
				query,
				error: {
					message: error instanceof Error ? error.message : 'Network error',
					type: 'NetworkError'
				},
				meta: {
					responseTime: 0,
					timestamp: new Date().toISOString(),
					apiProvider: 'RapidAPI SofaScore',
					apiKey: 'N/A'
				}
			}, ...testResults.slice(0, 9)];
		} finally {
			isLoading = false;
		}
	}

	function handleTestRun() {
		runTest(selectedTest, searchQuery);
	}

	function formatJson(obj: any): string {
		return JSON.stringify(obj, null, 2);
	}

	function getStatusColor(success: boolean): string {
		return success ? 'text-green-600' : 'text-red-600';
	}

	function getStatusBg(success: boolean): string {
		return success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
	}

	// Run initial test on mount
	onMount(() => {
		runTest('search', 'messi');
	});
</script>

<svelte:head>
	<title>RapidAPI SofaScore Test - PickNWin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">RapidAPI SofaScore Integration Test</h1>
			<p class="text-gray-600">Test the SofaScore API integration with your RapidAPI credentials</p>
		</div>

		<!-- Test Controls -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4">Run API Tests</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<!-- Test Type Selection -->
				<div>
					<label for="testType" class="block text-sm font-medium text-gray-700 mb-2">
						Test Type
					</label>
					<select 
						id="testType" 
						bind:value={selectedTest}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{#each testTypes as test}
							<option value={test.value}>{test.label}</option>
						{/each}
					</select>
				</div>

				<!-- Search Query (only for search test) -->
				<div class:opacity-50={selectedTest !== 'search'}>
					<label for="searchQuery" class="block text-sm font-medium text-gray-700 mb-2">
						Search Query
					</label>
					<input 
						id="searchQuery"
						type="text" 
						bind:value={searchQuery}
						disabled={selectedTest !== 'search'}
						placeholder="e.g., messi, ronaldo, barcelona"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
					/>
				</div>

				<!-- Run Test Button -->
				<div class="flex items-end">
					<button 
						on:click={handleTestRun}
						disabled={isLoading}
						class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isLoading}
							<span class="flex items-center justify-center">
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Testing...
							</span>
						{:else}
							Run Test
						{/if}
					</button>
				</div>
			</div>

			<!-- Test Description -->
			{#each testTypes as test}
				{#if test.value === selectedTest}
					<div class="bg-blue-50 border border-blue-200 rounded-md p-3">
						<p class="text-blue-800 text-sm">
							<strong>{test.label}:</strong> {test.description}
						</p>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Test Results -->
		<div class="space-y-6">
			{#if testResults.length === 0}
				<div class="bg-white rounded-lg shadow-md p-8 text-center">
					<p class="text-gray-500">No test results yet. Run a test to see results here.</p>
				</div>
			{:else}
				{#each testResults as result, index}
					<div class="bg-white rounded-lg shadow-md overflow-hidden">
						<!-- Result Header -->
						<div class="px-6 py-4 border-b border-gray-200 {getStatusBg(result.success)}">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="text-lg font-semibold {getStatusColor(result.success)}">
										{result.success ? '✅' : '❌'} {result.testDescription}
									</h3>
									<p class="text-sm text-gray-600 mt-1">
										{result.meta.timestamp} • {result.meta.responseTime}ms • {result.meta.apiProvider}
									</p>
								</div>
								<div class="text-right">
									{#if result.meta.resultCount !== undefined}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{result.meta.resultCount} results
										</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Result Content -->
						<div class="px-6 py-4">
							{#if result.success}
								<!-- Success Result -->
								{#if result.testType === 'search' && result.result?.results}
									<div class="space-y-3">
										<h4 class="font-medium text-gray-900">Search Results:</h4>
										{#each result.result.results.slice(0, 5) as item}
											<div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
												<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {item.type === 'player' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
													{item.type}
												</span>
												<div class="flex-1">
													<p class="font-medium text-gray-900">{item.entity.name}</p>
													{#if item.entity.team}
														<p class="text-sm text-gray-600">{item.entity.team.name}</p>
													{/if}
												</div>
												<span class="text-sm text-gray-500">Score: {item.score}</span>
											</div>
										{/each}
									</div>
								{:else}
									<!-- Raw JSON for other test types -->
									<div>
										<h4 class="font-medium text-gray-900 mb-2">API Response:</h4>
										<pre class="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto max-h-96">{formatJson(result.result)}</pre>
									</div>
								{/if}
							{:else}
								<!-- Error Result -->
								<div class="space-y-3">
									<div class="bg-red-50 border border-red-200 rounded-md p-4">
										<h4 class="font-medium text-red-800 mb-2">Error Details:</h4>
										<p class="text-red-700"><strong>Type:</strong> {result.error?.type}</p>
										<p class="text-red-700"><strong>Message:</strong> {result.error?.message}</p>
										{#if result.error?.stack}
											<details class="mt-2">
												<summary class="cursor-pointer text-red-600 hover:text-red-800">Stack Trace</summary>
												<pre class="mt-2 text-xs text-red-600 whitespace-pre-wrap">{result.error.stack}</pre>
											</details>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- API Info -->
		<div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 mb-3">RapidAPI Configuration</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
				<div>
					<p class="text-blue-800"><strong>API Provider:</strong> SofaScore via RapidAPI</p>
					<p class="text-blue-800"><strong>Base URL:</strong> https://sofascore.p.rapidapi.com</p>
				</div>
				<div>
					<p class="text-blue-800"><strong>Rate Limit:</strong> 100 requests/minute</p>
					<p class="text-blue-800"><strong>Cache TTL:</strong> 5 minutes</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	pre {
		white-space: pre-wrap;
		word-wrap: break-word;
	}
</style>