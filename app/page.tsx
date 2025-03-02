"use client";
import { useState } from "react";
import { FiLink, FiCopy, FiCheckCircle } from "react-icons/fi";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const shortenUrl = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ longUrl: url }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) throw new Error("Failed to shorten URL");
      
      const data = await res.json();
      setShortUrl(`${window.location.origin}/${data.shortUrl}`);
      setCopied(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-5">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <FiLink className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Shorten URLs
          </h1>
          <p className="text-gray-400">Paste your long link below</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="url"
              placeholder="https://example.com"
              className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-800 focus:outline-none focus:border-blue-500 transition-all ${
                error ? "border-red-500" : "border-gray-700"
              }`}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
            />
            {error && (
              <p className="absolute mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          <button
            onClick={shortenUrl}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              loading
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </button>

          {shortUrl && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg animate-fade-in">
              <div className="flex items-center justify-between">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 truncate"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <FiCopy className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-sm text-green-500">Copied to clipboard!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}