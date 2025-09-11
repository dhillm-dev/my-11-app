import type { Match, Player } from '$lib/types';
import type { FeedMatch, FeedPlayer, AuditEntry } from './feedAdapter';

// SofaScore API response interfaces
interface SofaScoreSearchResult {
	results: Array<{
		entity: SofaScorePlayer | SofaScoreTeam;
		score: number;
		type: 'player' | 'team';
	}>;
}

interface SofaScorePlayer {
	id: number;
	name: string;
	slug: string;
	retired?: boolean;
	userCount: number;
	team?: {
		id: number;
		name: string;
		nameCode: string;
		slug: string;
		national: boolean;
		sport: { id: number; slug: string; name: string };
		userCount: number;
		teamColors: {
			primary: string;
			secondary: string;
			text: string;
		};
	};
	deceased?: boolean;
	country: {
		alpha2: string;
		name: string;
		slug: string;
	};
	shortName?: string;
	position?: string;
	jerseyNumber?: string;
}

interface SofaScoreTeam {
	id: number;
	name: string;
	nameCode: string;
	slug: string;
	national: boolean;
	sport: { id: number; slug: string; name: string };
	userCount: number;
	teamColors: {
		primary: string;
		secondary: string;
		text: string;
	};
	type: number;
	gender: string;
	country: {
		alpha2: string;
		name: string;
		slug: string;
	};
}

interface SofaScoreMatch {
	id: number;
	status: {
		code: number;
		description: string;
		type: string;
	};
	winnerCode?: number;
	homeTeam: SofaScoreTeam;
	awayTeam: SofaScoreTeam;
	homeScore?: {
		current?: number;
		display?: number;
		period1?: number;
		period2?: number;
	};
	awayScore?: {
		current?: number;
		display?: number;
		period1?: number;
		period2?: number;
	};
	startTimestamp: number;
	tournament: {
		id: number;
		name: string;
		slug: string;
		category: {
			id: number;
			name: string;
			slug: string;
			sport: { id: number; slug: string; name: string };
			flag: string;
		};
		uniqueId: number;
		priority: number;
	};
	roundInfo?: {
		round: number;
	};
	customId?: string;
	lastPeriod?: string;
}

/**
 * SofaScore API Configuration
 */
interface SofaScoreConfig {
	apiKey: string;
	baseUrl: string;
	rateLimit: number; // requests per minute
	cacheTtl: number; // cache TTL in milliseconds
}

/**
 * SofaScore API Adapter for real sports data
 * Integrates with SofaScore API to fetch live match and player data
 */
export class SofaScoreAdapter {
	private static instance: SofaScoreAdapter;
	private config: SofaScoreConfig;
	private cache: Map<string, { data: any; expires: number }> = new Map();
	private requestCount = 0;
	private lastResetTime = Date.now();

	constructor(config: SofaScoreConfig) {
		this.config = config;
	}

	static getInstance(config?: SofaScoreConfig): SofaScoreAdapter {
		if (!SofaScoreAdapter.instance) {
			if (!config) {
				throw new Error('SofaScoreAdapter requires configuration on first initialization');
			}
			SofaScoreAdapter.instance = new SofaScoreAdapter(config);
		}
		return SofaScoreAdapter.instance;
	}

	/**
	 * Search for players or teams
	 */
	async search(query: string, type: 'all' | 'player' | 'team' = 'all', page = 0): Promise<SofaScoreSearchResult> {
		const cacheKey = `search_${query}_${type}_${page}`;
		const cached = this.getFromCache(cacheKey);
		if (cached) return cached;

		await this.checkRateLimit();

		const url = `${this.config.baseUrl}/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}`;
		const response = await this.makeRequest(url);
		
		this.setCache(cacheKey, response);
		return response;
	}

	/**
	 * Get player details by ID
	 */
	async getPlayer(playerId: number): Promise<SofaScorePlayer> {
		const cacheKey = `player_${playerId}`;
		const cached = this.getFromCache(cacheKey);
		if (cached) return cached;

		await this.checkRateLimit();

		const url = `${this.config.baseUrl}/player/${playerId}`;
		const response = await this.makeRequest(url);
		
		this.setCache(cacheKey, response);
		return response;
	}

	/**
	 * Get team details by ID
	 */
	async getTeam(teamId: number): Promise<SofaScoreTeam> {
		const cacheKey = `team_${teamId}`;
		const cached = this.getFromCache(cacheKey);
		if (cached) return cached;

		await this.checkRateLimit();

		const url = `${this.config.baseUrl}/team/${teamId}`;
		const response = await this.makeRequest(url);
		
		this.setCache(cacheKey, response);
		return response;
	}

	/**
	 * Get matches for a specific date
	 */
	async getMatchesByDate(date: Date): Promise<SofaScoreMatch[]> {
		const dateStr = date.toISOString().split('T')[0];
		const cacheKey = `matches_${dateStr}`;
		const cached = this.getFromCache(cacheKey);
		if (cached) return cached;

		await this.checkRateLimit();

		const url = `${this.config.baseUrl}/sport/football/scheduled-events/${dateStr}`;
		const response = await this.makeRequest(url);
		
		this.setCache(cacheKey, response.events || []);
		return response.events || [];
	}

	/**
	 * Get live matches
	 */
	async getLiveMatches(): Promise<SofaScoreMatch[]> {
		const cacheKey = 'live_matches';
		const cached = this.getFromCache(cacheKey, 30000); // 30 second cache for live data
		if (cached) return cached;

		await this.checkRateLimit();

		const url = `${this.config.baseUrl}/sport/football/events/live`;
		const response = await this.makeRequest(url);
		
		this.setCache(cacheKey, response.events || [], 30000);
		return response.events || [];
	}

	/**
	 * Convert SofaScore match to FeedMatch format
	 */
	convertToFeedMatch(sofaMatch: SofaScoreMatch): FeedMatch {
		const kickoff = new Date(sofaMatch.startTimestamp * 1000);
		const status = this.mapMatchStatus(sofaMatch.status.code);
		
		return {
			id: `sofa_${sofaMatch.id}`,
			matchId: `sofa_${sofaMatch.id}`,
			league: sofaMatch.tournament.name,
			home: sofaMatch.homeTeam.name,
			away: sofaMatch.awayTeam.name,
			homeTeam: sofaMatch.homeTeam.name,
			awayTeam: sofaMatch.awayTeam.name,
			homeTeamLogo: `/logos/sofa_${sofaMatch.homeTeam.id}.png`,
			awayTeamLogo: `/logos/sofa_${sofaMatch.awayTeam.id}.png`,
			kickoff,
			startTime: kickoff,
			status,
			popularity: Math.min(100, Math.floor(sofaMatch.homeTeam.userCount / 10000)),
			source: 'SofaScore',
			lastUpdated: new Date(),
			venue: `${sofaMatch.homeTeam.name} Stadium`,
			lineupStatus: 'probable',
			curationState: 'feed_only',
			auditTrail: [],
			players: []
		};
	}

	/**
	 * Convert SofaScore player to FeedPlayer format
	 */
	convertToFeedPlayer(sofaPlayer: SofaScorePlayer, matchId: string): FeedPlayer {
		const role = this.mapPlayerPosition(sofaPlayer.position);
		const credits = this.calculatePlayerCredits(sofaPlayer, role);
		
		return {
			id: `sofa_${sofaPlayer.id}`,
			matchId,
			name: sofaPlayer.name,
			team: sofaPlayer.team?.name || 'Unknown',
			position: this.mapPositionCode(role),
			role,
			credits,
			points: 0,
			selectedBy: Math.random() * 100, // Would need separate API for this
			isPlaying: true,
			meta: {
				injuryStatus: 'fit',
				form: Math.random() * 10, // Would need separate API for this
				value: Math.floor(Math.random() * 50000000) + 1000000
			}
		};
	}

	/**
	 * Get popular players (trending searches)
	 */
	async getPopularPlayers(limit = 20): Promise<FeedPlayer[]> {
		const searches = ['messi', 'ronaldo', 'mbappe', 'haaland', 'neymar', 'salah', 'kane', 'benzema'];
		const players: FeedPlayer[] = [];
		
		for (const query of searches.slice(0, Math.ceil(limit / searches.length))) {
			try {
				const results = await this.search(query, 'player', 0);
				const topPlayers = results.results
					.filter(r => r.type === 'player')
					.slice(0, 3)
					.map(r => this.convertToFeedPlayer(r.entity as SofaScorePlayer, 'popular'));
				
				players.push(...topPlayers);
			} catch (error) {
				console.warn(`Failed to fetch players for query: ${query}`, error);
			}
		}
		
		return players.slice(0, limit);
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats(): { size: number; hitRate: number } {
		return {
			size: this.cache.size,
			hitRate: 0 // Would need to track hits/misses
		};
	}

	private async makeRequest(url: string): Promise<any> {
		try {
			const response = await fetch(url, {
				headers: {
					'X-RapidAPI-Host': 'sofascore.p.rapidapi.com',
					'X-RapidAPI-Key': this.config.apiKey,
					'Content-Type': 'application/json'
				},
				method: 'GET'
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`RapidAPI SofaScore error: ${response.status} ${response.statusText}`, errorText);
				throw new Error(`RapidAPI SofaScore error: ${response.status} ${response.statusText}`);
			}

			return response.json();
		} catch (error) {
			console.error('RapidAPI request failed:', error);
			throw error;
		}
	}

	private async checkRateLimit(): Promise<void> {
		const now = Date.now();
		const timeSinceReset = now - this.lastResetTime;
		
		// Reset counter every minute
		if (timeSinceReset >= 60000) {
			this.requestCount = 0;
			this.lastResetTime = now;
		}
		
		// Wait if rate limit exceeded
		if (this.requestCount >= this.config.rateLimit) {
			const waitTime = 60000 - timeSinceReset;
			await new Promise(resolve => setTimeout(resolve, waitTime));
			this.requestCount = 0;
			this.lastResetTime = Date.now();
		}
		
		this.requestCount++;
	}

	private getFromCache(key: string, customTtl?: number): any | null {
		const cached = this.cache.get(key);
		if (cached && cached.expires > Date.now()) {
			return cached.data;
		}
		if (cached) {
			this.cache.delete(key);
		}
		return null;
	}

	private setCache(key: string, data: any, customTtl?: number): void {
		const ttl = customTtl || this.config.cacheTtl;
		this.cache.set(key, {
			data,
			expires: Date.now() + ttl
		});
	}

	private mapMatchStatus(statusCode: number): 'upcoming' | 'live' | 'completed' {
		if (statusCode === 0) return 'upcoming';
		if (statusCode >= 1 && statusCode <= 6) return 'live';
		return 'completed';
	}

	private mapPlayerPosition(position?: string): 'goalkeeper' | 'defender' | 'midfielder' | 'forward' {
		if (!position) return 'midfielder';
		
		const pos = position.toLowerCase();
		if (pos.includes('g') || pos.includes('keeper')) return 'goalkeeper';
		if (pos.includes('d') || pos.includes('def')) return 'defender';
		if (pos.includes('f') || pos.includes('forward') || pos.includes('striker')) return 'forward';
		return 'midfielder';
	}

	private mapPositionCode(role: 'goalkeeper' | 'defender' | 'midfielder' | 'forward'): 'GK' | 'DEF' | 'MID' | 'FWD' {
		switch (role) {
			case 'goalkeeper': return 'GK';
			case 'defender': return 'DEF';
			case 'midfielder': return 'MID';
			case 'forward': return 'FWD';
			default: return 'MID'; // fallback
		}
	}

	private calculatePlayerCredits(player: SofaScorePlayer, role: 'goalkeeper' | 'defender' | 'midfielder' | 'forward'): number {
		// Base credits by position
		const baseCredits = {
			goalkeeper: 5,
			defender: 6,
			midfielder: 7,
			forward: 8
		};
		
		// Adjust based on popularity (userCount)
		const popularityMultiplier = Math.min(2, 1 + (player.userCount / 1000000));
		
		return Math.round(baseCredits[role] * popularityMultiplier * 10) / 10;
	}
}

// Default RapidAPI configuration
const defaultConfig: SofaScoreConfig = {
	apiKey: '23eba5e004mshdb855f7e2e9c0c3p13cd89jsn53631ff75549',
	baseUrl: 'https://sofascore.p.rapidapi.com',
	rateLimit: 100, // RapidAPI allows more requests
	cacheTtl: 300000 // 5 minutes
};

// Export configured instance
export const sofaScoreAdapter = SofaScoreAdapter.getInstance(defaultConfig);

// Export types for use in other modules
export type {
	SofaScoreSearchResult,
	SofaScorePlayer,
	SofaScoreTeam,
	SofaScoreMatch,
	SofaScoreConfig
};