import type { User, Match, Contest, Team, Transaction, ApiResponse, LeaderboardEntry } from '$lib/types';
import { delay } from '$lib/utils';
import {
	generateMockUser,
	generateMockMatches,
	generateMockContests,
	generateMockTransactions
} from './mockData';

// Simulate network latency
const MOCK_DELAY = 800; // ms

// Mock storage
let mockUser: User | null = null;
let mockMatches: Match[] = [];
let mockContests: Contest[] = [];
const mockTeams: Team[] = [];
let mockTransactions: Transaction[] = [];

// Initialize mock data
function initializeMockData() {
	if (mockMatches.length === 0) {
		mockMatches = generateMockMatches();
		mockContests = mockMatches.flatMap(match => generateMockContests(match.id));
	}
}

export class ApiService {
	// Authentication
	static async login(email: string, password: string): Promise<ApiResponse<User>> {
		await delay(MOCK_DELAY);
		
		if (email === 'demo@picknwin.com' && password === 'demo123') {
			mockUser = generateMockUser();
			mockTransactions = generateMockTransactions(mockUser.id);
			return { success: true, data: mockUser };
		}
		
		return { success: false, error: 'Invalid credentials' };
	}
	
	static async register(email: string, password: string, name: string): Promise<ApiResponse<User>> {
		await delay(MOCK_DELAY);
		
		mockUser = {
			...generateMockUser(),
			email,
			name,
			balance: 1200 // Welcome bonus
		};
		
		mockTransactions = [
			{
				id: 'welcome-bonus',
				userId: mockUser.id,
				type: 'signup_bonus',
				amount: 1200,
				description: 'Welcome bonus - €1200 free credits!',
				status: 'completed',
				createdAt: new Date()
			}
		];
		
		return { success: true, data: mockUser };
	}
	
	static async getCurrentUser(): Promise<ApiResponse<User>> {
		await delay(300);
		return mockUser ? { success: true, data: mockUser } : { success: false, error: 'Not authenticated' };
	}
	
	static async logout(): Promise<ApiResponse<void>> {
		await delay(300);
		mockUser = null;
		return { success: true };
	}
	
	// Matches
	static async getMatches(): Promise<ApiResponse<Match[]>> {
		await delay(MOCK_DELAY);
		initializeMockData();
		return { success: true, data: mockMatches };
	}
	
	static async getMatch(id: string): Promise<ApiResponse<Match>> {
		await delay(MOCK_DELAY);
		initializeMockData();
		
		const match = mockMatches.find(m => m.id === id);
		return match ? { success: true, data: match } : { success: false, error: 'Match not found' };
	}
	
	// Contests
	static async getContests(matchId?: string): Promise<ApiResponse<Contest[]>> {
		await delay(MOCK_DELAY);
		initializeMockData();
		
		const contests = matchId ? mockContests.filter(c => c.matchId === matchId) : mockContests;
		return { success: true, data: contests };
	}
	
	static async getContest(id: string): Promise<ApiResponse<Contest>> {
		await delay(MOCK_DELAY);
		initializeMockData();
		
		const contest = mockContests.find(c => c.id === id);
		return contest ? { success: true, data: contest } : { success: false, error: 'Contest not found' };
	}
	
	static async joinContest(contestId: string, teamId: string): Promise<ApiResponse<void>> {
		await delay(MOCK_DELAY);
		
		if (!mockUser) {
			return { success: false, error: 'Not authenticated' };
		}
		
		const contest = mockContests.find(c => c.id === contestId);
		if (!contest) {
			return { success: false, error: 'Contest not found' };
		}
		
		if (mockUser.balance < contest.entryFee) {
			return { success: false, error: 'Insufficient balance' };
		}
		
		// Deduct entry fee
		mockUser.balance -= contest.entryFee;
		contest.currentEntries += 1;
		
		// Add transaction
		mockTransactions.unshift({
			id: `join-${Date.now()}`,
			userId: mockUser.id,
			type: 'join',
			amount: -contest.entryFee,
			description: `Joined ${contest.name}`,
			status: 'completed',
			createdAt: new Date()
		});
		
		return { success: true };
	}
	
	// Teams
	static async getMyTeams(matchId?: string): Promise<ApiResponse<Team[]>> {
		await delay(MOCK_DELAY);
		
		if (!mockUser) {
			return { success: false, error: 'Not authenticated' };
		}
		
		const teams = matchId ? mockTeams.filter(t => t.matchId === matchId) : mockTeams;
		return { success: true, data: teams };
	}
	
	static async saveTeam(team: Omit<Team, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Team>> {
		await delay(MOCK_DELAY);
		
		if (!mockUser) {
			return { success: false, error: 'Not authenticated' };
		}
		
		const newTeam: Team = {
			...team,
			id: `team-${Date.now()}`,
			userId: mockUser.id,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		
		mockTeams.push(newTeam);
		return { success: true, data: newTeam };
	}
	
	// Wallet & Transactions
	static async getTransactions(): Promise<ApiResponse<Transaction[]>> {
		await delay(MOCK_DELAY);
		
		if (!mockUser) {
			return { success: false, error: 'Not authenticated' };
		}
		
		return { success: true, data: mockTransactions };
	}
	
	static async addMoney(amount: number): Promise<ApiResponse<void>> {
		await delay(MOCK_DELAY);
		
		if (!mockUser) {
			return { success: false, error: 'Not authenticated' };
		}
		
		mockUser.balance += amount;
		
		mockTransactions.unshift({
			id: `deposit-${Date.now()}`,
			userId: mockUser.id,
			type: 'deposit',
			amount,
			description: 'Wallet deposit',
			status: 'completed',
			createdAt: new Date()
		});
		
		return { success: true };
	}
	
	// Live & Results
	static async getLeaderboard(contestId: string): Promise<ApiResponse<LeaderboardEntry[]>> {
		await delay(MOCK_DELAY);
		
		// Generate mock leaderboard
		const leaderboard: LeaderboardEntry[] = [];
		for (let i = 0; i < 50; i++) {
			leaderboard.push({
				userId: `user-${i}`,
				userName: `Player ${i + 1}`,
				teamName: `Team ${i + 1}`,
				points: Math.floor(Math.random() * 200) + 50,
				rank: i + 1,
				winnings: i < 10 ? Math.floor(Math.random() * 1000) + 100 : undefined
			});
		}
		
		// Sort by points
		leaderboard.sort((a, b) => b.points - a.points);
		leaderboard.forEach((entry, index) => {
			entry.rank = index + 1;
		});
		
		return { success: true, data: leaderboard };
	}
}