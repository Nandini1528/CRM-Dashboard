"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { NavigationProvider, useNavigation } from "@/lib/navigation-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

function LayoutShell({ children }: { children: React.ReactNode }) {
  const { activeSection, setActiveSection } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        className="hidden md:flex"
      />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar
            activeSection={activeSection}
            onSelect={(section) => {
              setActiveSection(section);
              setMobileOpen(false);
            }}
          />
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={activeSection} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <QueryProvider>
          <NavigationProvider>
            <LayoutShell>{children}</LayoutShell>
          </NavigationProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}