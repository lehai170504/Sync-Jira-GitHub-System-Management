"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

// 👇 IMPORT COMPONENT GỬI THÔNG BÁO
import { SendClassNotification } from "@/features/notifications/components/SendClassNotification";

// --- MOCK DATA ---
const PERFORMANCE_DATA = [
  { name: "Excellent", value: 45, color: "#4f46e5" },
  { name: "Good", value: 35, color: "#f27124" }, // Đổi màu orange đồng bộ thương hiệu
  { name: "Average", value: 20, color: "#10b981" },
];

const SCHEDULE = [
  { time: "07:30", class: "SE1783", room: "BE-401", type: "Offline" },
  { time: "09:10", class: "SE1783", room: "BE-401", type: "Offline" },
  { time: "13:30", class: "SE1802", room: "Google Meet", type: "Online" },
];

export function LecturerDashboard() {
  const router = useRouter();
  const [className, setClassName] = useState("Loading...");
  const [subjectCode, setSubjectCode] = useState("...");
  const [classId, setClassId] = useState("");

  useEffect(() => {
    const savedClassId = Cookies.get("lecturer_class_id");
    const savedClass = Cookies.get("lecturer_class_name");
    const savedSubject = Cookies.get("lecturer_subject");

    if (!savedClass) {
      setClassName("SE1783");
      setSubjectCode("SWP391");
      setClassId("mock-class-id");
    } else {
      setClassName(savedClass);
      setSubjectCode(savedSubject || "");
      setClassId(savedClassId || "");
    }
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10 font-sans">
      {/* 1. HERO WELCOME SECTION */}
      <div className="relative overflow-hidden bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Sparkles className="w-40 h-40 text-[#F27124]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <Badge className="bg-orange-100 text-[#F27124] hover:bg-orange-100 mb-2 uppercase tracking-[0.2em] text-[10px] font-black px-4 py-1 rounded-full border-none">
              Lecturer Workspace
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
              Tổng quan Lớp học
            </h1>
            <p className="text-slate-500 text-lg font-medium flex items-center gap-2">
              Tình hình lớp{" "}
              <span className="text-[#F27124] font-black underline decoration-2 underline-offset-4 decoration-orange-200">
                {className}
              </span>
              môn{" "}
              <span className="text-slate-900 font-black">{subjectCode}</span>
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
            value: "30",
            icon: Users,
            color: "bg-indigo-50 text-indigo-600",
            trend: "+2 mới",
          },
          {
            label: "Số Nhóm",
            value: "06",
            icon: Layers,
            color: "bg-blue-50 text-blue-600",
            trend: "Đã chốt",
          },
          {
            label: "Đang làm",
            value: "18",
            icon: BarChart3,
            color: "bg-orange-50 text-orange-600",
            trend: "Cần review",
          },
          {
            label: "Hoàn thành",
            value: "23",
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
            trend: "Đạt chỉ tiêu",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm bg-white ring-1 ring-slate-100 hover:ring-orange-200 transition-all group rounded-[28px] overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />{" "}
                    {stat.trend}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-4 rounded-2xl transition-all group-hover:scale-110 shadow-sm",
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
        {/* Kết quả học tập - Biểu đồ tập trung vào Typography và Khoảng trắng */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-0">
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  75%
                </span>
                <span className="text-[10px] text-emerald-500 uppercase font-black tracking-[0.2em] mt-2">
                  Pass Rate
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-10 w-full px-2">
              {PERFORMANCE_DATA.map((item) => (
                <div key={item.name} className="text-center space-y-1.5">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
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

        {/* Lịch trình dạy học - Hiện đại hóa List Item */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-[#F27124]" />
              </div>
              Lịch dạy
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[10px] font-black border-slate-200 text-slate-400 rounded-full px-3"
            >
              TODAY
            </Badge>
          </CardHeader>
          <CardContent className="p-8 space-y-5">
            {SCHEDULE.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex gap-5 items-center">
                  <div className="text-center min-w-[50px]">
                    <p className="text-sm font-black text-[#F27124]">
                      {item.time}
                    </p>
                  </div>
                  <div className="w-[1.5px] h-10 bg-slate-200 rounded-full group-hover:bg-orange-200 transition-colors" />
                  <div className="overflow-hidden">
                    <p className="font-black text-slate-900 text-base tracking-tight">
                      {item.class}
                    </p>
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-1 uppercase tracking-tight">
                      <MapPin className="h-3.5 w-3.5 opacity-50" /> {item.room}
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white border border-slate-100 group-hover:translate-x-1 transition-all shadow-sm">
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#F27124]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cột 3: Broadcast Center - Glassmorphism Card */}
        <Card className="lg:col-span-4 border-none shadow-2xl shadow-orange-600/20 bg-[#F27124] rounded-[32px] overflow-hidden relative group">
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
            <div className="flex items-center justify-center gap-3 bg-black/10 py-3 rounded-2xl border border-white/5">
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
