"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KanbanSkeletonProps {
  columns?: number;
  cardsPerColumn?: number;
  className?: string;
}

export function KanbanSkeleton({
  columns = 4,
  cardsPerColumn = 4,
  className,
}: KanbanSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4", className)}>
      {Array.from({ length: columns }).map((_, ci) => (
        <div
          key={ci}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 space-y-3"
          style={{ animationDelay: `${ci * 100}ms` }}
        >
          {/* Column header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>

          {/* Cards */}
          <div className="space-y-2.5">
            {Array.from({ length: cardsPerColumn }).map((_, ki) => (
              <div
                key={ki}
                className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900/80 p-3.5 space-y-3"
                style={{ animationDelay: `${ci * 100 + ki * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-8 rounded" />
                </div>
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3 w-4/5 rounded" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
