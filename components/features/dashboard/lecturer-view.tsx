"use client";

import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import {
  Users,
  Layers,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { SendClassNotification } from "@/features/notifications/components/SendClassNotification";

const PERFORMANCE_DATA = [
  { name: "Excellent", value: 45, color: "#4f46e5" },
  { name: "Good", value: 35, color: "#f27124" },
  { name: "Average", value: 20, color: "#10b981" },
];

const SCHEDULE = [
  { time: "07:30", class: "SE1783", room: "BE-401", type: "Offline" },
  { time: "09:10", class: "SE1783", room: "BE-401", type: "Offline" },
  { time: "13:30", class: "SE1802", room: "Google Meet", type: "Online" },
];

interface LecturerDashboardProps {
  classId?: string;
}

export function LecturerDashboard({ classId }: LecturerDashboardProps) {
  const { data: classDetails, isLoading } = useClassDetails(classId);

  const className = classDetails?.class?.name || "Đang tải...";
  const subjectCode = classDetails?.class?.subject_id?.code || "...";
  const studentCount = classDetails?.stats?.total_students || 0;
  const teamCount = classDetails?.stats?.total_teams || 0;

  if (!classId) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <Sparkles className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-medium">
          Vui lòng chọn một lớp học để xem tổng quan.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10 font-sans transition-colors duration-300">
      {/* 1. HERO WELCOME SECTION */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-[0.02] pointer-events-none">
          <Sparkles className="w-40 h-40 text-[#F27124]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <Badge className="bg-orange-100 dark:bg-orange-900/20 text-[#F27124] dark:text-orange-400 mb-2 uppercase tracking-[0.2em] text-[10px] font-black px-4 py-1 rounded-full border-none transition-colors">
              Lecturer Workspace
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-50 leading-tight transition-colors">
              Tổng quan Lớp học
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium flex items-center gap-2 flex-wrap transition-colors">
              Tình hình lớp{" "}
              <span className="text-[#F27124] dark:text-orange-400 font-black underline decoration-2 underline-offset-4 decoration-orange-200 dark:decoration-orange-900/50">
                {className}
              </span>
              môn{" "}
              <span className="text-slate-900 dark:text-slate-100 font-black">
                {subjectCode}
              </span>
            </p>
          </div>

          <div className="shrink-0 transition-all hover:scale-105 active:scale-95">
            <SendClassNotification classId={classId} className={className} />
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Sĩ số",
            value: studentCount,
            icon: Users,
            color:
              "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
            trend: "+Ổn định",
          },
          {
            label: "Số Nhóm",
            value: teamCount,
            icon: Layers,
            color:
              "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            trend: "Đã chốt",
          },
          {
            label: "Đang làm",
            value: "18",
            icon: BarChart3,
            color:
              "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
            trend: "Cần review",
          },
          {
            label: "Hoàn thành",
            value: "23",
            icon: CheckCircle2,
            color:
              "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
            trend: "Đạt chỉ tiêu",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-orange-200 dark:hover:ring-orange-900/50 transition-all group rounded-[28px] overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter transition-colors">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 transition-colors">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />{" "}
                    {stat.trend}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-4 rounded-2xl transition-all group-hover:scale-110 shadow-sm dark:shadow-none",
                    stat.color,
                  )}
                >
                  <stat.icon className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. ANALYTICS & BROADCAST SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kết quả học tập */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden transition-colors">
          <CardHeader className="px-8 pt-8 pb-0">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight transition-colors">
              Hiệu suất học tập
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="relative w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PERFORMANCE_DATA}
                    innerRadius={80}
                    outerRadius={105}
                    paddingAngle={10}
                    dataKey="value"
                    strokeWidth={0}
                    cornerRadius={12}
                  >
                    {PERFORMANCE_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      backgroundColor: "var(--tw-colors-slate-900)", // Hỗ trợ tooltip tối nếu cần
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter transition-colors">
                  75%
                </span>
                <span className="text-[10px] text-emerald-500 dark:text-emerald-400 uppercase font-black tracking-[0.2em] mt-2 transition-colors">
                  Pass Rate
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-10 w-full px-2">
              {PERFORMANCE_DATA.map((item) => (
                <div key={item.name} className="text-center space-y-1.5">
                  <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter transition-colors">
                    {item.name}
                  </div>
                  <div
                    className="text-lg font-black"
                    style={{ color: item.color }}
                  >
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lịch trình dạy học */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden transition-colors">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3 transition-colors">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg transition-colors">
                <CalendarIcon className="h-5 w-5 text-[#F27124] dark:text-orange-400" />
              </div>
              Lịch dạy
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[10px] font-black border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-full px-3 transition-colors"
            >
              TODAY
            </Badge>
          </CardHeader>
          <CardContent className="p-8 space-y-5">
            {SCHEDULE.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-[24px] border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900/50 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-all cursor-pointer group shadow-sm dark:shadow-none"
              >
                <div className="flex gap-5 items-center">
                  <div className="text-center min-w-[50px]">
                    <p className="text-sm font-black text-[#F27124] dark:text-orange-400 transition-colors">
                      {item.time}
                    </p>
                  </div>
                  <div className="w-[1.5px] h-10 bg-slate-200 dark:bg-slate-700 rounded-full group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors" />
                  <div className="overflow-hidden">
                    <p className="font-black text-slate-900 dark:text-slate-100 text-base tracking-tight transition-colors">
                      {item.class}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 mt-1 uppercase tracking-tight transition-colors">
                      <MapPin className="h-3.5 w-3.5 opacity-50" /> {item.room}
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group-hover:translate-x-1 transition-all shadow-sm dark:shadow-none">
                  <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#F27124] dark:group-hover:text-orange-400 transition-colors" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cột 3: Broadcast Center */}
        <Card className="lg:col-span-4 border-none shadow-2xl shadow-orange-600/20 dark:shadow-none bg-[#F27124] dark:bg-[#c05615] rounded-[32px] overflow-hidden relative group transition-colors duration-300">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
            <Clock className="w-48 h-48 text-white" />
          </div>
          <CardHeader className="relative z-10 px-8 pt-8">
            <CardTitle className="text-xl font-black text-white flex items-center gap-3">
              <TrendingUp className="h-6 w-6" /> Broadcast Center
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-8 p-8 pt-4">
            <div className="p-7 bg-white/15 backdrop-blur-md rounded-[28px] border border-white/20 shadow-inner">
              <p className="text-base text-orange-50 leading-relaxed font-bold mb-8">
                Cần nhắc cả lớp về{" "}
                <span className="text-white underline decoration-wavy underline-offset-4">
                  deadline
                </span>
                , báo nghỉ hoặc gửi link họp trực tuyến ngay bây giờ?
              </p>
              <div className="w-full transition-transform hover:-translate-y-1">
                <SendClassNotification
                  classId={classId}
                  className={className}
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-black/10 dark:bg-black/20 py-3 rounded-2xl border border-white/5">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black text-orange-50 uppercase tracking-[0.2em]">
                FCM System Online
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
