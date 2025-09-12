class SofaScoreAdapter {
  static instance;
  config;
  cache = /* @__PURE__ */ new Map();
  requestCount = 0;
  lastResetTime = Date.now();
  constructor(config) {
    this.config = config;
  }
  static getInstance(config) {
    if (!SofaScoreAdapter.instance) {
      if (!config) {
        throw new Error("SofaScoreAdapter requires configuration on first initialization");
      }
      SofaScoreAdapter.instance = new SofaScoreAdapter(config);
    }
    return SofaScoreAdapter.instance;
  }
  /**
   * Search for players or teams
   */
  async search(query, type = "all", page = 0) {
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
  async getPlayer(playerId) {
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
  async getTeam(teamId) {
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
  async getMatchesByDate(date) {
    const dateStr = date.toISOString().split("T")[0];
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
  async getLiveMatches() {
    const cacheKey = "live_matches";
    const cached = this.getFromCache(cacheKey, 3e4);
    if (cached) return cached;
    await this.checkRateLimit();
    const url = `${this.config.baseUrl}/sport/football/events/live`;
    const response = await this.makeRequest(url);
    this.setCache(cacheKey, response.events || [], 3e4);
    return response.events || [];
  }
  /**
   * Convert SofaScore match to FeedMatch format
   */
  convertToFeedMatch(sofaMatch) {
    const kickoff = new Date(sofaMatch.startTimestamp * 1e3);
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
      popularity: Math.min(100, Math.floor(sofaMatch.homeTeam.userCount / 1e4)),
      source: "SofaScore",
      lastUpdated: /* @__PURE__ */ new Date(),
      venue: `${sofaMatch.homeTeam.name} Stadium`,
      lineupStatus: "probable",
      curationState: "feed_only",
      auditTrail: [],
      players: []
    };
  }
  /**
   * Convert SofaScore player to FeedPlayer format
   */
  convertToFeedPlayer(sofaPlayer, matchId) {
    const role = this.mapPlayerPosition(sofaPlayer.position);
    const credits = this.calculatePlayerCredits(sofaPlayer, role);
    return {
      id: `sofa_${sofaPlayer.id}`,
      matchId,
      name: sofaPlayer.name,
      team: sofaPlayer.team?.name || "Unknown",
      position: this.mapPositionCode(role),
      role,
      credits,
      points: 0,
      selectedBy: Math.random() * 100,
      // Would need separate API for this
      isPlaying: true,
      meta: {
        injuryStatus: "fit",
        form: Math.random() * 10,
        // Would need separate API for this
        value: Math.floor(Math.random() * 5e7) + 1e6
      }
    };
  }
  /**
   * Get popular players (trending searches)
   */
  async getPopularPlayers(limit = 20) {
    const searches = ["messi", "ronaldo", "mbappe", "haaland", "neymar", "salah", "kane", "benzema"];
    const players = [];
    for (const query of searches.slice(0, Math.ceil(limit / searches.length))) {
      try {
        const results = await this.search(query, "player", 0);
        const topPlayers = results.results.filter((r) => r.type === "player").slice(0, 3).map((r) => this.convertToFeedPlayer(r.entity, "popular"));
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
  clearCache() {
    this.cache.clear();
  }
  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      hitRate: 0
      // Would need to track hits/misses
    };
  }
  async makeRequest(url) {
    try {
      const response = await fetch(url, {
        headers: {
          "X-RapidAPI-Host": "sofascore.p.rapidapi.com",
          "X-RapidAPI-Key": this.config.apiKey,
          "Content-Type": "application/json"
        },
        method: "GET"
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`RapidAPI SofaScore error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`RapidAPI SofaScore error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("RapidAPI request failed:", error);
      throw error;
    }
  }
  async checkRateLimit() {
    const now = Date.now();
    const timeSinceReset = now - this.lastResetTime;
    if (timeSinceReset >= 6e4) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    if (this.requestCount >= this.config.rateLimit) {
      const waitTime = 6e4 - timeSinceReset;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastResetTime = Date.now();
    }
    this.requestCount++;
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
  setCache(key, data, customTtl) {
    const ttl = customTtl || this.config.cacheTtl;
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }
  mapMatchStatus(statusCode) {
    if (statusCode === 0) return "upcoming";
    if (statusCode >= 1 && statusCode <= 6) return "live";
    return "completed";
  }
  mapPlayerPosition(position) {
    if (!position) return "midfielder";
    const pos = position.toLowerCase();
    if (pos.includes("g") || pos.includes("keeper")) return "goalkeeper";
    if (pos.includes("d") || pos.includes("def")) return "defender";
    if (pos.includes("f") || pos.includes("forward") || pos.includes("striker")) return "forward";
    return "midfielder";
  }
  mapPositionCode(role) {
    switch (role) {
      case "goalkeeper":
        return "GK";
      case "defender":
        return "DEF";
      case "midfielder":
        return "MID";
      case "forward":
        return "FWD";
      default:
        return "MID";
    }
  }
  calculatePlayerCredits(player, role) {
    const baseCredits = {
      goalkeeper: 5,
      defender: 6,
      midfielder: 7,
      forward: 8
    };
    const popularityMultiplier = Math.min(2, 1 + player.userCount / 1e6);
    return Math.round(baseCredits[role] * popularityMultiplier * 10) / 10;
  }
}
const defaultConfig = {
  apiKey: "23eba5e004mshdb855f7e2e9c0c3p13cd89jsn53631ff75549",
  baseUrl: "https://sofascore.p.rapidapi.com",
  rateLimit: 100,
  // RapidAPI allows more requests
  cacheTtl: 3e5
  // 5 minutes
};
const sofaScoreAdapter = SofaScoreAdapter.getInstance(defaultConfig);
export {
  sofaScoreAdapter as s
};
