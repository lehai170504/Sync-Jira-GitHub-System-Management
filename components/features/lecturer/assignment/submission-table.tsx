"use client";

import { useState } from "react";
import { Search, MoreHorizontal, FileText, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubmissionTableProps {
  isGroup: boolean;
  data: any[];
}

export function SubmissionTable({ isGroup, data }: SubmissionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    if (isGroup) {
      return item.teamName.toLowerCase().includes(searchLower);
    }
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.code.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50/50 border-b border-gray-100">
        <CardTitle className="text-base font-bold text-gray-700">
          {isGroup ? "Các nhóm dự án" : "Danh sách sinh viên"}
        </CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={isGroup ? "Tìm tên nhóm..." : "Tìm tên sinh viên..."}
            className="pl-9 bg-white border-gray-200 rounded-lg focus:border-[#F27124] focus:ring-1 focus:ring-orange-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px] pl-6 py-3">
                {isGroup ? "Thông tin Nhóm" : "Sinh viên"}
              </TableHead>
              <TableHead>
                {isGroup ? "Người nộp (Leader)" : "Thời gian nộp"}
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>
                {isGroup ? "Sản phẩm (Artifacts)" : "File đính kèm"}
              </TableHead>
              <TableHead className="text-center w-[100px]">Điểm số</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item: any) => (
              <TableRow
                key={item.id}
                className="hover:bg-orange-50/10 transition-colors group"
              >
                {/* COLUMN 1: NAME */}
                <TableCell className="pl-6 py-4">
                  {isGroup ? (
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {item.teamName}
                      </span>
                      <div className="flex -space-x-2 overflow-hidden pl-1">
                        {item.members.map((mem: string, idx: number) => (
                          <TooltipProvider key={idx}>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="h-6 w-6 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 cursor-default select-none">
                                  {mem.charAt(0)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{mem}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-gray-100">
                        <AvatarFallback className="bg-orange-50 text-[#F27124] text-xs font-bold">
                          {item.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">{item.code}</p>
                      </div>
                    </div>
                  )}
                </TableCell>

                {/* COLUMN 2: SUBMITTER */}
                <TableCell className="text-gray-600 text-sm">
                  {isGroup ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">
                        {item.submittedBy}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.submittedAt}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium">
                      {item.submittedAt}
                    </span>
                  )}
                </TableCell>

                {/* COLUMN 3: STATUS */}
                <TableCell>
                  {item.status === "On Time" && (
                    <Badge
                      variant="outline"
                      className="text-green-600 bg-green-50 border-green-100 px-2 py-0.5"
                    >
                      Đúng hạn
                    </Badge>
                  )}
                  {item.status === "Late" && (
                    <Badge
                      variant="outline"
                      className="text-orange-600 bg-orange-50 border-orange-100 px-2 py-0.5"
                    >
                      Trễ hạn
                    </Badge>
                  )}
                  {item.status === "Missing" && (
                    <Badge
                      variant="outline"
                      className="text-red-600 bg-red-50 border-red-100 px-2 py-0.5"
                    >
                      Chưa nộp
                    </Badge>
                  )}
                </TableCell>

                {/* COLUMN 4: FILES */}
                <TableCell>
                  {isGroup ? (
                    <div className="flex gap-2">
                      {item.repoUrl && (
                        <a
                          href={item.repoUrl}
                          target="_blank"
                          className="flex items-center gap-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-200 transition-all"
                        >
                          <Github className="h-3.5 w-3.5" /> Repo
                        </a>
                      )}
                      {item.docsUrl && (
                        <a
                          href="#"
                          className="flex items-center gap-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 text-xs font-medium px-2.5 py-1.5 rounded-md border border-blue-100 transition-all"
                        >
                          <FileText className="h-3.5 w-3.5" /> Docs
                        </a>
                      )}
                      {!item.repoUrl && !item.docsUrl && (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </div>
                  ) : item.file ? (
                    <div className="flex items-center gap-2 group/file cursor-pointer">
                      <div className="p-1.5 bg-blue-50 rounded text-blue-600 group-hover/file:bg-blue-100 transition-colors">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span
                        className="text-sm text-gray-600 hover:text-blue-600 hover:underline decoration-blue-300 underline-offset-2 transition-all truncate max-w-[120px]"
                        title={item.file}
                      >
                        {item.file}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-300 text-sm">-</span>
                  )}
                </TableCell>

                {/* COLUMN 5: GRADE */}
                <TableCell className="text-center">
                  {item.status !== "Missing" ? (
                    <Input
                      defaultValue={item.grade?.toString()}
                      className="h-9 w-16 text-center mx-auto font-bold text-gray-900 border-gray-200 focus:border-[#F27124] focus:ring-1 focus:ring-orange-200 bg-white"
                      placeholder="--"
                    />
                  ) : (
                    <span className="text-gray-300 text-sm">-</span>
                  )}
                </TableCell>

                {/* COLUMN 6: ACTION */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
