"use client";

import { useSubjectDetail } from "../hooks/use-subject-detail";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  User,
  GraduationCap,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col h-dvh font-sans overflow-hidden border-l border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950">
        {/* --- HEADER --- */}
        <SheetHeader className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 shadow-sm z-10 text-left">
          <div className="flex flex-col gap-3 items-start">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#F27124]/10 dark:bg-[#F27124]/20 text-[#F27124] hover:bg-[#F27124]/15 border-none font-black text-[10px] tracking-widest px-2.5 py-1">
                {subject?.code || "CODE"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] uppercase tracking-widest border-slate-200 dark:border-slate-700",
                  subject?.status === "Active"
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400",
                )}
              >
                {subject?.status || "Status"}
              </Badge>
            </div>

            <div>
              <SheetTitle className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter leading-tight">
                {isLoading ? (
                  <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
                ) : (
                  subject?.name
                )}
              </SheetTitle>
              <SheetDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Chi tiết môn học và lịch sử vận hành lớp học
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* --- SCROLL CONTENT --- */}
        <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="h-full min-h-100 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#F27124] opacity-20" />
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
                Đang nạp dữ liệu môn học...
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-8 pb-20">
              {/* 1. THỐNG KÊ GRID */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={BookOpen}
                  label="Tổng số lớp"
                  value={stats?.total_classes}
                  color="blue"
                />
                <StatCard
                  icon={GraduationCap}
                  label="Số tín chỉ"
                  value={subject?.credits}
                  subText="Credits"
                  color="orange"
                />
                <StatCard
                  icon={Layers}
                  label="Số học kỳ"
                  value={stats?.total_semesters}
                  color="purple"
                />
                <StatCard
                  icon={User}
                  label="Giảng viên"
                  value={stats?.total_lecturers}
                  color="emerald"
                />
              </div>

              {/* 2. ADMIN & INFO */}
              <section className="space-y-4">
                {subject?.created_by_admin && (
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-white dark:border-slate-700 shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Người tạo (Admin)
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {subject.created_by_admin.full_name}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1 text-slate-400 dark:text-slate-500">
                    <FileText className="w-4 h-4" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Mô tả môn học
                    </h4>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {subject?.description || "Chưa có mô tả chi tiết."}
                  </div>
                </div>
              </section>

              <Separator className="bg-slate-200/60 dark:bg-slate-800" />

              {/* 3. DANH SÁCH LỚP */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                    Danh sách lớp ({classes?.length || 0})
                  </h4>
                  <Badge
                    variant="secondary"
                    className="rounded-lg font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    History
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {classes?.map((cls) => (
                    <div
                      key={cls._id}
                      className="group p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-[#F27124]/30 dark:hover:border-[#F27124]/50 hover:shadow-lg hover:shadow-orange-500/5 space-y-3"
                    >
                      {/* Class Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#F27124] font-black text-xs border border-slate-100 dark:border-slate-700">
                            {cls.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-[#F27124] transition-colors">
                              {cls.name}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                              {cls.class_code}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[9px] bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                        >
                          {cls.status}
                        </Badge>
                      </div>

                      <Separator className="bg-slate-50 dark:bg-slate-800" />

                      {/* Info Row: Semester & Lecturer */}
                      <div className="flex items-center justify-between">
                        {/* Semester Info */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {cls.semester_id?.name}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500">
                              {format(
                                new Date(cls.semester_id?.start_date),
                                "MM/yyyy",
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(cls.semester_id?.end_date),
                                "MM/yyyy",
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Lecturer Info */}
                        {cls.lecturer_id ? (
                          <div className="flex items-center gap-2 pl-4 border-l border-slate-100 dark:border-slate-800">
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {cls.lecturer_id.full_name}
                              </p>
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate max-w-20">
                                {cls.lecturer_id.email.split("@")[0]}
                              </p>
                            </div>
                            <Avatar className="h-8 w-8 border border-white dark:border-slate-700 shadow-sm">
                              <AvatarImage src={cls.lecturer_id.avatar_url} />
                              <AvatarFallback className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                {cls.lecturer_id.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            <User className="w-3 h-3" /> Chưa gán GV
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {classes?.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] bg-white/50 dark:bg-slate-900/50">
                      <p className="text-sm font-bold text-slate-300 dark:text-slate-600 italic">
                        Chưa có lớp nào vận hành môn học này.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- SUB COMPONENT (Đã update Dark Mode) ---
function StatCard({ icon: Icon, label, value, subText, color }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    orange:
      "bg-orange-50 text-[#F27124] dark:bg-orange-900/20 dark:text-orange-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div
        className={cn(
          "p-2 rounded-xl w-fit mb-2",
          colors[color as keyof typeof colors],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
            {value || 0}
          </p>
          {subText && (
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
              {subText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
