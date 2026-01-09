export const INITIAL_WATCHLIST = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

export const MOCK_STOCKS = {
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 1.25,
    changePercent: 0.72,
    volume: 54300000,
    marketCap: '2.7T',
    peRatio: 28.5,
    sector: 'Technology',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.'
  },
  MSFT: {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    price: 330.11,
    change: -0.45,
    changePercent: -0.14,
    volume: 22100000,
    marketCap: '2.5T',
    peRatio: 32.1,
    sector: 'Technology',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 880.55,
    change: 15.20,
    changePercent: 1.76,
    volume: 45000000,
    marketCap: '2.2T',
    peRatio: 75.4,
    sector: 'Semiconductors',
    description: 'NVIDIA Corporation focuses on personal computer (PC) graphics, graphics processing unit (GPU) and also on artificial intelligence (AI).'
  },
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    price: 165.30,
    change: -3.20,
    changePercent: -1.90,
    volume: 98000000,
    marketCap: '520B',
    peRatio: 40.2,
    sector: 'Automotive',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.'
  }
};

export const MOCK_NEWS = [
  {
    id: '1',
    title: 'Nvidia chips are fueling a new era of computing, CEO says',
    author: 'Bloomberg',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    related_tickers: 'NVDA',
    category: 'Markets',
    summary: 'Jensen Huang highlights the massive demand for Blackwell architecture as cloud providers race to build AI infrastructure.',
    image_url: null,
    content: 'Full content not available in summary.'
  },
  {
    id: '2',
    title: 'Apple faces headwinds in China as sales slow',
    author: 'Reuters',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15m ago
    related_tickers: 'AAPL',
    category: 'Technology',
    summary: 'New local competitors and shifting consumer preferences are impacting iPhone shipments in the crucial Greater China region.',
    image_url: null,
    content: 'Full content not available in summary.'
  },
  {
    id: '3',
    title: 'Fed signals rate cuts may come sooner than expected',
    author: 'WSJ',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h ago
    related_tickers: 'SPY, QQQ',
    category: 'Economy',
    summary: 'Inflation data cooling down provides the FOMC with the confidence needed to begin a easing cycle this summer.',
    image_url: null,
    content: 'Full content not available in summary.'
  },
  {
    id: '4',
    title: 'Tesla Stock Rebounds on Robotaxi Optimism',
    author: 'CNBC',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3h ago
    related_tickers: 'TSLA',
    category: 'Auto',
    summary: 'Analysts suggest the upcoming Aug 8 event could be a turning point for the company\'s valuation model.',
    image_url: null,
    content: 'Full content not available in summary.'
  },
  {
    id: '5',
    title: 'Microsoft Azure Outpaces AWS in Recent Cloud Growth Metrics',
    author: 'TechCrunch',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    related_tickers: 'MSFT, AMZN',
    category: 'Cloud',
    summary: 'Deep integration of OpenAI models into the Azure stack is proving to be a significant competitive moat for Microsoft.',
    image_url: null,
    content: 'Full content not available in summary.'
  },
  {
    id: '6',
    title: 'The AI Bubble: Is the Hype Meeting the Revenue Reality?',
    author: 'Financial Times',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
    related_tickers: 'GOOGL, META',
    category: 'Analysis',
    summary: 'Investors are starting to demand clearer evidence of AI ROI beyond just increased infrastructure spend.',
    image_url: null,
    content: 'Full content not available in summary.'
  }
];

export const MOCK_SUMMARY = {
  ticker: 'AAPL',
  bullets: [
    "Revenue declined 1% YoY to $89.5B, driven by weakness in iPad and Wearables segments.",
    "Services revenue reached an all-time high of $22.3B, offsetting hardware slumps.",
    "Gross margin improved to 45.2% due to cost-cutting measures and favorable mix shift."
  ],
  generatedAt: 'Oct 24, 2023 - 5:30 PM EST',
  sentiment: 'Neutral'
};
