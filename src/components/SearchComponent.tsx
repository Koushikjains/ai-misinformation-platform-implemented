"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Globe, MapPin, Cpu, Brain } from "lucide-react";
import { CyberDropdown } from "./CyberDropdown";

interface SearchComponentProps {
  onAnalyze: (text: string, modelType: string, region: string) => void;
  isLoading: boolean;
}

export function SearchComponent({ onAnalyze, isLoading }: SearchComponentProps) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [modelType, setModelType] = useState("deep_learning");
  const [region, setRegion] = useState("global");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions.slice(0, 5));
      }
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSuggestions(text);
    }, 300);
    return () => clearTimeout(debounce);
  }, [text, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      onAnalyze(text, modelType, region);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setShowSuggestions(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + "px";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative">
        <div className="relative cyber-border rounded-xl bg-[#1a1a2e]/80 backdrop-blur-sm p-1 box-glow-cyan">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextareaChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Paste news article or claim to fact-check..."
              className="w-full min-h-[140px] bg-[#0a0a0f] text-white rounded-lg p-5 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50 placeholder:text-gray-500 text-lg font-medium"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            />
            <div className="absolute top-4 right-4 text-[#00f0ff]/50">
              <Search size={24} />
            </div>
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a2e] border border-[#00f0ff]/30 rounded-lg overflow-hidden z-50 shadow-lg"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setText(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[#00f0ff]/10 text-gray-300 hover:text-white transition-colors border-b border-[#00f0ff]/10 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-5">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="relative">
                <CyberDropdown
                  label="Model Type"
                  value={modelType}
                  onChange={setModelType}
                  options={[
                    { value: "deep_learning", label: "Deep Learning (DistilBERT)" },
                    { value: "classic", label: "Classic ML (Logistic)" },
                  ]}
                  icon={
                    modelType === "deep_learning" ? (
                      <Brain size={18} />
                    ) : (
                      <Cpu size={18} />
                    )
                  }
                  color="#00f0ff"
                />
              </div>
            </div>

            <div className="relative flex-1">
              <div className="relative">
                <CyberDropdown
                  label="Region Filter"
                  value={region}
                  onChange={setRegion}
                  options={[
                    { value: "global", label: "Global" },
                    { value: "india", label: "India" },
                  ]}
                  icon={region === "global" ? <Globe size={18} /> : <MapPin size={18} />}
                  color="#ff00ff"
                />
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isLoading || text.trim().length === 0}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-[#0a0a0f] font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-cyber uppercase tracking-wider flex items-center justify-center gap-2 min-w-[160px] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Analyze
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
