"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle, GitCommit } from "lucide-react";
import type { CommitItem, CommitDetail } from "./types";
import { getValidation } from "./utils";

interface CommitDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commit: CommitItem | undefined;
  detail: CommitDetail | undefined;
}

export function CommitDetailModal({
  open,
  onOpenChange,
  commit,
  detail,
}: CommitDetailModalProps) {
  if (!commit) return null;

  const validation = getValidation(commit.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b-2 bg-gradient-to-r from-purple-50 to-indigo-50 -m-6 mb-0 p-6">
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GitCommit className="h-5 w-5 text-purple-600" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Chi tiết Commit
            </span>
          </DialogTitle>
          <DialogDescription className="pt-2 flex items-center gap-2 text-sm">
            <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono text-xs">
              {commit.id}
            </code>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium text-foreground">{commit.author}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{commit.date}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="border-2 rounded-lg flex-1 overflow-hidden bg-gradient-to-br from-white to-purple-50/20">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* COMMIT MESSAGE */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded">
                    <GitCommit className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Commit Message</h3>
                </div>
                <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                  <p className="text-sm text-foreground leading-relaxed">{commit.message}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs border-purple-200 text-purple-700 bg-purple-50">
                    {commit.branch}
                  </Badge>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={
                            "text-xs font-medium " +
                            (validation.status === "valid"
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                              : "border-red-300 text-red-700 bg-red-50")
                          }
                        >
                          {validation.status === "valid" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1.5" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1.5" />
                          )}
                          {validation.label}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs">
                          <div className="font-semibold">{validation.label}</div>
                          {validation.reason ? <div className="mt-1">{validation.reason}</div> : null}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {detail && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
                      <span className="text-xs text-muted-foreground">LOC:</span>
                      <span className="text-xs font-semibold text-emerald-700">+{detail.totalAdd}</span>
                      <span className="text-xs text-muted-foreground">/</span>
                      <span className="text-xs font-semibold text-red-700">-{detail.totalDel}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* FILES TABLE */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded">
                    <GitCommit className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Files Changed</h3>
                  {detail && (
                    <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700">
                      {detail.files.length} files
                    </Badge>
                  )}
                </div>
                <div className="border-2 rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50/50">
                        <TableHead className="font-semibold">File Path</TableHead>
                        <TableHead className="text-right font-semibold">+ Additions</TableHead>
                        <TableHead className="text-right font-semibold">- Deletions</TableHead>
                        <TableHead className="text-right font-semibold">Net Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!detail || detail.files.length === 0) && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-sm text-muted-foreground"
                          >
                            Không có dữ liệu file/LOC (mock).
                          </TableCell>
                        </TableRow>
                      )}
                      {detail?.files.map((f) => (
                        <TableRow key={f.path} className="hover:bg-purple-50/30">
                          <TableCell>
                            <code className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded">
                              {f.path}
                            </code>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-emerald-700 font-semibold text-sm">+{f.additions}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-red-700 font-semibold text-sm">-{f.deletions}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-semibold text-sm ${f.additions - f.deletions >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                              {f.additions - f.deletions >= 0 ? "+" : ""}{f.additions - f.deletions}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

