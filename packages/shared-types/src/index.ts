// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Game and Match Types
export interface Game {
  id: string;
  name: string;
  description?: string;
  category: GameCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum GameCategory {
  CRICKET = 'cricket',
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis'
}

export interface Match {
  id: string;
  gameId: string;
  title: string;
  description?: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string;
  endTime?: string;
  status: MatchStatus;
  maxParticipants?: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  createdAt: string;
  updatedAt: string;
}

export enum MatchStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  points?: number;
  isPlaying: boolean;
  credits: number;
}

// Contest and Participation Types
export interface Contest {
  id: string;
  matchId: string;
  name: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: number;
  prizeDistribution: PrizeDistribution[];
  status: ContestStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ContestStatus {
  OPEN = 'open',
  FULL = 'full',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface PrizeDistribution {
  rank: string;
  prize: number;
  percentage: number;
}

export interface UserTeam {
  id: string;
  userId: string;
  contestId: string;
  name: string;
  players: Player[];
  captain: string;
  viceCaptain: string;
  totalCredits: number;
  points?: number;
  rank?: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export enum WebSocketEventType {
  MATCH_UPDATE = 'match_update',
  PLAYER_SCORE_UPDATE = 'player_score_update',
  CONTEST_UPDATE = 'contest_update',
  USER_TEAM_UPDATE = 'user_team_update'
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  liveMatches: number;
  totalContests: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface AdminUser extends User {
  lastLoginAt?: string;
  isBlocked: boolean;
  totalDeposits: number;
  totalWithdrawals: number;
  totalWinnings: number;
}