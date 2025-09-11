import { writable } from 'svelte/store';
import type { Match, Contest } from '$lib/types';
import { ApiService } from '$lib/services/api';

// Matches store
interface MatchesState {
	matches: Match[];
	selectedMatch: Match | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: MatchesState = {
	matches: [],
	selectedMatch: null,
	isLoading: false,
	error: null
};

function createMatchesStore() {
	const { subscribe, set, update } = writable<MatchesState>(initialState);

	return {
		subscribe,
		
		// Actions
		async loadMatches() {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.getMatches();
				
				if (response.success) {
					update(state => ({
						...state,
						matches: response.data!,
						isLoading: false
					}));
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to load matches'
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
		
		async loadMatch(id: string) {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.getMatch(id);
				
				if (response.success) {
					update(state => ({
						...state,
						selectedMatch: response.data!,
						isLoading: false
					}));
					return response.data!;
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to load match'
					}));
					return null;
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Network error'
				}));
				return null;
			}
		},
		
		setSelectedMatch(match: Match | null) {
			update(state => ({ ...state, selectedMatch: match }));
		},
		
		clearError() {
			update(state => ({ ...state, error: null }));
		}
	};
}

export const matchesStore = createMatchesStore();

// Contests store
interface ContestsState {
	contests: Contest[];
	selectedContest: Contest | null;
	isLoading: boolean;
	error: string | null;
}

const initialContestsState: ContestsState = {
	contests: [],
	selectedContest: null,
	isLoading: false,
	error: null
};

function createContestsStore() {
	const { subscribe, set, update } = writable<ContestsState>(initialContestsState);

	return {
		subscribe,
		
		// Actions
		async loadContests(matchId?: string) {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.getContests(matchId);
				
				if (response.success) {
					update(state => ({
						...state,
						contests: response.data!,
						isLoading: false
					}));
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to load contests'
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
		
		async loadContest(id: string) {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.getContest(id);
				
				if (response.success) {
					update(state => ({
						...state,
						selectedContest: response.data!,
						isLoading: false
					}));
					return response.data!;
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to load contest'
					}));
					return null;
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Network error'
				}));
				return null;
			}
		},
		
		async joinContest(contestId: string, teamId: string) {
			try {
				const response = await ApiService.joinContest(contestId, teamId);
				
				if (response.success) {
					// Update contest entry count locally
					update(state => ({
						...state,
						contests: state.contests.map(contest => 
							contest.id === contestId 
								? { ...contest, currentEntries: contest.currentEntries + 1 }
								: contest
						)
					}));
					return { success: true };
				} else {
					return { success: false, error: response.error };
				}
			} catch (error) {
				return { success: false, error: 'Network error' };
			}
		},
		
		setSelectedContest(contest: Contest | null) {
			update(state => ({ ...state, selectedContest: contest }));
		},
		
		clearError() {
			update(state => ({ ...state, error: null }));
		}
	};
}

export const contestsStore = createContestsStore();