"use client";

import {
  ScoreRadarChart,
  ScoreHistoryChart,
} from "@/components/features/scoring/score-charts";
import { ScoreBreakdown } from "@/components/features/scoring/score-breakdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  TrendingUp,
  Target,
  Download,
  Calendar,
  ShieldCheck,
  GitCommit,
  LayoutList,
  MessageSquare,
} from "lucide-react";

export default function MyScorePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER SECTION WITH ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Kết quả học tập
          </h2>
          <p className="text-muted-foreground mt-1">
            Tổng hợp hiệu suất, điểm số và lịch sử hoạt động trong Sprint 4.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="mr-2 h-4 w-4" />
            Sprint 4 (Hiện tại)
          </Button>
          <Button size="sm" className="h-9 bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Xuất bảng điểm
          </Button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Main Score (Gradient Brand Color) */}
        <Card className="relative overflow-hidden border-none shadow-lg">
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-600 opacity-90" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <CardHeader className="relative flex flex-row items-center justify-between pb-2 z-10">
            <CardTitle className="text-sm font-medium text-white/90">
              Điểm tổng kết (Dự kiến)
            </CardTitle>
            <Trophy className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-white">8.6</div>
            <p className="text-xs text-white/80 mt-2 flex items-center bg-white/20 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Tăng 0.4 so với Sprint trước
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Ranking */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Xếp hạng nhóm
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-foreground">Top 2</div>
              <span className="text-sm text-muted-foreground">/ 30 SV</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Bạn đang làm tốt hơn{" "}
              <span className="font-semibold text-green-600">60%</span> thành
              viên khác.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Risk Status */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trạng thái rủi ro
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 flex items-center gap-2">
              An toàn
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Không có vi phạm Deadline hay Coding convention.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* LEFT COLUMN: CHARTS */}
        <div className="space-y-8 lg:col-span-1">
          <ScoreRadarChart />
          <ScoreBreakdown />
        </div>

        {/* RIGHT COLUMN: HISTORY & LOGS */}
        <div className="lg:col-span-2 space-y-8">
          <ScoreHistoryChart />

          {/* ACTIVITY TIMELINE - MODERN STYLE */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Hoạt động gần đây
                <Badge variant="secondary" className="text-xs font-normal">
                  Real-time
                </Badge>
              </CardTitle>
              <CardDescription>
                Nhật ký cộng điểm từ hệ thống tự động.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-muted ml-3 space-y-8 py-2">
                {[
                  {
                    title: "Hoàn thành Task: Design Database",
                    desc: "Task được verify bởi Leader và merge vào nhánh main.",
                    points: "+5.0 Jira",
                    date: "2 giờ trước",
                    icon: LayoutList,
                    color: "text-blue-500",
                    bg: "bg-blue-100",
                    borderColor: "border-blue-200",
                  },
                  {
                    title: "Commit: Fix authentication bug",
                    desc: "Sửa lỗi đăng nhập Google OAuth trên mobile.",
                    points: "+12 LOC",
                    date: "Hôm qua, 14:30",
                    icon: GitCommit,
                    color: "text-slate-700",
                    bg: "bg-slate-100",
                    borderColor: "border-slate-200",
                  },
                  {
                    title: "Nhận đánh giá từ Leader",
                    desc: "'Làm việc tốt, code clean nhưng cần comment kỹ hơn.'",
                    points: "+0.5 Review",
                    date: "20/10/2025",
                    icon: MessageSquare,
                    color: "text-orange-600",
                    bg: "bg-orange-100",
                    borderColor: "border-orange-200",
                  },
                ].map((item, index) => (
                  <div key={index} className="relative pl-8 group">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background ${item.bg} ${item.borderColor}`}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors -mt-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span className="text-sm font-semibold leading-none">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                        <span className="text-xs text-muted-foreground/60">
                          {item.date}
                        </span>
                      </div>

                      <Badge
                        variant="outline"
                        className={`${item.bg} ${item.color} border-0 font-bold whitespace-nowrap`}
                      >
                        {item.points}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
