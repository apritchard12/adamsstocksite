'use client';

import React, { useState } from 'react';
import Layout from '../components/Layout';
import HomeView from '../components/HomeView';
import CommandCenter from '../components/CommandCenter';
import { INITIAL_WATCHLIST } from '../constants';

// Simplified view management without TypeScript enums
const VIEW_HOME = 'home';
const VIEW_DETAIL = 'detail';

export default function Page() {
  const [currentView, setCurrentView] = useState(VIEW_HOME);
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);

  const handleSelectTicker = (ticker) => {
    setSelectedTicker(ticker);
    setCurrentView(VIEW_DETAIL);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white">
      <CommandCenter 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onSelect={handleSelectTicker}
      />
      
      <Layout
        watchlist={watchlist}
        selectedTicker={selectedTicker}
        onSelectTicker={handleSelectTicker}
        onOpenCommand={() => setIsCommandOpen(true)}
        currentView={currentView}
        onSetView={setCurrentView}
      >
        {currentView === VIEW_HOME ? (
           <HomeView onSelectTicker={handleSelectTicker} />
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedTicker} Detail View</h2>
              <p>Work in Progress - This view is not yet implemented in the prototype.</p>
              <button 
                onClick={() => setCurrentView(VIEW_HOME)}
                className="mt-4 text-blue-500 hover:underline"
              >
                Back to Dashboard
              </button>
           </div>
        )}
      </Layout>
    </div>
  );
}
