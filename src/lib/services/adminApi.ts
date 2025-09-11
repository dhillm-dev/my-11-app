import type { 
	ApiResponse, 
	AdminContest, 
	AdminMatch, 
	AdminPlayer, 
	User, 
	WalletTransaction, 
	AdminSettings, 
	AuditLog 
} from '$lib/types';
import { adminAuthStore } from '$lib/stores/admin';

// Mock delay for realistic API simulation
const MOCK_DELAY = 500;

// In-memory storage (in real app, this would be IndexedDB or server state)
let mockContests: AdminContest[] = [];
let mockMatches: AdminMatch[] = [];
let mockPlayers: AdminPlayer[] = [];
let mockUsers: User[] = [];
let mockTransactions: WalletTransaction[] = [];
let mockAuditLogs: AuditLog[] = [];
let mockSettings: AdminSettings = {
	bonuses: {
		signupBonus: 1200,
		referralBonus: 500,
		promoEnabled: true
	},
	scoring: {
		weights: {
			goal: 6,
			assist: 4,
			cleanSheet: 4,
			yellowCard: -1,
			redCard: -3
		},
		roleRules: {
			gk: { min: 1, max: 1 },
			def: { min: 3, max: 5 },
			mid: { min: 3, max: 5 },
			fwd: { min: 1, max: 3 },
			maxCredits: 100,
			maxPerTeam: 7
		}
	},
	featureFlags: {
		liveEnabled: true,
		depositsEnabled: true,
		referralsEnabled: true
	},
	webhooks: {
		onPublish: '',
		onLock: '',
		onResult: ''
	},
	content: {
		howToPlay: '# How to Play\n\nCreate your team and join contests...',
		faqs: '# FAQs\n\n**Q: How do I create a team?**\nA: ...',
		terms: '# Terms & Conditions\n\nBy using this service...'
	}
};

// Initialize with mock data
function initializeMockData() {
	if (mockContests.length === 0) {
		mockContests = [
			{
				id: 'contest-1',
				matchId: 'match-1',
				name: 'Mega Contest - MUN vs LIV',
				title: 'Mega Contest - MUN vs LIV',
				matchTitle: 'Match match-1',
				prizePool: 100000,
				entryFee: 50,
				maxEntries: 10000,
				currentEntries: 7500,
				winners: 2500,
				firstPrize: 25000,
				status: 'open',
				visibility: 'public',
				multiEntry: true,
				lineupAvailable: true,
				createdBy: 'admin-1',
				createdAt: new Date()
			},
			{
				id: 'contest-2',
				matchId: 'match-2',
				name: 'Head to Head - CHE vs ARS',
				title: 'Head to Head - CHE vs ARS',
				matchTitle: 'Match match-2',
				prizePool: 100,
				entryFee: 50,
				maxEntries: 2,
				currentEntries: 1,
				winners: 1,
				firstPrize: 90,
				status: 'open',
				visibility: 'public',
				multiEntry: false,
				lineupAvailable: false,
				createdBy: 'admin-1',
				createdAt: new Date()
			}
		];

		mockMatches = [
			{
				id: 'match-1',
				homeTeam: 'Manchester United',
				awayTeam: 'Liverpool',
				homeTeamLogo: '🔴',
				awayTeamLogo: '🔴',
				startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
				league: 'Premier League',
				status: 'upcoming',
				players: [],
				lineupAvailable: true,
				scoringFeedId: 'feed-1',
				createdBy: 'admin-1'
			},
			{
				id: 'match-2',
				homeTeam: 'Chelsea',
				awayTeam: 'Arsenal',
				homeTeamLogo: '🔵',
				awayTeamLogo: '🔴',
				startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
				league: 'Premier League',
				status: 'upcoming',
				players: [],
				lineupAvailable: false,
				createdBy: 'admin-1'
			}
		];

		mockUsers = [
			{
				id: 'user-1',
				email: 'john@example.com',
				name: 'John Doe',
				balance: 2500,
				kycVerified: true,
				role: 'user',
				createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
			},
			{
				id: 'user-2',
				email: 'jane@example.com',
				name: 'Jane Smith',
				balance: 1800,
				kycVerified: false,
				role: 'user',
				createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
			}
		];
	}
}

// Audit logging helper
function logAudit(action: string, resource: string, resourceId?: string, changes?: Record<string, any>) {
	let currentAdmin: any = null;
	adminAuthStore.subscribe(state => {
		currentAdmin = state.session;
	})();

	if (currentAdmin) {
		const auditEntry: AuditLog = {
			id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			adminId: currentAdmin.user.id,
			adminName: currentAdmin.user.name,
			action,
			resource,
			resourceId,
			changes,
			timestamp: new Date(),
			ipAddress: '127.0.0.1', // Mock IP
			userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
		};
		mockAuditLogs.unshift(auditEntry);
	}
}

// Utility function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AdminApiService {
	// Initialize mock data
	static init() {
		initializeMockData();
	}

	// Contests
	static async getContests(filters?: {
		status?: string;
		league?: string;
		search?: string;
		page?: number;
		limit?: number;
	}): Promise<ApiResponse<{ contests: AdminContest[]; total: number }>> {
		await delay(MOCK_DELAY);
		initializeMockData();

		let filtered = [...mockContests];

		if (filters?.status) {
			filtered = filtered.filter(c => c.status === filters.status);
		}
		if (filters?.search) {
			filtered = filtered.filter(c => 
				c.name.toLowerCase().includes(filters.search!.toLowerCase())
			);
		}

		const page = filters?.page || 1;
		const limit = filters?.limit || 10;
		const start = (page - 1) * limit;
		const paged = filtered.slice(start, start + limit);

		return {
			success: true,
			data: {
				contests: paged,
				total: filtered.length
			}
		};
	}

	static async createContest(contest: Partial<AdminContest>): Promise<ApiResponse<AdminContest>> {
		await delay(MOCK_DELAY);

		const newContest: AdminContest = {
			id: `contest-${Date.now()}`,
			matchId: contest.matchId!,
			name: contest.name!,
			title: contest.title || contest.name!,
			matchTitle: contest.matchTitle || `Match ${contest.matchId}`,
			prizePool: contest.prizePool!,
			entryFee: contest.entryFee!,
			maxEntries: contest.maxEntries!,
			currentEntries: 0,
			winners: contest.winners!,
			firstPrize: contest.firstPrize!,
			status: 'open',
			visibility: contest.visibility || 'public',
			multiEntry: contest.multiEntry || false,
			lineupAvailable: contest.lineupAvailable || false,
			createdBy: 'current-admin',
			createdAt: new Date()
		};

		mockContests.unshift(newContest);
		logAudit('create', 'contest', newContest.id, newContest);

		return { success: true, data: newContest };
	}

	static async updateContest(id: string, updates: Partial<AdminContest>): Promise<ApiResponse<AdminContest>> {
		await delay(MOCK_DELAY);

		const index = mockContests.findIndex(c => c.id === id);
		if (index === -1) {
			return { success: false, error: 'Contest not found' };
		}

		const original = { ...mockContests[index] };
		mockContests[index] = { ...mockContests[index], ...updates, updatedAt: new Date() };
		logAudit('update', 'contest', id, { original, updated: updates });

		return { success: true, data: mockContests[index] };
	}

	static async publishContest(id: string): Promise<ApiResponse<void>> {
		await delay(MOCK_DELAY);

		const contest = mockContests.find(c => c.id === id);
		if (!contest) {
			return { success: false, error: 'Contest not found' };
		}

		contest.status = 'open';
		logAudit('publish', 'contest', id);

		// Emit event to update public store (mock)
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('contest.updated', { detail: contest }));
		}

		return { success: true };
	}

	static async lockContest(id: string): Promise<ApiResponse<void>> {
		await delay(MOCK_DELAY);

		const contest = mockContests.find(c => c.id === id);
		if (!contest) {
			return { success: false, error: 'Contest not found' };
		}

		contest.status = 'closed';
		logAudit('lock', 'contest', id);

		return { success: true };
	}

	static async deleteContest(id: string): Promise<ApiResponse<void>> {
		await delay(MOCK_DELAY);

		const index = mockContests.findIndex(c => c.id === id);
		if (index === -1) {
			return { success: false, error: 'Contest not found' };
		}

		mockContests.splice(index, 1);
		logAudit('delete', 'contest', id);

		return { success: true };
	}

	// Matches
	static async getMatches(filters?: {
		league?: string;
		status?: string;
		search?: string;
		page?: number;
		limit?: number;
	}): Promise<ApiResponse<{ matches: AdminMatch[]; total: number }>> {
		await delay(MOCK_DELAY);
		initializeMockData();

		let filtered = [...mockMatches];

		if (filters?.status) {
			filtered = filtered.filter(m => m.status === filters.status);
		}
		if (filters?.search) {
			filtered = filtered.filter(m => 
				m.homeTeam.toLowerCase().includes(filters.search!.toLowerCase()) ||
				m.awayTeam.toLowerCase().includes(filters.search!.toLowerCase())
			);
		}

		const page = filters?.page || 1;
		const limit = filters?.limit || 10;
		const start = (page - 1) * limit;
		const paged = filtered.slice(start, start + limit);

		return {
			success: true,
			data: {
				matches: paged,
				total: filtered.length
			}
		};
	}

	static async createMatch(match: Partial<AdminMatch>): Promise<ApiResponse<AdminMatch>> {
		await delay(MOCK_DELAY);

		const newMatch: AdminMatch = {
			id: `match-${Date.now()}`,
			homeTeam: match.homeTeam!,
			awayTeam: match.awayTeam!,
			homeTeamLogo: match.homeTeamLogo || '⚽',
			awayTeamLogo: match.awayTeamLogo || '⚽',
			startTime: match.startTime!,
			league: match.league!,
			status: 'upcoming',
			players: [],
			lineupAvailable: match.lineupAvailable || false,
			scoringFeedId: match.scoringFeedId,
			createdBy: 'current-admin'
		};

		mockMatches.unshift(newMatch);
		logAudit('create', 'match', newMatch.id, newMatch);

		return { success: true, data: newMatch };
	}

	// Users
	static async getUsers(filters?: {
		search?: string;
		kycStatus?: boolean;
		page?: number;
		limit?: number;
	}): Promise<ApiResponse<{ users: User[]; total: number }>> {
		await delay(MOCK_DELAY);
		initializeMockData();

		let filtered = [...mockUsers];

		if (filters?.search) {
			filtered = filtered.filter(u => 
				u.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
				u.email.toLowerCase().includes(filters.search!.toLowerCase())
			);
		}
		if (filters?.kycStatus !== undefined) {
			filtered = filtered.filter(u => u.kycVerified === filters.kycStatus);
		}

		const page = filters?.page || 1;
		const limit = filters?.limit || 10;
		const start = (page - 1) * limit;
		const paged = filtered.slice(start, start + limit);

		return {
			success: true,
			data: {
				users: paged,
				total: filtered.length
			}
		};
	}

	// Wallet
	static async getWalletTransactions(userId?: string, filters?: {
		type?: string;
		page?: number;
		limit?: number;
	}): Promise<ApiResponse<{ transactions: WalletTransaction[]; total: number }>> {
		await delay(MOCK_DELAY);

		let filtered = [...mockTransactions];

		if (userId) {
			filtered = filtered.filter(t => t.userId === userId);
		}
		if (filters?.type) {
			filtered = filtered.filter(t => t.type === filters.type);
		}

		const page = filters?.page || 1;
		const limit = filters?.limit || 10;
		const start = (page - 1) * limit;
		const paged = filtered.slice(start, start + limit);

		return {
			success: true,
			data: {
				transactions: paged,
				total: filtered.length
			}
		};
	}

	static async createWalletTransaction(transaction: {
		userId: string;
		type: 'credit' | 'debit';
		amount: number;
		description: string;
		notes?: string;
	}): Promise<ApiResponse<WalletTransaction>> {
		await delay(MOCK_DELAY);

		const newTransaction: WalletTransaction = {
			id: `txn-${Date.now()}`,
			userId: transaction.userId,
			adminId: 'current-admin',
			type: transaction.type,
			amount: transaction.amount,
			description: transaction.description,
			notes: transaction.notes,
			status: 'completed',
			createdAt: new Date()
		};

		mockTransactions.unshift(newTransaction);
		logAudit('create', 'wallet_transaction', newTransaction.id, newTransaction);

		return { success: true, data: newTransaction };
	}

	// Settings
	static async getSettings(): Promise<ApiResponse<AdminSettings>> {
		await delay(MOCK_DELAY);
		return { success: true, data: mockSettings };
	}

	static async updateSettings(updates: Partial<AdminSettings>): Promise<ApiResponse<AdminSettings>> {
		await delay(MOCK_DELAY);

		const original = { ...mockSettings };
		mockSettings = { ...mockSettings, ...updates };
		logAudit('update', 'settings', 'global', { original, updated: updates });

		return { success: true, data: mockSettings };
	}

	// Audit Logs
	static async getAuditLogs(filters?: {
		adminId?: string;
		resource?: string;
		action?: string;
		page?: number;
		limit?: number;
	}): Promise<ApiResponse<{ logs: AuditLog[]; total: number }>> {
		await delay(MOCK_DELAY);

		let filtered = [...mockAuditLogs];

		if (filters?.adminId) {
			filtered = filtered.filter(l => l.adminId === filters.adminId);
		}
		if (filters?.resource) {
			filtered = filtered.filter(l => l.resource === filters.resource);
		}
		if (filters?.action) {
			filtered = filtered.filter(l => l.action === filters.action);
		}

		const page = filters?.page || 1;
		const limit = filters?.limit || 10;
		const start = (page - 1) * limit;
		const paged = filtered.slice(start, start + limit);

		return {
			success: true,
			data: {
				logs: paged,
				total: filtered.length
			}
		};
	}

	// Reports
	static async getDashboardKPIs(): Promise<ApiResponse<{
		activeContests: number;
		totalEntries: number;
		ggr: number;
		payouts: number;
		activeUsers: number;
	}>> {
		await delay(MOCK_DELAY);
		initializeMockData();

		return {
			success: true,
			data: {
				activeContests: mockContests.filter(c => c.status === 'open').length,
				totalEntries: mockContests.reduce((sum, c) => sum + c.currentEntries, 0),
				ggr: 125000,
				payouts: 98000,
				activeUsers: mockUsers.length
			}
		};
	}

	static async getReports(type: 'ggr' | 'payouts' | 'users' | 'contests', dateRange?: {
		from: Date;
		to: Date;
	}): Promise<ApiResponse<any[]>> {
		await delay(MOCK_DELAY);

		// Mock report data
		const mockData = Array.from({ length: 30 }, (_, i) => ({
			date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
			value: Math.floor(Math.random() * 10000) + 1000
		}));

		return { success: true, data: mockData };
	}



	// Players
	static players = {
		async list(): Promise<AdminPlayer[]> {
			await delay(MOCK_DELAY);
			return mockPlayers;
		},

		async create(player: Partial<AdminPlayer>): Promise<ApiResponse<AdminPlayer>> {
			await delay(MOCK_DELAY);
			const newPlayer: AdminPlayer = {
				id: Date.now().toString(),
				credits: player.price || 8.0,
				selectedBy: 0,
				isPlaying: true,
				createdBy: 'admin',
				...player
			} as AdminPlayer;
			mockPlayers.push(newPlayer);
			return { success: true, data: newPlayer };
		},

		async update(playerId: string, updates: Partial<AdminPlayer>): Promise<ApiResponse<AdminPlayer>> {
			await delay(MOCK_DELAY);
			const index = mockPlayers.findIndex(p => p.id === playerId);
			if (index !== -1) {
				mockPlayers[index] = { ...mockPlayers[index], ...updates };
				return { success: true, data: mockPlayers[index] };
			}
			return { success: false, error: 'Player not found' };
		},

		async delete(playerId: string): Promise<ApiResponse<void>> {
			await delay(MOCK_DELAY);
			const index = mockPlayers.findIndex(p => p.id === playerId);
			if (index !== -1) {
				mockPlayers.splice(index, 1);
			}
			return { success: true };
		},

		async bulkCreate(players: AdminPlayer[]): Promise<ApiResponse<void>> {
			await delay(MOCK_DELAY);
			mockPlayers.push(...players);
			return { success: true };
		}
	};

	// Users
	static users = {
		async list(): Promise<ApiResponse<User[]>> {
			await delay(MOCK_DELAY);
			initializeMockData();
			return { success: true, data: mockUsers };
		},

		async updateKyc(userId: string, status: boolean): Promise<ApiResponse<void>> {
			await delay(MOCK_DELAY);
			const user = mockUsers.find(u => u.id === userId);
			if (user) {
				user.kycVerified = status;
			}
			return { success: true };
		},

		async ban(userId: string, reason: string): Promise<ApiResponse<void>> {
			await delay(MOCK_DELAY);
			// Mock implementation - in real app would update user status
			return { success: true };
		},

		async unban(userId: string): Promise<ApiResponse<void>> {
			await delay(MOCK_DELAY);
			// Mock implementation - in real app would update user status
			return { success: true };
		},

		async delete(userId: string): Promise<ApiResponse<void>> {
			await delay(MOCK_DELAY);
			const index = mockUsers.findIndex(u => u.id === userId);
			if (index !== -1) {
				mockUsers.splice(index, 1);
			}
			return { success: true };
		}
	};
}