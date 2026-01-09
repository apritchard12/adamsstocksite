'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { MOCK_STOCKS } from '../constants';

const CommandCenter = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = Object.values(MOCK_STOCKS).filter(s => 
    s.ticker.includes(query.toUpperCase()) || s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 font-medium"
            placeholder="Search tickers (e.g., AAPL)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
            }}
          />
          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">ESC</div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map(stock => (
              <div 
                key={stock.ticker}
                className="flex items-center justify-between px-4 py-3 hover:bg-blue-600/10 hover:border-l-2 hover:border-l-blue-500 cursor-pointer group"
                onClick={() => {
                  onSelect(stock.ticker);
                  onClose();
                  setQuery('');
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-200">{stock.ticker}</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">{stock.name}</span>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found for "{query}"
            </div>
          )}
          {query === '' && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-600 px-2 py-1">Trending</div>
              {['NVDA', 'TSLA', 'AMD'].map(t => (
                 <div key={t} onClick={() => { onSelect(t); onClose(); }} className="px-4 py-2 hover:bg-gray-800 cursor-pointer rounded flex items-center">
                    <span className="text-sm text-gray-300">{t}</span>
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
