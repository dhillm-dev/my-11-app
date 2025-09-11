import { writable } from 'svelte/store';
import type { Team, Player } from '$lib/types';
import { ApiService } from '$lib/services/api';

interface UserStats {
	totalTeams: number;
	contestsJoined: number;
	contestsWon: number;
	totalWinnings: number;
}

// Teams store
interface TeamsState {
	teams: Team[];
	selectedTeam: Team | null;
	isLoading: boolean;
	error: string | null;
	userStats: UserStats | null;
}

const initialState: TeamsState = {
	teams: [],
	selectedTeam: null,
	isLoading: false,
	error: null,
	userStats: null
};

function createTeamsStore() {
	const { subscribe, set, update } = writable<TeamsState>(initialState);

	return {
			subscribe,
			
			// Actions
			async loadUserStats() {
				try {
					// Mock user stats - in real app this would come from API
					const mockStats: UserStats = {
						totalTeams: 15,
						contestsJoined: 42,
						contestsWon: 8,
						totalWinnings: 2450
					};
					
					update(state => ({
						...state,
						userStats: mockStats
					}));
				} catch (error) {
					console.error('Failed to load user stats:', error);
				}
			},
			
			async loadTeams(matchId?: string) {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.getMyTeams(matchId);
				
				if (response.success) {
					update(state => ({
						...state,
						teams: response.data!,
						isLoading: false
					}));
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to load teams'
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
		
		async saveTeam(team: Omit<Team, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
			update(state => ({ ...state, isLoading: true, error: null }));
			
			try {
				const response = await ApiService.saveTeam(team);
				
				if (response.success) {
					update(state => ({
						...state,
						teams: [...state.teams, response.data!],
						isLoading: false
					}));
					return { success: true, data: response.data! };
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: response.error || 'Failed to save team'
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
		
		setSelectedTeam(team: Team | null) {
			update(state => ({ ...state, selectedTeam: team }));
		},
		
		clearError() {
			update(state => ({ ...state, error: null }));
		}
	};
}

export const teamsStore = createTeamsStore();

// Team Builder store for creating/editing teams
interface TeamBuilderState {
	selectedPlayers: Player[];
	captain: Player | null;
	viceCaptain: Player | null;
	totalCredits: number;
	usedCredits: number;
	teamName: string;
	validationErrors: string[];
}

const initialBuilderState: TeamBuilderState = {
	selectedPlayers: [],
	captain: null,
	viceCaptain: null,
	totalCredits: 100,
	usedCredits: 0,
	teamName: '',
	validationErrors: []
};

function createTeamBuilderStore() {
	const { subscribe, set, update } = writable<TeamBuilderState>(initialBuilderState);

	return {
		subscribe,
		
		// Actions
		addPlayer(player: Player) {
			update(state => {
				if (state.selectedPlayers.length >= 11) {
					return { ...state, validationErrors: ['Team is full (11 players)'] };
				}
				
				if (state.selectedPlayers.find(p => p.id === player.id)) {
					return { ...state, validationErrors: ['Player already selected'] };
				}
				
				const newUsedCredits = state.usedCredits + player.credits;
				if (newUsedCredits > state.totalCredits) {
					return { ...state, validationErrors: ['Not enough credits'] };
				}
				
				// Check position limits
				const positionCount = state.selectedPlayers.filter(p => p.position === player.position).length;
				const limits = { GK: 1, DEF: 5, MID: 5, FWD: 3 };
				
				if (positionCount >= limits[player.position]) {
					return { ...state, validationErrors: [`Maximum ${limits[player.position]} ${player.position} players allowed`] };
				}
				
				// Check team limits (max 6 from same team)
				const teamCount = state.selectedPlayers.filter(p => p.team === player.team).length;
				if (teamCount >= 6) {
					return { ...state, validationErrors: ['Maximum 6 players from same team'] };
				}
				
				return {
					...state,
					selectedPlayers: [...state.selectedPlayers, player],
					usedCredits: newUsedCredits,
					validationErrors: []
				};
			});
		},
		
		removePlayer(playerId: string) {
			update(state => {
				const player = state.selectedPlayers.find(p => p.id === playerId);
				if (!player) return state;
				
				const newSelectedPlayers = state.selectedPlayers.filter(p => p.id !== playerId);
				const newUsedCredits = state.usedCredits - player.credits;
				
				return {
					...state,
					selectedPlayers: newSelectedPlayers,
					usedCredits: newUsedCredits,
					captain: state.captain?.id === playerId ? null : state.captain,
					viceCaptain: state.viceCaptain?.id === playerId ? null : state.viceCaptain,
					validationErrors: []
				};
			});
		},
		
		setCaptain(player: Player) {
			update(state => ({
				...state,
				captain: player,
				viceCaptain: state.viceCaptain?.id === player.id ? null : state.viceCaptain
			}));
		},
		
		setViceCaptain(player: Player) {
			update(state => ({
				...state,
				viceCaptain: player,
				captain: state.captain?.id === player.id ? null : state.captain
			}));
		},
		
		setTeamName(name: string) {
			update(state => ({ ...state, teamName: name }));
		},
		
		validateTeam() {
			update(state => {
				const errors: string[] = [];
				
				if (state.selectedPlayers.length !== 11) {
					errors.push('Select exactly 11 players');
				}
				
				if (!state.captain) {
					errors.push('Select a captain');
				}
				
				if (!state.viceCaptain) {
					errors.push('Select a vice captain');
				}
				
				if (!state.teamName.trim()) {
					errors.push('Enter team name');
				}
				
				// Check position requirements
				const positions = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
				state.selectedPlayers.forEach(player => {
					positions[player.position]++;
				});
				
				if (positions.GK !== 1) errors.push('Select exactly 1 goalkeeper');
				if (positions.DEF < 3 || positions.DEF > 5) errors.push('Select 3-5 defenders');
				if (positions.MID < 3 || positions.MID > 5) errors.push('Select 3-5 midfielders');
				if (positions.FWD < 1 || positions.FWD > 3) errors.push('Select 1-3 forwards');
				
				return { ...state, validationErrors: errors };
			});
		},
		
		reset() {
			set(initialBuilderState);
		},
		
		loadTeam(team: Team) {
			update(state => ({
				...state,
				selectedPlayers: team.players,
				captain: team.players.find(p => p.id === team.captain) || null,
				viceCaptain: team.players.find(p => p.id === team.viceCaptain) || null,
				teamName: team.name,
				usedCredits: team.players.reduce((sum, p) => sum + p.credits, 0),
				validationErrors: []
			}));
		}
	};
}

export const teamBuilderStore = createTeamBuilderStore();