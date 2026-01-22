"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Code2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MemberOverviewTab() {
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
                <h2 className="text-4xl font-bold mt-2">8.5/10</h2>
                <p className="text-sm text-white/70 mt-1">
                  Cao hơn trung bình nhóm (7.2)
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Đã hoàn thành
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
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <Code2 className="h-3 w-3 mr-1" /> Commits tuần này
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MY TASKS */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg">Công việc của tôi</h3>
          <Card>
            <CardContent className="p-0">
              {[
                {
                  title: "Design Login Page",
                  status: "Done",
                  due: "Yesterday",
                  color: "bg-green-100 text-green-700",
                },
                {
                  title: "API Authentication",
                  status: "In Progress",
                  due: "Tomorrow",
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  title: "Unit Test for Auth",
                  status: "To Do",
                  due: "Next Week",
                  color: "bg-gray-100 text-gray-700",
                },
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.due}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`font-normal ${task.color}`}
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* UPCOMING EVENTS / NOTIFICATIONS */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Nhắc nhở</h3>
          <Card className="bg-yellow-50/50 border-yellow-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-yellow-800">
                Review Code chéo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-yellow-700">
                Bạn cần review PR #42 của Bình Trần trước 17:00 hôm nay.
              </p>
              <Button
                size="sm"
                className="mt-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Đi tới GitHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

