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
  GraduationCap,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. IMPORT HOOK LẤY CHI TIẾT (Giả định bạn đã tạo hook này tương tự useSubjectDetail)
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";

// 2. IMPORT TYPES
import { ClassDetailInfo } from "@/features/management/classes/types/class-details-types";

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
  if (!classInfo) return null;

  if (isLoading && !classInfo) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[700px] bg-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
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
      <SheetContent className="w-full sm:max-w-[700px] p-0 bg-white flex flex-col h-full border-l shadow-2xl font-sans">
        {/* --- 1. HEADER (STICKY) --- */}
        <div className="px-6 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <SheetHeader className="space-y-4 text-left">
            {/* Breadcrumb & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 font-mono text-xs">
                  <CalendarDays className="h-3 w-3" />
                  {classInfo.semester_id?.code}
                </span>
                <span className="text-slate-300">/</span>
                <span className="truncate max-w-[200px] font-semibold text-slate-700">
                  {classInfo.subjectName}
                </span>
              </div>

              <Badge
                className={cn(
                  "px-3 py-1 rounded-full font-semibold border",
                  classInfo.status === "Active"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200",
                )}
                variant="outline"
              >
                {classInfo.status === "Active" && (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                {classInfo.status || "Unknown"}
              </Badge>
            </div>

            {/* Title & Info */}
            <div className="space-y-1">
              <SheetTitle className="text-3xl font-black text-slate-900 tracking-tight">
                {classInfo.name}
              </SheetTitle>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span className="font-mono text-slate-700 font-bold">
                    {classInfo.class_code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-xs">
                    Tạo: {formatDate(classInfo.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Lecturer Card */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={classInfo.lecturer_id?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-[#F27124] to-orange-600 text-white font-bold">
                    {classInfo.lecturer_id?.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Giảng viên
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {classInfo.lecturer_id?.full_name}
                  </p>
                </div>
              </div>
              <div className="text-right px-2">
                <p className="text-xs font-medium text-slate-500">
                  {classInfo.lecturer_id?.email}
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* --- 2. BODY CONTENT --- */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white">
          {isLoading ? (
            <div className="h-60 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#F27124]" />
              <p className="text-xs font-bold text-slate-400 uppercase">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-8 pb-20">
              {/* A. THỐNG KÊ (STATS) */}
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

              {/* B. CẤU HÌNH ĐIỂM */}
              <section>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
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

                    {/* Config Extra */}
                    <div className="sm:col-span-3 mt-2 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Cho phép vượt trần điểm (Over Ceiling)
                      </span>
                      <Badge
                        variant={
                          classInfo.contributionConfig.allowOverCeiling
                            ? "default"
                            : "secondary"
                        }
                        className="rounded-full"
                      >
                        {classInfo.contributionConfig.allowOverCeiling
                          ? "Cho phép"
                          : "Không"}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Chưa cấu hình trọng số
                  </div>
                )}
              </section>

              <Separator className="bg-slate-100" />

              {/* C. CẤU TRÚC ĐIỂM (GRADE STRUCTURE) */}
              {classInfo.gradeStructure &&
                classInfo.gradeStructure.length > 0 && (
                  <section>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <GraduationCap className="h-5 w-5 text-[#F27124]" />
                      Cấu trúc đầu điểm
                    </h3>
                    <div className="space-y-2">
                      {classInfo.gradeStructure.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-orange-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-2 w-2 rounded-full ${item.isGroupGrade ? "bg-indigo-500" : "bg-emerald-500"}`}
                            />
                            <span className="text-sm font-bold text-slate-700">
                              {item.name}
                            </span>
                            {item.isGroupGrade ? (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 h-5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100"
                              >
                                Group
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 h-5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100"
                              >
                                Individual
                              </Badge>
                            )}
                          </div>
                          <span className="font-mono text-sm font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-md">
                            {item.weight * 100}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="bg-slate-100 mt-6" />
                  </section>
                )}

              {/* D. DANH SÁCH NHÓM (TEAMS) */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#F27124]" />
                    Danh sách Nhóm ({teams.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {teams.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                      <LayoutGrid className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Chưa có nhóm nào được tạo.</p>
                    </div>
                  ) : (
                    teams.map((team) => (
                      <div
                        key={team._id}
                        className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar Nhóm (Ký tự đầu) */}
                          <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 text-lg group-hover:bg-[#F27124] group-hover:text-white transition-colors">
                            {team.project_name.substring(0, 1).toUpperCase()}
                          </div>

                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-[#F27124] transition-colors">
                              {team.project_name}
                            </p>

                            {/* Trạng thái kết nối (Optional) */}
                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 mt-1 font-medium">
                              {team.github_repo_url ? (
                                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  <GitCommit className="w-3 h-3" /> Connected
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded opacity-60">
                                  <GitCommit className="w-3 h-3" /> No Git
                                </span>
                              )}

                              {team.jira_project_key ? (
                                <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                  <Trello className="w-3 h-3" /> Jira Linked
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded opacity-60">
                                  <Trello className="w-3 h-3" /> No Jira
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Team ID */}
                        <Badge
                          variant="outline"
                          className="text-[10px] text-slate-400 font-mono bg-slate-50"
                        >
                          {team._id.slice(-4)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* --- 3. FOOTER INFO --- */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-mono flex justify-between items-center shrink-0">
          <span>ID: {classInfo._id}</span>
          <span>Last Updated: {formatDate(classInfo.updatedAt)}</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- SUB COMPONENTS (GIỮ NGUYÊN) ---
function StatBox({ icon: Icon, label, value, color }: any) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };
  const style = colors[color as keyof typeof colors] || colors.blue;
  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${style.split(" ")[2]} ${style.split(" ")[1]}`}
    >
      <Icon className={`h-6 w-6 mb-2 ${style.split(" ")[0]}`} />
      <span className="text-2xl font-black text-slate-900">{value || 0}</span>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function WeightCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  };
  const colorClass = colors[color as keyof typeof colors] || colors.blue;
  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all group">
      <div
        className={`p-3 rounded-full mb-3 transition-colors ${colorClass.split(" ")[1]} group-hover:bg-opacity-80`}
      >
        <Icon className={`h-6 w-6 ${colorClass.split(" ")[0]}`} />
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${colorClass.split(" ")[0]}`}
      >
        {label}
      </span>
      <span className="text-3xl font-black text-slate-900 tracking-tighter">
        {Math.round((value || 0) * 100)}
        <span className="text-sm text-slate-400 font-medium">%</span>
      </span>
    </div>
  );
}
