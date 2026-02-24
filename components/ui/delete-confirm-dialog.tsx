"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemName?: string;
  subtitle?: string; // e.g. task key PROJ-123
  onConfirm: () => void;
  isLoading?: boolean;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  subtitle,
  onConfirm,
  isLoading = false,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 dark:bg-red-950/40">
              <Trash2 className="h-4 w-4 text-destructive" />
            </span>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
            {description}
          </AlertDialogDescription>
          {(itemName || subtitle) && (
            <div className="mt-3 space-y-1.5 rounded-lg border bg-muted/50 dark:bg-slate-800/70 dark:border-slate-700 p-3">
              {itemName && (
                <p className="font-medium text-foreground">{itemName}</p>
              )}
              {subtitle && (
                <p className="text-xs font-mono text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
