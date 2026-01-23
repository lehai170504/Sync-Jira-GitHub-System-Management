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
    <Card className="lg:col-span-8 border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
      <CardHeader className="pb-8 border-b border-slate-100 px-8 pt-8">
        <div className="flex items-start justify-between">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#F27124] ring-4 ring-orange-100">
              <CalendarRange className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Tạo Học kỳ Mới
              </CardTitle>
              <CardDescription className="mt-2 text-slate-500 text-base max-w-lg leading-relaxed">
                Tạo học kỳ mới sẽ tự động đặt trạng thái là{" "}
                <strong className="text-green-600">OPEN</strong> và đóng học kỳ
                cũ.
              </CardDescription>
            </div>
          </div>

          {activeSemester && (
            <div className="hidden xl:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold tracking-wide">
                Đang diễn ra: {activeSemester.code}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-3">
            <Label className="text-sm font-semibold text-slate-700 ml-1">
              Tên Học kỳ
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F27124] transition-colors">
                <GraduationCap className="h-5 w-5" />
              </div>
              <Input
                className="pl-12 h-14 text-lg font-medium bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-4 focus:ring-[#F27124]/10 rounded-2xl transition-all"
                placeholder="Ví dụ: Spring 2026"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 ml-1">
              Mã (Code)
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F27124] transition-colors">
                <Code2 className="h-5 w-5" />
              </div>
              <Input
                className="pl-12 h-14 font-mono font-bold text-lg bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-4 focus:ring-[#F27124]/10 rounded-2xl uppercase transition-all"
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 ml-1">
              Ngày bắt đầu
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F27124] transition-colors">
                <CalendarDays className="h-5 w-5" />
              </div>
              <Input
                type="date"
                className="pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-4 focus:ring-[#F27124]/10 rounded-2xl cursor-pointer text-base"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 ml-1">
              Ngày kết thúc
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F27124] transition-colors">
                <Clock className="h-5 w-5" />
              </div>
              <Input
                type="date"
                className="pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-4 focus:ring-[#F27124]/10 rounded-2xl cursor-pointer text-base"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {activeSemester && (
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">
                  Hiện tại
                </span>
                <span className="text-slate-900 font-bold text-lg">
                  {activeSemester.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#F27124] font-black text-3xl">
                  {progress}%
                </span>
                <span className="text-slate-400 text-xs font-medium block">
                  Hoàn thành
                </span>
              </div>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-[#F27124] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(242,113,36,0.3)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>
                {format(new Date(activeSemester.start_date), "dd/MM/yyyy")}
              </span>
              <span>
                {format(new Date(activeSemester.end_date), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100/50 text-blue-900">
          <Info className="h-6 w-6 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <span className="font-bold block mb-1 text-blue-700">
              Lưu ý quan trọng
            </span>
            Khi bạn bấm tạo, hệ thống sẽ tự động chuyển học kỳ hiện tại (nếu có)
            sang trạng thái <strong>CLOSED</strong>.
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 p-8 flex justify-end">
        <Button
          size="lg"
          disabled={isCreating || !formData.name || !formData.code}
          onClick={handleSubmit}
          className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20 rounded-xl px-10 h-12 text-base font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px]"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              <span>Tạo Học kỳ</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
