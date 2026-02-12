"use client";

import { useSemesterDetails } from "@/features/management/semesters/hooks/use-semester-details";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Loader2,
  Calendar,
  BookOpen,
  GraduationCap,
  LayoutGrid,
  Info,
  User,
  GitBranch,
  Trello,
  MessageSquare,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ClassInSemester } from "@/features/management/semesters/types";

interface SemesterDetailSheetProps {
  semesterId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SemesterDetailSheet({
  semesterId,
  open,
  onOpenChange,
}: SemesterDetailSheetProps) {
  const { data: detailData, isLoading } = useSemesterDetails(
    open && semesterId ? semesterId : undefined,
  );

  const semester = detailData?.semester;
  const classes = detailData?.classes || [];
  const stats = detailData?.stats;

  // --- 👇 1. LOGIC TÍNH TOÁN TRẠNG THÁI (Realtime) ---
  const getComputedStatus = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // Reset giờ về 00:00:00 để so sánh chính xác theo ngày
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999); // End date tính đến cuối ngày

    if (now < start) {
      return {
        label: "Sắp diễn ra",
        className: "bg-blue-50 text-blue-600 border-blue-200",
      };
    } else if (now > end) {
      return {
        label: "Đã kết thúc",
        className: "bg-slate-100 text-slate-500 border-slate-200",
      };
    } else {
      return {
        label: "Đang diễn ra",
        className:
          "bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse", // Thêm animate-pulse cho sinh động
      };
    }
  };

  // Tính toán trạng thái ngay khi có data
  const statusInfo = semester
    ? getComputedStatus(semester.start_date, semester.end_date)
    : { label: "Unknown", className: "" };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 bg-white flex flex-col h-[100dvh] font-sans overflow-hidden border-l border-slate-200 shadow-2xl">
        {/* --- HEADER --- */}
        <SheetHeader className="px-6 py-6 border-b border-slate-100 bg-white z-20 shrink-0 shadow-sm text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-[#F27124]" />
              </div>

              {/* 👇 2. HIỂN THỊ BADGE DỰA TRÊN LOGIC TÍNH TOÁN */}
              {semester && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border shadow-sm",
                    statusInfo.className,
                  )}
                >
                  {statusInfo.label}
                </Badge>
              )}
            </div>
            {semester && (
              <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                CODE: {semester.code}
              </span>
            )}
          </div>

          <SheetTitle className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
            {isLoading ? (
              <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
            ) : (
              semester?.name
            )}
          </SheetTitle>

          {semester && (
            <SheetDescription className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
              Thời gian: {format(new Date(semester.start_date), "dd/MM/yyyy")} —{" "}
              {format(new Date(semester.end_date), "dd/MM/yyyy")}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 w-full bg-slate-50/30 overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-8 pb-24">
            {isLoading ? (
              <div className="h-60 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#F27124]" />
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : !semester ? (
              <div className="p-12 text-center flex flex-col items-center gap-4">
                <Info className="w-12 h-12 text-slate-200" />
                <p className="text-slate-500 font-medium">
                  Không tìm thấy thông tin.
                </p>
              </div>
            ) : (
              <>
                {/* Stats Section */}
                <section className="grid grid-cols-2 gap-4">
                  <StatCard
                    icon={BookOpen}
                    label="Lớp học"
                    value={stats?.total_classes}
                    subText={`${stats?.active_classes} Active`}
                    color="blue"
                  />
                  <StatCard
                    icon={GraduationCap}
                    label="Giảng viên"
                    value={stats?.total_lecturers}
                    subText="Đang giảng dạy"
                    color="orange"
                  />
                </section>

                {/* Creator Info */}
                {semester.created_by_admin && (
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">
                      Quản trị viên
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <Avatar className="h-10 w-10 border border-white shadow-sm bg-slate-100">
                        <AvatarFallback className="text-slate-500 font-bold">
                          {semester.created_by_admin.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {semester.created_by_admin.full_name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {semester.created_by_admin.email}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                <Separator />

                {/* Class List */}
                <section>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        Danh sách lớp học
                      </h3>
                    </div>
                    <Badge className="bg-slate-900 text-white hover:bg-slate-800">
                      {classes.length}
                    </Badge>
                  </div>

                  <Accordion type="single" collapsible className="space-y-3">
                    {classes.map((cls) => (
                      <ClassItemAccordion key={cls._id} cls={cls} />
                    ))}
                  </Accordion>
                </section>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ... (Giữ nguyên các component con: StatCard, ClassItemAccordion, WeightBox)
function StatCard({ icon: Icon, label, value, subText, color }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-[#F27124]",
  };
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div
        className={cn(
          "inline-flex p-2 rounded-lg mb-3",
          colors[color as keyof typeof colors],
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-black text-slate-900">{value || 0}</span>
        <span className="text-[10px] text-slate-400 font-medium truncate">
          {subText}
        </span>
      </div>
    </div>
  );
}

function ClassItemAccordion({ cls }: { cls: ClassInSemester }) {
  return (
    <AccordionItem
      value={cls._id}
      className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-4 text-left">
          <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 text-xs shrink-0">
            {cls.name.substring(0, 2)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{cls.name}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              {cls.subjectName}
            </p>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 bg-slate-50/50 border-t border-slate-100">
        <div className="pt-4 space-y-6">
          {/* Lecturer Info */}
          {cls.lecturer_id ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-white shadow-sm">
                <AvatarImage src={cls.lecturer_id.avatar_url} />
                <AvatarFallback>
                  {cls.lecturer_id.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {cls.lecturer_id.full_name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {cls.lecturer_id.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <User className="w-4 h-4" /> Chưa phân công giảng viên
            </div>
          )}

          {/* Contribution Weights */}
          {cls.contributionConfig && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Contribution Weights
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <WeightBox
                  icon={Trello}
                  label="Jira"
                  value={cls.contributionConfig.jiraWeight * 100}
                  color="blue"
                />
                <WeightBox
                  icon={GitBranch}
                  label="Git"
                  value={cls.contributionConfig.gitWeight * 100}
                  color="orange"
                />
                <WeightBox
                  icon={MessageSquare}
                  label="Review"
                  value={cls.contributionConfig.reviewWeight * 100}
                  color="purple"
                />
              </div>
            </div>
          )}

          {/* Grade Structure */}
          {cls.gradeStructure && cls.gradeStructure.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Grade Structure
              </h4>
              <div className="space-y-1.5">
                {cls.gradeStructure.map((grade) => (
                  <div
                    key={grade._id}
                    className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-slate-100"
                  >
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      {grade.isGroupGrade ? (
                        <Users className="w-3 h-3 text-indigo-500" />
                      ) : (
                        <User className="w-3 h-3 text-slate-400" />
                      )}
                      {grade.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px]"
                    >
                      {grade.weight * 100}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function WeightBox({ icon: Icon, label, value, color }: any) {
  const colorStyles = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-100">
      <Icon
        className={cn(
          "w-4 h-4 mb-1",
          colorStyles[color as keyof typeof colorStyles].split(" ")[0],
        )}
      />
      <span className="text-[10px] text-slate-400 font-medium uppercase">
        {label}
      </span>
      <span className="text-xs font-black text-slate-900">{value}%</span>
    </div>
  );
}
