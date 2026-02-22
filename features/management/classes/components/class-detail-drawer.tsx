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
        <SheetContent className="w-full sm:max-w-[700px] bg-white dark:bg-slate-950 flex flex-col items-center justify-center border-l dark:border-slate-800">
          <SheetTitle className="sr-only">Đang tải dữ liệu lớp học</SheetTitle>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
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
      <SheetContent className="w-full sm:max-w-[700px] p-0 bg-white dark:bg-slate-950 flex flex-col h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl font-sans">
        {/* --- 1. HEADER (STICKY) --- */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
          <SheetHeader className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-mono text-xs">
                  <CalendarDays className="h-3 w-3" />
                  {classInfo.semester_id?.code}
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="truncate max-w-[200px] font-semibold text-slate-700 dark:text-slate-200">
                  {classInfo.subjectName}
                </span>
              </div>

              <Badge
                className={cn(
                  "px-3 py-1 rounded-full font-semibold border",
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

            <div className="space-y-1">
              <SheetTitle className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {classInfo.name}
              </SheetTitle>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {classInfo.class_code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs">
                    Tạo: {formatDate(classInfo.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm">
                  <AvatarImage src={classInfo.lecturer_id?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-[#F27124] to-orange-600 text-white font-bold">
                    {classInfo.lecturer_id?.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                    Giảng viên
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {classInfo.lecturer_id?.full_name}
                  </p>
                </div>
              </div>
              <div className="text-right px-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {classInfo.lecturer_id?.email}
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* --- 2. BODY CONTENT --- */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white dark:bg-slate-950">
          <div className="p-6 space-y-8 pb-20">
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <StatBox
                  icon={Users}
                  label="Sinh viên"
                  value={stats.total_students}
                  color="blue"
                />
                <StatBox
                  icon={Layers}
                  label="Nhóm"
                  value={stats.total_teams}
                  color="purple"
                />
                <StatBox
                  icon={Briefcase}
                  label="Dự án"
                  value={stats.total_projects}
                  color="orange"
                />
              </div>
            )}

            <section>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <Settings2 className="h-5 w-5 text-[#F27124]" />
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
                    color="purple"
                  />
                  <WeightCard
                    icon={MessageSquare}
                    label="Code Review"
                    value={classInfo.contributionConfig.reviewWeight}
                    color="orange"
                  />

                  <div className="sm:col-span-3 mt-2 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Cho phép vượt trần điểm (Over Ceiling)
                    </span>
                    <Badge
                      variant={
                        classInfo.contributionConfig.allowOverCeiling
                          ? "default"
                          : "secondary"
                      }
                      className={`rounded-full ${
                        classInfo.contributionConfig.allowOverCeiling
                          ? "bg-[#F27124] text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {classInfo.contributionConfig.allowOverCeiling
                        ? "Cho phép"
                        : "Không"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  Chưa cấu hình trọng số
                </div>
              )}
            </section>

            <Separator className="bg-slate-100 dark:bg-slate-800" />

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#F27124]" />
                  Danh sách Nhóm ({teams.length})
                </h3>
              </div>

              <div className="space-y-3">
                {teams.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600">
                    <LayoutGrid className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Chưa có nhóm nào được tạo.</p>
                  </div>
                ) : (
                  teams.map((team) => (
                    <div
                      key={team._id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-200 dark:hover:border-orange-900 hover:shadow-md hover:shadow-orange-500/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-500 dark:text-slate-400 text-lg group-hover:bg-[#F27124] group-hover:text-white transition-colors">
                          {team.project_name.substring(0, 1).toUpperCase()}
                        </div>

                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#F27124] transition-colors">
                            {team.project_name}
                          </p>

                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                            {team.github_repo_url ? (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                <GitCommit className="w-3 h-3" /> Connected
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded opacity-60">
                                <GitCommit className="w-3 h-3" /> No Git
                              </span>
                            )}

                            {team.jira_project_key ? (
                              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                                <Trello className="w-3 h-3" /> Jira Linked
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded opacity-60">
                                <Trello className="w-3 h-3" /> No Jira
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      >
                        {team._id.slice(-4)}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        {/* --- 3. FOOTER INFO --- */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] text-slate-400 dark:text-slate-500 font-mono flex justify-between items-center shrink-0">
          <span>ID: {classInfo._id}</span>
          <span>Last Updated: {formatDate(classInfo.updatedAt)}</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- SUB COMPONENTS ---
function StatBox({ icon: Icon, label, value, color }: any) {
  const colors = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
    purple:
      "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800",
    orange:
      "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
  };
  const style = colors[color as keyof typeof colors] || colors.blue;
  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${style}`}
    >
      <Icon className="h-6 w-6 mb-2 opacity-80" />
      <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
        {value || 0}
      </span>
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function WeightCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    purple:
      "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
    orange:
      "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
  };
  const colorClass = colors[color as keyof typeof colors] || colors.blue;
  return (
    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all group">
      <div
        className={`p-3 rounded-full mb-3 transition-colors ${colorClass} group-hover:bg-opacity-80`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
        {Math.round((value || 0) * 100)}
        <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
          %
        </span>
      </span>
    </div>
  );
}
