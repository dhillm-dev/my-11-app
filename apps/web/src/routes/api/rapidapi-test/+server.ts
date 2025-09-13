import { json } from '@sveltejs/kit';
import { sofaScoreAdapter } from '$lib/services/sofascoreAdapter';
import type { RequestHandler } from './$types';

/**
 * Test endpoint for RapidAPI SofaScore integration
 * GET /api/rapidapi-test?query=messi
 */
export const GET: RequestHandler = async ({ url }) => {
	const startTime = Date.now();
	const query = url.searchParams.get('query') || 'messi';
	const testType = url.searchParams.get('type') || 'search';

	try {
		console.log(`[RapidAPI Test] Testing ${testType} with query: ${query}`);

		let result;
		let testDescription;

		switch (testType) {
			case 'search':
				testDescription = `Search for "${query}"`;
				result = await sofaScoreAdapter.search(query, 'all', 0);
				break;

			case 'live':
				testDescription = 'Get live matches';
				result = await sofaScoreAdapter.getLiveMatches();
				break;

			case 'popular':
				testDescription = 'Get popular players';
				result = await sofaScoreAdapter.getPopularPlayers(10);
				break;

			case 'today':
				testDescription = 'Get today\'s matches';
				result = await sofaScoreAdapter.getMatchesByDate(new Date());
				break;

			default:
				throw new Error(`Unknown test type: ${testType}`);
		}

		const responseTime = Date.now() - startTime;
		const cacheStats = sofaScoreAdapter.getCacheStats();

		console.log(`[RapidAPI Test] ${testDescription} completed in ${responseTime}ms`);

		return json({
			success: true,
			testType,
			testDescription,
			query,
			result,
			meta: {
				responseTime,
				timestamp: new Date().toISOString(),
				cacheStats,
				resultCount: Array.isArray(result) ? result.length : 
							 result?.results?.length || 1,
				apiProvider: 'RapidAPI SofaScore',
				apiKey: '***' + sofaScoreAdapter['config'].apiKey.slice(-4)
			}
		}, {
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		});

	} catch (error) {
		const responseTime = Date.now() - startTime;
		console.error(`[RapidAPI Test] Error in ${testType} test:`, error);

		return json({
			success: false,
			testType,
			query,
			error: {
				message: error instanceof Error ? error.message : 'Unknown error',
				type: error instanceof Error ? error.constructor.name : 'UnknownError',
				stack: error instanceof Error ? error.stack : undefined
			},
			meta: {
				responseTime,
				timestamp: new Date().toISOString(),
				apiProvider: 'RapidAPI SofaScore',
				apiKey: '***' + sofaScoreAdapter['config'].apiKey.slice(-4)
			}
		}, {
			status: 500,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		});
	}
};

/**
 * Handle CORS preflight requests
 */
export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
};