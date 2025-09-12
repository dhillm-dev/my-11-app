import { d as derived, w as writable } from "./index.js";
import { D as DEV } from "./false.js";
import { g as generateId, d as delay } from "./utils2.js";
const browser = DEV;
const teams = [
  { name: "Manchester United", logo: "/teams/man-utd.svg" },
  { name: "Liverpool", logo: "/teams/liverpool.svg" },
  { name: "Manchester City", logo: "/teams/man-city.svg" },
  { name: "Arsenal", logo: "/teams/arsenal.svg" },
  { name: "Chelsea", logo: "/teams/chelsea.svg" },
  { name: "Tottenham", logo: "/teams/tottenham.svg" },
  { name: "Newcastle", logo: "/teams/newcastle.svg" },
  { name: "Brighton", logo: "/teams/brighton.svg" }
];
const playerNames = [
  "Marcus Rashford",
  "Mohamed Salah",
  "Erling Haaland",
  "Bukayo Saka",
  "Raheem Sterling",
  "Harry Kane",
  "Bruno Fernandes",
  "Kevin De Bruyne",
  "Virgil van Dijk",
  "Ruben Dias",
  "Alisson Becker",
  "Ederson",
  "Casemiro",
  "Declan Rice",
  "Mason Mount",
  "Phil Foden",
  "Darwin Nunez",
  "Gabriel Jesus",
  "Son Heung-min",
  "Alexander Isak",
  "Jadon Sancho",
  "Jack Grealish",
  "Martin Odegaard",
  "Thiago Silva",
  "Andrew Robertson",
  "Kyle Walker",
  "Ben White",
  "Joao Cancelo"
];
function generateMockUser() {
  return {
    id: generateId(),
    email: "user@example.com",
    name: "John Doe",
    balance: 1250,
    kycVerified: true,
    createdAt: /* @__PURE__ */ new Date()
  };
}
function generateMockPlayers(count = 22) {
  const players = [];
  for (let i = 0; i < count; i++) {
    const position = i < 2 ? "GK" : i < 8 ? "DEF" : i < 16 ? "MID" : "FWD";
    const baseCredits = position === "GK" ? 8 : position === "DEF" ? 7 : position === "MID" ? 8.5 : 9;
    players.push({
      id: generateId(),
      name: playerNames[i % playerNames.length],
      team: teams[Math.floor(i / 11) % teams.length].name,
      position,
      credits: baseCredits + Math.random() * 3,
      points: Math.floor(Math.random() * 15),
      selectedBy: Math.floor(Math.random() * 80) + 5,
      isPlaying: Math.random() > 0.1
    });
  }
  return players;
}
function generateMockMatches(count = 5) {
  const matches = [];
  for (let i = 0; i < count; i++) {
    const homeTeam = teams[i % teams.length];
    const awayTeam = teams[(i + 1) % teams.length];
    matches.push({
      id: generateId(),
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      homeTeamLogo: homeTeam.logo,
      awayTeamLogo: awayTeam.logo,
      startTime: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1e3),
      league: "Premier League",
      status: "upcoming",
      players: generateMockPlayers()
    });
  }
  return matches;
}
function generateMockContests(matchId, count = 8) {
  const contestTypes = [
    { name: "Mega Contest", prizePool: 1e4, entryFee: 25, maxEntries: 1e3, winners: 100 },
    { name: "Head to Head", prizePool: 18, entryFee: 10, maxEntries: 2, winners: 1 },
    { name: "Small League", prizePool: 500, entryFee: 5, maxEntries: 100, winners: 10 },
    { name: "Winner Takes All", prizePool: 1e3, entryFee: 50, maxEntries: 25, winners: 1 },
    { name: "Beginner Contest", prizePool: 100, entryFee: 2, maxEntries: 50, winners: 5 }
  ];
  const contests = [];
  for (let i = 0; i < count; i++) {
    const type = contestTypes[i % contestTypes.length];
    const currentEntries = Math.floor(Math.random() * type.maxEntries * 0.8);
    contests.push({
      id: generateId(),
      matchId,
      name: type.name,
      title: type.name,
      matchTitle: `Match ${matchId}`,
      prizePool: type.prizePool,
      entryFee: type.entryFee,
      maxEntries: type.maxEntries,
      currentEntries,
      winners: type.winners,
      firstPrize: Math.floor(type.prizePool * 0.4),
      status: "open",
      createdAt: /* @__PURE__ */ new Date()
    });
  }
  return contests;
}
function generateMockTransactions(userId, count = 10) {
  const transactions = [];
  const types = ["signup_bonus", "join", "winnings", "deposit"];
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    let amount = 0;
    let description = "";
    switch (type) {
      case "signup_bonus":
        amount = 1200;
        description = "Welcome bonus";
        break;
      case "join":
        amount = -(Math.floor(Math.random() * 50) + 5);
        description = "Contest entry fee";
        break;
      case "winnings":
        amount = Math.floor(Math.random() * 500) + 10;
        description = "Contest winnings";
        break;
      case "deposit":
        amount = Math.floor(Math.random() * 200) + 50;
        description = "Wallet deposit";
        break;
    }
    transactions.push({
      id: generateId(),
      userId,
      type,
      amount,
      description,
      status: "completed",
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1e3)
    });
  }
  return transactions;
}
const MOCK_DELAY = 800;
let mockUser = null;
let mockMatches = [];
let mockContests = [];
let mockTeams = [];
let mockTransactions = [];
function initializeMockData() {
  if (mockMatches.length === 0) {
    mockMatches = generateMockMatches();
    mockContests = mockMatches.flatMap((match) => generateMockContests(match.id));
  }
}
class ApiService {
  // Authentication
  static async login(email, password) {
    await delay(MOCK_DELAY);
    if (email === "demo@picknwin.com" && password === "demo123") {
      mockUser = generateMockUser();
      mockTransactions = generateMockTransactions(mockUser.id);
      return { success: true, data: mockUser };
    }
    return { success: false, error: "Invalid credentials" };
  }
  static async register(email, password, name) {
    await delay(MOCK_DELAY);
    mockUser = {
      ...generateMockUser(),
      email,
      name,
      balance: 1200
      // Welcome bonus
    };
    mockTransactions = [
      {
        id: "welcome-bonus",
        userId: mockUser.id,
        type: "signup_bonus",
        amount: 1200,
        description: "Welcome bonus - €1200 free credits!",
        status: "completed",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    return { success: true, data: mockUser };
  }
  static async getCurrentUser() {
    await delay(300);
    return mockUser ? { success: true, data: mockUser } : { success: false, error: "Not authenticated" };
  }
  static async logout() {
    await delay(300);
    mockUser = null;
    return { success: true };
  }
  // Matches
  static async getMatches() {
    await delay(MOCK_DELAY);
    initializeMockData();
    return { success: true, data: mockMatches };
  }
  static async getMatch(id) {
    await delay(MOCK_DELAY);
    initializeMockData();
    const match = mockMatches.find((m) => m.id === id);
    return match ? { success: true, data: match } : { success: false, error: "Match not found" };
  }
  // Contests
  static async getContests(matchId) {
    await delay(MOCK_DELAY);
    initializeMockData();
    const contests = matchId ? mockContests.filter((c) => c.matchId === matchId) : mockContests;
    return { success: true, data: contests };
  }
  static async getContest(id) {
    await delay(MOCK_DELAY);
    initializeMockData();
    const contest = mockContests.find((c) => c.id === id);
    return contest ? { success: true, data: contest } : { success: false, error: "Contest not found" };
  }
  static async joinContest(contestId, teamId) {
    await delay(MOCK_DELAY);
    if (!mockUser) {
      return { success: false, error: "Not authenticated" };
    }
    const contest = mockContests.find((c) => c.id === contestId);
    if (!contest) {
      return { success: false, error: "Contest not found" };
    }
    if (mockUser.balance < contest.entryFee) {
      return { success: false, error: "Insufficient balance" };
    }
    mockUser.balance -= contest.entryFee;
    contest.currentEntries += 1;
    mockTransactions.unshift({
      id: `join-${Date.now()}`,
      userId: mockUser.id,
      type: "join",
      amount: -contest.entryFee,
      description: `Joined ${contest.name}`,
      status: "completed",
      createdAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }
  // Teams
  static async getMyTeams(matchId) {
    await delay(MOCK_DELAY);
    if (!mockUser) {
      return { success: false, error: "Not authenticated" };
    }
    const teams2 = matchId ? mockTeams.filter((t) => t.matchId === matchId) : mockTeams;
    return { success: true, data: teams2 };
  }
  static async saveTeam(team) {
    await delay(MOCK_DELAY);
    if (!mockUser) {
      return { success: false, error: "Not authenticated" };
    }
    const newTeam = {
      ...team,
      id: `team-${Date.now()}`,
      userId: mockUser.id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    mockTeams.push(newTeam);
    return { success: true, data: newTeam };
  }
  // Wallet & Transactions
  static async getTransactions() {
    await delay(MOCK_DELAY);
    if (!mockUser) {
      return { success: false, error: "Not authenticated" };
    }
    return { success: true, data: mockTransactions };
  }
  static async addMoney(amount) {
    await delay(MOCK_DELAY);
    if (!mockUser) {
      return { success: false, error: "Not authenticated" };
    }
    mockUser.balance += amount;
    mockTransactions.unshift({
      id: `deposit-${Date.now()}`,
      userId: mockUser.id,
      type: "deposit",
      amount,
      description: "Wallet deposit",
      status: "completed",
      createdAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }
  // Live & Results
  static async getLeaderboard(contestId) {
    await delay(MOCK_DELAY);
    const leaderboard = [];
    for (let i = 0; i < 50; i++) {
      leaderboard.push({
        userId: `user-${i}`,
        userName: `Player ${i + 1}`,
        teamName: `Team ${i + 1}`,
        points: Math.floor(Math.random() * 200) + 50,
        rank: i + 1,
        winnings: i < 10 ? Math.floor(Math.random() * 1e3) + 100 : void 0
      });
    }
    leaderboard.sort((a, b) => b.points - a.points);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    return { success: true, data: leaderboard };
  }
}
const user = writable(null);
const isAuthenticated = derived(user, ($user) => $user !== null);
const isLoading = writable(false);
const userActions = {
  async login(email, password) {
    isLoading.set(true);
    try {
      const response = await ApiService.login(email, password);
      if (response.success && response.data) {
        user.set(response.data);
        if (browser) ;
        return { success: true };
      } else {
        return { success: false, error: response.error || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    } finally {
      isLoading.set(false);
    }
  },
  async register(email, password, name) {
    isLoading.set(true);
    try {
      const response = await ApiService.register(email, password, name);
      if (response.success && response.data) {
        user.set(response.data);
        if (browser) ;
        return { success: true };
      } else {
        return { success: false, error: response.error || "Registration failed" };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    } finally {
      isLoading.set(false);
    }
  },
  async logout() {
    isLoading.set(true);
    try {
      await ApiService.logout();
      user.set(null);
      if (browser) ;
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      isLoading.set(false);
    }
  },
  async loadFromStorage() {
  },
  updateBalance(newBalance) {
    user.update((currentUser) => {
      if (currentUser) {
        return { ...currentUser, balance: newBalance };
      }
      return currentUser;
    });
  },
  updateProfile(updates) {
    user.update((currentUser) => {
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        return updatedUser;
      }
      return currentUser;
    });
  }
};
const initialState$2 = {
  matches: [],
  selectedMatch: null,
  isLoading: false,
  error: null
};
function createMatchesStore() {
  const { subscribe, set, update } = writable(initialState$2);
  return {
    subscribe,
    // Actions
    async loadMatches() {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.getMatches();
        if (response.success) {
          update((state) => ({
            ...state,
            matches: response.data,
            isLoading: false
          }));
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to load matches"
          }));
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
      }
    },
    async loadMatch(id) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.getMatch(id);
        if (response.success) {
          update((state) => ({
            ...state,
            selectedMatch: response.data,
            isLoading: false
          }));
          return response.data;
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to load match"
          }));
          return null;
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
        return null;
      }
    },
    setSelectedMatch(match) {
      update((state) => ({ ...state, selectedMatch: match }));
    },
    clearError() {
      update((state) => ({ ...state, error: null }));
    }
  };
}
createMatchesStore();
const initialContestsState = {
  contests: [],
  selectedContest: null,
  isLoading: false,
  error: null
};
function createContestsStore() {
  const { subscribe, set, update } = writable(initialContestsState);
  return {
    subscribe,
    // Actions
    async loadContests(matchId) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.getContests(matchId);
        if (response.success) {
          update((state) => ({
            ...state,
            contests: response.data,
            isLoading: false
          }));
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to load contests"
          }));
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
      }
    },
    async loadContest(id) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.getContest(id);
        if (response.success) {
          update((state) => ({
            ...state,
            selectedContest: response.data,
            isLoading: false
          }));
          return response.data;
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to load contest"
          }));
          return null;
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
        return null;
      }
    },
    async joinContest(contestId, teamId) {
      try {
        const response = await ApiService.joinContest(contestId, teamId);
        if (response.success) {
          update((state) => ({
            ...state,
            contests: state.contests.map(
              (contest) => contest.id === contestId ? { ...contest, currentEntries: contest.currentEntries + 1 } : contest
            )
          }));
          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    setSelectedContest(contest) {
      update((state) => ({ ...state, selectedContest: contest }));
    },
    clearError() {
      update((state) => ({ ...state, error: null }));
    }
  };
}
const contestsStore = createContestsStore();
const initialState$1 = {
  transactions: [],
  balance: 0,
  bonusBalance: 0,
  winningsBalance: 0,
  isLoading: false,
  error: null
};
function createWalletStore() {
  const { subscribe, set, update } = writable(initialState$1);
  return {
    subscribe,
    // Actions
    async loadTransactions() {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.getTransactions();
        if (response.success) {
          update((state) => ({
            ...state,
            transactions: response.data,
            isLoading: false
          }));
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to load transactions"
          }));
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
      }
    },
    async addMoney(amount, paymentMethod) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.addMoney(amount);
        if (response.success) {
          await this.loadTransactions();
          const currentUser = await ApiService.getCurrentUser();
          if (currentUser.success) {
            userActions.updateBalance(currentUser.data.balance);
          }
          return { success: true };
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to add money"
          }));
          return { success: false, error: response.error };
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
        return { success: false, error: "Network error" };
      }
    },
    addTransaction(transaction) {
      update((state) => ({
        ...state,
        transactions: [transaction, ...state.transactions]
      }));
    },
    clearError() {
      update((state) => ({ ...state, error: null }));
    }
  };
}
const walletStore = createWalletStore();
const initialState = {
  teams: [],
  selectedTeam: null,
  isLoading: false,
  error: null,
  userStats: null
};
function createTeamsStore() {
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    // Actions
    async loadUserStats() {
      try {
        const mockStats = {
          totalTeams: 15,
          contestsJoined: 42,
          contestsWon: 8,
          totalWinnings: 2450
        };
        update((state) => ({
          ...state,
          userStats: mockStats
        }));
      } catch (error) {
        console.error("Failed to load user stats:", error);
      }
    },
    async loadTeams(matchId) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.getMyTeams(matchId);
        if (response.success) {
          update((state) => ({
            ...state,
            teams: response.data,
            isLoading: false
          }));
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to load teams"
          }));
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
      }
    },
    async saveTeam(team) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await ApiService.saveTeam(team);
        if (response.success) {
          update((state) => ({
            ...state,
            teams: [...state.teams, response.data],
            isLoading: false
          }));
          return { success: true, data: response.data };
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: response.error || "Failed to save team"
          }));
          return { success: false, error: response.error };
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: "Network error"
        }));
        return { success: false, error: "Network error" };
      }
    },
    setSelectedTeam(team) {
      update((state) => ({ ...state, selectedTeam: team }));
    },
    clearError() {
      update((state) => ({ ...state, error: null }));
    }
  };
}
const teamsStore = createTeamsStore();
const initialBuilderState = {
  selectedPlayers: [],
  captain: null,
  viceCaptain: null,
  totalCredits: 100,
  usedCredits: 0,
  teamName: "",
  validationErrors: []
};
function createTeamBuilderStore() {
  const { subscribe, set, update } = writable(initialBuilderState);
  return {
    subscribe,
    // Actions
    addPlayer(player) {
      update((state) => {
        if (state.selectedPlayers.length >= 11) {
          return { ...state, validationErrors: ["Team is full (11 players)"] };
        }
        if (state.selectedPlayers.find((p) => p.id === player.id)) {
          return { ...state, validationErrors: ["Player already selected"] };
        }
        const newUsedCredits = state.usedCredits + player.credits;
        if (newUsedCredits > state.totalCredits) {
          return { ...state, validationErrors: ["Not enough credits"] };
        }
        const positionCount = state.selectedPlayers.filter((p) => p.position === player.position).length;
        const limits = { GK: 1, DEF: 5, MID: 5, FWD: 3 };
        if (positionCount >= limits[player.position]) {
          return { ...state, validationErrors: [`Maximum ${limits[player.position]} ${player.position} players allowed`] };
        }
        const teamCount = state.selectedPlayers.filter((p) => p.team === player.team).length;
        if (teamCount >= 6) {
          return { ...state, validationErrors: ["Maximum 6 players from same team"] };
        }
        return {
          ...state,
          selectedPlayers: [...state.selectedPlayers, player],
          usedCredits: newUsedCredits,
          validationErrors: []
        };
      });
    },
    removePlayer(playerId) {
      update((state) => {
        const player = state.selectedPlayers.find((p) => p.id === playerId);
        if (!player) return state;
        const newSelectedPlayers = state.selectedPlayers.filter((p) => p.id !== playerId);
        const newUsedCredits = state.usedCredits - player.credits;
        return {
          ...state,
          selectedPlayers: newSelectedPlayers,
          usedCredits: newUsedCredits,
          captain: state.captain?.id === playerId ? null : state.captain,
          viceCaptain: state.viceCaptain?.id === playerId ? null : state.viceCaptain,
          validationErrors: []
        };
      });
    },
    setCaptain(player) {
      update((state) => ({
        ...state,
        captain: player,
        viceCaptain: state.viceCaptain?.id === player.id ? null : state.viceCaptain
      }));
    },
    setViceCaptain(player) {
      update((state) => ({
        ...state,
        viceCaptain: player,
        captain: state.captain?.id === player.id ? null : state.captain
      }));
    },
    setTeamName(name) {
      update((state) => ({ ...state, teamName: name }));
    },
    validateTeam() {
      update((state) => {
        const errors = [];
        if (state.selectedPlayers.length !== 11) {
          errors.push("Select exactly 11 players");
        }
        if (!state.captain) {
          errors.push("Select a captain");
        }
        if (!state.viceCaptain) {
          errors.push("Select a vice captain");
        }
        if (!state.teamName.trim()) {
          errors.push("Enter team name");
        }
        const positions = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
        state.selectedPlayers.forEach((player) => {
          positions[player.position]++;
        });
        if (positions.GK !== 1) errors.push("Select exactly 1 goalkeeper");
        if (positions.DEF < 3 || positions.DEF > 5) errors.push("Select 3-5 defenders");
        if (positions.MID < 3 || positions.MID > 5) errors.push("Select 3-5 midfielders");
        if (positions.FWD < 1 || positions.FWD > 3) errors.push("Select 1-3 forwards");
        return { ...state, validationErrors: errors };
      });
    },
    reset() {
      set(initialBuilderState);
    },
    loadTeam(team) {
      update((state) => ({
        ...state,
        selectedPlayers: team.players,
        captain: team.players.find((p) => p.id === team.captain) || null,
        viceCaptain: team.players.find((p) => p.id === team.viceCaptain) || null,
        teamName: team.name,
        usedCredits: team.players.reduce((sum, p) => sum + p.credits, 0),
        validationErrors: []
      }));
    }
  };
}
createTeamBuilderStore();
export {
  isLoading as a,
  contestsStore as c,
  isAuthenticated as i,
  teamsStore as t,
  user as u,
  walletStore as w
};
