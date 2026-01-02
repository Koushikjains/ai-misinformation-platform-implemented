"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

interface LimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

export function LimeModal({ isOpen, onClose, htmlContent }: LimeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#1a1a2e] rounded-2xl border border-[#ff00ff]/30 overflow-hidden box-glow-pink"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#ff00ff]/20 bg-gradient-to-r from-[#ff00ff]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ff00ff]/20 flex items-center justify-center">
                  <Sparkles className="text-[#ff00ff]" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-cyber font-bold text-white">LIME Explanation</h2>
                  <p className="text-sm text-gray-400">Word importance analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[calc(85vh-80px)]">
              <div
                className="lime-content bg-white rounded-xl p-6"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
