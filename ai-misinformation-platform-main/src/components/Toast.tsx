"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "error" | "success";
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-6 left-1/2 z-[100]"
        >
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-sm ${
              type === "error"
                ? "bg-red-500/20 border-red-500/50 text-red-300"
                : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
            }`}
          >
            {type === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            <span className="font-medium">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
