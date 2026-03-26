"use client";

import { useTeamTasks } from "@/features/lecturer/hooks/use-integration";
import {
  Loader2,
  ExternalLink,
  CircleDashed,
  Clock,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SiJira } from "react-icons/si";
import { cn } from "@/lib/utils";

// Đã fix: Map theo status_category của BE trả về (new, indeterminate, done)
const mapStatusToColumn = (statusCategory: string | undefined) => {
  const s = (statusCategory || "").toLowerCase();
  // Jira API thường trả về statusCategory theo 3 loại: 'new' (To Do), 'indeterminate' (In Progress), 'done' (Done).
  if (s === "indeterminate" || s.includes("progress")) return "In Progress";
  if (s.includes("review")) return "In Review"; // Tùy chọn nếu BE có trả về
  if (s === "done" || s.includes("close")) return "Done";
  return "To Do"; // Mặc định cho 'new'
};

export function TeamJiraTab({
  teamId,
  jiraUrl,
}: {
  teamId: string;
  jiraUrl?: string;
}) {
  const { data, isLoading } = useTeamTasks(teamId);

  // 1. TRẠNG THÁI ĐANG TẢI
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
          Đang tải bảng Kanban...
        </p>
      </div>
    );

  // 2. TRẠNG THÁI TRỐNG (Kiểm tra xem có task nào không)
  const hasTasks = data?.members_tasks?.some((m: any) => m.tasks?.length > 0);

  if (!data || !hasTasks)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 p-6 text-center">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <SiJira className="w-10 h-10 text-blue-300 dark:text-blue-900/50" />
        </div>
        <h3 className="text-lg font-black text-slate-700 dark:text-slate-300 mb-2">
          Bảng công việc trống
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Chưa có task nào được tạo hoặc đồng bộ từ Jira Workspace của nhóm.
        </p>
      </div>
    );

  // 3. XỬ LÝ DỮ LIỆU: Gom tất cả tasks và phân vào 4 cột
  const allTasks: any[] = [];
  data.members_tasks.forEach((memberData: any) => {
    const student = memberData.member.student;
    memberData.tasks?.forEach((task: any) => {
      // Đẩy task vào mảng chung, nhét luôn tên người làm vào
      allTasks.push({ ...task, assignee: student });
    });
  });

  // Phân loại vào 4 cột dựa trên status_category
  const columns = {
    "To Do": allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "To Do"
    ),
    "In Progress": allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "In Progress"
    ),
    "In Review": allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "In Review"
    ),
    Done: allTasks.filter(
      (t) => mapStatusToColumn(t.status_category) === "Done"
    ),
  };

  // Cấu hình UI cho từng cột
  const columnConfig = {
    "To Do": {
      icon: CircleDashed,
      color: "text-slate-500",
      bg: "bg-slate-100 dark:bg-slate-800/50",
      border: "border-slate-200 dark:border-slate-700",
    },
    "In Progress": {
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-200 dark:border-blue-900/30",
    },
    "In Review": {
      icon: Eye,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/10",
      border: "border-orange-200 dark:border-orange-900/30",
    },
    Done: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
      border: "border-emerald-200 dark:border-emerald-900/30",
    },
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      {/* --- HEADER --- */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 md:p-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-md">
            <SiJira className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Bảng Kanban (Jira)
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 border-none px-2 py-0.5 text-xs font-bold"
              >
                {allTasks.length} Tasks
              </Badge>
              <span className="text-xs text-slate-500 font-medium">
                đang được quản lý
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- KANBAN BOARD (4 Cột) --- */}
      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 min-w-[1000px] h-full items-start">
          {Object.entries(columns).map(([colName, tasks]) => {
            const config = columnConfig[colName as keyof typeof columnConfig];
            const Icon = config.icon;

            return (
              <div key={colName} className="flex flex-col max-h-[700px]">
                {/* Column Header */}
                <div
                  className={cn(
                    "flex items-center justify-between p-3 mb-4 rounded-xl border",
                    config.bg,
                    config.border
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", config.color)} />
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      {colName}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold border-none shadow-sm"
                  >
                    {tasks.length}
                  </Badge>
                </div>

                {/* Tasks List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                  {tasks.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-50">
                      <p className="text-xs font-bold text-slate-400">Trống</p>
                    </div>
                  ) : (
                    tasks.map((task: any) => (
                      <div
                        key={task._id}
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 hover:-translate-y-1 flex flex-col gap-3"
                      >
                        {/* Đã fix: Lấy tên Task từ task.summary */}
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-3">
                            {task.summary}
                          </p>

                          {/* Tự động tạo link sang Jira dựa trên issue_key và jiraUrl */}
                          {jiraUrl && task.issue_key && (
                            <a
                              href={`${jiraUrl}/browse/${task.issue_key}`}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        {/* Tags (Status Name & Issue Key & Story Points) */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono text-slate-500 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-1.5 py-0"
                          >
                            {task.issue_key}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-50 border-none px-1.5 py-0"
                          >
                            {task.status_name}
                          </Badge>
                          {/* Đã fix: dùng task.story_point số ít */}
                          {task.story_point > 0 && (
                            <Badge className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-50 border-none text-[10px] px-1.5 py-0">
                              {task.story_point} SP
                            </Badge>
                          )}
                        </div>

                        {/* Assignee (Người phụ trách) */}
                        <div className="flex items-center gap-2 mt-1 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700">
                            <AvatarImage src={task.assignee?.avatar_url} />
                            <AvatarFallback className="bg-slate-100 text-slate-500 text-[10px] font-bold">
                              {task.assignee?.full_name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                            {task.assignee?.full_name || "Chưa gán"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
