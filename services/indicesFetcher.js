import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export const INDICES_CONFIG = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^NDX', name: 'Nasdaq 100' },
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: 'BTC-USD', name: 'Bitcoin' }
];

export const fetchIndicesRaw = async () => {
  try {
    const results = await Promise.all(
      INDICES_CONFIG.map(async (index) => {
        try {
          const quote = await yahooFinance.quote(index.symbol);
          
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
          return null;
        }
      })
    );
    return results.filter(Boolean);
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return [];
  }
};
