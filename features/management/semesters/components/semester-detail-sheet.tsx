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
  Settings2,
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

  // --- LOGIC TÍNH TOÁN TRẠNG THÁI ---
  const getComputedStatus = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (now < start) {
      return {
        label: "Sắp diễn ra",
        className:
          "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      };
    } else if (now > end) {
      return {
        label: "Đã kết thúc",
        className:
          "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      };
    } else {
      return {
        label: "Đang diễn ra",
        className:
          "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 animate-pulse",
      };
    }
  };

  const statusInfo = semester
    ? getComputedStatus(semester.start_date, semester.end_date)
    : { label: "Unknown", className: "" };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 bg-white dark:bg-slate-950 flex flex-col h-[100dvh] font-sans overflow-hidden border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-colors">
        {/* --- HEADER --- */}
        <SheetHeader className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-20 shrink-0 text-left transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors">
                <Calendar className="h-3.5 w-3.5" />
                {semester?.code}
              </span>
            </div>

            {semester && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border shadow-sm rounded-md",
                  statusInfo.className,
                )}
              >
                {statusInfo.label}
              </Badge>
            )}
          </div>

          <div className="space-y-1.5">
            <SheetTitle className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight transition-colors">
              {isLoading ? (
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md" />
              ) : (
                semester?.name
              )}
            </SheetTitle>

            {semester && (
              <SheetDescription className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1 transition-colors">
                Thời gian: {format(new Date(semester.start_date), "dd/MM/yyyy")}{" "}
                — {format(new Date(semester.end_date), "dd/MM/yyyy")}
              </SheetDescription>
            )}
          </div>
        </SheetHeader>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 w-full bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto custom-scrollbar transition-colors">
          <div className="p-6 md:p-8 space-y-8 pb-24">
            {isLoading ? (
              <div className="h-60 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : !semester ? (
              <div className="p-12 text-center flex flex-col items-center gap-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Info className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Không tìm thấy thông tin chi tiết.
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
                    subText={`${stats?.active_classes} lớp mở`}
                    color="blue"
                  />
                  <StatCard
                    icon={GraduationCap}
                    label="Giảng viên"
                    value={stats?.total_lecturers}
                    subText="Đang giảng dạy"
                    color="emerald"
                  />
                </section>

                {/* Creator Info */}
                {semester.created_by_admin && (
                  <section className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wider transition-colors">
                      <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      Người khởi tạo
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                      <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                        <AvatarFallback className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold">
                          {semester.created_by_admin.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">
                          {semester.created_by_admin.full_name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5 transition-colors">
                          {semester.created_by_admin.email}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                <Separator className="bg-slate-200 dark:bg-slate-800 transition-colors" />

                {/* Class List */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wider transition-colors">
                      <LayoutGrid className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      Danh sách lớp học
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 transition-colors"
                    >
                      {classes.length} Lớp
                    </Badge>
                  </div>

                  <Accordion type="single" collapsible className="space-y-3">
                    {classes.map((cls) => (
                      <ClassItemAccordion key={cls._id} cls={cls} />
                    ))}
                  </Accordion>

                  {classes.length === 0 && (
                    <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">
                      Chưa có lớp học nào được phân bổ.
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon: Icon, label, value, subText, color }: any) {
  const colors = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",
    emerald:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
    orange:
      "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30",
  };

  const style = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors flex flex-col items-center text-center">
      <div
        className={cn(
          "inline-flex p-2.5 rounded-xl mb-3 transition-colors",
          style,
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">
        {label}
      </p>
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="text-3xl font-black text-slate-900 dark:text-slate-100 leading-none transition-colors">
          {value || 0}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium transition-colors">
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
      className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors"
    >
      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-4 text-left">
          <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-600 dark:text-slate-300 text-xs shrink-0 transition-colors">
            {cls.name.substring(0, 2)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">
              {cls.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium transition-colors">
              {cls.subjectName}
            </p>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-5 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="pt-4 space-y-6">
          {/* Lecturer Info */}
          {cls.lecturer_id ? (
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
              <Avatar className="h-9 w-9 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <AvatarImage src={cls.lecturer_id.avatar_url} />
                <AvatarFallback className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  {cls.lecturer_id.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 transition-colors">
                  Giảng viên
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">
                  {cls.lecturer_id.full_name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-medium transition-colors">
              <User className="w-4 h-4" /> Chưa phân công giảng viên
            </div>
          )}

          {/* Contribution Weights */}
          {cls.contributionConfig && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider transition-colors">
                <Settings2 className="w-3.5 h-3.5 text-slate-400" /> Trọng số
                Đánh giá
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
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider transition-colors">
                <LayoutGrid className="w-3.5 h-3.5 text-slate-400" /> Cấu trúc
                điểm (Grade)
              </h4>
              <div className="space-y-2">
                {cls.gradeStructure.map((grade) => (
                  <div
                    key={grade._id}
                    className="flex justify-between items-center text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors">
                      {grade.isGroupGrade ? (
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {grade.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none transition-colors"
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
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    orange:
      "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    purple:
      "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <Icon
        className={cn(
          "w-4 h-4 mb-1.5 transition-colors",
          colorStyles[color as keyof typeof colorStyles].split(" ")[0],
        )}
      />
      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest transition-colors">
        {label}
      </span>
      <span className="text-xs font-black text-slate-900 dark:text-slate-100 mt-0.5 transition-colors">
        {value}%
      </span>
    </div>
  );
}
