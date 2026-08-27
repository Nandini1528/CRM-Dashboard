"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks/useHasMounted";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const toggleTheme = () => {
    if (!mounted) return;

    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-foreground transition-colors hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* App brand */}
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
            className="fill-[#3B5BDB] dark:fill-[#4469ff]"
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
          disabled={!mounted}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted disabled:pointer-events-none"
          aria-label={
            !mounted
              ? "Toggle theme"
              : theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
          }
          title={
            !mounted
              ? "Toggle theme"
              : theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
          }
        >
          {!mounted ? (
            <span
              className="block h-[18px] w-[18px]"
              aria-hidden="true"
            />
          ) : theme === "dark" ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B5BDB] text-sm font-medium text-white">
          NT
        </div>
      </div>
    </header>
  );
}
