"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Save,
  AlertCircle,
  Clock,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export function SemesterTab() {
  const [config, setConfig] = useState({
    semesterName: "Spring 2026",
    startDate: "2026-01-05",
    endDate: "2026-04-30",
  });

  const handleSaveConfig = () => {
    toast.success("Đã cập nhật cấu hình Học kỳ thành công!");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* LEFT: ACTIVE SEMESTER CONFIG */}
      <Card className="lg:col-span-2 border-none shadow-lg bg-white ring-1 ring-gray-100 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b bg-gray-50/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#F27124]">
                  <Clock className="h-6 w-6" />
                </div>
                Thiết lập thời gian
              </CardTitle>
              <CardDescription className="mt-2 text-gray-500">
                Học kỳ đang hoạt động sẽ được dùng để tính deadline hệ thống.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5 rounded-full font-medium"
            >
              Active Semester
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-8 px-8">
          <div className="grid gap-3">
            <Label className="text-base font-medium text-gray-700">
              Tên Học kỳ
            </Label>
            <div className="relative group">
              <GraduationCap className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
              <Input
                className="pl-11 h-12 text-lg font-medium border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
                value={config.semesterName}
                onChange={(e) =>
                  setConfig({ ...config, semesterName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-3">
              <Label className="text-gray-700">Ngày Bắt đầu</Label>
              <div className="relative group">
                <CalendarDays className="absolute left-3.5 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
                <Input
                  type="date"
                  className="pl-11 h-11 border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
                  value={config.startDate}
                  onChange={(e) =>
                    setConfig({ ...config, startDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-3">
              <Label className="text-gray-700">Ngày Kết thúc</Label>
              <div className="relative group">
                <CalendarDays className="absolute left-3.5 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
                <Input
                  type="date"
                  className="pl-11 h-11 border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
                  value={config.endDate}
                  onChange={(e) =>
                    setConfig({ ...config, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Alert className="bg-amber-50 border-amber-200 rounded-xl">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold ml-2">
              Quy tắc hệ thống
            </AlertTitle>
            <AlertDescription className="text-amber-700 text-sm mt-1 ml-2 leading-relaxed">
              Hệ thống sẽ tự động khóa các bài nộp (submissions) sau 23:59 của
              ngày <span className="font-bold">{config.endDate}</span>. Sinh
              viên không thể nộp bài sau thời gian này trừ khi được Admin mở
              quyền riêng.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="bg-gray-50/50 border-t p-6 flex justify-end">
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 rounded-full px-8 h-11 font-medium transition-all hover:scale-105 active:scale-95"
            onClick={handleSaveConfig}
          >
            <Save className="mr-2 h-4 w-4" /> Lưu cấu hình
          </Button>
        </CardFooter>
      </Card>

      {/* RIGHT: HISTORY */}
      <Card className="border-none shadow-lg bg-white ring-1 ring-gray-100 h-fit rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 bg-gray-50/30 border-b">
          <CardTitle className="text-lg text-gray-800">Lịch sử</CardTitle>
          <CardDescription>Các học kỳ đã qua</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="pl-6 font-semibold">Học kỳ</TableHead>
                <TableHead className="text-right pr-6 font-semibold">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-orange-50/40 hover:bg-orange-50/60 transition-colors cursor-default border-orange-100">
                <TableCell className="pl-6 py-4">
                  <div className="font-bold text-gray-900 text-base">
                    Spring 2026
                  </div>
                  <div className="text-xs font-medium text-orange-600/80 mt-0.5">
                    05/01 - 30/04
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Badge className="bg-green-500 hover:bg-green-600 shadow-sm border-0 rounded-full px-3">
                    Active
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition-colors cursor-default border-gray-100">
                <TableCell className="pl-6 py-4 opacity-70">
                  <div className="font-medium text-gray-700">Fall 2025</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    05/09 - 30/12
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    Closed
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition-colors cursor-default border-0">
                <TableCell className="pl-6 py-4 opacity-70">
                  <div className="font-medium text-gray-700">Summer 2025</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    05/05 - 30/08
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    Closed
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
