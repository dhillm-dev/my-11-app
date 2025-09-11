export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	balance: number;
	kycVerified: boolean;
	role?: 'user' | 'superadmin' | 'admin' | 'moderator' | 'viewer';
	phone?: string;
	dateOfBirth?: string;
	state?: string;
	createdAt: Date;
}

export interface Player {
	id: string;
	name: string;
	team: string;
	position: 'GK' | 'DEF' | 'MID' | 'FWD';
	credits: number;
	points: number;
	selectedBy: number; // percentage
	isPlaying: boolean;
	avatar?: string;
}

export interface Match {
	id: string;
	homeTeam: string;
	awayTeam: string;
	homeTeamLogo: string;
	awayTeamLogo: string;
	startTime: Date;
	league: string;
	status: 'upcoming' | 'live' | 'completed';
	players: Player[];
}

export interface Contest {
	id: string;
	matchId: string;
	name: string;
	title: string;
	matchTitle: string;
	prizePool: number;
	entryFee: number;
	maxEntries: number;
	currentEntries: number;
	winners: number;
	firstPrize: number;
	status: 'draft' | 'open' | 'closed' | 'live' | 'completed';
	createdAt: Date;
}

export interface Team {
	id: string;
	userId: string;
	matchId: string;
	contestId?: string;
	name: string;
	players: Player[];
	captain: string; // player id
	viceCaptain: string; // player id
	totalCredits: number;
	totalPoints?: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Transaction {
	id: string;
	userId: string;
	type: 'signup_bonus' | 'join' | 'winnings' | 'deposit' | 'withdrawal' | 'contest_entry';
	amount: number;
	description: string;
	status: 'pending' | 'completed' | 'failed';
	createdAt: Date;
	timestamp?: string;
}

export interface LeaderboardEntry {
	userId: string;
	userName: string;
	teamName: string;
	points: number;
	rank: number;
	winnings?: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Admin Types
export interface AdminSession {
	user: User;
	role: 'superadmin' | 'admin' | 'moderator' | 'viewer';
	permissions: AdminPermission[];
	isImpersonating?: boolean;
	originalAdminId?: string;
}

export interface AdminPermission {
	resource: string;
	actions: ('create' | 'read' | 'update' | 'delete' | 'publish' | 'lock')[];
}

export interface AuditLog {
	id: string;
	adminId: string;
	adminName: string;
	action: string;
	resource: string;
	resourceId?: string;
	changes?: Record<string, any>;
	timestamp: Date;
	ipAddress?: string;
	userAgent?: string;
}

export interface AdminContest extends Contest {
	visibility: 'public' | 'private';
	multiEntry: boolean;
	lineupAvailable: boolean;
	scoringFeedId?: string;
	createdBy: string;
	updatedBy?: string;
	updatedAt?: Date;
}

export interface AdminMatch extends Match {
	lineupAvailable: boolean;
	scoringFeedId?: string;
	createdBy: string;
	updatedBy?: string;
	updatedAt?: Date;
}

export interface AdminPlayer extends Player {
	isActive: boolean;
	price: number;
	injuryStatus?: string;
	createdBy: string;
	updatedBy?: string;
	updatedAt?: Date;
}

export interface WalletTransaction {
	id: string;
	userId: string;
	adminId?: string;
	type: 'credit' | 'debit' | 'deposit' | 'withdrawal' | 'contest_entry' | 'contest_win' | 'bonus' | 'refund';
	amount: number;
	description: string;
	notes?: string;
	status: 'pending' | 'completed' | 'failed';
	createdAt: Date;
}

export interface AdminSettings {
	bonuses: {
		signupBonus: number;
		referralBonus: number;
		promoEnabled: boolean;
	};
	scoring: {
		weights: Record<string, number>;
		roleRules: {
			gk: { min: number; max: number };
			def: { min: number; max: number };
			mid: { min: number; max: number };
			fwd: { min: number; max: number };
			maxCredits: number;
			maxPerTeam: number;
		};
	};
	featureFlags: {
		liveEnabled: boolean;
		depositsEnabled: boolean;
		referralsEnabled: boolean;
	};
	webhooks: {
		onPublish?: string;
		onLock?: string;
		onResult?: string;
	};
	content: {
		howToPlay: string;
		faqs: string;
		terms: string;
	};
}