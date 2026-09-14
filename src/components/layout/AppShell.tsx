"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "epbb-sidebar-collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* abaikan */
    }
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((v) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, v ? "0" : "1");
      } catch {
        /* abaikan */
      }
      return !v;
    });
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Sidebar
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "flex min-h-screen flex-col transition-[padding] duration-200 ease-out",
            collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]",
          )}
        >
          <Header
            onMenuClick={() => setMobileOpen(true)}
            onToggleSidebar={toggleCollapsed}
            sidebarCollapsed={collapsed}
          />
          <main className="flex-1 overflow-x-auto p-4 lg:p-6">{children}</main>
          <footer className="border-t border-border bg-card py-3 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Badan Keuangan – EPBB
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}
