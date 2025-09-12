import { json } from "@sveltejs/kit";
import { u as unifiedFeedService } from "../../../../../chunks/unifiedFeedService.js";
const GET = async ({ request }) => {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    console.log(`Live matches request from ${clientIP} (${userAgent})`);
    const startTime = Date.now();
    const liveMatches = await unifiedFeedService.getLiveMatches();
    const responseTime = Date.now() - startTime;
    const stats = unifiedFeedService.getStats();
    const response = {
      matches: liveMatches,
      meta: {
        count: liveMatches.length,
        responseTime,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        sources: {
          mock: liveMatches.filter((m) => m.dataSource === "mock").length,
          sofascore: liveMatches.filter((m) => m.dataSource === "sofascore").length
        },
        serviceStats: {
          totalRequests: stats.totalRequests,
          cacheHits: stats.cacheHits,
          averageResponseTime: Math.round(stats.averageResponseTime)
        }
      }
    };
    const headers = {
      "Cache-Control": "public, max-age=30",
      // 30 seconds
      "Content-Type": "application/json",
      "X-Response-Time": `${responseTime}ms`,
      "X-Data-Sources": liveMatches.map((m) => m.dataSource).join(",")
    };
    return json(response, { headers });
  } catch (error) {
    console.error("Live matches API error:", error);
    if (error instanceof Error) {
      if (error.message.includes("fetch") || error.message.includes("timeout")) {
        return json(
          {
            error: "External API is currently unavailable.",
            code: "SERVICE_UNAVAILABLE",
            matches: [],
            // Return empty array as fallback
            meta: {
              count: 0,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              error: true
            }
          },
          { status: 503 }
        );
      }
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        return json(
          {
            error: "Rate limit exceeded. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
            matches: [],
            meta: {
              count: 0,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              error: true
            }
          },
          { status: 429 }
        );
      }
    }
    return json(
      {
        error: "An unexpected error occurred while fetching live matches.",
        code: "INTERNAL_ERROR",
        matches: [],
        meta: {
          count: 0,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          error: true
        }
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
