import { Skeleton } from "@/components/ui/Skeleton";

/* Meniru halaman Wajib Pajak: judul + konteks NOP + kartu detail WP */
export function WpSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="h-4 w-3/4" />
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="p-5 pb-3">
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="space-y-3 p-5 pt-0 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border py-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="py-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1.5 h-4 w-3/5" />
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-border py-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}
