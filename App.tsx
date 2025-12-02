import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Button } from './components/ui/Button';
import { ImageDisplay } from './components/ImageDisplay';
import { createFilePreviewUrl } from './utils/fileUtils';
import { cartoonifyImage } from './services/geminiService';

const STYLES = [
  "classic disney animation",
  "modern 3d pixar style",
  "japanese anime",
  "vintage comic book",
  "watercolor painting",
  "simpsons style"
];

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptStyle, setPromptStyle] = useState<string>(STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG, WebP).');
        return;
      }
      
      setSelectedFile(file);
      const url = createFilePreviewUrl(file);
      setPreviewUrl(url);
      setGeneratedImage(null); // Clear previous result
      setError(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const styleToUse = customPrompt.trim() !== "" ? customPrompt : promptStyle;
      const result = await cartoonifyImage(selectedFile, styleToUse);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate cartoon. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `cartoon-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* LEFT COLUMN: Input */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span>
                Upload Photo
              </h2>
              
              {!previewUrl ? (
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-yellow-400 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">Click to upload an image</p>
                  <p className="text-slate-400 text-sm mt-1">JPEG, PNG, WebP up to 5MB</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
              ) : (
                <div className="h-[300px]">
                   <ImageDisplay 
                    src={previewUrl} 
                    alt="Original Upload" 
                    label="Original" 
                    onClear={handleClear}
                  />
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span>
                Choose Style
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        setPromptStyle(style);
                        setCustomPrompt("");
                      }}
                      className={`text-sm px-3 py-2 rounded-lg text-left transition-all ${
                        promptStyle === style && customPrompt === ""
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300 border'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Or type a custom style..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm text-slate-700"
                    />
                </div>

                <div className="pt-4 mt-auto">
                    <Button 
                        className="w-full" 
                        onClick={handleGenerate} 
                        disabled={!selectedFile}
                        isLoading={isLoading}
                    >
                        Cartoonify Image
                    </Button>
                    {error && (
                        <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Output */}
          <div className="flex flex-col h-full">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
               <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">3</span>
                Result
              </h2>
              
              <div className="flex-1 min-h-[400px]">
                <ImageDisplay 
                    src={generatedImage} 
                    alt="Generated Cartoon" 
                    label="Gemini Output" 
                    isLoading={isLoading}
                    isPlaceholder={true}
                />
              </div>

              {generatedImage && (
                  <div className="mt-4 flex gap-3">
                      <Button onClick={downloadImage} className="flex-1">
                        Download Image
                      </Button>
                  </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;