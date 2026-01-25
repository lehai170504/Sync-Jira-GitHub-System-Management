"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, History, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Semester } from "@/features/management/semesters/api/semester-api";

interface SemesterHistoryProps {
  activeSemester?: Semester;
  pastSemesters: Semester[];
  onSelect: (id: string) => void;
}

export function SemesterHistory({
  activeSemester,
  pastSemesters,
  onSelect,
}: SemesterHistoryProps) {
  return (
    <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden max-h-[85vh] flex flex-col">
      <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-100 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
            <History className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Lịch sử Kỳ học
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Danh sách các kỳ đã tạo
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
        <Table>
          <TableBody>
            {/* Active Row */}
            {activeSemester && (
              <TableRow
                className="border-l-[6px] border-l-[#F27124] bg-orange-50/40 hover:bg-orange-50/60"
                onClick={() => onSelect(activeSemester._id)}
              >
                <TableCell className="pl-6 py-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-base">
                      {activeSemester.name}
                    </span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-none text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-slate-500 gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {format(
                      new Date(activeSemester.start_date),
                      "dd/MM/yyyy",
                    )}{" "}
                    - {format(new Date(activeSemester.end_date), "dd/MM/yyyy")}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Past Rows */}
            {pastSemesters.length > 0
              ? pastSemesters.map((sem) => (
                  <TableRow
                    key={sem._id}
                    className="border-l-[6px] border-l-transparent hover:border-l-slate-200 hover:bg-slate-50 transition-all group cursor-default"
                    onClick={() => onSelect(sem._id)}
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                          {sem.name}
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                      </div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-500 font-medium">
                        {format(new Date(sem.start_date), "dd/MM/yyyy")} -{" "}
                        {format(new Date(sem.end_date), "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : !activeSemester && (
                  <TableRow>
                    <TableCell className="h-32 text-center text-slate-400 text-sm">
                      Chưa có dữ liệu nào
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
