import { writable } from 'svelte/store';
import type { Transaction } from '$lib/types';
import { ApiService } from '$lib/services/api';
import { userActions } from './user';

// Wallet store
interface WalletState {
	transactions: Transaction[];
	balance: number;
	bonusBalance: number;
	winningsBalance: number;
	isLoading: boolean;
	error: string | null;
}

const initialState: WalletState = {
	transactions: [],
	balance: 0,
	bonusBalance: 0,
	winningsBalance: 0,
	isLoading: false,
	error: null
};

function createWalletStore() {
	const { subscribe, set, update } = writable<WalletState>(initialState);

	return {
		subscribe,
		
		// Actions
		async loadTransactions() {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.getTransactions();
				
				if (response.success) {
					update(state => ({
						...state,
						transactions: response.data!,
						isLoading: false
					}));
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to load transactions'
					}));
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Network error'
				}));
			}
		},
		
		async addMoney(amount: number, paymentMethod?: string) {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.addMoney(amount);
				
				if (response.success) {
					// Reload transactions to get the new deposit
					await this.loadTransactions();
					
					// Update user store balance
					const currentUser = await ApiService.getCurrentUser();
					if (currentUser.success) {
						userActions.updateBalance(currentUser.data!.balance);
					}
					
					return { success: true };
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to add money'
					}));
					return { success: false, error: response.error };
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Network error'
				}));
				return { success: false, error: 'Network error' };
			}
		},
		
		addTransaction(transaction: Transaction) {
			update(state => ({
				...state,
				transactions: [transaction, ...state.transactions]
			}));
		},

		clearError() {
			update(state => ({ ...state, error: null }));
		}
	};
}

export const walletStore = createWalletStore();