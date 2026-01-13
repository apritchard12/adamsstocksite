import YahooFinance from 'yahoo-finance2';
import { unstable_cache } from 'next/cache';

const yahooFinance = new YahooFinance();

const INDICES_CONFIG = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^NDX', name: 'Nasdaq 100' },
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: 'BTC-USD', name: 'Bitcoin' }
];

// Wrapped in unstable_cache for Next.js Data Cache
export const getMarketIndices = unstable_cache(
  async () => {
    try {
      const results = await Promise.all(
        INDICES_CONFIG.map(async (index) => {
          try {
            const quote = await yahooFinance.quote(index.symbol);
            
            // Calculate change percentage safely
            const changePercent = quote.regularMarketChangePercent || 0;
            const changeValue = quote.regularMarketChange || 0;
            const price = quote.regularMarketPrice || 0;

            return {
              name: index.name,
              value: price.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              }),
              change: `${changeValue >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
              isPositive: changeValue >= 0
            };
          } catch (err) {
            console.error(`Failed to fetch ${index.symbol}:`, err);
            return null; // Handle individual failures gracefully
          }
        })
      );

      return results.filter(Boolean); // Remove failed requests
    } catch (error) {
      console.error('Error fetching market indices:', error);
      return [];
    }
  },
  ['market-indices'], // Cache Key
  { revalidate: 180 } // 180 seconds = 3 minutes
);
