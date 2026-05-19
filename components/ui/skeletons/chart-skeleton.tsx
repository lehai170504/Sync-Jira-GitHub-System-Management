"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  height?: string;
  className?: string;
}

export function ChartSkeleton({ height = "h-[300px]", className }: ChartSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6",
        className,
      )}
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      {/* Chart area */}
      <div className={cn("relative flex items-end gap-2 px-2", height)}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{
              height: `${30 + Math.random() * 70}%`,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <Skeleton className="h-2.5 w-14 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
