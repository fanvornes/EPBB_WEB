import { Skeleton } from "@/components/ui/Skeleton";

/* Fallback navigasi antar route — meniru AppShell: sidebar + header + isi */
export function RouteLoadingSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 left-0 hidden w-[260px] flex-col gap-2 border-r border-rule bg-card p-4 lg:flex">
        <Skeleton className="h-10 w-3/4" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
      </div>
      <div className="lg:pl-[260px]">
        <div className="flex h-16 items-center gap-3 border-b border-rule bg-card px-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="ml-auto h-6 w-44 rounded-full" />
        </div>
        <div className="space-y-4 p-6">
          <Skeleton className="h-28 w-full" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
