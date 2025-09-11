import { json } from "@sveltejs/kit";
import { s as sofaScoreAdapter } from "../../../../../chunks/sofascoreAdapter.js";
const GET = async ({ url, request }) => {
  try {
    const query = url.searchParams.get("q");
    const type = url.searchParams.get("type") || "all";
    const page = parseInt(url.searchParams.get("page") || "0");
    if (!query || query.trim().length === 0) {
      return json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }
    if (!["all", "player", "team"].includes(type)) {
      return json(
        { error: "Type must be one of: all, player, team" },
        { status: 400 }
      );
    }
    if (isNaN(page) || page < 0) {
      return json(
        { error: "Page must be a non-negative integer" },
        { status: 400 }
      );
    }
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `sofascore_search_${clientIP}`;
    const startTime = Date.now();
    const results = await sofaScoreAdapter.search(
      query.trim(),
      type,
      page
    );
    const responseTime = Date.now() - startTime;
    const response = {
      ...results,
      meta: {
        query: query.trim(),
        type,
        page,
        responseTime,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        resultCount: results.results?.length || 0
      }
    };
    const headers = {
      "Cache-Control": "public, max-age=300",
      // 5 minutes
      "Content-Type": "application/json",
      "X-Response-Time": `${responseTime}ms`
    };
    return json(response, { headers });
  } catch (error) {
    console.error("SofaScore search API error:", error);
    if (error instanceof Error) {
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        return json(
          {
            error: "Rate limit exceeded. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED"
          },
          { status: 429 }
        );
      }
      if (error.message.includes("401") || error.message.includes("403")) {
        return json(
          {
            error: "API authentication failed.",
            code: "AUTH_ERROR"
          },
          { status: 502 }
        );
      }
      if (error.message.includes("fetch") || error.message.includes("timeout")) {
        return json(
          {
            error: "External API is currently unavailable.",
            code: "SERVICE_UNAVAILABLE"
          },
          { status: 503 }
        );
      }
    }
    return json(
      {
        error: "An unexpected error occurred while searching.",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
};
export {
  GET,
  OPTIONS
};
