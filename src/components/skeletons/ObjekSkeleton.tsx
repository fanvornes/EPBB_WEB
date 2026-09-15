import { Skeleton } from "@/components/ui/Skeleton";

/* Meniru halaman Objek Pajak: judul + konteks NOP + kartu + 2 kotak luas */
export function ObjekSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-2/3" />
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="p-5 pb-3">
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="space-y-3 p-5 pt-0 text-sm">
          <div className="py-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1.5 h-4 w-4/5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-secondary/60 p-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-5 w-3/4" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-5 w-3/4" />
            </div>
          </div>
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}
