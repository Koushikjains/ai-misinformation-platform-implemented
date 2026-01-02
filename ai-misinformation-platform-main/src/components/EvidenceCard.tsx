"use client";

import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";

interface Evidence {
  title: string;
  snippet: string;
  link: string;
  isGovt?: boolean;
  isTrusted?: boolean;
}

interface EvidenceCardProps {
  evidence: Evidence;
  index: number;
}

export function EvidenceCard({ evidence, index }: EvidenceCardProps) {
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch {
      return url;
    }
  };

  const isGovt = evidence.isGovt;
  const isTrusted = evidence.isTrusted;

  let borderColor = "border-gray-700 hover:border-gray-500";
  let badgeColor = "bg-gray-800 text-gray-400 border-gray-600";
  let iconColor = "text-gray-400";
  let bgGradient = "bg-gradient-to-r from-gray-800/20 to-gray-700/20";
  let textColor = "text-gray-300";
  let badgeText = "";
  let glowClass = "";

  if (isGovt) {
    borderColor = "border-yellow-500/50 hover:border-yellow-400";
    badgeColor = "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    iconColor = "text-yellow-500";
    bgGradient = "bg-gradient-to-r from-yellow-500/20 to-amber-500/20";
    textColor = "text-yellow-500";
    badgeText = "🏛️ GOVT SOURCE";
    glowClass = "box-glow-gold";
  } else if (isTrusted) {
    borderColor = "border-blue-500/50 hover:border-blue-400";
    badgeColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
    iconColor = "text-blue-400";
    bgGradient = "bg-gradient-to-r from-blue-500/20 to-cyan-500/20";
    textColor = "text-blue-400";
    badgeText = "📰 TRUSTED MEDIA";
    glowClass = "box-glow-blue";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative"
    >
      <div className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${bgGradient}`} />

      <div className={`relative bg-[#1a1a2e] rounded-xl p-5 h-full flex flex-col transition-all duration-300 border ${borderColor} ${glowClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10 ${isGovt ? "bg-yellow-500" : isTrusted ? "bg-blue-500" : "bg-gray-700"}`}>
            <Globe size={16} className={iconColor} />
          </div>
          <span className={`text-xs font-medium uppercase tracking-wider truncate ${textColor}`}>
            {getDomain(evidence.link)}
          </span>
          {badgeText && (
            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>

        <h3 className={`font-semibold text-lg mb-2 line-clamp-2 transition-colors text-white group-hover:text-white`}>
          {evidence.title}
        </h3>

        <p className="text-gray-400 text-sm flex-1 line-clamp-3 mb-4">
          {evidence.snippet}
        </p>

        <a
          href={evidence.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${textColor} hover:brightness-125`}
        >
          Read More
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
}
