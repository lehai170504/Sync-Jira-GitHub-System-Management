"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  CalendarDays,
  Settings2,
  Clock,
  Hash,
  GitCommit,
  Trello,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Loader2,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";

interface ClassDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: { _id: string } | null;
}

export function ClassDetailDrawer({
  isOpen,
  onOpenChange,
  selectedClass,
}: ClassDetailDrawerProps) {
  const { data: detailData, isLoading } = useClassDetails(
    isOpen && selectedClass?._id ? selectedClass._id : undefined,
  );

  const classInfo = detailData?.class;
  const teams = detailData?.teams || [];
  const stats = detailData?.stats;

  if (isLoading && !classInfo) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[700px] bg-white dark:bg-slate-950 flex flex-col items-center justify-center border-l dark:border-slate-800 transition-colors">
          <SheetTitle className="sr-only">Đang tải dữ liệu lớp học</SheetTitle>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
              Đang tải thông tin...
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!classInfo) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[700px] p-0 bg-white dark:bg-slate-950 flex flex-col h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl font-sans transition-colors">
        {/* --- 1. HEADER (STICKY) --- */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 transition-colors">
          <SheetHeader className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {classInfo.semester_id?.code}
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="truncate max-w-[200px] font-semibold text-slate-700 dark:text-slate-200">
                  {classInfo.subjectName}
                </span>
              </div>

              <Badge
                className={cn(
                  "px-3 py-1 rounded-md font-bold uppercase tracking-wider text-[10px] border",
                  classInfo.status === "Active"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
                )}
                variant="outline"
              >
                {classInfo.status === "Active" && (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                {classInfo.status || "Unknown"}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <SheetTitle className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight transition-colors">
                Lớp {classInfo.name}
              </SheetTitle>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-4 w-4" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">
                    {classInfo.class_code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Tạo: {formatDate(classInfo.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-3.5">
                <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                  <AvatarImage src={classInfo.lecturer_id?.avatar_url} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                    {classInfo.lecturer_id?.full_name?.charAt(0) || "G"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 transition-colors">
                    Giảng viên phụ trách
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">
                    {classInfo.lecturer_id?.full_name || "Chưa phân công"}
                  </p>
                </div>
              </div>
              <div className="text-right px-2 hidden sm:block">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">
                  {classInfo.lecturer_id?.email}
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* --- 2. BODY CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30 transition-colors">
          <div className="p-6 md:p-8 space-y-8 pb-20">
            {/* --- THỐNG KÊ (STATS) --- */}
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
                  <Users className="h-6 w-6 text-blue-500 dark:text-blue-400 mb-2" />
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100 transition-colors">
                    {stats.total_students}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 transition-colors">
                    Sinh viên
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
                  <Layers className="h-6 w-6 text-purple-500 dark:text-purple-400 mb-2" />
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100 transition-colors">
                    {stats.total_teams}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 transition-colors">
                    Nhóm
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
                  <Briefcase className="h-6 w-6 text-orange-500 dark:text-orange-400 mb-2" />
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100 transition-colors">
                    {stats.total_projects}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 transition-colors">
                    Dự án
                  </span>
                </div>
              </div>
            )}

            {/* --- CẤU HÌNH ĐÁNH GIÁ TRỌNG SỐ --- */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider transition-colors">
                <Settings2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Cấu hình đánh giá
              </h3>

              {classInfo.contributionConfig ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <WeightCard
                    icon={Trello}
                    label="Jira Tracking"
                    value={classInfo.contributionConfig.jiraWeight}
                    color="blue"
                  />
                  <WeightCard
                    icon={GitCommit}
                    label="Git Commits"
                    value={classInfo.contributionConfig.gitWeight}
                    color="orange"
                  />
                  <WeightCard
                    icon={MessageSquare}
                    label="Code Review"
                    value={classInfo.contributionConfig.reviewWeight}
                    color="purple"
                  />

                  {/* Over Ceiling Badge */}
                  <div className="sm:col-span-3 mt-2 flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-slate-400" />
                      Cho phép vượt trần điểm (Over Ceiling)
                    </span>
                    <Badge
                      variant={
                        classInfo.contributionConfig.allowOverCeiling
                          ? "default"
                          : "secondary"
                      }
                      className={cn(
                        "rounded-md font-bold px-3 py-1 text-xs transition-colors",
                        classInfo.contributionConfig.allowOverCeiling
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                      )}
                    >
                      {classInfo.contributionConfig.allowOverCeiling
                        ? "Được phép"
                        : "Không"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-sm font-medium transition-colors">
                  Lớp học này chưa được cấu hình trọng số đánh giá.
                </div>
              )}
            </section>

            <Separator className="bg-slate-200 dark:bg-slate-800 transition-colors" />

            {/* --- DANH SÁCH NHÓM --- */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wider transition-colors">
                  <Briefcase className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  Danh sách Nhóm ({teams.length})
                </h3>
              </div>

              <div className="space-y-3">
                {teams.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                    <LayoutGrid className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      Chưa có nhóm nào được tạo trong lớp này.
                    </p>
                  </div>
                ) : (
                  teams.map((team) => (
                    <div
                      key={team._id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-900/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-600 dark:text-slate-300 text-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors border border-slate-100 dark:border-slate-700/50">
                          {team.project_name.substring(0, 1).toUpperCase()}
                        </div>

                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {team.project_name}
                          </p>

                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-semibold uppercase tracking-wider">
                            {/* Github Connection Status */}
                            {team.github_repo_url ? (
                              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md transition-colors">
                                <GitCommit className="w-3 h-3 text-emerald-500" />{" "}
                                Git: Có
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md opacity-60 transition-colors">
                                <GitCommit className="w-3 h-3" /> No Git
                              </span>
                            )}

                            {/* Jira Connection Status */}
                            {team.jira_project_key ? (
                              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md transition-colors">
                                <Trello className="w-3 h-3 text-blue-500" />{" "}
                                Jira: Có
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md opacity-60 transition-colors">
                                <Trello className="w-3 h-3" /> No Jira
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-transparent border-slate-200 dark:border-slate-800 shrink-0 hidden sm:flex"
                      >
                        ID: {team._id.slice(-6)}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        {/* --- 3. FOOTER INFO --- */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 text-[10px] text-slate-400 dark:text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center shrink-0 gap-2 transition-colors">
          <span>Class ID: {classInfo._id}</span>
          <span>Last Updated: {formatDate(classInfo.updatedAt)}</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- SUB COMPONENTS CỦA DRAWER ---

function WeightCard({ icon: Icon, label, value, color }: any) {
  // Config màu sắc UI (Không dùng bg sặc sỡ nữa)
  const colors = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",
    purple:
      "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",
    orange:
      "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30",
  };
  const colorClass = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center transition-all group">
      <div
        className={cn("p-2.5 rounded-xl mb-3 transition-colors", colorClass)}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 transition-colors">
        {label}
      </span>
      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter transition-colors">
        {Math.round((value || 0) * 100)}
        <span className="text-sm text-slate-400 dark:text-slate-500 font-medium ml-0.5">
          %
        </span>
      </span>
    </div>
  );
}
