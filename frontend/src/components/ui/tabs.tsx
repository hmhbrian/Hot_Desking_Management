"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined);

const Tabs = ({ 
  children, 
  defaultValue, 
  value, 
  onValueChange, 
  className 
}: { 
  children: React.ReactNode, 
  defaultValue?: string, 
  value?: string, 
  onValueChange?: (val: string) => void, 
  className?: string 
}) => {
  const [internalTab, setInternalTab] = React.useState(defaultValue || "");
  const activeTab = value !== undefined ? value : internalTab;
  
  const setActiveTab = React.useCallback((val: string) => {
    if (onValueChange) onValueChange(val);
    else setInternalTab(val);
  }, [onValueChange]);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900/50 p-1.5 text-slate-400 border border-white/5 backdrop-blur-sm", className)}>
    {children}
  </div>
);

const TabsTrigger = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  
  const isActive = context.activeTab === value;
  
  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" 
          : "hover:text-slate-100",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  
  if (context.activeTab !== value) return null;

  return (
    <div className={cn("mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300", className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
