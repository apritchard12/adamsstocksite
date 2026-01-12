'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import Layout from '../../../components/Layout';
import { INITIAL_WATCHLIST } from '../../../constants';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/v1/articles/${id}`);
        if (!res.ok) throw new Error('Article not found');
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleSetView = (view) => {
    if (view === 'home') {
      router.push('/');
    }
  };

  const handleSelectTicker = (ticker) => {
    // In a real app, this might navigate to /?ticker=AAPL or /ticker/AAPL
    router.push(`/?ticker=${ticker}`);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white">
      <Layout
        watchlist={INITIAL_WATCHLIST}
        selectedTicker={null}
        onSelectTicker={handleSelectTicker}
        onOpenCommand={() => {}} 
        currentView="article"
        onSetView={handleSetView}
      >
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
          
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Intelligence</span>
          </button>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
               <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-500 animate-pulse">Decrypting Market Data...</p>
             </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
               <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Article</h3>
               <p className="text-gray-400">{error}</p>
               <button onClick={() => router.push('/')} className="mt-4 text-sm text-white underline">Return Home</button>
            </div>
          ) : (
            <>
              <header className="space-y-6 border-b border-gray-800 pb-8">
                 <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded">
                      {article.category || 'MARKETS'}
                    </span>
                    {article.related_tickers && article.related_tickers.split(',').map(t => (
                        <span key={t} className="text-xs font-mono font-bold text-gray-400 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded">
                           ${t.trim()}
                        </span>
                    ))}
                 </div>
                 
                 <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                    {article.title}
                 </h1>

                 <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-blue-500" />
                       <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-blue-500" />
                       <span>{formatTimeAgo(article.created_at)}</span>
                    </div>
                 </div>
              </header>

              <article className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white">
                 {/* 
                    If content is HTML, use dangerouslySetInnerHTML. 
                    If markdown, we'd need a parser. 
                    Assuming simple text or HTML for now based on typical DB content. 
                  */}
                 <div className="whitespace-pre-wrap leading-relaxed">
                    {article.content}
                 </div>
              </article>
            </>
          )}
        </div>
      </Layout>
    </div>
  );
}
