"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Code2, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeamDashboard } from "@/features/management/teams/hooks/use-team-dashboard";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";

export function MemberOverviewTab() {
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const { data: myClasses } = useMyClasses();
  const { data: dashboardData, isLoading, error } = useTeamDashboard(teamId);

  // Lấy teamId từ class hiện tại hoặc từ myClasses
  useEffect(() => {
    const classId = Cookies.get("student_class_id");
    if (classId && myClasses?.classes) {
      const currentClass = myClasses.classes.find(
        (cls) => cls.class._id === classId
      );
      if (currentClass?.team_id) {
        setTeamId(currentClass.team_id);
      }
    } else if (myClasses?.classes && myClasses.classes.length > 0) {
      // Nếu không có classId trong cookie, lấy class đầu tiên
      setTeamId(myClasses.classes[0].team_id);
    }
  }, [myClasses]);

  // Loading state
  if (isLoading || !teamId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">
              Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tasks = dashboardData?.overview.tasks || {
    total: 0,
    done: 0,
    todo: 0,
    done_percent: 0,
    story_point_total: 0,
    story_point_done: 0,
  };

  const commits = dashboardData?.overview.commits || {
    total: 0,
    counted: 0,
    last_commit_date: null,
  };

  const sprints = dashboardData?.overview.sprints || {
    total: 0,
    active: 0,
  };

  return (
    <div className="space-y-6">
      {/* PERSONAL SCORECARD */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-[#F27124] to-[#ff8c4a] text-white border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 font-medium">
                  Điểm dự kiến (Contribution)
                </p>
                <h2 className="text-4xl font-bold mt-2">
                  {tasks.done_percent > 0
                    ? (tasks.done_percent / 10).toFixed(1)
                    : "0.0"}
                  /10
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  {tasks.done_percent > 0
                    ? `${tasks.done_percent}% hoàn thành`
                    : "Chưa có dữ liệu"}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Jira Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.done}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Đã hoàn thành / {tasks.total} tổng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Code Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commits.total}</div>
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <Code2 className="h-3 w-3 mr-1" /> Tổng commits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Story Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.story_point_done} / {tasks.story_point_total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Đã hoàn thành / Tổng SP
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Sprints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sprints.active} / {sprints.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Đang hoạt động / Tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Commits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commits.counted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đã được tính điểm
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MY TASKS */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg">Tổng quan công việc</h3>
          <Card>
            <CardContent className="p-0">
              {tasks.total === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">Chưa có task nào</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium text-sm">Tổng số task</p>
                      <p className="text-xs text-muted-foreground">
                        {tasks.done} hoàn thành, {tasks.todo} chưa bắt đầu
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="font-normal bg-blue-100 text-blue-700"
                    >
                      {tasks.total} tasks
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium text-sm">Đã hoàn thành</p>
                      <p className="text-xs text-muted-foreground">
                        {tasks.done_percent}% tiến độ
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="font-normal bg-green-100 text-green-700"
                    >
                      {tasks.done} done
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-sm">Chưa bắt đầu</p>
                      <p className="text-xs text-muted-foreground">
                        Cần bắt đầu sớm
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="font-normal bg-gray-100 text-gray-700"
                    >
                      {tasks.todo} todo
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* TEAM INFO */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Thông tin nhóm</h3>
          <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-blue-800">
                {dashboardData?.team.project_name || "Nhóm"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-blue-700 mb-2">
                {sprints.active > 0
                  ? `Đang có ${sprints.active} sprint hoạt động`
                  : "Chưa có sprint nào"}
              </p>
              {commits.last_commit_date && (
                <p className="text-xs text-blue-600">
                  Commit gần nhất:{" "}
                  {new Date(commits.last_commit_date).toLocaleDateString("vi-VN")}
                </p>
              )}
              {dashboardData?.team.last_sync_at && (
                <p className="text-xs text-blue-600 mt-1">
                  Đồng bộ lần cuối:{" "}
                  {new Date(dashboardData.team.last_sync_at).toLocaleString("vi-VN")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

