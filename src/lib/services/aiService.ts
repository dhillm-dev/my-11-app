import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import type { Player, Match } from '../types';

// Mock API key for development - in production, use environment variables
const API_KEY = 'mock-api-key';

export class AIService {
	/**
	 * Generate team suggestions based on match and available players
	 */
	static async generateTeamSuggestions(
		match: Match,
		availablePlayers: Player[],
		budget: number = 100
	): Promise<{
		suggestions: Player[];
		captainSuggestion: Player;
		viceCaptainSuggestion: Player;
		reasoning: string;
	}> {
		// Mock AI suggestions for development
		// In production, this would call the actual OpenAI API
		return new Promise((resolve) => {
			setTimeout(() => {
				// Simple algorithm to suggest a balanced team
				const goalkeepers = availablePlayers.filter(p => p.position === 'GK');
				const defenders = availablePlayers.filter(p => p.position === 'DEF');
				const midfielders = availablePlayers.filter(p => p.position === 'MID');
				const forwards = availablePlayers.filter(p => p.position === 'FWD');

				// Sort by credits (value for money)
				const sortByValue = (a: Player, b: Player) => {
					// Simple value calculation: recent form / credits
					const aValue = (a.points || 50) / a.credits;
			const bValue = (b.points || 50) / b.credits;
					return bValue - aValue;
				};

				goalkeepers.sort(sortByValue);
				defenders.sort(sortByValue);
				midfielders.sort(sortByValue);
				forwards.sort(sortByValue);

				// Build suggested team
				const suggestions: Player[] = [
					...goalkeepers.slice(0, 1), // 1 GK
					...defenders.slice(0, 4), // 4 DEF
					...midfielders.slice(0, 4), // 4 MID
					...forwards.slice(0, 2) // 2 FWD
				];

				// Suggest captain (highest recent form)
				const captainSuggestion = suggestions.reduce((best, player) => 
					(player.points || 0) > (best.points || 0) ? player : best
				);

				// Suggest vice-captain (second highest, different from captain)
				const viceCaptainSuggestion = suggestions
					.filter(p => p.id !== captainSuggestion.id)
					.reduce((best, player) => 
						(player.points || 0) > (best.points || 0) ? player : best
					);

				const reasoning = `This team is balanced with strong performers from both teams. ${captainSuggestion.name} is suggested as captain due to excellent recent form (${captainSuggestion.points} points). The team stays within budget while maximizing potential points.`;

				resolve({
					suggestions,
					captainSuggestion,
					viceCaptainSuggestion,
					reasoning
				});
			}, 1500); // Simulate API delay
		});
	}

	/**
	 * Get player analysis and insights
	 */
	static async getPlayerAnalysis(player: Player, match: Match): Promise<{
		analysis: string;
		strengths: string[];
		weaknesses: string[];
		recommendation: 'highly_recommended' | 'recommended' | 'risky' | 'avoid';
	}> {
		return new Promise((resolve) => {
			setTimeout(() => {
				const form = player.points || 50;
				const credits = player.credits;

				let recommendation: 'highly_recommended' | 'recommended' | 'risky' | 'avoid';
				let strengths: string[] = [];
				let weaknesses: string[] = [];

				// Simple analysis based on form and credits
				if (form > 70 && credits < 9) {
					recommendation = 'highly_recommended';
					strengths = ['Excellent recent form', 'Great value for money', 'Consistent performer'];
				} else if (form > 60) {
					recommendation = 'recommended';
					strengths = ['Good recent form', 'Reliable choice'];
				} else if (form > 40) {
					recommendation = 'risky';
					weaknesses = ['Inconsistent form', 'Moderate risk'];
				} else {
					recommendation = 'avoid';
					weaknesses = ['Poor recent form', 'High risk choice'];
				}

				// Add position-specific insights
				switch (player.position) {
					case 'GK':
						strengths.push('Goalkeeping points bonus');
						break;
					case 'DEF':
						strengths.push('Defensive specialist');
						break;
					case 'MID':
						strengths.push('Midfield versatility');
						break;
					case 'FWD':
						strengths.push('Attacking specialist');
						break;
				}

				const analysis = `${player.name} has been ${form > 60 ? 'performing well' : 'struggling'} recently with an average of ${form}. At ${credits} credits, they offer ${credits < 8 ? 'excellent' : credits < 10 ? 'good' : 'moderate'} value.`;

				resolve({
					analysis,
					strengths,
					weaknesses,
					recommendation
				});
			}, 800);
		});
	}

	/**
	 * Generate match predictions and insights
	 */
	static async getMatchInsights(match: Match): Promise<{
		prediction: string;
		keyPlayers: string[];
		pitchConditions: string;
		weatherImpact: string;
		strategyTips: string[];
	}> {
		return new Promise((resolve) => {
			setTimeout(() => {
				const insights = {
				prediction: `${match.homeTeam} has a slight edge based on recent form and home advantage. Expected to be a high-scoring match.`,
				keyPlayers: [
					`${match.homeTeam} captain - Strong attacking form`,
					`${match.awayTeam} striker - Excellent goal-scoring ability`,
					'Key midfielders from both teams'
				],
					pitchConditions: 'Good playing surface with fast pace. Weather conditions favor attacking play.',
					weatherImpact: 'Clear weather expected. No weather interruptions likely.',
					strategyTips: [
						'Pick attacking midfielders for goal contributions',
						'Consider defenders from strong defensive teams',
						'Forwards provide high scoring potential',
						'Goalkeepers from teams with clean sheet potential'
					]
				};

				resolve(insights);
			}, 1200);
		});
	}

	/**
	 * Stream real-time team building chat
	 */
	static async* streamTeamBuildingChat(message: string, context: {
		match: Match;
		currentTeam: Player[];
		budget: number;
	}) {
		// Mock streaming response for development
		const responses = [
			"Let me analyze your current team...",
			"Based on the match conditions and your budget, ",
			"I'd suggest considering a few changes. ",
			"Your attacking lineup looks strong, but ",
				"you might want to add more defensive stability. ",
				"Consider swapping one forward for a midfielder."
		];

		for (const response of responses) {
			await new Promise(resolve => setTimeout(resolve, 300));
			yield { content: response };
		}
	}
}

// Export for use in components
export default AIService;