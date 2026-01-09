import { MOCK_STOCKS } from '../constants';

// Simulating a random walk for prices
export const generateNextPrice = (currentPrice) => {
  const volatility = 0.002; // 0.2% max swing per tick
  const change = currentPrice * volatility * (Math.random() - 0.5);
  return Number((currentPrice + change).toFixed(2));
};

export const getHistoricalData = (ticker, period) => {
  const points = [];
  const now = new Date();
  let basePrice = MOCK_STOCKS[ticker]?.price || 100;
  const count = period === '1D' ? 78 : period === '1W' ? 100 : 300; // 78 5-min intervals in a trading day roughly
  
  // Generate backwards
  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (period === '1D' ? 5 * 60000 : 60 * 60000));
    const randomChange = (Math.random() - 0.5) * 2;
    basePrice = basePrice - randomChange; 
    points.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number(basePrice.toFixed(2))
    });
  }
  // Reverse to put in chronological order (though loop logic basically did reverse chronological generation, 
  // let's just make sure the last point is close to current price)
  return points;
};

// Mock async fetch
export const fetchStockDetails = async (ticker) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STOCKS[ticker] || {
        ...MOCK_STOCKS['AAPL'],
        ticker: ticker,
        name: `${ticker} Corp`,
        price: 100 + Math.random() * 100
      });
    }, 300); // 300ms latency simulation
  });
};
