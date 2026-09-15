import { Skeleton } from "@/components/ui/Skeleton";

/* Isi tabel Data SPPT saat memuat: baris header kolom + 6 baris isi.
   Dipasang di dalam Card yang sudah ada di halaman. */
export function SpptListSkeleton() {
  return (
    <div>
      <div className="flex gap-4 border-b border-border px-6 py-2.5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="hidden h-3 flex-1 md:block" />
        <Skeleton className="hidden h-3 w-14 sm:block" />
        <Skeleton className="ml-auto h-3 w-12" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border px-6 py-3.5 last:border-0"
        >
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="hidden h-3.5 flex-1 md:block" />
          <Skeleton className="hidden h-3.5 w-16 sm:block" />
          <Skeleton className="ml-auto h-7 w-14 rounded-md" />
        </div>
      ))}
    </div>
  );
}
