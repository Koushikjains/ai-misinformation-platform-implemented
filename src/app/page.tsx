"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, TrendingUp, Newspaper } from "lucide-react";
import { SearchComponent } from "@/components/SearchComponent";
import { ResultDisplay } from "@/components/ResultDisplay";
import { EvidenceCard } from "@/components/EvidenceCard";
import { Toast } from "@/components/Toast";

interface Evidence {
  title: string;
  snippet: string;
  link: string;
  isGovt?: boolean;
  isTrusted?: boolean;
}

interface AnalysisResult {
  final_verdict: string;
  ui_color: string;
  ai_score: number;
  evidence_count: number;
  evidence: Evidence[];
  description?: string;
  verdict_explanation?: string;
  // Legacy support or if needed
  verdict?: string;
  confidence?: number;
}

interface ToastState {
  message: string;
  type: "error" | "success";
  isVisible: boolean;
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModelType, setCurrentModelType] = useState("deep_learning");
  const [analyzedText, setAnalyzedText] = useState("");
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "error",
    isVisible: false,
  });

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible]);

  const handleAnalyze = async (text: string, modelType: string, region: string) => {
    setIsLoading(true);
    setResult(null);
    setCurrentModelType(modelType);
    setAnalyzedText(text);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model_type: modelType, region }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Analysis failed", "error");
        return;
      }

      setResult(data);
    } catch {
      showToast("Connection failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff00ff]/10 rounded-full blur-[120px]" />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <div className="relative z-10">
        <header className="py-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#ff00ff] p-[2px] animate-pulse-glow">
                <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                  <Shield className="text-[#00f0ff]" size={28} />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-cyber font-bold">
                <span className="text-white">MISINFO</span>
                <span className="text-[#00f0ff] text-glow-cyan">SHIELD</span>
              </h1>
            </div>
            <p className="text-center text-gray-400 text-lg max-w-2xl mx-auto">
              AI-Powered Misinformation Detection Platform
            </p>
          </motion.div>
        </header>

        <main className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center gap-8 mb-12 flex-wrap"
            >
              {[
                { icon: Zap, label: "Real-time Analysis", color: "#00f0ff" },
                { icon: TrendingUp, label: "ML & Deep Learning", color: "#ff00ff" },
                { icon: Newspaper, label: "Evidence Search", color: "#00ff88" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <feature.icon size={18} style={{ color: feature.color }} />
                  <span className="text-sm">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <SearchComponent onAnalyze={handleAnalyze} isLoading={isLoading} />

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-12 space-y-12"
                >
                  <ResultDisplay
                    verdict={result.final_verdict}
                    uiColor={result.ui_color}
                    aiScore={result.ai_score}
                    description={result.description}
                    verdictExplanation={result.verdict_explanation}
                    modelType={currentModelType}
                  />

                  {result.evidence && result.evidence.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-cyber font-semibold text-white mb-6 text-center">
                        <span className="text-[#00f0ff]">RELATED</span> EVIDENCE
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {result.evidence.map((evidence, index) => (
                          <EvidenceCard key={index} evidence={evidence} index={index} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 text-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#1a1a2e]/50 border border-[#00f0ff]/20">
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span className="text-gray-400 text-sm">
                    Enter text above to analyze for misinformation
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <footer className="py-8 border-t border-[#00f0ff]/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-500 text-sm">
              Built with Next.js, Tailwind CSS & AI
            </p>
          </div>
        </footer>
      </div>


    </div>
  );
}
