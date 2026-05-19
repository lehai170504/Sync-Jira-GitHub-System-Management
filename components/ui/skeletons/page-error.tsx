"use client";

import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PageErrorProps {
  title?: string;
  message?: string;
  /** Show a retry button that calls onRetry */
  onRetry?: () => void;
  /** Show a back button */
  backHref?: string;
  className?: string;
}

export function PageError({
  title = "Đã xảy ra lỗi",
  message = "Không thể tải dữ liệu. Vui lòng thử lại sau.",
  onRetry,
  backHref,
  className,
}: PageErrorProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[60vh] text-center px-6",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6 ring-1 ring-red-200/60 dark:ring-red-900/30">
        <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
      </div>

      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        {message}
      </p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
        )}
        {backHref && (
          <Button
            variant="outline"
            onClick={() => router.push(backHref)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        )}
      </div>
    </div>
  );
}
