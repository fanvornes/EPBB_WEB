"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSearchParams, usePathname } from "next/navigation";
import { formatNopDotted } from "@/lib/validators";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pencarian": "Pencarian SPPT",
  "/hasil_data": "Hasil Data",
  "/sppt": "Data SPPT",
  "/wajib-pajak": "Wajib Pajak",
  "/objek-pajak": "Objek Pajak",
  "/monitoring": "Monitoring Pajak",
};

export function Header({
  onMenuClick,
  onToggleSidebar,
  sidebarCollapsed,
}: {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nop = searchParams.get("nop");
  const tahun = searchParams.get("tahun");

  const baseTitle =
    titleMap[pathname] ??
    (pathname.startsWith("/sppt/") ? "Detail SPPT" : "EPBB");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Buka navigasi"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleSidebar}
          aria-expanded={!sidebarCollapsed}
          aria-label={sidebarCollapsed ? "Bentangkan sidebar" : "Ciutkan sidebar"}
          title={sidebarCollapsed ? "Bentangkan" : "Ciutkan"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold lg:text-base">{baseTitle}</h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {nop ? (
              <>
                NOP: <span className="font-mono font-medium text-foreground">{formatNopDotted(nop)}</span>
                {tahun && <> · Tahun {tahun}</>}
              </>
            ) : (
              "Sistem Informasi Pajak Bumi dan Bangunan"
            )}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {nop && (
          <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 md:flex">
            <Search className="h-3.5 w-3.5 text-primary" aria-hidden />
            <span className="font-mono text-xs font-medium">
              {nop.slice(0, 4)}...{nop.slice(-4)} · {tahun ?? "-"}
            </span>
          </div>
        )}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
          title="Badan Keuangan"
        >
          BK
        </div>
      </div>
    </header>
  );
}
