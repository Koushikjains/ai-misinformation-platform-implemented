"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
    value: string;
    label: string;
}

interface CyberDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    icon: React.ReactNode;
    label: string;
    color: string; // Hex color for the theme (e.g., #00f0ff)
}

export function CyberDropdown({
    value,
    onChange,
    options,
    icon,
    label,
    color,
}: CyberDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    return (
        <div className="relative flex-1" ref={dropdownRef}>
            <label
                className="block text-xs mb-2 uppercase tracking-wider font-cyber"
                style={{ color: color }}
            >
                {label}
            </label>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-[#0a0a0f] border text-white rounded-lg px-4 py-3 pl-10 flex items-center justify-between focus:outline-none transition-all duration-200"
                    style={{
                        borderColor: `${color}4D`, // 30% opacity
                        boxShadow: isOpen ? `0 0 15px ${color}33` : "none",
                    }}
                >
                    <span className="truncate font-sans font-medium text-lg">
                        {selectedLabel}
                    </span>
                    <ChevronDown
                        size={18}
                        className="transition-transform duration-200"
                        style={{
                            color: color,
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                </button>

                <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: color }}>
                    {icon}
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-[#0a0a0f] border rounded-lg overflow-hidden z-20 shadow-xl"
                            style={{
                                borderColor: `${color}4D`,
                                boxShadow: `0 0 20px ${color}1A`,
                            }}
                        >
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 flex items-center justify-between group transition-colors duration-150"
                                    style={{
                                        color: option.value === value ? color : "#9ca3af", // White/gray
                                    }}
                                >
                                    <span
                                        className="group-hover:text-white transition-colors"
                                        style={{ fontFamily: "'Rajdhani', sans-serif" }}
                                    >
                                        {option.label}
                                    </span>
                                    {option.value === value && <Check size={16} />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
