"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  KanbanSquare,
  ListChecks,
  AlertTriangle,
} from "lucide-react";

// --- MOCK DATA ---
const members = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN" },
  { id: "m2", name: "Trần Thị Bình", initials: "BT" },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC" },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM" },
];

const tasks = [
  {
    id: "T-101",
    title: "Thiết kế trang Dashboard",
    assigneeId: "m1",
    status: "todo",
    storyPoints: 5,
    priority: "High",
    type: "Frontend",
  },
  {
    id: "T-102",
    title: "Implement API Authentication",
    assigneeId: "m2",
    status: "in-progress",
    storyPoints: 8,
    priority: "Critical",
    type: "Backend",
  },
  {
    id: "T-103",
    title: "Viết unit test cho Auth Service",
    assigneeId: "m3",
    status: "review",
    storyPoints: 3,
    priority: "Medium",
    type: "Testing",
  },
  {
    id: "T-104",
    title: "Tối ưu truy vấn database",
    assigneeId: "m4",
    status: "done",
    storyPoints: 5,
    priority: "High",
    type: "Backend",
  },
  {
    id: "T-105",
    title: "Config CI/CD cho project",
    assigneeId: "m1",
    status: "in-progress",
    storyPoints: 8,
    priority: "High",
    type: "DevOps",
  },
  {
    id: "T-106",
    title: "Thiết kế database schema",
    assigneeId: "m2",
    status: "todo",
    storyPoints: 13,
    priority: "High",
    type: "Architecture",
  },
];

const statusColumns: {
  id: "todo" | "in-progress" | "review" | "done";
  title: string;
  description: string;
  color: string;
}[] = [
  {
    id: "todo",
    title: "To Do",
    description: "Task đã được tạo nhưng chưa bắt đầu",
    color: "border-slate-200",
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Task đang được thực hiện",
    color: "border-blue-300",
  },
  {
    id: "review",
    title: "In Review",
    description: "Chờ review / kiểm thử",
    color: "border-amber-300",
  },
  {
    id: "done",
    title: "Done",
    description: "Đã hoàn thành & merged",
    color: "border-emerald-300",
  },
];

export default function LeaderTaskBoardPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  // Chỉ LEADER mới được truy cập Task Board
  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">
              Team Task Board
            </h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để theo dõi tiến độ task của từng
              thành viên.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài
            khoản Leader nếu muốn xem Task Board nhóm.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-[#F27124]" />
            Team Task Board
          </h2>
          <p className="text-muted-foreground">
            Theo dõi danh sách task của từng thành viên
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-1">
            Sprint 4 • E-Commerce App
          </Badge>
        </div>
      </div>

      <Separator />

      {/* VIEW SWITCHER: TABLE / KANBAN */}
      <Tabs defaultValue="board" className="space-y-4">
        <TabsList className="h-9">
          <TabsTrigger value="board" className="flex items-center gap-2">
            <KanbanSquare className="h-4 w-4" />
            Board
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Bảng theo thành viên
          </TabsTrigger>
        </TabsList>

        {/* KANBAN VIEW */}
        <TabsContent
          value="board"
          className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
        >
          <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-muted/30 p-4">
            <div className="flex gap-4 min-w-max">
              {statusColumns.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <div
                    key={col.id}
                    className={`w-[260px] flex-shrink-0 rounded-xl bg-background border ${col.color} shadow-sm flex flex-col`}
                  >
                    <div className="px-4 pt-3 pb-2 border-b flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {col.title}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {col.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                      >
                        {columnTasks.length}
                      </Badge>
                    </div>
                    <div className="p-3 space-y-3">
                      {columnTasks.length === 0 && (
                        <p className="text-[11px] text-muted-foreground italic">
                          Chưa có task nào.
                        </p>
                      )}
                      {columnTasks.map((task) => {
                        const assignee = members.find(
                          (m) => m.id === task.assigneeId,
                        );
                        return (
                          <Card
                            key={task.id}
                            className="border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-mono text-muted-foreground">
                                  {task.id}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5"
                                >
                                  {task.type}
                                </Badge>
                              </div>
                              <p className="text-sm font-semibold leading-snug">
                                {task.title}
                              </p>
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6 border">
                                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
                                      {assignee?.initials ?? "NA"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">
                                    {assignee?.name ?? "Unassigned"}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5"
                                >
                                  {task.storyPoints} SP
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* TABLE VIEW */}
        <TabsContent
          value="table"
          className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4" />
                Task theo thành viên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map((member) => {
                const memberTasks = tasks.filter(
                  (t) => t.assigneeId === member.id,
                );
                return (
                  <div
                    key={member.id}
                    className="rounded-lg border bg-muted/30 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border bg-background">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {memberTasks.length} task đang phụ trách
                          </p>
                        </div>
                      </div>
                      {memberTasks.some((t) => t.status === "todo") && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-[11px] border-amber-300 text-amber-700 bg-amber-50"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Có task chưa bắt đầu
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {memberTasks.length === 0 && (
                        <p className="text-[11px] text-muted-foreground italic">
                          Chưa có task nào được assign.
                        </p>
                      )}
                      {memberTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between text-xs bg-background rounded-md px-2 py-1 border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {task.id}
                            </span>
                            <span className="font-medium">{task.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0.5"
                            >
                              {task.status === "todo"
                                ? "To Do"
                                : task.status === "in-progress"
                                ? "In Progress"
                                : task.status === "review"
                                ? "In Review"
                                : "Done"}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">
                              {task.storyPoints} SP
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


