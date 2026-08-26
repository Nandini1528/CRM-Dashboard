"use client";

import { useState } from "react";
import { Users, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Customers", icon: Users },
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Settings", icon: Settings },
] as const;

export type NavSection = (typeof NAV_ITEMS)[number]["label"];

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
        "h-screen flex flex-col py-5 px-3 gap-1 transition-all duration-200 ease-out",
        expanded ? "w-56 bg-sidebar-expanded" : "w-18 bg-sidebar",
        className
      )}
    >
      <div className="text-white font-medium px-2 mb-5 whitespace-nowrap overflow-hidden">
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
              "flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-colors",
              active
                ? overlapActiveTab
                  ? "relative z-10 -mr-5 rounded-l-xl rounded-r-none bg-white text-slate-900 md:-mr-6"
                  : "bg-white text-slate-900 rounded-lg"
                : "text-sidebar-muted hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span
              className={cn(
                "text-sm whitespace-nowrap transition-all duration-200 overflow-hidden",
                expanded ? "opacity-100 max-w-35" : "opacity-0 max-w-0"
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