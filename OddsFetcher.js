const axios = require('axios');
const NodeCache = require('node-cache');
const { ODDS_API_KEY, BASE_URL, CACHE_TTL } = require('../config');

const cache = new NodeCache({ stdTTL: CACHE_TTL });

class OddsFetcher {
  async fetchSportsData(sport, region, market) {
    const cacheKey = `${sport}-${region}-${market}`;
    const cached = cache.get(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await axios.get(`${BASE_URL}/sports/${sport}/odds`, {
        params: {
          apiKey: ODDS_API_KEY,
          regions: region,
          markets: market,
          oddsFormat: 'decimal'
        }
      });

      const processed = this.processResponse(response.data);
      cache.set(cacheKey, processed);
      return processed;
      
    } catch (error) {
      console.error(`API Error: ${error.response?.status}`);
      throw new Error('Failed to fetch odds data');
    }
  }

  processResponse(data) {
    return data.map(event => ({
      id: event.id,
      sport: event.sport_key,
      commenceTime: event.commence_time,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      bookmakers: event.bookmakers.map(b => ({
        name: b.key,
        lastUpdate: b.last_update,
        markets: b.markets
      }))
    }));
  }
}