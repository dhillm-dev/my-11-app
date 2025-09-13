<script lang="ts">
	import { onMount } from 'svelte';
	import { walletStore } from '$lib/stores';
	import { goto } from '$app/navigation';

	interface Transaction {
		type: 'add_money' | 'contest_entry' | 'contest_win' | 'refund' | 'bonus';
		description: string;
		amount?: number;
		date?: string;
		id?: string;
	}

	let showAddMoney = false;
	let addAmount = '';
	let selectedPaymentMethod = 'upi';
	let isProcessing = false;

	const quickAmounts = [100, 500, 1000, 2000, 5000];
	const paymentMethods = [
		{ id: 'upi', name: 'UPI', icon: '📱', description: 'Pay using UPI apps' },
		{ id: 'card', name: 'Debit/Credit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
		{ id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks' },
		{ id: 'wallet', name: 'Digital Wallet', icon: '📲', description: 'Paytm, PhonePe, GPay' }
	];

	onMount(async () => {
		await Promise.all([
			walletStore.loadTransactions()
		]);
	});

	function selectQuickAmount(amount: number) {
		addAmount = amount.toString();
	}

	async function addMoney() {
		const amount = parseFloat(addAmount);
		
		if (!amount || amount < 10) {
			alert('Minimum amount is €10');
			return;
		}

		if (amount > 100000) {
			alert('Maximum amount is €100,000');
			return;
		}

		isProcessing = true;

		try {
			// Simulate payment processing
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Add money to wallet
			await walletStore.addMoney(amount, selectedPaymentMethod);
			
			// Reset form
			addAmount = '';
			showAddMoney = false;
			
			alert(`€${amount} added successfully!`);
		} catch (error) {
			alert('Payment failed. Please try again.');
		} finally {
			isProcessing = false;
		}
	}

	function getTransactionIcon(type: string) {
		switch (type) {
			case 'add_money': return '💰';
			case 'contest_entry': return '🎯';
			case 'contest_win': return '🏆';
			case 'refund': return '↩️';
			case 'bonus': return '🎁';
			default: return '💳';
		}
	}

	function getTransactionColor(type: string) {
		switch (type) {
			case 'add_money':
			case 'contest_win':
			case 'refund':
			case 'bonus':
				return 'text-emerald-600';
			case 'contest_entry':
				return 'text-red-600';
			default:
				return 'text-slate-600';
		}
	}

	function formatTransactionTitle(transaction: Transaction) {
		switch (transaction.type) {
			case 'add_money': return 'Money Added';
			case 'contest_entry': return `Contest Entry - ${transaction.description}`;
			case 'contest_win': return `Contest Win - ${transaction.description}`;
			case 'refund': return `Refund - ${transaction.description}`;
			case 'bonus': return `Bonus - ${transaction.description}`;
			default: return transaction.description;
		}
	}
</script>

<svelte:head>
	<title>Wallet - PickNWin</title>
	<meta name="description" content="Manage your wallet balance and transactions" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 pb-20">
	<!-- Header -->
	<div class="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 p-4 shadow-lg shadow-slate-200/50">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-400/25">
					<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
					</svg>
				</div>
				<h1 class="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">My Wallet</h1>
			</div>
			<button 
				on:click={() => goto('/profile')}
				aria-label="Go to profile"
				class="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:shadow-slate-300/60 transition-all duration-300 hover:scale-105"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Wallet Balance Card -->
	<div class="p-4">
		<div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02]"> relative overflow-hidden">
			<!-- Decorative Elements -->
			<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lime-400/20 to-lime-500/20 rounded-full -translate-y-16 translate-x-16"></div>
			<div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-lime-400/20 to-emerald-500/20 rounded-full translate-y-12 -translate-x-12"></div>
			
			<div class="relative z-10">
				<div class="flex items-center justify-between mb-6">
					<div>
						<div class="flex items-center space-x-2 mb-2">
							<div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
							<p class="text-slate-600 text-sm font-bold">Available Balance</p>
						</div>
						<p class="text-4xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">€{$walletStore.balance?.toLocaleString() || '0'}</p>
					</div>
					<div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-400/25">
						<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
						</svg>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30">
						<div class="flex items-center space-x-2 mb-2">
							<svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<p class="text-slate-600 text-xs font-bold">Bonus Cash</p>
						</div>
						<p class="text-xl font-black text-slate-900">€{$walletStore.bonusBalance?.toLocaleString() || '0'}</p>
					</div>
					<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30">
						<div class="flex items-center space-x-2 mb-2">
							<svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							</svg>
							<p class="text-slate-600 text-xs font-bold">Winnings</p>
						</div>
						<p class="text-xl font-black text-slate-900">€{$walletStore.winningsBalance?.toLocaleString() || '0'}</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="px-4 mb-6">
		<div class="grid grid-cols-2 gap-4">
			<button
				on:click={() => showAddMoney = true}
				class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105 group relative overflow-hidden"
			>
				<!-- Decorative gradient -->
				<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
				
				<div class="relative z-10">
					<div class="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-lime-400/25 group-hover:scale-110 transition-transform duration-300">
						<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="text-lg font-black text-slate-900 mb-1">Add Money</div>
					<div class="text-sm font-bold text-slate-600">Instant & Secure</div>
				</div>
			</button>

			<button
					on:click={() => goto('/withdraw')}
					class="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105 group relative overflow-hidden"
				>
				<!-- Decorative gradient -->
				<div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
				
				<div class="relative z-10">
					<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-400/25 group-hover:scale-110 transition-transform duration-300">
						<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="text-lg font-black text-slate-900 mb-1">Withdraw</div>
					<div class="text-sm font-bold text-slate-600">To Bank Account</div>
				</div>
			</button>
		</div>
	</div>

	<!-- Transaction History -->
	<div class="px-4">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">Recent Transactions</h2>
			<button class="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 text-emerald-600 text-sm font-bold hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105">
				View All
			</button>
		</div>

		<div class="space-y-4">
			{#each $walletStore.transactions || [] as transaction}
				<div class="bg-white/60 backdrop-blur-sm p-5 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
					<!-- Decorative gradient based on transaction type -->
					<div class="absolute top-0 right-0 w-20 h-20 {transaction.type === 'contest_entry' ? 'bg-gradient-to-br from-red-400/20 to-red-600/20' : 'bg-gradient-to-br from-emerald-400/20 to-emerald-600/20'} rounded-full -translate-y-10 translate-x-10"></div>
					
					<div class="relative z-10 flex items-center justify-between">
						<div class="flex items-center space-x-4">
							<div class="w-12 h-12 {transaction.type === 'contest_entry' ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'} rounded-2xl flex items-center justify-center shadow-lg {transaction.type === 'contest_entry' ? 'shadow-red-400/25' : 'shadow-emerald-400/25'}">
								<span class="text-lg">{getTransactionIcon(transaction.type)}</span>
							</div>
							<div>
								<h3 class="font-black text-slate-900 text-lg">{formatTransactionTitle(transaction)}</h3>
								<div class="flex items-center space-x-2">
									<div class="w-2 h-2 bg-slate-400 rounded-full"></div>
									<p class="text-sm font-bold text-slate-600">{new Date(transaction.createdAt).toLocaleDateString()}</p>
								</div>
							</div>
						</div>

						<div class="text-right">
							<div class="text-xl font-black {getTransactionColor(transaction.type)}">
								{transaction.type === 'contest_entry' ? '-' : '+'}€{Math.abs(transaction.amount).toLocaleString()}
							</div>
							<div class="text-xs font-bold text-slate-500 capitalize bg-slate-100 px-2 py-1 rounded-full mt-1">{transaction.status}</div>
						</div>
					</div>
				</div>
			{/each}

			{#if !$walletStore.transactions || $walletStore.transactions.length === 0}
				<div class="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 text-center relative overflow-hidden">
					<!-- Decorative elements -->
					<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-full -translate-y-12 translate-x-12"></div>
					<div class="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-slate-300/20 to-slate-500/20 rounded-full translate-y-10 -translate-x-10"></div>
					
					<div class="relative z-10">
						<div class="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-slate-400/25">
							<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
							</svg>
						</div>
						<h3 class="text-xl font-black text-slate-900 mb-2">No transactions yet</h3>
						<p class="text-slate-600 font-bold mb-6">Your transaction history will appear here</p>
						<button
							on:click={() => showAddMoney = true}
							class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
						>
							Add Money Now
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Add Money Modal -->
{#if showAddMoney}
	<div class="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-end z-50">
		<div class="bg-white/90 backdrop-blur-sm w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] border-t border-slate-100/30 relative">
			<!-- Decorative elements -->
			<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-16 translate-x-16"></div>
			<div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-blue-600/20 rounded-full translate-y-12 -translate-x-12"></div>
			
			<div class="relative z-10">
				<div class="flex items-center justify-between mb-8">
					<div class="flex items-center space-x-3">
						<div class="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-400/25">
							<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
							</svg>
						</div>
						<h2 class="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">Add Money</h2>
					</div>
					<button 
						on:click={() => showAddMoney = false}
						aria-label="Close add money dialog"
						class="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:shadow-slate-300/60 transition-all duration-300 hover:scale-105"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Amount Input -->
				<div class="mb-8">
					<label for="add-amount" class="block text-sm font-black text-slate-700 mb-3">Enter Amount</label>
					<div class="relative">
						<span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600 font-black text-lg">€</span>
						<input
							id="add-amount"
							type="number"
							bind:value={addAmount}
							placeholder="0"
							min="10"
							max="100000"
							class="w-full pl-10 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xl font-black shadow-lg shadow-slate-200/50 transition-all duration-300"
						/>
					</div>
					<p class="text-xs font-bold text-slate-600 mt-2">Minimum €10, Maximum €1,00,000</p>
				</div>

				<!-- Quick Amount Buttons -->
				<fieldset class="mb-8">
					<legend class="block text-sm font-black text-slate-700 mb-4">Quick Select</legend>
					<div class="grid grid-cols-3 gap-3">
						{#each quickAmounts as amount}
							<button
							on:click={() => selectQuickAmount(amount)}
							class="p-4 bg-white/60 backdrop-blur-sm shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 rounded-2xl text-center hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105 {addAmount === amount.toString() ? 'shadow-[inset_6px_6px_12px_#10b981,inset_-6px_-6px_12px_#ffffff] border-emerald-300' : ''}"
						>
							<div class="font-black text-slate-900 text-lg">€{amount.toLocaleString()}</div>
						</button>
						{/each}
					</div>
				</fieldset>

				<!-- Payment Methods -->
				<fieldset class="mb-8">
					<legend class="block text-sm font-black text-slate-700 mb-4">Payment Method</legend>
					<div class="space-y-3">
						{#each paymentMethods as method}
							<button
								on:click={() => selectedPaymentMethod = method.id}
								class="w-full p-5 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl text-left hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-slate-200/50 {selectedPaymentMethod === method.id ? 'border-emerald-500 bg-emerald-50/80 shadow-emerald-500/25' : ''}"
							>
								<div class="flex items-center space-x-4">
									<div class="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-400/25">
										<span class="text-2xl">{method.icon}</span>
									</div>
									<div class="flex-1">
										<div class="font-black text-slate-900 text-lg">{method.name}</div>
										<div class="text-sm font-bold text-slate-600">{method.description}</div>
									</div>
									{#if selectedPaymentMethod === method.id}
										<div class="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-400/25">
											<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
											</svg>
										</div>
									{/if}
								</div>
							</button>
					{/each}
				</div>
			</fieldset>

				<!-- Add Money Button -->
				<button
					on:click={addMoney}
					disabled={!addAmount || parseFloat(addAmount) < 10 || isProcessing}
					class="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg {!addAmount || parseFloat(addAmount) < 10 || isProcessing ? 'bg-slate-200/80 text-slate-500 shadow-slate-200/50' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-[1.02]'}"
				>
					{#if isProcessing}
						<div class="flex items-center justify-center space-x-3">
							<div class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
							<span>Processing...</span>
						</div>
					{:else}
						<div class="flex items-center justify-center space-x-2">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
							</svg>
							<span>Add €{addAmount || '0'}</span>
						</div>
					{/if}
				</button>

					</div>
					<button 
						on:click={() => showAddMoney = false}
						aria-label="Close add money dialog"
						class="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:shadow-slate-300/60 transition-all duration-300 hover:scale-105"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Security Note -->
				<div class="mt-6 p-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50">
					<div class="flex items-start space-x-3">
						<div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-400/25">
							<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clip-rule="evenodd" />
							</svg>
						</div>
						<div>
							<p class="text-sm font-black text-slate-900">100% Secure Payment</p>
							<p class="text-xs font-bold text-slate-600">Your payment information is encrypted and secure</p>
						</div>
					</div>
				</div>
			</div>
{/if}
</div>