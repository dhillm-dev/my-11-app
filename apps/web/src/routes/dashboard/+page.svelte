<script lang="ts">
	import { onMount } from 'svelte';
	import { user, walletStore, contestsStore, matchesStore } from '$lib/stores';
	import { isAuthenticated } from '$lib/stores';
	import { goto } from '$app/navigation';
	import LoginModal from '$lib/components/LoginModal.svelte';

	let upcomingMatches: any[] = [];
	let recentActivity: any[] = [];
	let showLoginModal = false;
	let loginModalConfig = {
		title: 'Login Required',
		message: 'Please login to access wallet features.',
		actionText: 'Access Wallet'
	};

	onMount(async () => {
		// Load dashboard data
		await Promise.all([
			contestsStore.loadContests(),
			matchesStore.loadMatches()
		]);

		// Get upcoming matches with mock data matching the design
		upcomingMatches = [
			{ 
				id: 1, 
				team1: 'MUN', 
				team2: 'LIV', 
				team1Logo: '🔴', 
				team2Logo: '🔴', 
				date: '9/8/2025', 
				league: 'Premier League' 
			},
			{ 
				id: 2, 
				team1: 'CHE', 
				team2: 'ARS', 
				team1Logo: '🔵', 
				team2Logo: '🔴', 
				date: '9/9/2025', 
				league: 'Premier League' 
			},
			{ 
				id: 3, 
				team1: 'RM', 
				team2: 'BAR', 
				team1Logo: '⚪', 
				team2Logo: '🔵', 
				date: '9/11/2025', 
				league: 'La Liga' 
			}
		];

		// Mock recent activity
		recentActivity = [
			{ type: 'bonus', title: 'Welcome Bonus', time: '9/8/2025', amount: '+€1200', icon: '🎁' }
		];
	});

	function handleAddMoney() {
		if (!$isAuthenticated) {
			loginModalConfig = {
				title: 'Add Money to Wallet',
				message: 'Please login to add money to your wallet.',
				actionText: 'Add Money'
			};
			showLoginModal = true;
			return;
		}
		// Navigate to add money page or show add money modal
		goto('/wallet/add-money');
	}

	function handleWalletHistory() {
		if (!$isAuthenticated) {
			loginModalConfig = {
				title: 'View Wallet History',
				message: 'Please login to view your wallet transaction history.',
				actionText: 'View History'
			};
			showLoginModal = true;
			return;
		}
		// Navigate to wallet history page
		goto('/wallet/history');
	}
</script>

<svelte:head>
	<title>Dashboard - PickNWin</title>
	<meta name="description" content="Your fantasy cricket dashboard" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 pb-20">
		<!-- Welcome Header -->
		<div class="mb-8">
			<div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-slate-200/50 border-2 border-slate-200/60">
				<h1 class="text-3xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
					Welcome back, {$user?.name || 'Champion'}! 👋
				</h1>
				<p class="text-slate-600 font-medium text-lg">Ready to dominate some contests today?</p>
				<div class="mt-4 flex items-center space-x-2">
					<div class="w-3 h-3 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full animate-pulse"></div>
					<span class="text-sm font-bold text-slate-700">Live Dashboard</span>
				</div>
			</div>
		</div>

		<!-- Enhanced Wallet & Stats Cards -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
			<!-- Enhanced Wallet Balance Card -->
			<div class="lg:col-span-2 bg-gradient-to-br from-lime-400/10 via-emerald-400/5 to-lime-500/10 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-lime-200/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.01]">
				<div class="flex items-center justify-between mb-6">
					<div class="flex items-center space-x-4">
						<div class="w-16 h-16 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-400/25">
							<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
							</svg>
						</div>
						<div>
							<div class="text-4xl font-black text-slate-900 mb-1">€{($user?.balance || 0).toLocaleString()}</div>
							<div class="text-sm font-bold text-slate-600">Available Balance</div>
						</div>
					</div>
					<div class="text-right">
						<div class="w-3 h-3 bg-lime-400 rounded-full animate-pulse mb-2"></div>
						<span class="text-xs font-medium text-lime-600 bg-lime-50 px-2 py-1 rounded-full">+12% this week</span>
					</div>
				</div>
				
				<!-- Quick Wallet Actions -->
				<div class="grid grid-cols-2 gap-3">
					<button on:click={handleAddMoney} class="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] border border-slate-100/30 hover:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 hover:scale-[1.02] group">
						<div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-2 mx-auto shadow-lg shadow-blue-400/25 group-hover:scale-110 transition-transform duration-300">
							<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
							</svg>
						</div>
						<p class="text-xs font-bold text-slate-700">Add Money</p>
					</button>
					
					<button on:click={handleWalletHistory} class="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] border border-slate-100/30 hover:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 hover:scale-[1.02] group">
						<div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-2 mx-auto shadow-lg shadow-purple-400/25 group-hover:scale-110 transition-transform duration-300">
							<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
							</svg>
						</div>
						<p class="text-xs font-bold text-slate-700">History</p>
					</button>
				</div>
			</div>
			
			<!-- Combined Stats Card -->
			<div class="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02]">
				<h3 class="text-lg font-black text-slate-900 mb-4 flex items-center space-x-2">
					<span>Your Stats</span>
					<div class="w-6 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
				</h3>
				
				<div class="space-y-4">
					<!-- Total Winnings -->
					<div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl">
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/25">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
							</div>
							<div>
								<p class="text-sm font-bold text-slate-600">Total Winnings</p>
								<p class="text-lg font-black text-slate-900">€0</p>
							</div>
						</div>
						<span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Start playing!</span>
					</div>
					
					<!-- Win Rate -->
					<div class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl">
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-400/25">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
							</div>
							<div>
								<p class="text-sm font-bold text-slate-600">Win Rate</p>
								<p class="text-lg font-black text-slate-900">0%</p>
							</div>
						</div>
						<span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Build streak</span>
					</div>
					
					<!-- Contests Joined -->
					<div class="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl">
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-400/25">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<p class="text-sm font-bold text-slate-600">Contests Joined</p>
								<p class="text-lg font-black text-slate-900">0</p>
							</div>
						</div>
						<span class="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Get started</span>
					</div>
				</div>
			</div>



		<!-- Enhanced Quick Actions -->
		<div class="mb-8">
			<h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center space-x-3">
				<span>Quick Actions</span>
				<div class="w-8 h-1 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full"></div>
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<button 
					on:click={() => goto('/contests')}
					class="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] hover:scale-[1.02] transition-all duration-300 flex flex-col items-center space-y-3 group"
				>
					<div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-400/25 group-hover:scale-110 transition-transform duration-300">
						<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="text-center">
						<p class="font-black text-lg text-slate-900 mb-1">Live Matches</p>
						<p class="text-xs font-medium text-slate-600">View & join contests</p>
						<span class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full mt-2 inline-block">3 Live</span>
					</div>
				</button>
				
				<button 
					on:click={() => goto('/contests')}
					class="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] hover:scale-[1.02] transition-all duration-300 flex flex-col items-center space-y-3 group"
				>
					<div class="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-400/25 group-hover:scale-110 transition-transform duration-300">
						<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="text-center">
						<p class="font-black text-lg text-slate-900 mb-1">Join Contest</p>
						<p class="text-xs font-medium text-slate-600">Enter & win prizes</p>
						<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2 inline-block">€50K Pool</span>
					</div>
				</button>
				
				<button 
					on:click={() => goto('/team-builder')}
					class="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] hover:scale-[1.02] transition-all duration-300 flex flex-col items-center space-y-3 group"
				>
					<div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/25 group-hover:scale-110 transition-transform duration-300">
						<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
							<path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45-1.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="text-center">
						<p class="font-black text-lg text-slate-900 mb-1">Build Team</p>
						<p class="text-xs font-medium text-slate-600">Create your squad</p>
						<span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-2 inline-block">New</span>
					</div>
				</button>
				
				<button 
					on:click={() => goto('/leaderboard')}
					class="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] hover:scale-[1.02] transition-all duration-300 flex flex-col items-center space-y-3 group"
				>
					<div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-400/25 group-hover:scale-110 transition-transform duration-300">
						<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="text-center">
						<p class="font-black text-lg text-slate-900 mb-1">Leaderboard</p>
						<p class="text-xs font-medium text-slate-600">Check rankings</p>
						<span class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full mt-2 inline-block">Top 100</span>
					</div>
				</button>
			</div>
		</div>

		<!-- Upcoming Matches -->
		<div class="mb-8">
			<h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center space-x-3">
				<span>Upcoming Matches</span>
				<div class="w-8 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
			</h2>
			<div class="space-y-6">
				{#each upcomingMatches as match}
					<div class="bg-white/70 backdrop-blur-sm p-6 rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 hover:scale-[1.01] transition-all duration-300 group">
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center space-x-6">
								<div class="text-center relative">
									<div class="flex items-center space-x-4">
										<div class="text-center">
											<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-400/25">
												<span class="text-white font-black text-lg">{match.team1.substring(0, 2)}</span>
											</div>
											<p class="font-black text-sm text-slate-900">{match.team1}</p>
										</div>
										<div class="flex flex-col items-center px-4">
											<div class="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mb-1">
												<span class="text-white font-bold text-xs">VS</span>
											</div>
											<span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">LIVE</span>
										</div>
										<div class="text-center">
											<div class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-red-400/25">
												<span class="text-white font-black text-lg">{match.team2.substring(0, 2)}</span>
											</div>
											<p class="font-black text-sm text-slate-900">{match.team2}</p>
										</div>
									</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-sm font-medium text-slate-900">{match.date}</div>
								<div class="text-xs text-slate-500">{match.league}</div>
							</div>
						</div>
						
						<div class="grid grid-cols-3 gap-3 mb-4">
							<div class="bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-center shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300">
								<div class="text-xs font-bold text-slate-600 mb-2">Mega Contest</div>
								<div class="text-sm font-black text-slate-900 mb-1">Prize Pool: €50,000</div>
								<div class="text-xs text-slate-500 mb-3">Entry: €100 • 50,000 spots</div>
								<button class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs py-2 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-400/25">Join Contest</button>
							</div>
							
							<div class="bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-center shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300">
								<div class="text-xs font-bold text-slate-600 mb-2">Grand League</div>
								<div class="text-sm font-black text-slate-900 mb-1">Prize Pool: €10,000</div>
								<div class="text-xs text-slate-500 mb-3">Entry: €25 • 10,000 spots</div>
								<button class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs py-2 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-400/25">Join Contest</button>
							</div>
							
							<div class="bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-center shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300">
								<div class="text-xs font-bold text-slate-600 mb-2">Head to Head</div>
								<div class="text-sm font-black text-slate-900 mb-1">Prize Pool: €100</div>
								<div class="text-xs text-slate-500 mb-3">Entry: €50 • 2 spots</div>
								<button class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs py-2 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-400/25">Join Contest</button>
							</div>
						</div>
						
						<div class="text-xs font-medium text-slate-500 text-center bg-slate-50/50 rounded-xl py-2 px-4">
							{#if match.id === 1}
								Old Trafford • 🕐 Lineup out 1h 30m before
							{:else if match.id === 2}
								Stamford Bridge • 🕐 Lineup out 1h 30m before
							{:else}
								Santiago Bernabéu • 🕐 Lineup out 1h 30m before
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="mb-8">
			<h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center space-x-3">
				<span>Recent Activity</span>
				<div class="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
			</h2>
			<div class="space-y-4">
				{#each recentActivity as activity}
					<div class="bg-white/70 backdrop-blur-sm p-5 rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 hover:scale-[1.01] transition-all duration-300 flex items-center space-x-4 group">
						<div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 {activity.type === 'win' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-400/25' : activity.type === 'loss' ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-400/25' : 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-400/25'}">
							{#if activity.type === 'win'}
								<svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
							{:else if activity.type === 'loss'}
								<svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							{:else}
								<span class="text-white text-2xl">{activity.icon}</span>
							{/if}
						</div>
						<div class="flex-1">
							<p class="font-black text-lg text-slate-900 mb-1">{activity.title}</p>
							<div class="flex items-center space-x-3">
								<p class="text-sm font-medium text-slate-600">{activity.time}</p>
								<span class="text-xs font-bold px-2 py-1 rounded-full {activity.type === 'win' ? 'text-emerald-600 bg-emerald-50' : activity.type === 'loss' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'}">
									{activity.type === 'win' ? 'Won' : activity.type === 'loss' ? 'Lost' : 'Bonus'}
								</span>
							</div>
						</div>
						<div class="text-right">
							<p class="font-black text-xl mb-1 {activity.type === 'win' ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' : activity.type === 'loss' ? 'bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'}">
								{activity.amount}
							</p>
							{#if activity.type === 'win'}
								<div class="flex items-center justify-end space-x-1">
									<svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
									</svg>
									<span class="text-xs font-bold text-emerald-600">+15%</span>
								</div>
							{:else if activity.type === 'loss'}
								<div class="flex items-center justify-end space-x-1">
									<svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
									<span class="text-xs font-bold text-red-600">-8%</span>
								</div>
							{:else}
								<div class="flex items-center justify-end space-x-1">
									<span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Welcome</span>
								</div>
							{/if}
						</div>
					</div>
				{/each}
	</div>
		</div>
	</div>
</div>

<!-- Login Modal -->
<LoginModal
	bind:isOpen={showLoginModal}
	title={loginModalConfig.title}
	message={loginModalConfig.message}
	actionText={loginModalConfig.actionText}
	on:close={() => showLoginModal = false}
/>