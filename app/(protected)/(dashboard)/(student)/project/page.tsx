"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMyProject } from "@/features/projects/hooks/use-my-project";
import {
  Loader2,
  Github,
  Trello,
  Crown,
  Users,
  Mail,
  Code,
  Rocket,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { syncProjectApi } from "@/features/integration/api/sync-api";

export default function ProjectDetailsPage() {
  const { data: project, isLoading, error } = useMyProject();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const isLeader = Cookies.get("student_is_leader") === "true";

  const handleSyncProject = async () => {
    if (!project?._id) {
      toast.error("Không tìm thấy dự án để đồng bộ.");
      return;
    }

    try {
      setIsSyncing(true);
      const res = await syncProjectApi(project._id);

      const { github, jira, errors = [] } = res.stats || {};
      const description =
        github !== undefined || jira !== undefined
          ? `GitHub: ${github ?? 0} commits. Jira: ${jira ?? 0} items.`
          : undefined;

      if (errors.length && errors.length > 0) {
        toast.warning(res.message || "Đồng bộ dự án hoàn tất với một số lỗi.", {
          description,
        });
      } else {
        toast.success(res.message || "Đồng bộ dự án thành công!", {
          description,
        });
      }

      // Refetch thông tin dự án sau sync
      queryClient.invalidateQueries({ queryKey: ["my-project"] });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || "Không thể đồng bộ dữ liệu dự án.";
      toast.error(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-900 dark:text-slate-100">
          <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400 animate-pulse">
            Đang tải không gian làm việc...
          </p>
        </div>
      </div>
    );
  }

  // 4. TRƯỜNG HỢP: CHƯA CÓ DỰ ÁN
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto p-6 h-[70vh] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 text-slate-900 dark:text-slate-100">
        <div className="p-6 bg-orange-50 dark:bg-orange-900/30 rounded-full mb-6 border border-orange-100 dark:border-orange-900/60">
          <Rocket className="w-16 h-16 text-[#F27124]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight text-center">
          Dự án chưa được khởi tạo
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2 mb-8 text-center max-w-md">
          {isLeader
            ? "Chào Leader! Nhóm của bạn hiện chưa có không gian làm việc chính thức. Hãy kết nối GitHub và Jira để bắt đầu ngay."
            : "Nhóm của bạn hiện chưa có dự án trên hệ thống. Vui lòng liên hệ Trưởng nhóm (Leader) để khởi tạo dự án."}
        </p>
      </div>
    );
  }

  // 5. TRƯỜNG HỢP: ĐÃ CÓ DỰ ÁN
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 text-slate-900 dark:text-slate-100">
      {project.jira_sync_warning && (
        <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/60">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Cảnh báo Jira
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-100 text-sm">
            {project.jira_sync_warning}
          </AlertDescription>
        </Alert>
      )}

      {/* Header Project */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-slate-800 pb-8">
        <div className="space-y-2">
          <Badge className="bg-orange-100 text-[#F27124] hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/60 border-none px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">
            Project Workspace
          </Badge>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">
            {project.name}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {isLeader && (
            <Button
              className="rounded-xl gap-2 bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-sm active:scale-95"
              onClick={handleSyncProject}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-bold uppercase">
                    Đang đồng bộ...
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">
                    Đồng bộ dữ liệu
                  </span>
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            className="rounded-xl gap-2 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95"
            onClick={() => window.open(project.githubRepoUrl, "_blank")}
          >
            <Github className="w-4 h-4 text-gray-900 dark:text-slate-100" />
            <span className="text-xs font-bold uppercase">Github</span>
          </Button>

          <Button
            variant="outline"
            className="rounded-xl gap-2 border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-50 cursor-default shadow-sm dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
          >
            <Trello className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">
              Jira: {project.jiraProjectKey}
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin giảng viên & Thống kê */}
        <div className="space-y-6">
          <Card className="rounded-[24px] border-none bg-white dark:bg-slate-900 shadow-sm ring-1 ring-gray-100 dark:ring-slate-800 overflow-hidden">
            <CardHeader className="bg-gray-50/50 dark:bg-slate-900/40 pb-4">
              <CardTitle className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">
                Giảng viên hướng dẫn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
                <Avatar className="h-14 w-14 border-2 border-white dark:border-slate-800 shadow-sm">
                  <AvatarImage src={project.lecturer_id?.avatar_url} />
                  <AvatarFallback className="bg-orange-500 text-white font-bold">
                    GV
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-900 dark:text-slate-50 truncate">
                    {project.lecturer_id?.full_name || "Chưa xác định"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-400 truncate">
                    {project.lecturer_id?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border-none bg-white dark:bg-slate-900 shadow-sm ring-1 ring-gray-100 dark:ring-slate-800 overflow-hidden">
            <CardHeader className="bg-gray-50/50 dark:bg-slate-900/40">
              <CardTitle className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">
                Thống kê dự án
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center p-5 bg-orange-50/50 dark:bg-orange-900/20 rounded-3xl border border-orange-100/50 dark:border-orange-900/50">
                <p className="text-3xl font-bold text-[#F27124] dark:text-orange-300">
                  {project.members?.length.toString().padStart(2, "0")}
                </p>
                <p className="text-[10px] font-bold text-orange-600 uppercase mt-1">
                  Thành viên
                </p>
              </div>
              <div className="text-center p-5 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100/50 dark:border-emerald-900/60">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-300">
                  ACTIVE
                </p>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300 uppercase mt-2">
                  Trạng thái
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Danh sách thành viên */}
        <div className="lg:col-span-2">
          <Card className="rounded-[24px] border-none bg-white dark:bg-slate-900 shadow-sm ring-1 ring-gray-100 dark:ring-slate-800 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                  <Users className="w-5 h-5 text-[#F27124]" />
                </div>
                Thành viên dự án
              </CardTitle>
              <Badge
                variant="secondary"
                className="rounded-full px-3 text-[10px] font-bold text-gray-400 dark:text-slate-400"
              >
                TEAM_ROSTER
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {project.members?.map((member) => {
                const isLeader = member._id === project.leader_id?._id;
                return (
                  <div
                    key={member._id}
                    className="group relative flex items-center gap-4 p-4 border border-gray-50 dark:border-slate-800 rounded-[20px] hover:border-orange-200 dark:hover:border-orange-900/60 hover:bg-orange-50/10 dark:hover:bg-orange-900/10 transition-all duration-300"
                  >
                    {isLeader && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-100 text-amber-700 border-none gap-1 py-0.5 px-2 text-[9px] font-bold uppercase">
                          <Crown className="w-3 h-3 fill-amber-500" /> Leader
                        </Badge>
                      </div>
                    )}
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback className="bg-gray-100 dark:bg-slate-800 font-bold text-gray-400 dark:text-slate-300">
                        {member.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 dark:text-slate-50 group-hover:text-[#F27124] transition-colors">
                        {member.full_name}
                      </p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold flex items-center gap-1.5 uppercase">
                          <Code className="w-3.5 h-3.5 opacity-50" />{" "}
                          {member.student_code}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 opacity-50" />{" "}
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
