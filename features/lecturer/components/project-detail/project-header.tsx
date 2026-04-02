"use client";

import { format } from "date-fns";
import {
  Clock,
  FileDown,
  Loader2,
  ListTodo,
  Code2,
  Star,
  Trophy,
  GitCommit,
  Target,
  ArrowLeft,
} from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { exportTeamSrsApi } from "@/features/lecturer/api/ai-api";
import { cn } from "@/lib/utils";
import {
  ratioToPercentDisplay,
  scoreRatioToDisplay10,
} from "@/lib/score-display";
import { StatCard } from "./stat-card";

interface ProjectHeaderProps {
  team: any;
  dashboardData: any;
}

export function ProjectHeader({ team, dashboardData }: ProjectHeaderProps) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  /** Cùng ID với route /lecturer/projects/[teamId] & GET /dashboard/teams/:teamId — không dùng project._id lẻ */
  const teamId = team?._id;

  const handleExportSRS = async () => {
    if (!teamId) return;
    setIsExporting(true);
    toast.info("AI đang tổng hợp báo cáo SRS, vui lòng đợi...");

    try {
      const blob = await exportTeamSrsApi(teamId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `SRS_Report_${team?.project_name || "Project"}.md`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Xuất báo cáo SRS thành công!");
    } catch (error) {
      toast.error("Xuất báo cáo thất bại.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
      {/* Nút Back */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-slate-500 hover:text-slate-900 w-fit pl-0 gap-2 hover:bg-transparent font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách đồ án
      </Button>

      {/* Card Chính */}
      <div className="flex flex-col bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm gap-6">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-orange-50 text-[#F27124] border-orange-200 font-black uppercase text-[10px] tracking-widest"
              >
                Team Profile
              </Badge>
              {team?.last_sync_at && (
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" /> Cập nhật:{" "}
                  {format(new Date(team.last_sync_at), "HH:mm dd/MM")}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
              {dashboardData?.team_info?.project_name || team.project_name}
            </h1>
            {team.class_id && (
              <p className="text-sm font-medium text-slate-500">
                Lớp:{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {team.class_id.name}
                </span>{" "}
                • Môn:{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {team.class_id.subject_id?.code}
                </span>
              </p>
            )}
          </div>

          {/* Connection Status & Action */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full xl:w-auto">
            {/* <div className="flex gap-3">
              <ConnectionBadge
                type="github"
                isConnected={!!githubUrl}
                value={githubUrl?.replace("https://github.com/", "")}
              />
              <ConnectionBadge
                type="jira"
                isConnected={!!jiraKey}
                value={jiraKey ? `Key: ${jiraKey}` : undefined}
              />
            </div> */}
            <Button
              onClick={handleExportSRS}
              disabled={isExporting || !teamId}
              className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-sm w-full sm:w-auto"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4 mr-2" />
              )}
              Xuất Báo Cáo SRS
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        {dashboardData && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icon={ListTodo}
              label="Agile SP Done"
              value={dashboardData.project_health?.total_jira_sp_done}
              color="blue"
            />
            <StatCard
              icon={Code2}
              label="Chất lượng Git"
              value={`${ratioToPercentDisplay(dashboardData.project_health?.total_git_ai_score)}%`}
              color="emerald"
            />

            {/* Đặc cách cái Peer Review vì nó có cúp Trophy */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div className="inline-flex p-2 rounded-xl mb-2 bg-yellow-100 text-yellow-600 w-fit">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                  Peer Review
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
                    {scoreRatioToDisplay10(
                      dashboardData.project_health?.average_peer_review,
                    ).toFixed(1)}
                  </p>
                  {scoreRatioToDisplay10(
                    dashboardData.project_health?.average_peer_review,
                  ) >= 9.95 && (
                    <Trophy className="w-5 h-5 text-yellow-500 mb-0.5" />
                  )}
                </div>
              </div>
            </div>

            <StatCard
              icon={GitCommit}
              label="Commits Hợp lệ"
              value={dashboardData.project_health?.team_approved_commits}
              color="slate"
            />
            <StatCard
              icon={Target}
              label="Tổng Tasks"
              value={dashboardData.project_health?.team_total_tasks}
              color="purple"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectionBadge({ type, isConnected, value }: any) {
  const Icon = type === "github" ? SiGithub : SiJira;
  return (
    <div
      className={cn(
        "flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border transition-all h-12",
        isConnected
          ? "border-slate-200 bg-white dark:bg-slate-800"
          : "border-dashed border-slate-200 bg-slate-50 opacity-60",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg",
          isConnected
            ? type === "github"
              ? "bg-slate-900 text-white"
              : "bg-blue-600 text-white"
            : "bg-slate-200 text-slate-400",
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] uppercase font-black text-slate-400">
          {type}
        </span>
        <span className="text-xs font-bold truncate max-w-[120px]">
          {isConnected ? value : "N/A"}
        </span>
      </div>
    </div>
  );
}
