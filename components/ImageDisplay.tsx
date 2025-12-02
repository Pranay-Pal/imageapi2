import React from 'react';

interface ImageDisplayProps {
  src: string | null;
  alt: string;
  label: string;
  isLoading?: boolean;
  onClear?: () => void;
  isPlaceholder?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  src, 
  alt, 
  label, 
  isLoading, 
  onClear,
  isPlaceholder = false
}) => {
  return (
    <div className="relative group w-full h-full min-h-[300px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-slate-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
        {label}
      </div>

      {onClear && src && !isLoading && (
        <button 
          onClick={onClear}
          className="absolute top-4 right-4 z-10 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full shadow-sm transition-colors"
          title="Clear image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 18 12"/>
          </svg>
        </button>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium text-sm">Generating cartoon...</p>
          </div>
        ) : src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-contain rounded-lg transition-transform duration-500 hover:scale-[1.02]" 
          />
        ) : (
          <div className="text-center text-slate-400 p-8">
             {isPlaceholder ? (
               <div className="flex flex-col items-center gap-3">
                 <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                     <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                     <circle cx="9" cy="9" r="2"/>
                     <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                   </svg>
                 </div>
                 <p className="text-sm">Result will appear here</p>
               </div>
             ) : (
               <p className="text-sm">No image selected</p>
             )}
          </div>
        )}
      </div>
    </div>
  );
};