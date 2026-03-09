"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, GitCommit, FileCode, AlertCircle } from "lucide-react";
import type { CommitItem } from "./types";
import { getCommitDetailsApi } from "@/features/integration/api/github-commit-details-api";
import type { CommitDetailFile } from "@/features/integration/api/github-commit-details-api";
import { PatchViewer } from "./components/patch-viewer";

interface CommitPatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commit: CommitItem | undefined;
  repoUrl: string | undefined;
}

export function CommitPatchModal({
  open,
  onOpenChange,
  commit,
  repoUrl,
}: CommitPatchModalProps) {
  const [files, setFiles] = useState<CommitDetailFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !commit || !repoUrl) {
      setFiles([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCommitDetailsApi(commit.id, repoUrl)
      .then((res) => {
        if (!cancelled) {
          setFiles(res.files ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Không thể tải chi tiết commit.",
          );
          setFiles([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, commit?.id, repoUrl]);

  if (!commit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[90vw] lg:max-w-[1280px] h-[80vh] overflow-hidden flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <DialogHeader className="pb-4 border-b-2 border-purple-100 dark:border-purple-900/40 bg-linear-to-r from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/80 -m-6 mb-0 p-6">
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <GitCommit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Xem chi tiết Patch
            </span>
          </DialogTitle>
          <DialogDescription className="pt-2 flex items-center gap-2 text-sm">
            <code className="bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-200 px-2 py-1 rounded font-mono text-xs">
              {commit.id.substring(0, 7)}
            </code>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium text-foreground">{commit.message}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden border-2 border-slate-200 dark:border-slate-800 rounded-lg flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Đang tải patch...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-10 w-10" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
              <FileCode className="h-10 w-10 opacity-50" />
              <p className="text-sm">Không có thay đổi trong commit này.</p>
            </div>
          ) : (
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-6 pr-4">
                {files.map((f) => (
                  <div key={f.path} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <code className="text-sm font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded">
                        {f.path}
                      </code>
                      {(f.additions != null || f.deletions != null) && (
                        <span className="text-xs text-muted-foreground">
                          +{f.additions ?? 0} / -{f.deletions ?? 0}
                        </span>
                      )}
                    </div>
                    {f.patch ? (
                      <PatchViewer patch={f.patch} />
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Không có nội dung patch
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
