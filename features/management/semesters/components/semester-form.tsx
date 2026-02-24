"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  Clock,
  CalendarDays,
  GraduationCap,
  Info,
  CalendarRange,
  Loader2,
  Code2,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {
  Semester,
  CreateSemesterPayload,
} from "@/features/management/semesters/api/semester-api";
import { Progress } from "@/components/ui/progress";

interface SemesterFormProps {
  activeSemester?: Semester;
  isCreating: boolean;
  onCreate: (data: CreateSemesterPayload) => void;
}

export function SemesterForm({
  activeSemester,
  isCreating,
  onCreate,
}: SemesterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    start_date: "",
    end_date: "",
  });

  // Tự động generate Code
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({ ...prev, name: val }));
    let codePrefix = "";
    if (val.includes("Spring")) codePrefix = "SP";
    else if (val.includes("Summer")) codePrefix = "SU";
    else if (val.includes("Fall")) codePrefix = "FA";
    else if (val.includes("Winter")) codePrefix = "WI";

    if (codePrefix) {
      const year = val.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        name: val,
        code: codePrefix + year,
      }));
    }
  };

  const handleSubmit = () => {
    onCreate(formData);
  };

  // Tính toán Progress Bar
  const calculateProgress = () => {
    if (!activeSemester) return 0;
    const start = new Date(activeSemester.start_date);
    const end = new Date(activeSemester.end_date);
    const today = new Date();
    const totalDays = differenceInDays(end, start);
    const daysPassed = differenceInDays(today, start);

    if (daysPassed < 0) return 0;
    if (daysPassed > totalDays) return 100;
    return Math.round((daysPassed / totalDays) * 100);
  };

  const progress = calculateProgress();

  return (
    <Card className="border-none shadow-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden font-sans transition-colors">
      <CardHeader className="pb-6 border-b border-slate-100 dark:border-slate-800 px-6 md:px-10 pt-8 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <CalendarRange className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Thiết lập Học kỳ
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Tạo học kỳ mới sẽ tự động đặt trạng thái là{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Open
                </span>{" "}
                và đóng học kỳ cũ.
              </CardDescription>
            </div>
          </div>

          {activeSemester && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Đang diễn ra: {activeSemester.code}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 px-6 md:px-10 py-8">
        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Tên Học kỳ
            </Label>
            <Input
              className="pl-4 h-12 text-sm font-semibold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all dark:text-slate-100"
              placeholder="Ví dụ: Spring 2026"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Code2 className="h-4 w-4" /> Mã (Code)
            </Label>
            <Input
              className="pl-4 h-12 font-mono font-bold text-sm bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl uppercase transition-all dark:text-slate-100"
              placeholder="SP2026"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Bắt đầu
            </Label>
            <Input
              type="date"
              className="pl-4 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl cursor-pointer text-sm font-medium dark:text-slate-100 dark:scheme-dark"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Kết thúc
            </Label>
            <Input
              type="date"
              className="pl-4 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl cursor-pointer text-sm font-medium dark:text-slate-100 dark:scheme-dark"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
            />
          </div>
        </div>

        {/* Progress Section (Chỉ hiện khi đã có kỳ học active) */}
        {activeSemester && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col gap-5 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
                  Tiến độ kỳ học hiện tại
                </span>
                <span className="text-slate-900 dark:text-slate-100 font-bold text-base">
                  {activeSemester.name}
                </span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-2xl leading-none">
                  {progress}%
                </span>
              </div>
            </div>

            <Progress
              value={progress}
              className="h-2 bg-slate-200 dark:bg-slate-700"
              indicatorColor="bg-emerald-500"
            />

            <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <span>
                {format(new Date(activeSemester.start_date), "dd/MM/yyyy")}
              </span>
              <span>
                {format(new Date(activeSemester.end_date), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 p-6 md:px-10 flex justify-end transition-colors">
        <Button
          size="lg"
          disabled={isCreating || !formData.name || !formData.code}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Đang tạo...</span>
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              <span>Xác nhận Lưu</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
