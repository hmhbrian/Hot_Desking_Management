"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          className={cn(
            "peer h-5 w-5 appearance-none rounded-md border-2 border-white/10 bg-slate-800/50 transition-all",
            "checked:border-rose-500 checked:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
        <Check className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none" />
      </div>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
