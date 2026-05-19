"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
  /** Show a header row */
  withHeader?: boolean;
}

export function TableSkeleton({
  rows = 8,
  cols = 5,
  className,
  withHeader = true,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 overflow-hidden">
        {withHeader && (
          <div className="flex items-center gap-4 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/80">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-3.5 rounded"
                style={{ width: `${40 + Math.random() * 30}%`, maxWidth: 180 }}
              />
            ))}
          </div>
        )}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {Array.from({ length: cols }).map((_, j) => (
                <Skeleton
                  key={j}
                  className="h-3 rounded"
                  style={{
                    width: j === 0 ? "35%" : `${20 + Math.random() * 20}%`,
                    maxWidth: j === 0 ? 240 : 120,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
