<script lang="ts">
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/stores';

	// Game steps data
	const gameSteps = [
		{
			step: 1,
			title: 'Select a Match',
			description: 'Choose from upcoming cricket, football, or basketball matches. Each match has different contest types and prize pools.',
			icon: 'calendar',
			tips: ['Check match timing', 'Review team news', 'Consider weather conditions']
		},
		{
			step: 2,
			title: 'Build Your Team',
			description: 'Select 11 players within the 100 credit budget. Pick maximum 6 players from one team and 5 from the other team.',
			icon: 'users',
			tips: ['Balance your budget wisely', 'Max 6 from one team, 5 from other', 'Consider recent form']
		},
		{
			step: 3,
			title: 'Choose Captain & Vice-Captain',
			description: 'Your captain gets 2x points and vice-captain gets 1.5x points. Choose wisely as they can make or break your team.',
			icon: 'crown',
			tips: ['Captain gets 2x points', 'Vice-captain gets 1.5x points', 'Pick consistent performers']
		},
		{
			step: 4,
			title: 'Join Contest',
			description: 'Enter contests with different entry fees and prize structures. From free contests to high-stakes tournaments.',
			icon: 'trophy',
			tips: ['Start with free contests', 'Check prize distribution', 'Read contest rules']
		},
		{
			step: 5,
			title: 'Track & Win',
			description: 'Follow live scores and leaderboard updates. Winnings are credited instantly after match completion.',
			icon: 'chart',
			tips: ['Monitor live scores', 'Check leaderboard', 'Instant payouts']
		}
	];

	// Scoring system data
	const scoringRules: Record<string, Array<{action: string, points: string}>> = {
		football: [
			{ action: 'Goal', points: '+16' },
			{ action: 'Assist', points: '+12' },
			{ action: 'Clean Sheet (GK/DEF)', points: '+4' },
			{ action: 'Save (GK)', points: '+1' },
			{ action: 'Yellow Card', points: '-1' },
			{ action: 'Red Card', points: '-3' },
			{ action: 'Own Goal', points: '-2' },
			{ action: 'Penalty Miss', points: '-2' },
			{ action: 'Playing 11', points: '+2' },
			{ action: 'Substitute', points: '+1' }
		]
	};

	// Contest types
	const contestTypes = [
		{
			type: 'Practice Contest',
			entry: 'Free',
			description: 'Perfect for beginners to learn without any risk',
			prize: 'Practice Points',
			icon: 'academic-cap'
		},
		{
			type: 'Head to Head',
			entry: '€2 - €100',
			description: 'Compete against just one other player',
			prize: '1.8x Entry Fee',
			icon: 'user-group'
		},
		{
			type: 'Small League',
			entry: '€5 - €50',
			description: '3-10 participants with multiple winning positions',
			prize: '50% Winners',
			icon: 'users'
		},
		{
			type: 'Mega Contest',
			entry: '€10 - €500',
			description: 'Thousands of participants, huge prize pools',
			prize: 'Up to €100K',
			icon: 'trophy'
		}
	];

	// Pro tips
	const proTips = [
		{
			title: 'Research is Key',
			description: 'Study player form, pitch conditions, weather, and team news before selecting your team.',
			icon: 'magnifying-glass'
		},
		{
			title: 'Diversify Your Portfolio',
			description: 'Create multiple teams with different combinations to increase your winning chances.',
			icon: 'chart-bar'
		},
		{
			title: 'Captain Selection',
			description: 'Choose captains who are consistent performers and likely to get more opportunities.',
			icon: 'star'
		},
		{
			title: 'Budget Management',
			description: 'Balance expensive star players with budget picks to create a well-rounded team.',
			icon: 'currency-euro'
		},
		{
			title: 'Contest Selection',
			description: 'Start with smaller contests and gradually move to bigger ones as you gain experience.',
			icon: 'arrow-trending-up'
		}
	];

	let activeTab = $state('overview');
	let activeSport = $state('football');

	function getIconSvg(icon: string): string {
		const icons: Record<string, string> = {
			calendar: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />',
			users: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />',
			crown: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.5c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v4.127c0 2.49.824 4.916 2.343 6.75l.071.108c.054.082.12.15.196.196l.108.071c.497.497 1.042.625 1.407.625.365 0 .91-.128 1.407-.625l.108-.071A8.817 8.817 0 0 0 15.75 8.627V4.5Z" />',
			trophy: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.5c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v4.127c0 2.49.824 4.916 2.343 6.75l.071.108c.054.082.12.15.196.196l.108.071c.497.497 1.042.625 1.407.625.365 0 .91-.128 1.407-.625l.108-.071A8.817 8.817 0 0 0 15.75 8.627V4.5Z" />',
			chart: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />',
			'academic-cap': '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />',
			'user-group': '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />',
			'magnifying-glass': '<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />',
			'chart-bar': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />',
			star: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />',
			'currency-euro': '<path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
			'arrow-trending-up': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />'
		};
		return icons[icon] || icons.users;
	}
</script>

<svelte:head>
	<title>How to Play - PickNWin Fantasy Sports</title>
	<meta name="description" content="Learn how to play fantasy sports on PickNWin. Complete guide with rules, scoring system, and winning strategies." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
	<!-- Hero Section -->
	<section class="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-16">
		<div class="max-w-6xl mx-auto px-4 text-center">
			<h1 class="text-4xl md:text-5xl font-black mb-4">How to Play Fantasy Sports</h1>
			<p class="text-xl md:text-2xl text-lime-100 mb-8 max-w-3xl mx-auto">
				Master the art of fantasy sports with our comprehensive guide. From team building to winning strategies.
			</p>
			<div class="flex flex-wrap justify-center gap-4">
				<button 
					onclick={() => activeTab = 'overview'}
					class="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 {activeTab === 'overview' ? 'bg-white/30 ring-2 ring-white/50' : ''}"
				>
					Game Overview
				</button>
				<button 
					onclick={() => activeTab = 'scoring'}
					class="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 {activeTab === 'scoring' ? 'bg-white/30 ring-2 ring-white/50' : ''}"
				>
					Scoring Rules
				</button>
				<button 
					onclick={() => activeTab = 'contests'}
					class="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 {activeTab === 'contests' ? 'bg-white/30 ring-2 ring-white/50' : ''}"
				>
					Contest Types
				</button>
				<button 
					onclick={() => activeTab = 'tips'}
					class="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 {activeTab === 'tips' ? 'bg-white/30 ring-2 ring-white/50' : ''}"
				>
					Pro Tips
				</button>
			</div>
		</div>
	</section>

	<!-- Main Content -->
	<section class="max-w-6xl mx-auto px-4 py-16">
		<!-- Game Overview Tab -->
		{#if activeTab === 'overview'}
			<div class="space-y-12">
				<div class="text-center mb-12">
					<h2 class="text-3xl font-bold text-slate-900 mb-4">5 Simple Steps to Start Winning</h2>
					<p class="text-lg text-slate-600 max-w-2xl mx-auto">
						Fantasy sports is easy to learn but takes skill to master. Follow these steps to get started.
					</p>
				</div>

				<!-- Game Steps -->
				<div class="grid gap-8">
					{#each gameSteps as step, index}
						<div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
							<div class="flex flex-col md:flex-row">
								<!-- Step Number & Icon -->
								<div class="bg-gradient-to-br from-lime-400 to-lime-500 p-8 md:w-64 flex flex-col items-center justify-center text-center">
									<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
										<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											{@html getIconSvg(step.icon)}
										</svg>
									</div>
									<div class="text-3xl font-black text-white mb-2">Step {step.step}</div>
									<div class="text-lg font-semibold text-white">{step.title}</div>
								</div>

								<!-- Content -->
								<div class="p-8 flex-1">
									<p class="text-lg text-slate-700 mb-6 leading-relaxed">{step.description}</p>
									
									<!-- Tips -->
									<div class="space-y-3">
										<h4 class="font-semibold text-slate-900 mb-3">💡 Pro Tips:</h4>
										{#each step.tips as tip}
											<div class="flex items-center space-x-3">
												<div class="w-2 h-2 bg-lime-500 rounded-full"></div>
												<span class="text-slate-600">{tip}</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- CTA Section -->
				<div class="bg-gradient-to-r from-lime-500 to-lime-600 rounded-2xl p-8 text-center text-white">
					<h3 class="text-2xl font-bold mb-4">Ready to Start Playing?</h3>
					<p class="text-lime-100 mb-6">Join thousands of players and start winning real money today!</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						{#if $isAuthenticated}
							<button onclick={() => goto('/contests')} class="px-8 py-3 bg-white text-lime-600 font-bold rounded-xl hover:bg-lime-50 transition-colors">
								Browse Contests
							</button>
							<button onclick={() => goto('/matches')} class="px-8 py-3 bg-lime-400 text-lime-900 font-bold rounded-xl hover:bg-lime-300 transition-colors">
								View Matches
							</button>
						{:else}
							<button onclick={() => goto('/auth/register')} class="px-8 py-3 bg-white text-lime-600 font-bold rounded-xl hover:bg-lime-50 transition-colors">
								Sign Up Free
							</button>
							<button onclick={() => goto('/auth/login')} class="px-8 py-3 bg-lime-400 text-lime-900 font-bold rounded-xl hover:bg-lime-300 transition-colors">
								Login
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Scoring Rules Tab -->
		{#if activeTab === 'scoring'}
			<div class="space-y-8">
				<div class="text-center mb-12">
					<h2 class="text-3xl font-bold text-slate-900 mb-4">Scoring System</h2>
					<p class="text-lg text-slate-600 max-w-2xl mx-auto">
						Understand how points are awarded for different actions in each sport.
					</p>
				</div>

				<!-- Sport Selector -->
				<div class="flex justify-center mb-8">
					<div class="bg-white rounded-xl p-2 shadow-lg border border-slate-200">
						<button 
							onclick={() => activeSport = 'football'}
							class="px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-lime-500 text-white shadow-md"
						>
							⚽ Football
						</button>
					</div>
				</div>

				<!-- Scoring Table -->
				<div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
					<div class="bg-gradient-to-r from-lime-500 to-lime-600 p-6">
						<h3 class="text-xl font-bold text-white">
							⚽ Football Scoring Rules
						</h3>
					</div>
					<div class="p-6">
						<div class="grid gap-4">
							{#each scoringRules[activeSport] as rule}
								<div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
									<span class="font-medium text-slate-900">{rule.action}</span>
									<span class="font-bold text-lg {rule.points.startsWith('+') ? 'text-green-600' : 'text-red-600'}">
										{rule.points} pts
									</span>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Captain & Vice-Captain Info -->
				<div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
					<div class="flex items-center space-x-3 mb-4">
						<svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{@html getIconSvg('crown')}
						</svg>
						<h3 class="text-xl font-bold text-amber-900">Captain & Vice-Captain Multipliers</h3>
					</div>
					<div class="grid md:grid-cols-2 gap-4">
						<div class="bg-white rounded-xl p-4 border border-amber-200">
							<div class="text-2xl font-bold text-amber-600 mb-2">2x Points</div>
							<div class="font-semibold text-amber-900">Captain</div>
							<div class="text-sm text-amber-700">Your captain gets double points for all actions</div>
						</div>
						<div class="bg-white rounded-xl p-4 border border-amber-200">
							<div class="text-2xl font-bold text-amber-600 mb-2">1.5x Points</div>
							<div class="font-semibold text-amber-900">Vice-Captain</div>
							<div class="text-sm text-amber-700">Your vice-captain gets 1.5x points for all actions</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Contest Types Tab -->
		{#if activeTab === 'contests'}
			<div class="space-y-8">
				<div class="text-center mb-12">
					<h2 class="text-3xl font-bold text-slate-900 mb-4">Contest Types</h2>
					<p class="text-lg text-slate-600 max-w-2xl mx-auto">
						Choose from different contest formats based on your skill level and risk appetite.
					</p>
				</div>

				<div class="grid md:grid-cols-2 gap-6">
					{#each contestTypes as contest}
						<div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
							<div class="flex items-center space-x-4 mb-4">
								<div class="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center">
									<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{@html getIconSvg(contest.icon)}
									</svg>
								</div>
								<div>
									<h3 class="text-xl font-bold text-slate-900">{contest.type}</h3>
									<div class="text-lime-600 font-semibold">{contest.entry}</div>
								</div>
							</div>
							<p class="text-slate-600 mb-4">{contest.description}</p>
							<div class="bg-lime-50 rounded-xl p-4 border border-lime-200">
								<div class="text-sm font-medium text-lime-800 mb-1">Prize Pool</div>
								<div class="text-lg font-bold text-lime-600">{contest.prize}</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Contest Tips -->
				<div class="bg-blue-50 border border-blue-200 rounded-2xl p-6">
					<h3 class="text-xl font-bold text-blue-900 mb-4">💡 Contest Selection Tips</h3>
					<div class="grid md:grid-cols-2 gap-4">
						<div class="space-y-3">
							<div class="flex items-start space-x-3">
								<div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
								<span class="text-blue-800">Start with practice contests to learn the game</span>
							</div>
							<div class="flex items-start space-x-3">
								<div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
								<span class="text-blue-800">Head-to-head contests have higher win rates</span>
							</div>
						</div>
						<div class="space-y-3">
							<div class="flex items-start space-x-3">
								<div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
								<span class="text-blue-800">Mega contests offer huge prizes but lower win rates</span>
							</div>
							<div class="flex items-start space-x-3">
								<div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
								<span class="text-blue-800">Diversify across multiple contest types</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Pro Tips Tab -->
		{#if activeTab === 'tips'}
			<div class="space-y-8">
				<div class="text-center mb-12">
					<h2 class="text-3xl font-bold text-slate-900 mb-4">Pro Tips & Strategies</h2>
					<p class="text-lg text-slate-600 max-w-2xl mx-auto">
						Learn from the experts and improve your fantasy sports skills with these proven strategies.
					</p>
				</div>

				<div class="grid gap-6">
					{#each proTips as tip, index}
						<div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
									<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{@html getIconSvg(tip.icon)}
									</svg>
								</div>
								<div class="flex-1">
									<h3 class="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
									<p class="text-slate-600 leading-relaxed">{tip.description}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Advanced Strategies -->
				<div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
					<h3 class="text-2xl font-bold mb-6">🎯 Advanced Strategies</h3>
					<div class="grid md:grid-cols-2 gap-6">
						<div class="space-y-4">
							<div class="bg-white/20 rounded-xl p-4">
								<h4 class="font-bold mb-2">🔄 Stacking Strategy</h4>
								<p class="text-purple-100 text-sm">Pick multiple players from the same team when they're likely to perform well together.</p>
							</div>
							<div class="bg-white/20 rounded-xl p-4">
								<h4 class="font-bold mb-2">📊 Contrarian Picks</h4>
								<p class="text-purple-100 text-sm">In large contests, pick less popular players who could have big games.</p>
							</div>
						</div>
						<div class="space-y-4">
							<div class="bg-white/20 rounded-xl p-4">
								<h4 class="font-bold mb-2">💰 Bankroll Management</h4>
								<p class="text-purple-100 text-sm">Never risk more than 10% of your bankroll in a single contest.</p>
							</div>
							<div class="bg-white/20 rounded-xl p-4">
								<h4 class="font-bold mb-2">📈 Late Swap</h4>
								<p class="text-purple-100 text-sm">Make last-minute changes based on team news and weather updates.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<!-- Bottom CTA -->
	<section class="bg-slate-900 text-white py-16">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-bold mb-4">Ready to Put Your Skills to the Test?</h2>
			<p class="text-xl text-slate-300 mb-8">
				Join millions of fantasy sports players and start your winning journey today!
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				{#if $isAuthenticated}
					<button onclick={() => goto('/contests')} class="px-8 py-4 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition-colors shadow-lg">
						Start Playing Now
					</button>
					<button onclick={() => goto('/matches')} class="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600">
						View Live Matches
					</button>
				{:else}
					<button onclick={() => goto('/auth/register')} class="px-8 py-4 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition-colors shadow-lg">
						Sign Up Free
					</button>
					<button onclick={() => goto('/auth/login')} class="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600">
						Login to Play
					</button>
				{/if}
			</div>
		</div>
	</section>
</div>