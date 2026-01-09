'use client';

import React, { useEffect, useState, useRef } from 'react';
import { generateNextPrice } from '../services/marketService';

const WatchlistRow = ({ ticker, isSelected, onClick }) => {
  const [data, setData] = useState({
    ticker,
    price: 0,
    changePercent: 0
  });
  const prevPriceRef = useRef(0);
  const [flash, setFlash] = useState(null);

  // Simulate WebSocket subscription for this specific ticker
  useEffect(() => {
    // Initial random data
    const startPrice = 100 + Math.random() * 500;
    setData({
      ticker,
      price: startPrice,
      changePercent: (Math.random() - 0.5) * 2
    });
    prevPriceRef.current = startPrice;

    const interval = setInterval(() => {
      setData(prev => {
        const newPrice = generateNextPrice(prev.price);
        const priceDiff = newPrice - prev.price;
        
        // Trigger flash
        if (Math.abs(priceDiff) > 0.01) {
             setFlash(priceDiff > 0 ? 'green' : 'red');
             setTimeout(() => setFlash(null), 800);
        }
        
        prevPriceRef.current = prev.price;

        return {
          ...prev,
          price: newPrice,
          changePercent: prev.changePercent + (priceDiff / prev.price) * 100
        };
      });
    }, 2000 + Math.random() * 3000); // Random update interval between 2-5s

    return () => clearInterval(interval);
  }, [ticker]);

  const priceColor = flash === 'green' ? 'text-green-400 bg-green-400/10' : 
                     flash === 'red' ? 'text-red-400 bg-red-400/10' : 
                     'text-gray-200';

  return (
    <div 
      onClick={onClick}
      className={`
        group flex justify-between items-center p-3 cursor-pointer transition-all duration-200 border-b border-gray-800/50 hover:bg-gray-800
        ${isSelected ? 'bg-gray-800 border-l-4 border-l-blue-500 pl-2' : 'pl-3 border-l-4 border-l-transparent'}
      `}
    >
      <div className="flex flex-col">
        <span className="font-bold text-sm text-gray-100">{ticker}</span>
        <span className={`text-xs ${data.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
        </span>
      </div>
      <div className={`font-mono text-sm px-2 py-1 rounded transition-colors duration-300 ${priceColor}`}>
        {data.price.toFixed(2)}
      </div>
    </div>
  );
};

const Watchlist = ({ initialTickers, onSelectTicker, selectedTicker }) => {
  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800 w-64 flex-shrink-0">
      <div className="p-4 border-b border-gray-800 bg-gray-950/50 backdrop-blur sticky top-0 z-10">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Pulse</h2>
      </div>
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {initialTickers.map(t => (
          <WatchlistRow 
            key={t} 
            ticker={t} 
            isSelected={t === selectedTicker} 
            onClick={() => onSelectTicker(t)} 
          />
        ))}
      </div>
      <div className="p-4 border-t border-gray-800">
        <button className="w-full py-2 text-xs font-medium text-gray-400 hover:text-white border border-dashed border-gray-700 rounded hover:border-gray-500 transition-colors">
          + Add Symbol
        </button>
      </div>
    </div>
  );
};

export default Watchlist;
