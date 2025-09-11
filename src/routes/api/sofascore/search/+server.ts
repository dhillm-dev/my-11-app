import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sofaScoreAdapter } from '$lib/services/sofascoreAdapter';

/**
 * SofaScore Search API Endpoint
 * GET /api/sofascore/search?q=query&type=all&page=0
 */
export const GET: RequestHandler = async ({ url, request }) => {
	try {
		// Extract query parameters
		const query = url.searchParams.get('q');
		const type = url.searchParams.get('type') || 'all';
		const page = parseInt(url.searchParams.get('page') || '0');

		// Validate required parameters
		if (!query || query.trim().length === 0) {
			return json(
				{ error: 'Query parameter "q" is required' },
				{ status: 400 }
			);
		}

		// Validate type parameter
		if (!['all', 'player', 'team'].includes(type)) {
			return json(
				{ error: 'Type must be one of: all, player, team' },
				{ status: 400 }
			);
		}

		// Validate page parameter
		if (isNaN(page) || page < 0) {
			return json(
				{ error: 'Page must be a non-negative integer' },
				{ status: 400 }
			);
		}

		// Rate limiting check (simple implementation)
		const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
		const rateLimitKey = `sofascore_search_${clientIP}`;
		
		// In production, you'd use Redis or similar for rate limiting
		// For now, we'll rely on the adapter's built-in rate limiting

		// Perform the search
		const startTime = Date.now();
		const results = await sofaScoreAdapter.search(
			query.trim(),
			type as 'all' | 'player' | 'team',
			page
		);
		const responseTime = Date.now() - startTime;

		// Add metadata to response
		const response = {
			...results,
			meta: {
				query: query.trim(),
				type,
				page,
				responseTime,
				timestamp: new Date().toISOString(),
				resultCount: results.results?.length || 0
			}
		};

		// Set appropriate cache headers
		const headers = {
			'Cache-Control': 'public, max-age=300', // 5 minutes
			'Content-Type': 'application/json',
			'X-Response-Time': `${responseTime}ms`
		};

		return json(response, { headers });

	} catch (error) {
		console.error('SofaScore search API error:', error);
		
		// Handle different types of errors
		if (error instanceof Error) {
			// API rate limit or network error
			if (error.message.includes('rate limit') || error.message.includes('429')) {
				return json(
					{ 
						error: 'Rate limit exceeded. Please try again later.',
						code: 'RATE_LIMIT_EXCEEDED'
					},
					{ status: 429 }
				);
			}

			// API authentication error
			if (error.message.includes('401') || error.message.includes('403')) {
				return json(
					{ 
						error: 'API authentication failed.',
						code: 'AUTH_ERROR'
					},
					{ status: 502 }
				);
			}

			// Network or timeout error
			if (error.message.includes('fetch') || error.message.includes('timeout')) {
				return json(
					{ 
						error: 'External API is currently unavailable.',
						code: 'SERVICE_UNAVAILABLE'
					},
					{ status: 503 }
				);
			}
		}

		// Generic error response
		return json(
			{ 
				error: 'An unexpected error occurred while searching.',
				code: 'INTERNAL_ERROR'
			},
			{ status: 500 }
		);
	}
};

/**
 * OPTIONS handler for CORS preflight requests
 */
export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Max-Age': '86400'
		}
	});
};