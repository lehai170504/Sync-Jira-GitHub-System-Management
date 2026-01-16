"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Types
interface Student {
  id: number;
  name: string;
  roll: string;
}

interface ScoreBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classCode: string;
  students: Student[];
}

export function ScoreBoardDialog({
  isOpen,
  onOpenChange,
  classCode,
  students,
}: ScoreBoardDialogProps) {
  const studentsWithScores = useMemo(() => {
    return students.map((s) => {
      const progress = Math.floor(Math.random() * 3) + 7;
      const midterm = Math.floor(Math.random() * 4) + 6;
      const final = Math.floor(Math.random() * 5) + 5;
      const total = parseFloat(
        (progress * 0.3 + midterm * 0.3 + final * 0.4).toFixed(1)
      );

      return {
        ...s,
        scores: { progress, midterm, final, total },
      };
    });
  }, [students]);

  const handleExportExcel = () => {
    try {
      const exportData = studentsWithScores.map((std, index) => ({
        STT: index + 1,
        "Họ và Tên": std.name,
        MSSV: std.roll,
        "Điểm Quá Trình (30%)": std.scores.progress,
        "Điểm Giữa Kỳ (30%)": std.scores.midterm,
        "Điểm Cuối Kỳ (40%)": std.scores.final,
        "Tổng Kết": std.scores.total,
        "Trạng Thái": std.scores.total >= 5 ? "Đạt" : "Trượt",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const wscols = [
        { wch: 5 },
        { wch: 25 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
      ];
      worksheet["!cols"] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng Điểm");
      XLSX.writeFile(workbook, `Bang_Diem_Lop_${classCode}.xlsx`);

      toast.success("Đã xuất file Excel thành công!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Xuất file thất bại, vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* --- CẬP NHẬT CSS Ở ĐÂY --- */}
      {/* max-w-[98vw]: Rộng 98% bề ngang màn hình (gần như full) */}
      {/* h-[80vh]: Cao 80% màn hình (giảm bớt height để nhìn giống widescreen) */}
      <DialogContent className="max-w-[98vw] w-full h-[80vh] flex flex-col p-0 rounded-2xl overflow-hidden bg-white shadow-2xl border-none">
        {/* HEADER */}
        <DialogHeader className="p-6 pb-4 border-b bg-gray-50/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-200">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                  Bảng điểm Lớp {classCode}
                </DialogTitle>
                <DialogDescription className="mt-1 text-gray-500 font-medium">
                  Chi tiết điểm thành phần của{" "}
                  <span className="text-gray-900 font-bold">
                    {students.length}
                  </span>{" "}
                  sinh viên.
                </DialogDescription>
              </div>
            </div>

            <Button
              onClick={handleExportExcel}
              className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all h-10 px-6 rounded-lg font-medium"
            >
              <Download className="mr-2 h-4 w-4" /> Xuất Excel (.xlsx)
            </Button>
          </div>
        </DialogHeader>

        {/* TABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100/90 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                <TableRow className="hover:bg-transparent border-b border-gray-200">
                  <TableHead className="font-bold text-gray-700 w-[60px] text-center h-12">
                    STT
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 min-w-[250px]">
                    Sinh viên
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 min-w-[120px]">
                    MSSV
                  </TableHead>
                  <TableHead className="text-center font-bold text-blue-700 bg-blue-50/50 min-w-[100px]">
                    Quá trình (30%)
                  </TableHead>
                  <TableHead className="text-center font-bold text-blue-700 bg-blue-50/50 min-w-[100px]">
                    Giữa kỳ (30%)
                  </TableHead>
                  <TableHead className="text-center font-bold text-purple-700 bg-purple-50/50 min-w-[100px]">
                    Cuối kỳ (40%)
                  </TableHead>
                  <TableHead className="text-right font-bold text-green-700 bg-green-50/50 pr-8 min-w-[100px]">
                    Tổng kết
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsWithScores.map((std, index) => (
                  <TableRow
                    key={std.id}
                    className="hover:bg-orange-50/20 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="text-center text-muted-foreground font-medium py-4">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-orange-100 to-orange-200 text-[#F27124] font-bold">
                            {std.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-900 font-semibold">
                          {std.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-500 font-medium bg-gray-50/50">
                      {std.roll}
                    </TableCell>

                    <TableCell className="text-center text-gray-700 bg-blue-50/10 font-medium text-base">
                      {std.scores.progress}
                    </TableCell>
                    <TableCell className="text-center text-gray-700 bg-blue-50/10 font-medium text-base">
                      {std.scores.midterm}
                    </TableCell>
                    <TableCell className="text-center text-gray-700 bg-purple-50/10 font-medium text-base">
                      {std.scores.final}
                    </TableCell>

                    <TableCell className="text-right bg-green-50/20 pr-6">
                      <span
                        className={`inline-flex items-center justify-center h-8 w-12 rounded-lg font-bold text-sm shadow-sm ${
                          std.scores.total >= 5
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {std.scores.total}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
