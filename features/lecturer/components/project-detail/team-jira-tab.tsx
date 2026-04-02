"use client";

import { useTeamTasks } from "@/features/lecturer/hooks/use-integration";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiJira } from "react-icons/si";
import {
  Loader2,
  CircleDashed,
  Clock,
  Eye,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  teamId: string;
  jiraUrl?: string;
}

// Helper phân loại status vào cột tương ứng
const mapStatusToColumn = (statusCategory: string | undefined) => {
  const s = (statusCategory || "").toLowerCase();
  if (s === "indeterminate" || s.includes("progress")) return "In Progress";
  if (s.includes("review")) return "In Review";
  if (s === "done" || s.includes("close")) return "Done";
  return "To Do";
};

export function TeamJiraTab({ teamId, jiraUrl }: Props) {
  const { data, isLoading } = useTeamTasks(teamId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Đang tải bảng công việc...
        </p>
      </div>
    );
  }

  // Gom tất cả tasks từ các thành viên về một mối để phân loại
  const allTasks: any[] = [];
  data?.members_tasks?.forEach((memberData: any) => {
    const student = memberData.member?.student;
    memberData.tasks?.forEach((task: any) => {
      allTasks.push({ ...task, assignee: student });
    });
  });

  if (allTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center">
        <SiJira className="w-12 h-12 text-blue-300 mb-4" />
        <h3 className="text-lg font-black text-slate-700 dark:text-slate-300">
          Bảng công việc trống
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mt-2">
          Chưa có task nào được tạo hoặc đồng bộ từ Jira của nhóm.
        </p>
      </div>
    );
  }

  const columns = {
    "To Do": allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "To Do",
    ),
    "In Progress": allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "In Progress",
    ),
    "In Review": allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "In Review",
    ),
    Done: allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "Done",
    ),
  };

  const columnConfig = {
    "To Do": {
      icon: CircleDashed,
      color: "text-slate-500",
      bg: "bg-slate-100",
      border: "border-slate-200",
    },
    "In Progress": {
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    "In Review": {
      icon: Eye,
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    Done: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
  };

  return (
    <div className="flex flex-col h-[700px] bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <SiJira className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Bảng công việc (Jira)
            </h2>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 mt-1 border-none font-bold"
            >
              {allTasks.length} Tasks đang quản lý
            </Badge>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 min-h-0 p-4 md:p-6 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {Object.entries(columns).map(([colName, tasks]) => {
            const config = columnConfig[colName as keyof typeof columnConfig];
            const Icon = config.icon;

            return (
              <div
                key={colName}
                className="flex-1 flex flex-col h-full bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl p-2"
              >
                {/* Column Header */}
                <div
                  className={cn(
                    "shrink-0 flex items-center justify-between p-3 mb-3 rounded-xl border bg-white dark:bg-slate-900 shadow-sm",
                    config.border,
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", config.color)} />
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                      {colName}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-600 font-bold"
                  >
                    {tasks.length}
                  </Badge>
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {tasks.map((task: any) => (
                    <div
                      key={task._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-3">
                          {task.summary}
                        </p>
                        {jiraUrl && (
                          <a
                            href={`${jiraUrl}/browse/${task.issue_key}`}
                            target="_blank"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono py-0 bg-slate-50"
                        >
                          {task.issue_key}
                        </Badge>
                        {task.story_point > 0 && (
                          <Badge className="bg-purple-50 text-purple-600 border-none text-[10px] px-1.5">
                            {task.story_point} SP
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-50 dark:border-slate-800">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee?.avatar_url} />
                          <AvatarFallback className="text-[10px]">
                            {task.assignee?.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-slate-500 truncate italic">
                          {task.assignee?.full_name || "Unassigned"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
