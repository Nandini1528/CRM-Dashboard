"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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

        {/* App brand — wordmark logo */}
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
  className="fill-[#3B5BDB] dark:fill-[#6B7FE8]"
>
  ROLODEX
</text>
        </svg>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B5BDB] text-sm font-medium text-white">
          NT
        </div>
      </div>
    </header>
  );
}