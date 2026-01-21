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
import { CheckCircle2, XCircle, GitCommit } from "lucide-react";
import type { CommitItem } from "./types";
import { getValidation } from "./utils";

interface CommitListTableProps {
  commits: CommitItem[];
  onCommitClick: (commitId: string) => void;
}

export function CommitListTable({ commits, onCommitClick }: CommitListTableProps) {
  return (
    <Card className="border-2 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <GitCommit className="h-4 w-4 text-purple-600" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Danh sách commit
          </span>
          <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700">
            {commits.length} commit
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <TooltipProvider delayDuration={0}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[140px] font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Mã commit</TableHead>
                  <TableHead className="font-semibold">Nội dung</TableHead>
                  <TableHead className="font-semibold">Tác giả</TableHead>
                  <TableHead className="font-semibold">Branch</TableHead>
                  <TableHead className="font-semibold">Ngày</TableHead>
                  <TableHead className="text-right font-semibold">Loại</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <GitCommit className="h-8 w-8 opacity-50" />
                        <p className="text-sm font-medium">Không có commit trong khoảng thời gian này</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {commits.map((c) => {
                  const v = getValidation(c.id);
                  return (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-purple-50/50 transition-colors group"
                      onClick={() => onCommitClick(c.id)}
                    >
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center gap-2">
                              {v.status === "valid" ? (
                                <div className="p-1.5 bg-emerald-100 rounded-lg">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                </div>
                              ) : (
                                <div className="p-1.5 bg-red-100 rounded-lg">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </div>
                              )}
                              <span className={`text-xs font-medium ${v.status === "valid" ? "text-emerald-700" : "text-red-700"}`}>
                                {v.label}
                              </span>
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
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-purple-700">
                          {c.id.substring(0, 7)}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium max-w-md truncate">{c.message}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                            {c.author.charAt(0)}
                          </div>
                          <span className="text-sm">{c.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-mono border-purple-200 text-purple-700 bg-purple-50">
                          {c.branch}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="text-[11px] bg-indigo-100 text-indigo-700 border-indigo-200">
                          NEW
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

