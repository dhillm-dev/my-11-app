import type { Match, Player } from '$lib/types';

// Extended match interface for data processing
export interface FeedMatch extends Match {
	matchId: string;
	league: string;
	home: string;
	away: string;
	kickoff: Date;
	status: 'upcoming' | 'live' | 'completed';
	popularity: number; // 0-100 score
	source: string;
	lastUpdated: Date;
	venue?: string;
	lineupStatus?: 'confirmed' | 'probable' | 'unavailable';
	odds?: {
		home: number;
		draw: number;
		away: number;
	};
	curationState: 'feed_only' | 'curated' | 'blacklisted';
	auditTrail: AuditEntry[];
}

export interface AuditEntry {
	id: string;
	who: string;
	what: string;
	entity: string;
	before: any;
	after: any;
	when: Date;
}

export interface FeedPlayer extends Player {
	matchId: string;
	role: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
	meta: {
		injuryStatus?: 'fit' | 'doubtful' | 'injured';
		form: number; // 0-10
		value: number; // market value
	};
}

/**
 * Mock FeedAdapter - Replaceable interface for match data
 * In production, this would connect to real sports data APIs
 */
export class FeedAdapter {
	private static instance: FeedAdapter;
	private mockMatches: FeedMatch[] = [];
	private mockPlayers: FeedPlayer[] = [];

	constructor() {
		this.initializeMockData();
	}

	static getInstance(): FeedAdapter {
		if (!FeedAdapter.instance) {
			FeedAdapter.instance = new FeedAdapter();
		}
		return FeedAdapter.instance;
	}

	/**
	 * Get upcoming matches within date range
	 */
	async listUpcoming(from: Date, to: Date): Promise<FeedMatch[]> {
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 200));

		return this.mockMatches.filter(match => 
			match.kickoff >= from && 
			match.kickoff <= to &&
			match.status === 'upcoming'
		);
	}

	/**
	 * Get specific match by ID
	 */
	async getMatch(matchId: string): Promise<FeedMatch | null> {
		await new Promise(resolve => setTimeout(resolve, 100));
		return this.mockMatches.find(match => match.matchId === matchId) || null;
	}

	/**
	 * Get players for a specific match
	 */
	async getPlayers(matchId: string): Promise<FeedPlayer[]> {
		await new Promise(resolve => setTimeout(resolve, 150));
		return this.mockPlayers.filter(player => player.matchId === matchId);
	}

	/**
	 * Update match curation state (local storage for now)
	 */
	updateCurationState(matchId: string, state: 'feed_only' | 'curated' | 'blacklisted', user: string): void {
		const match = this.mockMatches.find(m => m.matchId === matchId);
		if (match) {
			const oldState = match.curationState;
			match.curationState = state;
			match.lastUpdated = new Date();
			
			// Add audit entry
			match.auditTrail.push({
				id: crypto.randomUUID(),
				who: user,
				what: `Changed curation state from ${oldState} to ${state}`,
				entity: 'match',
				before: { curationState: oldState },
				after: { curationState: state },
				when: new Date()
			});

			// Persist to localStorage
			this.saveCurationState();
		}
	}

	/**
	 * Bulk update curation states
	 */
	bulkUpdateCuration(matchIds: string[], state: 'feed_only' | 'curated' | 'blacklisted', user: string): void {
		matchIds.forEach(matchId => {
			this.updateCurationState(matchId, state, user);
		});
	}

	/**
	 * Refresh feed data (simulate API refresh)
	 */
	async refreshFeed(): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, 1000));
		// In real implementation, this would fetch fresh data from API
		this.mockMatches.forEach(match => {
			match.lastUpdated = new Date();
			// Simulate popularity changes
			match.popularity = Math.max(0, Math.min(100, match.popularity + (Math.random() - 0.5) * 10));
		});
	}

	private initializeMockData(): void {
		// Load persisted curation states
		this.loadCurationState();

		// Generate mock matches if none exist
		if (this.mockMatches.length === 0) {
			this.generateMockMatches();
		}
	}

	private generateMockMatches(): void {
		const leagues = ['EPL', 'LALIGA', 'UCL', 'BUNDESLIGA', 'SERIE_A', 'LIGUE_1'];
		const teams = {
			EPL: ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Man United', 'Tottenham'],
			LALIGA: ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia', 'Villarreal'],
			UCL: ['Bayern Munich', 'PSG', 'Juventus', 'AC Milan', 'Inter Milan', 'Dortmund'],
			BUNDESLIGA: ['Bayern Munich', 'Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Wolfsburg', 'Frankfurt'],
			SERIE_A: ['Juventus', 'AC Milan', 'Inter Milan', 'Napoli', 'Roma', 'Lazio'],
			LIGUE_1: ['PSG', 'Marseille', 'Lyon', 'Monaco', 'Nice', 'Lille']
		};

		const now = new Date();
		for (let i = 0; i < 50; i++) {
			const league = leagues[Math.floor(Math.random() * leagues.length)];
			const leagueTeams = teams[league as keyof typeof teams];
			const homeTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
			let awayTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
			while (awayTeam === homeTeam) {
				awayTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
			}

			const kickoff = new Date(now.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000)); // Next 7 days
			const popularity = Math.floor(Math.random() * 100);
			const isBigMatch = ['EPL', 'LALIGA', 'UCL'].includes(league) && popularity > 70;

			const match: FeedMatch = {
				id: `match_${i + 1}`,
				matchId: `feed_${Date.now()}_${i}`,
				league,
				home: homeTeam,
				away: awayTeam,
				homeTeam,
				awayTeam,
				homeTeamLogo: `/logos/${homeTeam.toLowerCase().replace(' ', '_')}.png`,
				awayTeamLogo: `/logos/${awayTeam.toLowerCase().replace(' ', '_')}.png`,
				kickoff,
				startTime: kickoff,
				status: 'upcoming',
				popularity,
				source: 'MockFeed',
				lastUpdated: new Date(),
				venue: `${homeTeam} Stadium`,
				lineupStatus: Math.random() > 0.3 ? 'confirmed' : 'probable',
				odds: {
					home: 1.5 + Math.random() * 2,
					draw: 3 + Math.random() * 2,
					away: 1.5 + Math.random() * 2
				},
				curationState: isBigMatch ? 'curated' : 'feed_only',
				auditTrail: [],
				players: []
			};

			this.mockMatches.push(match);
			this.generatePlayersForMatch(match.matchId, homeTeam, awayTeam);
		}
	}

	private generatePlayersForMatch(matchId: string, homeTeam: string, awayTeam: string): void {
		const positions: Array<'goalkeeper' | 'defender' | 'midfielder' | 'forward'> = 
			['goalkeeper', 'defender', 'midfielder', 'forward'];
		const positionCounts = { goalkeeper: 2, defender: 8, midfielder: 8, forward: 6 };

		[homeTeam, awayTeam].forEach(team => {
			positions.forEach(position => {
				for (let i = 0; i < positionCounts[position]; i++) {
					const player: FeedPlayer = {
						id: `${matchId}_${team}_${position}_${i}`,
						matchId,
						name: `${team} ${position} ${i + 1}`,
						team,
						position: position === 'goalkeeper' ? 'GK' : 
								  position === 'defender' ? 'DEF' :
								  position === 'midfielder' ? 'MID' : 'FWD',
						role: position,
						credits: position === 'goalkeeper' ? 5 + Math.random() * 3 :
								 position === 'defender' ? 6 + Math.random() * 4 :
								 position === 'midfielder' ? 7 + Math.random() * 5 :
								 8 + Math.random() * 6,
						points: 0,
						selectedBy: Math.random() * 100,
						isPlaying: Math.random() > 0.1,
						meta: {
							injuryStatus: Math.random() > 0.8 ? 'doubtful' : 'fit',
							form: Math.random() * 10,
							value: 1000000 + Math.random() * 50000000
						}
					};
					this.mockPlayers.push(player);
				}
			});
		});
	}

	private saveCurationState(): void {
		if (typeof localStorage !== 'undefined') {
			const curationData = this.mockMatches.map(match => ({
				matchId: match.matchId,
				curationState: match.curationState,
				auditTrail: match.auditTrail
			}));
			localStorage.setItem('picknwin_curation_state', JSON.stringify(curationData));
		}
	}

	private loadCurationState(): void {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem('picknwin_curation_state');
			if (saved) {
				const curationData = JSON.parse(saved);
				// Apply saved states when matches are generated
				this.applySavedCurationStates = curationData;
			}
		}
	}

	private applySavedCurationStates: any[] = [];
}

// Export singleton instance
export const feedAdapter = FeedAdapter.getInstance();