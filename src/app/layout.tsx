import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { RouteLoadingSkeleton } from "@/components/skeletons/RouteLoadingSkeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "EPBB - Badan Keuangan",
  description: "Sistem Informasi Pajak Bumi dan Bangunan - Badan Keuangan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-screen bg-background font-sans leading-relaxed text-foreground antialiased">
        <Suspense fallback={<RouteLoadingSkeleton />}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
