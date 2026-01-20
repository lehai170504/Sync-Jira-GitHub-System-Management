"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
import {
  Save,
  Clock,
  CalendarDays,
  GraduationCap,
  History,
  Info,
  CheckCircle2,
  CalendarRange,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function SemesterTab() {
  const [config, setConfig] = useState({
    semesterName: "Spring 2026",
    startDate: "2026-01-05",
    endDate: "2026-04-30",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveConfig = async () => {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Đã lưu thành công!");
    } catch (error) {
      toast.error("Lỗi khi lưu.");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = 35;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Quản lý Học kỳ
            </h1>
            <p className="text-slate-500 mt-1">
              Thiết lập thời gian và theo dõi lịch sử các kỳ học.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT: ACTIVE SEMESTER CONFIG (Chiếm 8 phần) */}
          <Card className="lg:col-span-8 border-none shadow-sm bg-white rounded-3xl overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-6 border-b border-slate-100 px-8 pt-8">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#F27124] ring-4 ring-orange-50/50">
                    <CalendarRange className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Cấu hình hiện tại
                    </CardTitle>
                    <CardDescription className="mt-1.5 text-slate-500 text-sm max-w-md leading-relaxed">
                      Thiết lập thời gian cho học kỳ đang diễn ra. Hệ thống sẽ
                      dựa vào mốc này để tính toán deadline.
                    </CardDescription>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-semibold">Active</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 py-8">
              {/* Semester Name Input */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Tên Học kỳ
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#F27124] transition-colors">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-12 h-12 text-lg font-medium bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-4 focus:ring-[#F27124]/10 rounded-2xl transition-all placeholder:text-slate-400"
                    placeholder="Ví dụ: Spring 2026"
                    value={config.semesterName}
                    onChange={(e) =>
                      setConfig({ ...config, semesterName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Date Range Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Ngày bắt đầu
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#F27124] transition-colors">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <Input
                      type="date"
                      className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-4 focus:ring-[#F27124]/10 rounded-2xl transition-all cursor-pointer"
                      value={config.startDate}
                      onChange={(e) =>
                        setConfig({ ...config, startDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Ngày kết thúc
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#F27124] transition-colors">
                      <Clock className="h-5 w-5" />
                    </div>
                    <Input
                      type="date"
                      className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-4 focus:ring-[#F27124]/10 rounded-2xl transition-all cursor-pointer"
                      value={config.endDate}
                      onChange={(e) =>
                        setConfig({ ...config, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Visual Progress Indicator (Optional but nice) */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">
                    Tiến độ học kỳ
                  </span>
                  <span className="text-[#F27124] font-bold">{progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-[#F27124] rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 text-center mt-1">
                  Học kỳ đang diễn ra đúng tiến độ
                </p>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-blue-900">
                <Info className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <span className="font-semibold block mb-1">
                    Lưu ý quan trọng
                  </span>
                  Hệ thống sẽ tự động khóa các bài nộp sau{" "}
                  <strong>23:59</strong> ngày <strong>{config.endDate}</strong>.
                  Sinh viên sẽ không thể nộp bài sau thời gian này trừ khi được
                  cấp quyền đặc biệt.
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end">
              <Button
                size="lg"
                disabled={isLoading}
                onClick={handleSaveConfig}
                className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20 rounded-xl px-8 font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* RIGHT: HISTORY (Chiếm 4 phần) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="border-none shadow-sm bg-white rounded-3xl h-fit overflow-hidden">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <History className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Lịch sử
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-[500px] overflow-y-auto custom-scrollbar">
                <Table>
                  <TableBody>
                    {/* Active Row */}
                    <TableRow className="border-l-4 border-l-[#F27124] bg-orange-50/30 hover:bg-orange-50/50 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">
                            Spring 2026
                          </span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-none text-[10px] px-2 h-5">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5">
                          <CalendarDays className="h-3 w-3" />
                          05/01 - 30/04/2026
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Past Row 1 */}
                    <TableRow className="border-l-4 border-l-transparent hover:bg-slate-50 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                            Fall 2025
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-500">
                          05/09 - 30/12/2025
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Past Row 2 */}
                    <TableRow className="border-l-4 border-l-transparent hover:bg-slate-50 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                            Summer 2025
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-500">
                          05/05 - 30/08/2025
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Past Row 3 */}
                    <TableRow className="border-l-4 border-l-transparent hover:bg-slate-50 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                            Spring 2025
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-500">
                          05/01 - 30/04/2025
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
