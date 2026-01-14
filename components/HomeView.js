'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Newspaper, Globe, ChevronRight } from 'lucide-react';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NewsCard = ({ news, onSelectTicker }) => {
  // Handle related_tickers whether it comes as a string (DB) or array (Legacy/Mock)
  const tickers = typeof news.related_tickers === 'string' 
    ? news.related_tickers.split(',').map(t => t.trim()) 
    : (Array.isArray(news.related_tickers) ? news.related_tickers : []);

  return (
    <Link href={`/articles/${news.id}`} className="block group bg-gray-900/40 border border-gray-800 rounded-xl p-5 hover:bg-gray-800/60 hover:border-gray-700 transition-all cursor-pointer">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
          {news.category || 'MARKETS'}
        </span>
        <span className="text-xs text-gray-500">{formatTimeAgo(news.created_at)}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors leading-tight mb-3">
        {news.title}
      </h3>
      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
        {news.summary}
      </p>
      <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500">{news.author}</span>
          <div className="flex gap-2">
            {tickers.map(ticker => (
              <button 
                key={ticker}
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation
                  e.stopPropagation();
                  onSelectTicker(ticker);
                }}
                className="text-[10px] font-bold text-gray-400 hover:text-blue-400 bg-gray-800 px-1.5 py-0.5 rounded transition-colors"
              >
                ${ticker}
              </button>
            ))}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  );
};

const HomeView = ({ onSelectTicker }) => {
  const [newsData, setNewsData] = useState([]);
  const [indicesData, setIndicesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsRes, indicesRes] = await Promise.all([
          fetch('/api/v1/articles'),
          fetch('/api/v1/indices')
        ]);
        
        const news = await newsRes.json();
        const indices = await indicesRes.json();
        
        setNewsData(news);
        setIndicesData(indices);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 via-gray-950 to-gray-950 border border-gray-800 p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-400 mb-4">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">Adam's Stock Site</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            The future of finance is <span className="text-blue-500">real-time.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Monitor global markets, analyze corporate earnings, and track your portfolio with Adam's high-performance terminal.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Handled by sidebar naturally, but we can add Indices here for home look */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
             <div className="p-4 border-b border-gray-800 bg-gray-950/50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp className="w-4 h-4" /> Market Indices
                </h2>
             </div>
             <div className="divide-y divide-gray-800">
                {indicesData.length > 0 ? (
                  indicesData.map(index => (
                    <div key={index.name} className="p-4 flex justify-between items-center hover:bg-gray-800/50 transition-colors cursor-default">
                      <div>
                        <div className="text-sm font-bold text-gray-200">{index.name}</div>
                        <div className="text-xs text-gray-500">Index Spot Price</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-gray-100">{index.value}</div>
                        <div className={`text-xs font-mono ${index.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {index.change}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500">Loading Indices...</div>
                )}
             </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-blue-400 font-bold mb-2">Portfolio Insights</h3>
            <p className="text-sm text-gray-400 mb-4">You have 3 positions reaching new 52-week highs today. View your dashboard for details.</p>
            <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
              Open Portfolio →
            </button>
          </div>
        </div>

        {/* Right Columns: News Feed */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-gray-500" /> Top Stories
              </h2>
              <div className="flex gap-4">
                <button className="text-xs text-gray-400 hover:text-white transition-colors border-b border-blue-500 pb-1">Latest</button>
                <button className="text-xs text-gray-400 hover:text-white transition-colors">Popular</button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="text-gray-500 col-span-2 text-center py-10">Loading Intelligence...</div>
              ) : (
                newsData.map(news => (
                  <NewsCard key={news.id} news={news} onSelectTicker={onSelectTicker} />
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

