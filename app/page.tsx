"use client";
import { useState, useEffect } from "react";
import { FiLink, FiCopy, FiCheckCircle, FiExternalLink, FiClock, FiTrash2, FiInfo } from "react-icons/fi";
import QRCode from "react-qr-code";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ url: string; shortUrl: string; date: string }[]>([]);
  const [showQR, setShowQR] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("urlHistory") || "[]");
    setHistory(savedHistory);
  }, []);

  const shortenUrl = async () => {
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ longUrl: url }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) throw new Error("Failed to shorten URL");
      
      const data = await res.json();
      const newShortUrl = `${window.location.origin}/${data.shortUrl}`;
      
      setShortUrl(newShortUrl);
      setCopied(false);
      setShowQR(true);
      
      // Add to history
      const newHistory = [{ url, shortUrl: newShortUrl, date: new Date().toISOString() }, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem("urlHistory", JSON.stringify(newHistory));
    } catch (err) {
      setError((err as any).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidUrl = (string: string) => {
    try { 
      return Boolean(new URL(string)); 
    } catch(e){ 
      return false;
    }
  };

  const deleteHistoryItem = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem("urlHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("urlHistory");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-5">
      {/* Glass morphism container */}
      <div className="max-w-3xl mx-auto backdrop-blur-xl bg-black/20 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        
        {/* Header Section with animated background */}
        <div className="relative overflow-hidden py-12 px-8 bg-gradient-to-r from-blue-600/30 to-purple-600/30">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl ring-4 ring-white/10 mb-4">
              <FiLink className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
              ShortMeet
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Transform your lengthy URLs into concise, memorable links in seconds
            </p>
          </div>
          
          {/* Floating animated shapes */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-float-delayed"></div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* URL Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <div className="flex">
                <input
                  type="url"
                  placeholder="Paste your long URL here"
                  className={`w-full px-6 py-4 text-lg rounded-l-xl border-2 bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-4 transition-all ${
                    error ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10 focus:ring-blue-500/30"
                  }`}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && shortenUrl()}
                />
                <button
                  onClick={shortenUrl}
                  disabled={loading}
                  className={`px-8 py-4 text-lg rounded-r-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                    loading ? "bg-blue-600/50 cursor-not-allowed" : 
                    "bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 hover:shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden md:inline">Processing</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden md:inline">Shorten</span>
                      <span className="md:hidden">Go</span>
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="absolute mt-2 flex items-center gap-2 text-red-400 text-sm">
                  <FiInfo className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Enter any URL to create an instant short link and QR code
            </div>
          </div>

          {/* Result Section */}
          {shortUrl && (
            <div className="mt-8 rounded-xl border border-white/10 overflow-hidden animate-fade-in">
              <div className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 p-4 flex justify-between items-center">
                <h3 className="font-medium">Your Short Link</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowQR(!showQR)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    title="Toggle QR Code"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 bg-white/5">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 truncate text-lg flex items-center gap-2"
                      >
                        {shortUrl}
                        <FiExternalLink className="flex-shrink-0" />
                      </a>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all relative"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <FiCheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <FiCopy className="h-5 w-5 text-gray-300" />
                        )}
                        {copied && (
                          <div className="absolute -top-8 -right-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                            Copied!
                          </div>
                        )}
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      <span className="font-medium text-gray-300">Original URL: </span>
                      <span className="truncate block">{url}</span>
                    </div>
                    
                    {showQR && (
                      <div className="mt-4">
                        <div className="flex items-center gap-4 text-gray-400 mb-4">
                          <span className="h-px flex-1 bg-white/10"></span>
                          <span>QR Code</span>
                          <span className="h-px flex-1 bg-white/10"></span>
                        </div>
                        <div className="flex justify-center">
                          <div className="p-4 bg-white rounded-lg">
                            <QRCode
                              value={shortUrl}
                              size={160}
                              bgColor="#ffffff"
                              fgColor="#1f2937"
                              level="Q"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
                  <FiClock className="text-blue-400" />
                  Recent Links
                </h3>
                <button 
                  onClick={clearHistory}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <FiTrash2 size={14} />
                  Clear all
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center justify-between">
                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 truncate flex-1 font-medium"
                      >
                        {item.shortUrl}
                      </a>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(item.shortUrl)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
                          title="Copy to clipboard"
                        >
                          <FiCopy className="h-4 w-4 text-gray-300" />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(index)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-red-400"
                          title="Delete from history"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 truncate mt-1">
                      {item.url}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="py-4 px-8 text-center text-sm text-gray-400 border-t border-white/5">
          ShortMeet — Share links quickly and easily
        </div>
      </div>
      
      {/* Add some CSS for animations and custom scrollbar */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .bg-grid-pattern {
          background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
}