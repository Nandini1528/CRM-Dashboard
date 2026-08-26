"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
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

        {/* App brand — wordmark logo, inherits color via currentColor */}
        <svg
          viewBox="0 0 420 100"
          className="h-6 w-auto text-foreground"
          role="img"
          aria-label="Rolodex"
        >
          <text
            x="10"
            y="72"
            fontFamily="Inter, 'Helvetica Neue', Arial, sans-serif"
            fontWeight="700"
            fontSize="56"
            letterSpacing="1"
            fill="#3B5BDB"
          >
            ROLODEX
          </text>
        </svg>
      </div>

      <div className="flex items-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B5BDB] text-sm font-medium text-white">
  NT
</div>
      </div>
    </header>
  );
}