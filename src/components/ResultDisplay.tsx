"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ResultDisplayProps {
  verdict: string;
  uiColor: string;
  aiScore: number;
  description?: string;
  verdictExplanation?: string;
  modelType: string;
}

export function ResultDisplay({
  verdict,
  uiColor,
  aiScore,
  description,
  verdictExplanation,
  modelType,
}: ResultDisplayProps) {
  const confidencePercent = Math.round(aiScore * 100);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return {
          bg: "bg-gradient-to-br from-emerald-500/20 to-emerald-900/20",
          border: "border-emerald-500/40",
          glow: "box-glow-green",
          text: "text-emerald-400",
          itemBg: "bg-emerald-500/30",
          gradient: "from-emerald-600 to-emerald-400"
        };
      case "amber":
        return {
          bg: "bg-gradient-to-br from-amber-500/20 to-amber-900/20",
          border: "border-amber-500/40",
          glow: "box-glow-gold", // using gold glow for amber
          text: "text-amber-400",
          itemBg: "bg-amber-500/30",
          gradient: "from-amber-600 to-amber-400"
        };
      case "yellow":
        return {
          bg: "bg-gradient-to-br from-yellow-500/20 to-yellow-900/20",
          border: "border-yellow-500/40",
          glow: "box-glow-gold",
          text: "text-yellow-400",
          itemBg: "bg-yellow-500/30",
          gradient: "from-yellow-600 to-yellow-400"
        };
      case "gray":
        return {
          bg: "bg-gradient-to-br from-gray-500/20 to-gray-900/20",
          border: "border-gray-500/40",
          glow: "shadow-gray-500/20",
          text: "text-gray-400",
          itemBg: "bg-gray-500/30",
          gradient: "from-gray-600 to-gray-400"
        };
      case "red":
      default:
        return {
          bg: "bg-gradient-to-br from-red-500/20 to-red-900/20",
          border: "border-red-500/40",
          glow: "box-glow-red",
          text: "text-red-400",
          itemBg: "bg-red-500/30",
          gradient: "from-red-600 to-red-400"
        };
    }
  };

  const colors = getColorClasses(uiColor);
  const isInvalid = uiColor === "gray";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={`relative rounded-2xl p-8 border ${colors.bg} ${colors.border} ${colors.glow}`}
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${colors.itemBg}`}
          >
            {/* Dynamic Icon could be improved, simplifying for now */}
            {uiColor === "green" ? (
              <CheckCircle size={48} className={colors.text} />
            ) : (
              <AlertTriangle size={48} className={colors.text} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2
              className={`text-3xl md:text-5xl font-cyber font-bold tracking-wider mb-2 ${colors.text}`}
              style={{
                textShadow: `0 0 20px currentColor`,
              }}
            >
              {verdict}
            </h2>
            <p className="text-gray-400 text-lg max-w-lg mx-auto">
              {isInvalid
                ? (description || "Input analysis unavailable.")
                : "Unified Analysis (AI Style + Fact Check)"
              }
            </p>
            {/* NEW: Verdict Explanation */}
            {!isInvalid && verdictExplanation && (
              <p className="text-gray-400 text-sm mt-3 italic text-center max-w-md mx-auto">
                {verdictExplanation}
              </p>
            )}
          </motion.div>


          {!isInvalid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 w-full"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm uppercase tracking-wider">Fake Probability (AI)</span>
                <span className={`text-2xl font-cyber font-bold ${colors.text}`}>
                  {confidencePercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-[#0a0a0f] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercent}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
                />
              </div>
            </motion.div>
          )}


        </div>



      </div>
    </motion.div>
  );
}
