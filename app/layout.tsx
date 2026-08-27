"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import {
  NavigationProvider,
  useNavigation,
} from "@/lib/navigation-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

function LayoutShell({ children }: { children: React.ReactNode }) {
  const { activeSection, setActiveSection } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#383838] dark:bg-black p-0 md:gap-3 md:p-3">
      {/* Desktop Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        className="hidden shrink-0 md:flex"
      />

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar
            activeSection={activeSection}
            onSelect={(section) => {
              setActiveSection(section);
              setMobileOpen(false);
            }}
            className="w-56 shrink-0 bg-sidebar"
            forceExpanded
            overlapActiveTab={false}
          />

          {/* Mobile overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main App Container */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-none bg-white shadow-none dark:bg-[#383838] md:rounded-3xl md:shadow-xl">
        <Header
          title={activeSection}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <QueryProvider>
          <NavigationProvider>
            <ThemeProvider>
              <LayoutShell>{children}</LayoutShell>
            </ThemeProvider>
          </NavigationProvider>
        </QueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
