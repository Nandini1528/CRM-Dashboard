"use client";

import { useState } from "react";
import {
  Users,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Customers", icon: Users },
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Settings", icon: Settings },
] as const;

export type NavSection =
  (typeof NAV_ITEMS)[number]["label"];

interface SidebarProps {
  activeSection: NavSection;
  onSelect: (section: NavSection) => void;
  className?: string;
  forceExpanded?: boolean;
  overlapActiveTab?: boolean;
}

export function Sidebar({
  activeSection,
  onSelect,
  className,
  forceExpanded = false,
  overlapActiveTab = true,
}: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const expanded = forceExpanded || hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex h-screen flex-col gap-1 px-3 py-5 transition-all duration-200 ease-out",
        expanded
          ? "w-56 bg-sidebar-expanded"
          : "w-18 bg-sidebar",
        className
      )}
    >
      <div className="mb-5 overflow-hidden whitespace-nowrap px-2 font-medium text-white">
        {expanded ? "CRM Dashboard" : "CRM"}
      </div>

      {NAV_ITEMS.map(({ label, icon: Icon }) => {
        const active = label === activeSection;

        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(label)}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors",

              active
                ? overlapActiveTab
                  ? [
                      "z-10 -mr-5 rounded-l-xl rounded-r-none",
                      "bg-card text-card-foreground",
                      "md:-mr-6",

                      // Extension into the main container — bg-card auto-flips with theme
                      "after:absolute",
                      "after:inset-y-0",
                      "after:-right-6",
                      "after:w-6",
                      "after:bg-card",
                      "after:-z-10",
                    ].join(" ")
                  : "rounded-lg bg-card text-card-foreground"
                : "text-sidebar-muted hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} className="shrink-0" />

            <span
              className={cn(
                "max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-200",
                expanded
                  ? "max-w-35 opacity-100"
                  : "opacity-0"
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}