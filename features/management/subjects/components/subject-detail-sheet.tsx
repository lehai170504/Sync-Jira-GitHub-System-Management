"use client";

import { useSubjectDetail } from "../hooks/use-subject-detail";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  User,
  ChevronRight,
} from "lucide-react";

interface SubjectDetailSheetProps {
  subjectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubjectDetailSheet({
  subjectId,
  open,
  onOpenChange,
}: SubjectDetailSheetProps) {
  const { data, isLoading } = useSubjectDetail(
    open && subjectId ? subjectId : undefined,
  );
  const { subject, classes, stats } = data || {};

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col h-[100dvh] overflow-hidden border-l border-slate-200 shadow-2xl">
        {/* --- HEADER CỐ ĐỊNH --- */}
        <SheetHeader className="p-6 border-b border-slate-100 bg-white shrink-0 shadow-sm z-10">
          <div className="flex flex-col gap-2 items-start">
            <Badge className="bg-[#F27124]/10 text-[#F27124] hover:bg-[#F27124]/15 border-none font-black text-[10px] tracking-widest px-2.5 py-1">
              {subject?.code || "SUBJECT"}
            </Badge>
            <SheetTitle className="text-3xl font-black text-slate-900 tracking-tighter leading-tight text-left">
              {isLoading ? "Đang tải..." : subject?.name}
            </SheetTitle>
            <SheetDescription className="text-sm font-medium text-slate-500">
              Chi tiết môn học và lịch sử vận hành lớp học
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* --- VÙNG CUỘN NỘI DUNG --- */}
        <ScrollArea className="flex-1 bg-slate-50/50">
          {isLoading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#F27124] opacity-20" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
                Đang nạp dữ liệu môn học...
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-10 pb-20">
              {/* 1. THỐNG KÊ NHANH */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Tổng số lớp
                  </p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">
                    {stats?.total_classes || 0}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Số học kỳ
                  </p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">
                    {stats?.total_semesters || 0}
                  </p>
                </div>
              </div>

              {/* 2. MÔ TẢ CHI TIẾT */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1 text-slate-400">
                  <FileText className="w-4 h-4" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Mô tả môn học
                  </h4>
                </div>
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm leading-relaxed text-sm text-slate-600 font-medium italic">
                  "
                  {subject?.description ||
                    "Môn học này hiện chưa có mô tả chi tiết từ quản trị viên."}
                  "
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* 3. DANH SÁCH LỚP VẬN HÀNH */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    Lịch sử lớp học ({classes?.length || 0})
                  </h4>
                  <Badge
                    variant="outline"
                    className="rounded-full bg-slate-900 text-white font-bold px-3 border-none"
                  >
                    DATA
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {classes?.map((cls: any) => (
                    <div
                      key={cls._id}
                      className="group flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 transition-all hover:border-[#F27124]/30 hover:shadow-lg hover:shadow-orange-500/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#F27124] font-black text-sm group-hover:bg-[#F27124] group-hover:text-white transition-all shadow-inner">
                          {cls.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-[#F27124] transition-colors">
                            {cls.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 font-bold">
                            <Calendar className="w-3 h-3" />
                            {cls.semester_id.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black text-slate-800 leading-none capitalize">
                            {cls.lecturer_id?.full_name || "Chưa gán"}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                            Giảng viên
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-white shadow-sm ring-1 ring-slate-100">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-[#F27124] transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}

                  {classes?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[32px] bg-white/50">
                      <p className="text-sm font-bold text-slate-300 italic">
                        Chưa có lớp nào vận hành môn học này.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
