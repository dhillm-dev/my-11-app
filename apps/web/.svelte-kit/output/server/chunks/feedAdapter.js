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
export {
  feedAdapter as f
};
