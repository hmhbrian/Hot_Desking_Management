"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Option {
  value: string | number;
  label: string;
  subLabel?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function CustomSelect({ options, value, onChange, placeholder = "Chọn...", className, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl flex items-center justify-between transition-all",
          "bg-slate-800/40 border border-white/10 hover:border-rose-500/30 text-sm font-bold text-white shadow-lg shadow-black/20",
          isOpen && "ring-2 ring-rose-500/20 border-rose-500/50 bg-slate-800/60"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-slate-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180 text-rose-500")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] w-full mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
          >
            <div className="max-h-60 overflow-y-auto scrollbar-hide">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 flex items-center justify-between text-left transition-colors",
                    "hover:bg-rose-500/10 group",
                    value === option.value ? "bg-rose-500/5" : ""
                  )}
                >
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-bold transition-colors", value === option.value ? "text-rose-500" : "text-slate-300 group-hover:text-white")}>
                      {option.label}
                    </span>
                    {option.subLabel && <span className="text-[10px] text-slate-500 group-hover:text-slate-400">{option.subLabel}</span>}
                  </div>
                  {value === option.value && <Check className="h-4 w-4 text-rose-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
