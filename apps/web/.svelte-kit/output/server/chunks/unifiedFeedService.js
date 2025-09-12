import { s as sofaScoreAdapter } from "./sofascoreAdapter.js";
class FeedAdapter {
  static instance;
  mockMatches = [];
  mockPlayers = [];
  constructor() {
    this.initializeMockData();
  }
  static getInstance() {
    if (!FeedAdapter.instance) {
      FeedAdapter.instance = new FeedAdapter();
    }
    return FeedAdapter.instance;
  }
  /**
   * Get upcoming matches within date range
   */
  async listUpcoming(from, to) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockMatches.filter(
      (match) => match.kickoff >= from && match.kickoff <= to && match.status === "upcoming"
    );
  }
  /**
   * Get specific match by ID
   */
  async getMatch(matchId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.mockMatches.find((match) => match.matchId === matchId) || null;
  }
  /**
   * Get players for a specific match
   */
  async getPlayers(matchId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return this.mockPlayers.filter((player) => player.matchId === matchId);
  }
  /**
   * Update match curation state (local storage for now)
   */
  updateCurationState(matchId, state, user) {
    const match = this.mockMatches.find((m) => m.matchId === matchId);
    if (match) {
      const oldState = match.curationState;
      match.curationState = state;
      match.lastUpdated = /* @__PURE__ */ new Date();
      match.auditTrail.push({
        id: crypto.randomUUID(),
        who: user,
        what: `Changed curation state from ${oldState} to ${state}`,
        entity: "match",
        before: { curationState: oldState },
        after: { curationState: state },
        when: /* @__PURE__ */ new Date()
      });
      this.saveCurationState();
    }
  }
  /**
   * Bulk update curation states
   */
  bulkUpdateCuration(matchIds, state, user) {
    matchIds.forEach((matchId) => {
      this.updateCurationState(matchId, state, user);
    });
  }
  /**
   * Refresh feed data (simulate API refresh)
   */
  async refreshFeed() {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    this.mockMatches.forEach((match) => {
      match.lastUpdated = /* @__PURE__ */ new Date();
      match.popularity = Math.max(0, Math.min(100, match.popularity + (Math.random() - 0.5) * 10));
    });
  }
  initializeMockData() {
    this.loadCurationState();
    if (this.mockMatches.length === 0) {
      this.generateMockMatches();
    }
  }
  generateMockMatches() {
    const leagues = ["EPL", "LALIGA", "UCL", "BUNDESLIGA", "SERIE_A", "LIGUE_1"];
    const teams = {
      EPL: ["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United", "Tottenham"],
      LALIGA: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla", "Valencia", "Villarreal"],
      UCL: ["Bayern Munich", "PSG", "Juventus", "AC Milan", "Inter Milan", "Dortmund"],
      BUNDESLIGA: ["Bayern Munich", "Dortmund", "RB Leipzig", "Bayer Leverkusen", "Wolfsburg", "Frankfurt"],
      SERIE_A: ["Juventus", "AC Milan", "Inter Milan", "Napoli", "Roma", "Lazio"],
      LIGUE_1: ["PSG", "Marseille", "Lyon", "Monaco", "Nice", "Lille"]
    };
    const now = /* @__PURE__ */ new Date();
    for (let i = 0; i < 50; i++) {
      const league = leagues[Math.floor(Math.random() * leagues.length)];
      const leagueTeams = teams[league];
      const homeTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
      let awayTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
      while (awayTeam === homeTeam) {
        awayTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
      }
      const kickoff = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1e3);
      const popularity = Math.floor(Math.random() * 100);
      const isBigMatch = ["EPL", "LALIGA", "UCL"].includes(league) && popularity > 70;
      const match = {
        id: `match_${i + 1}`,
        matchId: `feed_${Date.now()}_${i}`,
        league,
        home: homeTeam,
        away: awayTeam,
        homeTeam,
        awayTeam,
        homeTeamLogo: `/logos/${homeTeam.toLowerCase().replace(" ", "_")}.png`,
        awayTeamLogo: `/logos/${awayTeam.toLowerCase().replace(" ", "_")}.png`,
        kickoff,
        startTime: kickoff,
        status: "upcoming",
        popularity,
        source: "MockFeed",
        lastUpdated: /* @__PURE__ */ new Date(),
        venue: `${homeTeam} Stadium`,
        lineupStatus: Math.random() > 0.3 ? "confirmed" : "probable",
        odds: {
          home: 1.5 + Math.random() * 2,
          draw: 3 + Math.random() * 2,
          away: 1.5 + Math.random() * 2
        },
        curationState: isBigMatch ? "curated" : "feed_only",
        auditTrail: [],
        players: []
      };
      this.mockMatches.push(match);
      this.generatePlayersForMatch(match.matchId, homeTeam, awayTeam);
    }
  }
  generatePlayersForMatch(matchId, homeTeam, awayTeam) {
    const positions = ["goalkeeper", "defender", "midfielder", "forward"];
    const positionCounts = { goalkeeper: 2, defender: 8, midfielder: 8, forward: 6 };
    [homeTeam, awayTeam].forEach((team) => {
      positions.forEach((position) => {
        for (let i = 0; i < positionCounts[position]; i++) {
          const player = {
            id: `${matchId}_${team}_${position}_${i}`,
            matchId,
            name: `${team} ${position} ${i + 1}`,
            team,
            position: position === "goalkeeper" ? "GK" : position === "defender" ? "DEF" : position === "midfielder" ? "MID" : "FWD",
            role: position,
            credits: position === "goalkeeper" ? 5 + Math.random() * 3 : position === "defender" ? 6 + Math.random() * 4 : position === "midfielder" ? 7 + Math.random() * 5 : 8 + Math.random() * 6,
            points: 0,
            selectedBy: Math.random() * 100,
            isPlaying: Math.random() > 0.1,
            meta: {
              injuryStatus: Math.random() > 0.8 ? "doubtful" : "fit",
              form: Math.random() * 10,
              value: 1e6 + Math.random() * 5e7
            }
          };
          this.mockPlayers.push(player);
        }
      });
    });
  }
  saveCurationState() {
    if (typeof localStorage !== "undefined") {
      const curationData = this.mockMatches.map((match) => ({
        matchId: match.matchId,
        curationState: match.curationState,
        auditTrail: match.auditTrail
      }));
      localStorage.setItem("picknwin_curation_state", JSON.stringify(curationData));
    }
  }
  loadCurationState() {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("picknwin_curation_state");
      if (saved) {
        const curationData = JSON.parse(saved);
        this.applySavedCurationStates = curationData;
      }
    }
  }
  applySavedCurationStates = [];
}
const feedAdapter = FeedAdapter.getInstance();
class UnifiedFeedService {
  static instance;
  config;
  stats;
  cache = /* @__PURE__ */ new Map();
  constructor(config = {}) {
    this.config = {
      primarySource: "hybrid",
      fallbackEnabled: true,
      cacheEnabled: true,
      maxRetries: 3,
      timeoutMs: 1e4,
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
  static getInstance(config) {
    if (!UnifiedFeedService.instance) {
      UnifiedFeedService.instance = new UnifiedFeedService(config);
    }
    return UnifiedFeedService.instance;
  }
  /**
   * Get upcoming matches with intelligent source selection
   */
  async getUpcomingMatches(from, to) {
    const startTime = Date.now();
    this.stats.totalRequests++;
    try {
      const cacheKey = `upcoming_${from.getTime()}_${to.getTime()}`;
      if (this.config.cacheEnabled) {
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          this.stats.cacheHits++;
          this.updateResponseTime(startTime);
          return cached;
        }
        this.stats.cacheMisses++;
      }
      let matches = [];
      switch (this.config.primarySource) {
        case "mock":
          matches = await this.getMockMatches(from, to);
          break;
        case "sofascore":
          matches = await this.getSofaScoreMatches(from, to);
          break;
        case "hybrid":
          matches = await this.getHybridMatches(from, to);
          break;
      }
      if (this.config.cacheEnabled && matches.length > 0) {
        this.setCache(cacheKey, matches, 3e5);
      }
      this.updateResponseTime(startTime);
      return matches;
    } catch (error) {
      this.handleError(error);
      this.updateResponseTime(startTime);
      if (this.config.fallbackEnabled && this.config.primarySource !== "mock") {
        console.warn("Falling back to mock data due to error:", error);
        return this.getMockMatches(from, to);
      }
      throw error;
    }
  }
  /**
   * Get players for a specific match
   */
  async getMatchPlayers(matchId) {
    const startTime = Date.now();
    this.stats.totalRequests++;
    try {
      const cacheKey = `players_${matchId}`;
      if (this.config.cacheEnabled) {
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          this.stats.cacheHits++;
          this.updateResponseTime(startTime);
          return cached;
        }
        this.stats.cacheMisses++;
      }
      let players = [];
      if (matchId.startsWith("sofa_")) {
        players = await this.getSofaScorePlayers(matchId);
      } else {
        players = await this.getMockPlayers(matchId);
      }
      if (this.config.cacheEnabled && players.length > 0) {
        this.setCache(cacheKey, players, 6e5);
      }
      this.updateResponseTime(startTime);
      return players;
    } catch (error) {
      this.handleError(error);
      this.updateResponseTime(startTime);
      if (this.config.fallbackEnabled) {
        console.warn("Falling back to mock players due to error:", error);
        return this.getMockPlayers(matchId);
      }
      throw error;
    }
  }
  /**
   * Search for players across all sources
   */
  async searchPlayers(query, limit = 20) {
    const startTime = Date.now();
    this.stats.totalRequests++;
    try {
      const cacheKey = `search_${query}_${limit}`;
      if (this.config.cacheEnabled) {
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          this.stats.cacheHits++;
          this.updateResponseTime(startTime);
          return cached;
        }
        this.stats.cacheMisses++;
      }
      let players = [];
      if (this.config.primarySource !== "mock") {
        try {
          const sofaResults = await sofaScoreAdapter.search(query, "player");
          players = sofaResults.results.filter((r) => r.type === "player").slice(0, limit).map((r) => this.enhanceSofaScorePlayer(
            sofaScoreAdapter.convertToFeedPlayer(r.entity, "search")
          ));
          this.stats.sofascoreRequests++;
        } catch (error) {
          console.warn("SofaScore search failed, using mock data:", error);
        }
      }
      if (players.length < limit) {
        const mockPlayers = await this.searchMockPlayers(query, limit - players.length);
        players.push(...mockPlayers);
      }
      if (this.config.cacheEnabled && players.length > 0) {
        this.setCache(cacheKey, players, 6e5);
      }
      this.updateResponseTime(startTime);
      return players;
    } catch (error) {
      this.handleError(error);
      this.updateResponseTime(startTime);
      throw error;
    }
  }
  /**
   * Get live match updates
   */
  async getLiveMatches() {
    const startTime = Date.now();
    this.stats.totalRequests++;
    try {
      const cacheKey = "live_matches";
      const cached = this.getFromCache(cacheKey, 3e4);
      if (cached) {
        this.stats.cacheHits++;
        this.updateResponseTime(startTime);
        return cached;
      }
      this.stats.cacheMisses++;
      let matches = [];
      if (this.config.primarySource !== "mock") {
        try {
          const liveMatches = await sofaScoreAdapter.getLiveMatches();
          matches = liveMatches.map(
            (match) => this.enhanceSofaScoreMatch(sofaScoreAdapter.convertToFeedMatch(match))
          );
          this.stats.sofascoreRequests++;
        } catch (error) {
          console.warn("SofaScore live matches failed:", error);
        }
      }
      if (this.config.cacheEnabled && matches.length > 0) {
        this.setCache(cacheKey, matches, 3e4);
      }
      this.updateResponseTime(startTime);
      return matches;
    } catch (error) {
      this.handleError(error);
      this.updateResponseTime(startTime);
      return [];
    }
  }
  /**
   * Update service configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (!newConfig.cacheEnabled) {
      this.cache.clear();
    }
  }
  /**
   * Get service statistics
   */
  getStats() {
    return { ...this.stats };
  }
  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
    sofaScoreAdapter.clearCache();
  }
  /**
   * Reset statistics
   */
  resetStats() {
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
  async getMockMatches(from, to) {
    this.stats.mockRequests++;
    const matches = await feedAdapter.listUpcoming(from, to);
    return matches.map((match) => this.enhanceMockMatch(match));
  }
  async getSofaScoreMatches(from, to) {
    this.stats.sofascoreRequests++;
    const matches = [];
    const currentDate = new Date(from);
    while (currentDate <= to) {
      try {
        const dayMatches = await sofaScoreAdapter.getMatchesByDate(currentDate);
        const enhancedMatches = dayMatches.map(
          (match) => this.enhanceSofaScoreMatch(sofaScoreAdapter.convertToFeedMatch(match))
        );
        matches.push(...enhancedMatches);
      } catch (error) {
        console.warn(`Failed to get matches for ${currentDate.toISOString()}:`, error);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return matches;
  }
  async getHybridMatches(from, to) {
    const [mockMatches, sofaMatches] = await Promise.allSettled([
      this.getMockMatches(from, to),
      this.getSofaScoreMatches(from, to)
    ]);
    const allMatches = [];
    if (sofaMatches.status === "fulfilled") {
      allMatches.push(...sofaMatches.value);
    }
    if (mockMatches.status === "fulfilled") {
      const nonConflictingMock = mockMatches.value.filter(
        (mockMatch) => !allMatches.some(
          (sofaMatch) => this.matchesAreSimilar(mockMatch, sofaMatch)
        )
      );
      allMatches.push(...nonConflictingMock);
    }
    return allMatches.sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
  }
  async getMockPlayers(matchId) {
    this.stats.mockRequests++;
    const players = await feedAdapter.getPlayers(matchId);
    return players.map((player) => this.enhanceMockPlayer(player));
  }
  async getSofaScorePlayers(matchId) {
    this.stats.sofascoreRequests++;
    return [];
  }
  async searchMockPlayers(query, limit) {
    this.stats.mockRequests++;
    const allPlayers = await feedAdapter.getPlayers("mock_search");
    const filtered = allPlayers.filter((player) => player.name.toLowerCase().includes(query.toLowerCase())).slice(0, limit);
    return filtered.map((player) => this.enhanceMockPlayer(player));
  }
  enhanceMockMatch(match) {
    return {
      ...match,
      dataSource: "mock",
      confidenceScore: 85,
      // Mock data is consistent but not real
      lastSyncTime: /* @__PURE__ */ new Date()
    };
  }
  enhanceSofaScoreMatch(match) {
    return {
      ...match,
      dataSource: "sofascore",
      confidenceScore: 95,
      // Real data is high confidence
      lastSyncTime: /* @__PURE__ */ new Date()
    };
  }
  enhanceMockPlayer(player) {
    return {
      ...player,
      dataSource: "mock",
      confidenceScore: 80,
      lastSyncTime: /* @__PURE__ */ new Date()
    };
  }
  enhanceSofaScorePlayer(player) {
    return {
      ...player,
      dataSource: "sofascore",
      confidenceScore: 95,
      lastSyncTime: /* @__PURE__ */ new Date()
    };
  }
  matchesAreSimilar(match1, match2) {
    const timeDiff = Math.abs(match1.kickoff.getTime() - match2.kickoff.getTime());
    const sameTeams = match1.home === match2.home && match1.away === match2.away || match1.home === match2.away && match1.away === match2.home;
    return sameTeams && timeDiff < 36e5;
  }
  getFromCache(key, customTtl) {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }
  setCache(key, data, ttl) {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
      source: this.config.primarySource
    });
  }
  handleError(error) {
    this.stats.errorCount++;
    this.stats.lastError = error.message;
    this.stats.lastErrorTime = /* @__PURE__ */ new Date();
    console.error("UnifiedFeedService error:", error);
  }
  updateResponseTime(startTime) {
    const responseTime = Date.now() - startTime;
    this.stats.averageResponseTime = (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) / this.stats.totalRequests;
  }
}
const unifiedFeedService = UnifiedFeedService.getInstance({
  primarySource: "hybrid",
  // Use both mock and real data
  fallbackEnabled: true,
  cacheEnabled: true,
  maxRetries: 3,
  timeoutMs: 1e4
});
export {
  unifiedFeedService as u
};
