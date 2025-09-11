# SofaScore API Integration

This document describes the integration of the SofaScore API with the PickNWin fantasy sports platform, providing real-time sports data capabilities.

## Overview

The SofaScore integration provides:
- **Real-time player and team search**
- **Live match data**
- **Player statistics and information**
- **Team details and standings**
- **Intelligent caching and fallback systems**
- **Hybrid data sources (mock + real API)**

## Architecture

### Core Components

1. **SofaScoreAdapter** (`src/lib/services/sofascoreAdapter.ts`)
   - Direct interface to SofaScore API
   - Rate limiting and caching
   - Data transformation and mapping

2. **UnifiedFeedService** (`src/lib/services/unifiedFeedService.ts`)
   - Combines mock and real data sources
   - Intelligent fallback mechanisms
   - Service monitoring and statistics

3. **API Endpoints**
   - `/api/sofascore/search` - Player/team search
   - `/api/sofascore/live` - Live match data

4. **Demo Interface** (`/api-demo`)
   - Interactive testing interface
   - Service statistics monitoring
   - Real-time data visualization

## Configuration

### API Setup

The SofaScore adapter is configured to use RapidAPI with your provided credentials:

```typescript
const config: SofaScoreConfig = {
  apiKey: '23eba5e004mshdb855f7e2e9c0c3p13cd89jsn53631ff75549',
  baseUrl: 'https://sofascore.p.rapidapi.com',
  rateLimit: 100, // RapidAPI allows more requests per minute
  cacheTtl: 300000 // 5 minutes
};
```

### RapidAPI Headers
The integration uses the following headers for RapidAPI authentication:
- `X-RapidAPI-Host`: sofascore.p.rapidapi.com
- `X-RapidAPI-Key`: Your provided API key
- `Content-Type`: application/json
```

### Service Configuration

```typescript
const serviceConfig: UnifiedFeedConfig = {
  primarySource: 'hybrid', // 'mock' | 'sofascore' | 'hybrid'
  fallbackEnabled: true,
  cacheEnabled: true,
  maxRetries: 3,
  timeoutMs: 10000
};
```

## Usage Examples

### Basic Player Search

```typescript
import { sofaScoreAdapter } from '$lib/services/sofascoreAdapter';

// Search for players
const results = await sofaScoreAdapter.search('messi', 'player');
console.log(results.results);

// Get specific player details
const player = await sofaScoreAdapter.getPlayer(12994); // Messi's ID
console.log(player.name, player.team?.name);
```

### Using Unified Service

```typescript
import { unifiedFeedService } from '$lib/services/unifiedFeedService';

// Get upcoming matches (combines all sources)
const matches = await unifiedFeedService.getUpcomingMatches(
  new Date(),
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
);

// Search players across all sources
const players = await unifiedFeedService.searchPlayers('ronaldo', 10);

// Get live matches
const liveMatches = await unifiedFeedService.getLiveMatches();
```

### API Endpoints

```bash
# Search for players/teams
GET /api/sofascore/search?q=messi&type=player&page=0

# Get live matches
GET /api/sofascore/live
```

## Data Models

### SofaScore Player

```typescript
interface SofaScorePlayer {
  id: number;
  name: string;
  slug: string;
  retired?: boolean;
  userCount: number;
  team?: {
    id: number;
    name: string;
    nameCode: string;
    // ... more team properties
  };
  country: {
    alpha2: string;
    name: string;
    slug: string;
  };
  position?: string;
  jerseyNumber?: string;
}
```

### Enhanced Feed Match

```typescript
interface EnhancedFeedMatch extends FeedMatch {
  dataSource: 'mock' | 'sofascore';
  confidenceScore: number; // 0-100
  lastSyncTime: Date;
  syncErrors?: string[];
}
```

### Enhanced Feed Player

```typescript
interface EnhancedFeedPlayer extends FeedPlayer {
  dataSource: 'mock' | 'sofascore';
  confidenceScore: number;
  lastSyncTime: Date;
  realTimeStats?: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
}
```

## Features

### 1. Intelligent Caching

- **Multi-level caching**: Service-level and adapter-level
- **TTL-based expiration**: Different cache times for different data types
- **Cache statistics**: Hit rates and performance monitoring

```typescript
// Cache configuration
const cacheConfig = {
  search: 600000,      // 10 minutes
  matches: 300000,     // 5 minutes
  liveMatches: 30000,  // 30 seconds
  players: 600000      // 10 minutes
};
```

### 2. Rate Limiting

- **Automatic rate limiting**: Prevents API quota exhaustion
- **Request queuing**: Handles burst requests gracefully
- **Backoff strategies**: Exponential backoff on errors

### 3. Fallback Systems

- **Graceful degradation**: Falls back to mock data on API failures
- **Hybrid mode**: Combines real and mock data intelligently
- **Error handling**: Comprehensive error categorization and handling

### 4. Data Quality

- **Confidence scoring**: Each data point has a quality score
- **Source tracking**: Know where each piece of data comes from
- **Validation**: Input validation and data sanitization

### 5. Monitoring

- **Service statistics**: Request counts, response times, error rates
- **Performance metrics**: Cache hit rates, API usage
- **Error tracking**: Detailed error logging and categorization

## API Reference

### SofaScoreAdapter Methods

#### `search(query, type, page)`
- **Purpose**: Search for players or teams
- **Parameters**:
  - `query`: Search term
  - `type`: 'all' | 'player' | 'team'
  - `page`: Page number (default: 0)
- **Returns**: `SofaScoreSearchResult`

#### `getPlayer(playerId)`
- **Purpose**: Get detailed player information
- **Parameters**: `playerId` - SofaScore player ID
- **Returns**: `SofaScorePlayer`

#### `getLiveMatches()`
- **Purpose**: Get currently live matches
- **Returns**: `SofaScoreMatch[]`

### UnifiedFeedService Methods

#### `getUpcomingMatches(from, to)`
- **Purpose**: Get matches in date range from all sources
- **Parameters**: Date range
- **Returns**: `EnhancedFeedMatch[]`

#### `searchPlayers(query, limit)`
- **Purpose**: Search players across all sources
- **Parameters**: Search query and result limit
- **Returns**: `EnhancedFeedPlayer[]`

#### `getLiveMatches()`
- **Purpose**: Get live matches from all sources
- **Returns**: `EnhancedFeedMatch[]`

## Error Handling

### Error Types

1. **Rate Limit Errors** (429)
   - Automatic retry with backoff
   - Fallback to cached data if available

2. **Authentication Errors** (401/403)
   - API key validation
   - Service degradation notifications

3. **Network Errors**
   - Timeout handling
   - Retry mechanisms
   - Fallback to mock data

4. **Data Validation Errors**
   - Input sanitization
   - Response validation
   - Graceful error responses

### Error Response Format

```typescript
interface ErrorResponse {
  error: string;
  code: string;
  timestamp?: string;
  details?: any;
}
```

## Performance Optimization

### Caching Strategy

1. **Search Results**: 10-minute cache
2. **Player Details**: 10-minute cache
3. **Live Matches**: 30-second cache
4. **Match Lists**: 5-minute cache

### Rate Limiting

- **Default Limit**: 50 requests per minute
- **Burst Handling**: Queue up to 10 requests
- **Backoff**: Exponential backoff on rate limit hits

### Data Compression

- **Response Compression**: Gzip compression for API responses
- **Selective Fields**: Only fetch required data fields
- **Batch Requests**: Combine multiple requests where possible

## Testing

### Demo Interface

Visit `/api-demo` to:
- Test search functionality
- View live matches
- Monitor service statistics
- Test error handling
- Clear caches and reset statistics

### Interactive Test Page
Visit `/rapidapi-test` for a comprehensive testing interface that allows you to:
- Test player/team search functionality
- Fetch live matches
- Get popular players
- View today's matches
- Monitor API response times and caching

### Manual API Testing
Test the integration directly with curl commands:

```bash
# Test search functionality
curl "http://localhost:5173/api/rapidapi-test?type=search&query=messi"

# Test live matches
curl "http://localhost:5173/api/rapidapi-test?type=live"

# Test popular players
curl "http://localhost:5173/api/rapidapi-test?type=popular"

# Test today's matches
curl "http://localhost:5173/api/rapidapi-test?type=today"
```

### Original Demo Page
The original demo page is still available at `/api-demo` for testing the unified feed service.

### API Testing

```bash
# Test search endpoint
curl "http://localhost:5173/api/sofascore/search?q=messi&type=player"

# Test live matches endpoint
curl "http://localhost:5173/api/sofascore/live"
```

### Unit Tests

```typescript
// Example test
import { sofaScoreAdapter } from '$lib/services/sofascoreAdapter';

test('should search for players', async () => {
  const results = await sofaScoreAdapter.search('test', 'player');
  expect(results.results).toBeDefined();
  expect(Array.isArray(results.results)).toBe(true);
});
```

## Deployment Considerations

### Environment Variables

```env
# Required
SOFASCORE_API_KEY=your-rapidapi-key

# Optional
SOFASCORE_BASE_URL=https://sofascore.p.rapidapi.com
SOFASCORE_RATE_LIMIT=50
SOFASCORE_CACHE_TTL=300000
```

### Production Setup

1. **API Key Management**
   - Store API keys securely
   - Rotate keys regularly
   - Monitor usage quotas

2. **Caching Infrastructure**
   - Use Redis for distributed caching
   - Implement cache warming strategies
   - Monitor cache performance

3. **Monitoring**
   - Set up error alerting
   - Monitor API usage and costs
   - Track performance metrics

4. **Scaling**
   - Implement request queuing
   - Use multiple API keys for higher limits
   - Consider CDN for static data

## Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
   - Check API usage in dashboard
   - Implement longer caching
   - Consider upgrading API plan

2. **Authentication Failures**
   - Verify API key is correct
   - Check API key permissions
   - Ensure proper headers are sent

3. **Network Timeouts**
   - Increase timeout values
   - Implement retry logic
   - Check network connectivity

4. **Data Quality Issues**
   - Validate API responses
   - Implement data sanitization
   - Use confidence scoring

### Debug Mode

```typescript
// Enable debug logging
unifiedFeedService.updateConfig({
  debugMode: true,
  logLevel: 'debug'
});
```

## Future Enhancements

### Planned Features

1. **Real-time Updates**
   - WebSocket connections for live data
   - Push notifications for match events

2. **Advanced Analytics**
   - Player performance trends
   - Team statistics and analysis

3. **Machine Learning**
   - Predictive player scoring
   - Injury risk assessment

4. **Enhanced Caching**
   - Predictive cache warming
   - Intelligent cache invalidation

### API Expansion

- **Match Statistics**: Detailed match events and statistics
- **Player Performance**: Historical performance data
- **Team Analysis**: Team formation and tactical analysis
- **Injury Reports**: Real-time injury and fitness updates

## Support

For issues or questions regarding the SofaScore integration:

1. Check the demo interface at `/api-demo`
2. Review error logs and service statistics
3. Consult the SofaScore API documentation
4. Contact the development team

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: PickNWin Development Team