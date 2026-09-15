import { Skeleton } from "@/components/ui/Skeleton";

/* Meniru detail SPPT per NOP: tombol kembali + lembar arsip + kartu tabel */
export function SpptDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Skeleton className="h-8 w-24 rounded-md" />
      <div className="relative overflow-hidden rounded-xl border border-rule bg-paper p-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-seal" />
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="mt-3 h-7 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </div>
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="p-5 pb-3">
          <Skeleton className="h-4 w-44" />
        </div>
        <div className="space-y-3 p-5 pt-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
