import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";

// Mock Task Interface
interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  priority: string;
  type: string;
  status: string;
}

const JIRA_TASKS: TaskItem[] = [
  {
    id: "J-101",
    title: "Thiết kế Database Schema",
    assignee: "Nguyen Van A",
    status: "Hoàn thành",
    priority: "Cao",
    type: "Task",
  },
  {
    id: "J-102",
    title: "API Authentication (JWT)",
    assignee: "Le Van C",
    status: "Hoàn thành",
    priority: "Cao",
    type: "Story",
  },
  {
    id: "J-103",
    title: "UI Trang chủ (Homepage)",
    assignee: "Tran Thi B",
    status: "Đang làm",
    priority: "Vừa",
    type: "Story",
  },
  {
    id: "J-104",
    title: "Tích hợp thanh toán VNPay",
    assignee: "Nguyen Van A",
    status: "Đang làm",
    priority: "Cao",
    type: "Task",
  },
  {
    id: "J-105",
    title: "Sửa lỗi đăng nhập Google",
    assignee: "Pham Minh D",
    status: "Cần làm",
    priority: "Nghiêm trọng",
    type: "Bug",
  },
  {
    id: "J-106",
    title: "Viết Unit Test Module User",
    assignee: "Pham Minh D",
    status: "Cần làm",
    priority: "Thấp",
    type: "Task",
  },
];

function TaskCard({ task }: { task: TaskItem }) {
  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
          {task.id}
        </span>
        <Badge
          variant={
            task.priority === "Cao" || task.priority === "Nghiêm trọng"
              ? "destructive"
              : "outline"
          }
          className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-tight"
        >
          {task.priority}
        </Badge>
      </div>
      <p className="text-sm font-medium text-gray-800 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
        {task.title}
      </p>
      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          {task.type === "Bug" ? (
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
          ) : task.type === "Story" ? (
            <FileText className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
          )}
          <span className="text-[10px] font-medium text-gray-500">
            {task.type}
          </span>
        </div>
        <Avatar className="h-5 w-5 ring-1 ring-white">
          <AvatarFallback className="text-[9px] bg-indigo-50 text-indigo-600 font-bold">
            {task.assignee.split(" ").pop()?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export function JiraBoard() {
  const todoTasks = JIRA_TASKS.filter((t) => t.status === "Cần làm");
  const inProgressTasks = JIRA_TASKS.filter((t) => t.status === "Đang làm");
  const doneTasks = JIRA_TASKS.filter((t) => t.status === "Hoàn thành");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-h-[500px]">
      {/* Column: Cần làm */}
      <div className="flex flex-col bg-gray-50/50 rounded-xl border border-gray-200 h-full">
        <div className="p-3 border-b border-gray-200 bg-gray-100/50 rounded-t-xl flex justify-between items-center">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span> Cần làm
          </span>
          <Badge
            variant="secondary"
            className="bg-white text-gray-600 border border-gray-200"
          >
            {todoTasks.length}
          </Badge>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {todoTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Column: Đang làm */}
      <div className="flex flex-col bg-blue-50/30 rounded-xl border border-blue-100 h-full">
        <div className="p-3 border-b border-blue-100 bg-blue-50/50 rounded-t-xl flex justify-between items-center">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>{" "}
            Đang làm
          </span>
          <Badge
            variant="secondary"
            className="bg-white text-blue-700 border border-blue-200"
          >
            {inProgressTasks.length}
          </Badge>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {inProgressTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Column: Hoàn thành */}
      <div className="flex flex-col bg-green-50/30 rounded-xl border border-green-100 h-full">
        <div className="p-3 border-b border-green-100 bg-green-50/50 rounded-t-xl flex justify-between items-center">
          <span className="text-xs font-bold text-green-700 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Hoàn
            thành
          </span>
          <Badge
            variant="secondary"
            className="bg-white text-green-700 border border-green-200"
          >
            {doneTasks.length}
          </Badge>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {doneTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
