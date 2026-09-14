"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Table2,
  Search,
  Users,
  MapPinned,
  BarChart3,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/Separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import * as React from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requiresSelection?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Utama",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Pencarian SPPT", href: "/pencarian", icon: Search },
      { label: "Hasil Data", href: "/hasil_data", icon: FileText, requiresSelection: true },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "Data SPPT", href: "/sppt", icon: Table2 },
      { label: "Wajib Pajak", href: "/wajib-pajak", icon: Users },
      { label: "Objek Pajak", href: "/objek-pajak", icon: MapPinned },
    ],
  },
  {
    title: "Pantau",
    items: [{ label: "Monitoring", href: "/monitoring", icon: BarChart3 }],
  },
];

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSelection = !!searchParams.get("nop");
  // Drawer mobile selalu tampil penuh; mode ikon hanya untuk desktop.
  const iconOnly = collapsed && !mobileOpen;

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onMobileClose]);

  const buildHref = (href: string) => {
    if (
      hasSelection &&
      (href === "/hasil_data" || href === "/wajib-pajak" || href === "/objek-pajak")
    ) {
      const nop = searchParams.get("nop");
      const tahun = searchParams.get("tahun");
      if (nop) return `${href}?nop=${nop}${tahun ? `&tahun=${tahun}` : ""}`;
    }
    return href;
  };

  return (
    <>
      {mobileOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        aria-label="Navigasi utama EPBB"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-card transition-[width,transform] duration-200 ease-out",
          iconOnly ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center gap-2 border-b border-border px-3",
            iconOnly && "flex-col justify-center gap-1 px-2 py-2",
          )}
        >
          <div className={cn("flex min-w-0 flex-1 items-center gap-2.5", iconOnly && "flex-none")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            {!iconOnly && (
              <div className="leading-tight">
                <p className="text-sm font-bold tracking-tight">EPBB</p>
                <p className="text-[11px] text-muted-foreground">Badan Keuangan</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={!iconOnly}
            aria-label={iconOnly ? "Bentangkan sidebar" : "Ciutkan sidebar"}
            title={iconOnly ? "Bentangkan" : "Ciutkan"}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:inline-flex"
          >
            {iconOnly ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Tutup navigasi"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Menu" className="flex-1 space-y-4 overflow-y-auto px-2 py-4">
          {navGroups.map((group, gi) => (
            <div key={group.title} className="space-y-1">
              {!iconOnly && (
                <p className="px-2 pb-1 text-[11px] font-medium text-muted-foreground">
                  {group.title}
                </p>
              )}
              {gi > 0 && iconOnly && <Separator className="mx-2" />}
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const disabled = !!item.requiresSelection && !hasSelection;
                const row = (
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary font-medium text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      disabled && !isActive && "opacity-50",
                      iconOnly && "justify-center px-0",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                    {!iconOnly && <span className="truncate">{item.label}</span>}
                  </span>
                );

                const wrapped = iconOnly ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {disabled && !isActive ? (
                        <span
                          aria-disabled
                          className="block cursor-not-allowed"
                          title="Cari NOP dulu di Pencarian"
                        >
                          {row}
                        </span>
                      ) : (
                        <Link
                          href={buildHref(item.href)}
                          onClick={onMobileClose}
                          aria-current={isActive ? "page" : undefined}
                          className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {row}
                        </Link>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {disabled && !isActive ? `${item.label} — cari NOP dulu` : item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : disabled && !isActive ? (
                  <span
                    key={item.href}
                    aria-disabled
                    className="block cursor-not-allowed"
                    title="Cari NOP dulu di Pencarian"
                  >
                    {row}
                  </span>
                ) : (
                  <Link
                    key={item.href}
                    href={buildHref(item.href)}
                    onClick={onMobileClose}
                    aria-current={isActive ? "page" : undefined}
                    className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {row}
                  </Link>
                );

                return wrapped;
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          {!iconOnly ? (
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs font-medium">Butuh bantuan?</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Masukkan NOP 18 digit + tahun di menu Pencarian untuk memulai.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <span
                title="Siap"
                className="h-2 w-2 rounded-full bg-primary"
                aria-hidden
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
