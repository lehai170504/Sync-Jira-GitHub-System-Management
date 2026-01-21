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
import { CheckCircle2, XCircle } from "lucide-react";
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Commit Detail</DialogTitle>
          <DialogDescription>
            <span className="font-mono">{commit.id}</span> •{" "}
            <span className="font-medium">{commit.author}</span> • {commit.date}
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-md flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-semibold">Message</div>
                <div className="text-sm text-muted-foreground">{commit.message}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {commit.branch}
                  </Badge>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={
                            "text-[11px] " +
                            (validation.status === "valid"
                              ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                              : "border-red-200 text-red-700 bg-red-50")
                          }
                        >
                          {validation.status === "valid" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
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
                    <div className="text-xs text-muted-foreground">
                      LOC:{" "}
                      <span className="font-semibold text-emerald-700">+{detail.totalAdd}</span>{" "}
                      <span className="font-semibold text-red-700">-{detail.totalDel}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="text-sm font-semibold">Files</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">+ Add</TableHead>
                    <TableHead className="text-right">- Del</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!detail || detail.files.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-sm text-muted-foreground"
                      >
                        Không có dữ liệu file/LOC (mock).
                      </TableCell>
                    </TableRow>
                  )}
                  {detail?.files.map((f) => (
                    <TableRow key={f.path}>
                      <TableCell className="font-mono text-xs">{f.path}</TableCell>
                      <TableCell className="text-right text-emerald-700 font-semibold">
                        +{f.additions}
                      </TableCell>
                      <TableCell className="text-right text-red-700 font-semibold">
                        -{f.deletions}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {f.additions - f.deletions}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

