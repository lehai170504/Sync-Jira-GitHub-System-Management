"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  count?: number;
  className?: string;
  /** Grid columns: default 3-column on desktop */
  cols?: 1 | 2 | 3 | 4;
  /** Show avatar circle in card */
  withAvatar?: boolean;
  /** Extra content lines */
  lines?: number;
}

export function CardSkeleton({
  count = 6,
  className,
  cols = 3,
  withAvatar = false,
  lines = 2,
}: CardSkeletonProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[cols];

  return (
    <div className={cn("grid gap-6", gridCols, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 space-y-4"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {withAvatar && (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          )}
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            {Array.from({ length: lines }).map((_, j) => (
              <Skeleton key={j} className="h-3 w-full" style={{ width: `${85 - j * 15}%` }} />
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
