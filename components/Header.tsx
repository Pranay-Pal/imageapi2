import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-950">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Banana<span className="text-yellow-500">Toon</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">Gemini Nano Banana</span>
        </div>
      </div>
    </header>
  );
};