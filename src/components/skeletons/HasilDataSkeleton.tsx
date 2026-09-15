import { Skeleton } from "@/components/ui/Skeleton";

/* Register hero — meniru lembar hasil: garis stempel + nama + NOP + badge */
function HasilHeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-rule bg-paper p-5 lg:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-seal" />
      <Skeleton className="h-3.5 w-44" />
      <Skeleton className="mt-3 h-7 w-2/3" />
      <Skeleton className="mt-2 h-8 w-1/2" />
      <div className="mt-3 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-40 rounded-full" />
      </div>
    </div>
  );
}

/* Kartu statistik — meniru StatCard: label + angka + ikon lingkaran */
function HasilStatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2.5 h-7 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

/* Kartu detail dua kolom — meniru Informasi WP / Objek */
function HasilDetailSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-5 pb-3">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-3 p-5 pt-0 text-sm">
        <div className="flex items-center justify-between gap-4 border-y border-border py-2.5">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-border py-2.5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-6 w-44" />
        </div>
        <div className="py-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

/* Tabel ringkasan — meniru header + 3 baris SPPT */
function HasilTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-5">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-3 w-72" />
      </div>
      <div className="px-5 pb-5">
        <div className="flex gap-4 border-b border-border py-2.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="hidden w-40 sm:block" />
          <Skeleton className="ml-auto h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border py-3.5 last:border-0">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="hidden h-3.5 flex-1 sm:block" />
            <Skeleton className="ml-auto h-3.5 w-14" />
            <Skeleton className="h-3.5 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HasilDataSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <HasilHeroSkeleton />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <HasilStatSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <HasilDetailSkeleton />
        <HasilDetailSkeleton />
      </div>
      <HasilTableSkeleton />
    </div>
  );
}
