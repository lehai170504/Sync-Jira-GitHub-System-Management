"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle } from "lucide-react";
import type { CommitItem } from "./types";
import { getValidation } from "./utils";

interface CommitListTableProps {
  commits: CommitItem[];
  onCommitClick: (commitId: string) => void;
}

export function CommitListTable({ commits, onCommitClick }: CommitListTableProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Danh sách commit</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <TooltipProvider delayDuration={0}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Validation</TableHead>
                <TableHead>Mã commit</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commits.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                    Không có commit trong khoảng thời gian này.
                  </TableCell>
                </TableRow>
              )}
              {commits.map((c) => {
                const v = getValidation(c.id);
                return (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => onCommitClick(c.id)}
                  >
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-2">
                            {v.status === "valid" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-xs text-muted-foreground">{v.label}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-xs">
                            <div className="font-semibold">{v.label}</div>
                            {v.reason ? <div className="mt-1">{v.reason}</div> : null}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell className="font-medium">{c.message}</TableCell>
                    <TableCell>{c.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-mono">
                        {c.branch}
                      </Badge>
                    </TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-[11px] bg-slate-100 text-slate-700">
                        NEW
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

