import type { User, Player, Match, Contest, Team, Transaction } from '$lib/types';
import { generateId } from '$lib/utils';

// Mock teams data
const teams = [
	{ name: 'Manchester United', logo: '/teams/man-utd.svg' },
	{ name: 'Liverpool', logo: '/teams/liverpool.svg' },
	{ name: 'Manchester City', logo: '/teams/man-city.svg' },
	{ name: 'Arsenal', logo: '/teams/arsenal.svg' },
	{ name: 'Chelsea', logo: '/teams/chelsea.svg' },
	{ name: 'Tottenham', logo: '/teams/tottenham.svg' },
	{ name: 'Newcastle', logo: '/teams/newcastle.svg' },
	{ name: 'Brighton', logo: '/teams/brighton.svg' }
];

// Mock player names
const playerNames = [
	'Marcus Rashford', 'Mohamed Salah', 'Erling Haaland', 'Bukayo Saka',
	'Raheem Sterling', 'Harry Kane', 'Bruno Fernandes', 'Kevin De Bruyne',
	'Virgil van Dijk', 'Ruben Dias', 'Alisson Becker', 'Ederson',
	'Casemiro', 'Declan Rice', 'Mason Mount', 'Phil Foden',
	'Darwin Nunez', 'Gabriel Jesus', 'Son Heung-min', 'Alexander Isak',
	'Jadon Sancho', 'Jack Grealish', 'Martin Odegaard', 'Thiago Silva',
	'Andrew Robertson', 'Kyle Walker', 'Ben White', 'Joao Cancelo'
];

export function generateMockUser(): User {
	return {
		id: generateId(),
		email: 'user@example.com',
		name: 'John Doe',
		balance: 1250.00,
		kycVerified: true,
		createdAt: new Date()
	};
}

export function generateMockPlayers(count: number = 22): Player[] {
	const positions: Array<'GK' | 'DEF' | 'MID' | 'FWD'> = ['GK', 'DEF', 'MID', 'FWD'];
	const players: Player[] = [];
	
	for (let i = 0; i < count; i++) {
		const position = i < 2 ? 'GK' : i < 8 ? 'DEF' : i < 16 ? 'MID' : 'FWD';
		const baseCredits = position === 'GK' ? 8 : position === 'DEF' ? 7 : position === 'MID' ? 8.5 : 9;
		
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

export function generateMockMatches(count: number = 5): Match[] {
	const matches: Match[] = [];
	
	for (let i = 0; i < count; i++) {
		const homeTeam = teams[i % teams.length];
		const awayTeam = teams[(i + 1) % teams.length];
		
		matches.push({
			id: generateId(),
			homeTeam: homeTeam.name,
			awayTeam: awayTeam.name,
			homeTeamLogo: homeTeam.logo,
			awayTeamLogo: awayTeam.logo,
			startTime: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
			league: 'Premier League',
			status: 'upcoming',
			players: generateMockPlayers()
		});
	}
	
	return matches;
}

export function generateMockContests(matchId: string, count: number = 8): Contest[] {
	const contestTypes = [
		{ name: 'Mega Contest', prizePool: 10000, entryFee: 25, maxEntries: 1000, winners: 100 },
		{ name: 'Head to Head', prizePool: 18, entryFee: 10, maxEntries: 2, winners: 1 },
		{ name: 'Small League', prizePool: 500, entryFee: 5, maxEntries: 100, winners: 10 },
		{ name: 'Winner Takes All', prizePool: 1000, entryFee: 50, maxEntries: 25, winners: 1 },
		{ name: 'Beginner Contest', prizePool: 100, entryFee: 2, maxEntries: 50, winners: 5 }
	];
	
	const contests: Contest[] = [];
	
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
			status: 'open',
			createdAt: new Date()
		});
	}
	
	return contests;
}

export function generateMockTransactions(userId: string, count: number = 10): Transaction[] {
	const transactions: Transaction[] = [];
	const types: Array<Transaction['type']> = ['signup_bonus', 'join', 'winnings', 'deposit'];
	
	for (let i = 0; i < count; i++) {
		const type = types[Math.floor(Math.random() * types.length)];
		let amount = 0;
		let description = '';
		
		switch (type) {
			case 'signup_bonus':
				amount = 1200;
				description = 'Welcome bonus';
				break;
			case 'join':
				amount = -(Math.floor(Math.random() * 50) + 5);
				description = 'Contest entry fee';
				break;
			case 'winnings':
				amount = Math.floor(Math.random() * 500) + 10;
				description = 'Contest winnings';
				break;
			case 'deposit':
				amount = Math.floor(Math.random() * 200) + 50;
				description = 'Wallet deposit';
				break;
		}
		
		transactions.push({
			id: generateId(),
			userId,
			type,
			amount,
			description,
			status: 'completed',
			createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
		});
	}
	
	return transactions;
}