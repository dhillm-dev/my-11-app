import type { Match, Player } from '$lib/types';
import type { FeedMatch, FeedPlayer } from './feedAdapter';
import { feedAdapter } from './feedAdapter';
import { sofaScoreAdapter, type SofaScoreMatch, type SofaScorePlayer } from './sofascoreAdapter';

/**
 * Configuration for the unified feed service
 */
interface UnifiedFeedConfig {
	primarySource: 'mock' | 'sofascore' | 'hybrid';
	fallbackEnabled: boolean;
	cacheEnabled: boolean;
	maxRetries: number;
	timeoutMs: number;
}

/**
 * Enhanced match interface with source information
 */
interface EnhancedFeedMatch extends FeedMatch {
	dataSource: 'mock' | 'sofascore';
	confidenceScore: number; // 0-100, data quality/reliability
	lastSyncTime: Date;
	syncErrors?: string[];
}

/**
 * Enhanced player interface with source information
 */
interface EnhancedFeedPlayer extends FeedPlayer {
	dataSource: 'mock' | 'sofascore';
	confidenceScore: number;
	lastSyncTime: Date;
	realTimeStats?: {
		goals: number;
		assists: number;
		yellowCards: number;
		redCards: number;
		minutesPlayed: number;
	};
}

/**
 * Service statistics for monitoring
 */
interface ServiceStats {
	totalRequests: number;
	mockRequests: number;
	sofascoreRequests: number;
	cacheHits: number;
	cacheMisses: number;
	errorCount: number;
	averageResponseTime: number;
	lastError?: string;
	lastErrorTime?: Date;
}

/**
 * Unified Feed Service
 * Provides a single interface for accessing both mock and real sports data
 * Handles fallbacks, caching, and data source switching
 */
export class UnifiedFeedService {
	private static instance: UnifiedFeedService;
	private config: UnifiedFeedConfig;
	private stats: ServiceStats;
	private cache: Map<string, { data: any; expires: number; source: string }> = new Map();

	constructor(config: Partial<UnifiedFeedConfig> = {}) {
		this.config = {
			primarySource: 'hybrid',
			fallbackEnabled: true,
			cacheEnabled: true,
			maxRetries: 3,
			timeoutMs: 10000,
			...config
		};

		this.stats = {
			totalRequests: 0,
			mockRequests: 0,
			sofascoreRequests: 0,
			cacheHits: 0,
			cacheMisses: 0,
			errorCount: 0,
			averageResponseTime: 0
		};
	}

	static getInstance(config?: Partial<UnifiedFeedConfig>): UnifiedFeedService {
		if (!UnifiedFeedService.instance) {
			UnifiedFeedService.instance = new UnifiedFeedService(config);
		}
		return UnifiedFeedService.instance;
	}

	/**
	 * Get upcoming matches with intelligent source selection
	 */
	async getUpcomingMatches(from: Date, to: Date): Promise<EnhancedFeedMatch[]> {
		const startTime = Date.now();
		this.stats.totalRequests++;

		try {
			const cacheKey = `upcoming_${from.getTime()}_${to.getTime()}`;
			
			// Check cache first
			if (this.config.cacheEnabled) {
				const cached = this.getFromCache(cacheKey);
				if (cached) {
					this.stats.cacheHits++;
					this.updateResponseTime(startTime);
					return cached;
				}
				this.stats.cacheMisses++;
			}

			let matches: EnhancedFeedMatch[] = [];

			// Primary source strategy
			switch (this.config.primarySource) {
				case 'mock':
					matches = await this.getMockMatches(from, to);
					break;
				case 'sofascore':
					matches = await this.getSofaScoreMatches(from, to);
					break;
				case 'hybrid':
					matches = await this.getHybridMatches(from, to);
					break;
			}

			// Cache results
			if (this.config.cacheEnabled && matches.length > 0) {
				this.setCache(cacheKey, matches, 300000); // 5 minute cache
			}

			this.updateResponseTime(startTime);
			return matches;

		} catch (error) {
			this.handleError(error as Error);
			this.updateResponseTime(startTime);
			
			// Fallback to mock data if enabled
			if (this.config.fallbackEnabled && this.config.primarySource !== 'mock') {
				console.warn('Falling back to mock data due to error:', error);
				return this.getMockMatches(from, to);
			}
			
			throw error;
		}
	}

	/**
	 * Get players for a specific match
	 */
	async getMatchPlayers(matchId: string): Promise<EnhancedFeedPlayer[]> {
		const startTime = Date.now();
		this.stats.totalRequests++;

		try {
			const cacheKey = `players_${matchId}`;
			
			// Check cache first
			if (this.config.cacheEnabled) {
				const cached = this.getFromCache(cacheKey);
				if (cached) {
					this.stats.cacheHits++;
					this.updateResponseTime(startTime);
					return cached;
				}
				this.stats.cacheMisses++;
			}

			let players: EnhancedFeedPlayer[] = [];

			// Determine source based on match ID prefix
			if (matchId.startsWith('sofa_')) {
				players = await this.getSofaScorePlayers(matchId);
			} else {
				players = await this.getMockPlayers(matchId);
			}

			// Cache results
			if (this.config.cacheEnabled && players.length > 0) {
				this.setCache(cacheKey, players, 600000); // 10 minute cache
			}

			this.updateResponseTime(startTime);
			return players;

		} catch (error) {
			this.handleError(error as Error);
			this.updateResponseTime(startTime);
			
			// Fallback to mock data
			if (this.config.fallbackEnabled) {
				console.warn('Falling back to mock players due to error:', error);
				return this.getMockPlayers(matchId);
			}
			
			throw error;
		}
	}

	/**
	 * Search for players across all sources
	 */
	async searchPlayers(query: string, limit = 20): Promise<EnhancedFeedPlayer[]> {
		const startTime = Date.now();
		this.stats.totalRequests++;

		try {
			const cacheKey = `search_${query}_${limit}`;
			
			// Check cache first
			if (this.config.cacheEnabled) {
				const cached = this.getFromCache(cacheKey);
				if (cached) {
					this.stats.cacheHits++;
					this.updateResponseTime(startTime);
					return cached;
				}
				this.stats.cacheMisses++;
			}

			let players: EnhancedFeedPlayer[] = [];

			// Try SofaScore first for real data
			if (this.config.primarySource !== 'mock') {
				try {
					const sofaResults = await sofaScoreAdapter.search(query, 'player');
					players = sofaResults.results
						.filter(r => r.type === 'player')
						.slice(0, limit)
						.map(r => this.enhanceSofaScorePlayer(
							sofaScoreAdapter.convertToFeedPlayer(r.entity as SofaScorePlayer, 'search')
						));
					this.stats.sofascoreRequests++;
				} catch (error) {
					console.warn('SofaScore search failed, using mock data:', error);
				}
			}

			// Fallback to mock data or supplement results
			if (players.length < limit) {
				const mockPlayers = await this.searchMockPlayers(query, limit - players.length);
				players.push(...mockPlayers);
			}

			// Cache results
			if (this.config.cacheEnabled && players.length > 0) {
				this.setCache(cacheKey, players, 600000); // 10 minute cache
			}

			this.updateResponseTime(startTime);
			return players;

		} catch (error) {
			this.handleError(error as Error);
			this.updateResponseTime(startTime);
			throw error;
		}
	}

	/**
	 * Get live match updates
	 */
	async getLiveMatches(): Promise<EnhancedFeedMatch[]> {
		const startTime = Date.now();
		this.stats.totalRequests++;

		try {
			// Live data should not be cached for long
			const cacheKey = 'live_matches';
			const cached = this.getFromCache(cacheKey, 30000); // 30 second cache
			if (cached) {
				this.stats.cacheHits++;
				this.updateResponseTime(startTime);
				return cached;
			}
			this.stats.cacheMisses++;

			let matches: EnhancedFeedMatch[] = [];

			// Try SofaScore for live data
			if (this.config.primarySource !== 'mock') {
				try {
					const liveMatches = await sofaScoreAdapter.getLiveMatches();
					matches = liveMatches.map(match => 
						this.enhanceSofaScoreMatch(sofaScoreAdapter.convertToFeedMatch(match))
					);
					this.stats.sofascoreRequests++;
				} catch (error) {
					console.warn('SofaScore live matches failed:', error);
				}
			}

			// Cache results briefly
			if (this.config.cacheEnabled && matches.length > 0) {
				this.setCache(cacheKey, matches, 30000); // 30 second cache
			}

			this.updateResponseTime(startTime);
			return matches;

		} catch (error) {
			this.handleError(error as Error);
			this.updateResponseTime(startTime);
			return []; // Return empty array for live matches on error
		}
	}

	/**
	 * Update service configuration
	 */
	updateConfig(newConfig: Partial<UnifiedFeedConfig>): void {
		this.config = { ...this.config, ...newConfig };
		
		// Clear cache if caching was disabled
		if (!newConfig.cacheEnabled) {
			this.cache.clear();
		}
	}

	/**
	 * Get service statistics
	 */
	getStats(): ServiceStats {
		return { ...this.stats };
	}

	/**
	 * Clear all caches
	 */
	clearCache(): void {
		this.cache.clear();
		sofaScoreAdapter.clearCache();
	}

	/**
	 * Reset statistics
	 */
	resetStats(): void {
		this.stats = {
			totalRequests: 0,
			mockRequests: 0,
			sofascoreRequests: 0,
			cacheHits: 0,
			cacheMisses: 0,
			errorCount: 0,
			averageResponseTime: 0
		};
	}

	// Private helper methods

	private async getMockMatches(from: Date, to: Date): Promise<EnhancedFeedMatch[]> {
		this.stats.mockRequests++;
		const matches = await feedAdapter.listUpcoming(from, to);
		return matches.map(match => this.enhanceMockMatch(match));
	}

	private async getSofaScoreMatches(from: Date, to: Date): Promise<EnhancedFeedMatch[]> {
		this.stats.sofascoreRequests++;
		const matches: EnhancedFeedMatch[] = [];
		
		// Get matches for each day in the range
		const currentDate = new Date(from);
		while (currentDate <= to) {
			try {
				const dayMatches = await sofaScoreAdapter.getMatchesByDate(currentDate);
				const enhancedMatches = dayMatches.map(match => 
					this.enhanceSofaScoreMatch(sofaScoreAdapter.convertToFeedMatch(match))
				);
				matches.push(...enhancedMatches);
			} catch (error) {
				console.warn(`Failed to get matches for ${currentDate.toISOString()}:`, error);
			}
			currentDate.setDate(currentDate.getDate() + 1);
		}
		
		return matches;
	}

	private async getHybridMatches(from: Date, to: Date): Promise<EnhancedFeedMatch[]> {
		const [mockMatches, sofaMatches] = await Promise.allSettled([
			this.getMockMatches(from, to),
			this.getSofaScoreMatches(from, to)
		]);

		const allMatches: EnhancedFeedMatch[] = [];

		// Add SofaScore matches (higher priority)
		if (sofaMatches.status === 'fulfilled') {
			allMatches.push(...sofaMatches.value);
		}

		// Add mock matches that don't conflict
		if (mockMatches.status === 'fulfilled') {
			const nonConflictingMock = mockMatches.value.filter(mockMatch => 
				!allMatches.some(sofaMatch => 
					this.matchesAreSimilar(mockMatch, sofaMatch)
				)
			);
			allMatches.push(...nonConflictingMock);
		}

		return allMatches.sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
	}

	private async getMockPlayers(matchId: string): Promise<EnhancedFeedPlayer[]> {
		this.stats.mockRequests++;
		const players = await feedAdapter.getPlayers(matchId);
		return players.map(player => this.enhanceMockPlayer(player));
	}

	private async getSofaScorePlayers(matchId: string): Promise<EnhancedFeedPlayer[]> {
		this.stats.sofascoreRequests++;
		// For now, return empty array as SofaScore player lineup API would need separate implementation
		return [];
	}

	private async searchMockPlayers(query: string, limit: number): Promise<EnhancedFeedPlayer[]> {
		this.stats.mockRequests++;
		// Simple mock search - filter players by name
		const allPlayers = await feedAdapter.getPlayers('mock_search');
		const filtered = allPlayers
			.filter(player => player.name.toLowerCase().includes(query.toLowerCase()))
			.slice(0, limit);
		return filtered.map(player => this.enhanceMockPlayer(player));
	}

	private enhanceMockMatch(match: FeedMatch): EnhancedFeedMatch {
		return {
			...match,
			dataSource: 'mock',
			confidenceScore: 85, // Mock data is consistent but not real
			lastSyncTime: new Date()
		};
	}

	private enhanceSofaScoreMatch(match: FeedMatch): EnhancedFeedMatch {
		return {
			...match,
			dataSource: 'sofascore',
			confidenceScore: 95, // Real data is high confidence
			lastSyncTime: new Date()
		};
	}

	private enhanceMockPlayer(player: FeedPlayer): EnhancedFeedPlayer {
		return {
			...player,
			dataSource: 'mock',
			confidenceScore: 80,
			lastSyncTime: new Date()
		};
	}

	private enhanceSofaScorePlayer(player: FeedPlayer): EnhancedFeedPlayer {
		return {
			...player,
			dataSource: 'sofascore',
			confidenceScore: 95,
			lastSyncTime: new Date()
		};
	}

	private matchesAreSimilar(match1: EnhancedFeedMatch, match2: EnhancedFeedMatch): boolean {
		// Simple similarity check based on teams and time
		const timeDiff = Math.abs(match1.kickoff.getTime() - match2.kickoff.getTime());
		const sameTeams = (match1.home === match2.home && match1.away === match2.away) ||
						 (match1.home === match2.away && match1.away === match2.home);
		
		return sameTeams && timeDiff < 3600000; // Within 1 hour
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

	private setCache(key: string, data: any, ttl: number): void {
		this.cache.set(key, {
			data,
			expires: Date.now() + ttl,
			source: this.config.primarySource
		});
	}

	private handleError(error: Error): void {
		this.stats.errorCount++;
		this.stats.lastError = error.message;
		this.stats.lastErrorTime = new Date();
		console.error('UnifiedFeedService error:', error);
	}

	private updateResponseTime(startTime: number): void {
		const responseTime = Date.now() - startTime;
		this.stats.averageResponseTime = 
			(this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) / 
			this.stats.totalRequests;
	}
}

// Export configured instance
export const unifiedFeedService = UnifiedFeedService.getInstance({
	primarySource: 'hybrid', // Use both mock and real data
	fallbackEnabled: true,
	cacheEnabled: true,
	maxRetries: 3,
	timeoutMs: 10000
});

// Export types
export type {
	UnifiedFeedConfig,
	EnhancedFeedMatch,
	EnhancedFeedPlayer,
	ServiceStats
};