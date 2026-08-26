"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { NavSection } from "@/components/layout/Sidebar";

interface NavigationContextValue {
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<NavSection>("Customers");

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}