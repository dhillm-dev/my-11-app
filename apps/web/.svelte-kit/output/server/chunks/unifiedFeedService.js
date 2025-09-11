import { f as feedAdapter } from "./feedAdapter.js";
import { s as sofaScoreAdapter } from "./sofascoreAdapter.js";
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
