"use client";

import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ title = "Customers", onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b bg-background">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-muted text-foreground"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 rounded-md hover:bg-muted text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
          AR
        </div>
      </div>
    </header>
  );
}