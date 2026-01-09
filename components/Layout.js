'use client';

import React from 'react';
import { LayoutGrid, BarChart3, Settings, Bell, User, Home } from 'lucide-react';
import Watchlist from './Watchlist';

const VIEW_HOME = 'home';
const VIEW_DETAIL = 'detail';

const Layout = ({ 
  children, 
  watchlist, 
  selectedTicker, 
  onSelectTicker,
  onOpenCommand,
  currentView,
  onSetView
}) => {
  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Navigation Rail */}
      <nav className="w-16 flex flex-col items-center py-6 border-r border-gray-800 bg-gray-950 flex-shrink-0 z-20">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-8 shadow-lg shadow-blue-900/50">
          <BarChart3 className="text-white w-5 h-5" />
        </div>
        
        <div className="flex flex-col gap-6 w-full items-center">
          <button 
            onClick={() => onSetView(VIEW_HOME)}
            className={`p-3 rounded-xl transition-all duration-200 ${currentView === VIEW_HOME ? 'bg-gray-800 text-blue-400 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            title="Home Dashboard"
          >
            <Home className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onSetView(VIEW_DETAIL)}
            className={`p-3 rounded-xl transition-all duration-200 ${currentView === VIEW_DETAIL ? 'bg-gray-800 text-blue-400 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            title="Markets Detail"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-auto">
          <button className="p-3 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Watchlist Sidebar */}
      <Watchlist 
        initialTickers={watchlist} 
        onSelectTicker={(t) => {
          onSelectTicker(t);
          onSetView(VIEW_DETAIL);
        }} 
        selectedTicker={selectedTicker}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950 relative">
         {/* Top Bar */}
         <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950/80 backdrop-blur sticky top-0 z-30">
            <div className="flex items-center gap-4">
               <button 
                onClick={onOpenCommand}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-200 px-4 py-1.5 rounded-md text-sm transition-all shadow-sm"
               >
                 <span className="text-xs font-mono opacity-50">⌘K</span>
                 <span>Global Search</span>
               </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <span className="text-[10px] font-mono font-bold text-green-500 tracking-widest uppercase">Network Live</span>
              </div>
            </div>
         </div>

         {/* Content Scroll Area */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
           {children}
         </div>
      </main>
    </div>
  );
};

export default Layout;
