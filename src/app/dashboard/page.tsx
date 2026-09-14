"use client";

import Link from "next/link";
import { Search, Landmark, FileStack } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Dashboard kini hanya pintu masuk (landing minimal).
 * Hasil pencarian ditampilkan di /hasil_data.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="h-1 bg-primary" />
        <div className="space-y-5 p-6 lg:p-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Landmark className="h-4 w-4 text-primary" />
            <span>Register pajak daerah</span>
            <span className="opacity-50">·</span>
            <span>Badan Keuangan</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-tight lg:text-3xl">
              Cari satu nomor, buka satu berkas.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Masukkan 18 digit NOP per bagiannya dan tahun pajak. Hasilnya
              dibuka di lembar hasil, bukan di sini.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/pencarian">
                <Search />
                Cari data
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <FileStack className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
