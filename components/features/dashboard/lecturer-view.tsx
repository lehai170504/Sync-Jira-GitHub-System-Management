"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Users,
  Layers,
  BarChart3,
  CheckCircle2,
  MoreVertical,
  Bell,
  ArrowRight,
  MapPin,
  Link as LinkIcon,
  TrendingUp,
  Clock,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// --- MOCK DATA ---
const PERFORMANCE_DATA = [
  { name: "Excellent", value: 45, color: "#4f46e5" }, // Indigo
  { name: "Good", value: 35, color: "#f97316" }, // Orange
  { name: "Average", value: 20, color: "#22c55e" }, // Green
];

const STUDENTS_LIST = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    topic: "E-Commerce AI",
    grade: "A (Very Good)",
    status: "In Progress",
    avatar: "A",
  },
  {
    id: 2,
    name: "Trần Thị Bích",
    topic: "LMS System",
    grade: "B+ (Good)",
    status: "In Progress",
    avatar: "B",
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    topic: "Grab Clone",
    grade: "C (Pass)",
    status: "Reviewed",
    avatar: "C",
  },
  {
    id: 4,
    name: "Phạm Minh Duy",
    topic: "IoT Dashboard",
    grade: "A+ (Excellent)",
    status: "Not viewed",
    avatar: "P",
  },
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

  useEffect(() => {
    const savedClass = Cookies.get("lecturer_class_name");
    const savedSubject = Cookies.get("lecturer_subject");

    // Nếu không có cookie (chưa chọn lớp), giả lập dữ liệu để hiện UI đẹp (hoặc redirect)
    if (!savedClass) {
      // router.push("/lecturer/courses"); // Uncomment dòng này khi chạy thật
      setClassName("SE1783");
      setSubjectCode("SWP391");
    } else {
      setClassName(savedClass);
      setSubjectCode(savedSubject || "");
    }
  }, [router]);

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10">
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tổng quan Lớp học
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            Chào mừng trở lại! Đây là tình hình lớp{" "}
            <span className="font-bold text-[#F27124]">{className}</span> môn{" "}
            <span className="font-bold text-gray-700">{subjectCode}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border shadow-sm">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full text-gray-500 hover:text-[#F27124] hover:bg-orange-50 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-[#F27124] text-white">
              GV
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Students */}
        <Card className="border-none shadow-sm bg-white ring-1 ring-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sĩ số
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">30</h3>
                <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-medium">
                  <TrendingUp className="h-3 w-3" /> +2 mới
                </div>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Groups */}
        <Card className="border-none shadow-sm bg-white ring-1 ring-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Số Nhóm
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">6</h3>
                <p className="text-xs text-gray-400 mt-1">Đã chốt danh sách</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: In Progress */}
        <Card className="border-none shadow-sm bg-white ring-1 ring-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Đang thực hiện
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">18</h3>
                <p className="text-xs text-orange-600 mt-1 font-medium">
                  Cần review gấp
                </p>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Completed */}
        <Card className="border-none shadow-sm bg-white ring-1 ring-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hoàn thành
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">23</h3>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  Đạt chỉ tiêu
                </p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MIDDLE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Student Performance Chart (Span 4) */}
        <Card className="md:col-span-4 border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold text-gray-800">
              Kết quả học tập
            </CardTitle>
            <MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[280px]">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PERFORMANCE_DATA}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={5}
                  >
                    {PERFORMANCE_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">75%</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest">
                  Passed
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              {PERFORMANCE_DATA.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 text-xs font-medium"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar (Span 4) */}
        <Card className="md:col-span-4 border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2 text-gray-800">
              <CalendarIcon className="h-4 w-4 text-[#F27124]" />
              <span className="text-base font-bold">Lịch trình</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">
                Tháng 1, 2026
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simple Calendar Mock */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase font-bold text-gray-400 mb-3">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {/* Empty days */}
              {[...Array(3)].map((_, i) => (
                <div key={`e-${i}`}></div>
              ))}
              {/* Days */}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isToday = day === 22; // Mock today
                return (
                  <div
                    key={day}
                    className={`h-9 w-9 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200
                            ${
                              isToday
                                ? "bg-[#F27124] text-white shadow-md shadow-orange-200 font-bold scale-110"
                                : "text-gray-600 hover:bg-gray-100 font-medium"
                            }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Sự kiện hôm nay
              </span>
              <Badge
                variant="secondary"
                className="bg-orange-50 text-[#F27124] hover:bg-orange-100"
              >
                2 Task
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Messages / Notifications (Span 4) */}
        <Card className="md:col-span-4 border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold text-gray-800">
              Thông báo mới
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#F27124] hover:text-[#d65d1b] hover:bg-orange-50 h-7"
            >
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    i === 1 ? "bg-red-500" : "bg-gray-300"
                  }`}
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {i === 1
                        ? "Phòng Đào tạo"
                        : i === 2
                        ? "Nhóm 1 (E-Com)"
                        : "Hệ thống"}
                    </h4>
                    <span className="text-[10px] text-gray-400 group-hover:text-gray-600">
                      2h trước
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5 line-clamp-1">
                    {i === 1
                      ? "Thông báo về lịch nghỉ tết Nguyên Đán..."
                      : i === 2
                      ? "Em xin phép nộp muộn Lab 1 ạ..."
                      : "Server bảo trì định kỳ..."}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. BOTTOM SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Students Table (Span 8) */}
        <Card className="md:col-span-8 border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-gray-800">
              Sinh viên tiêu biểu
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed text-xs"
              >
                <Search className="h-3 w-3 mr-1" /> Tìm kiếm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-gray-500"
              >
                Xem tất cả <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {STUDENTS_LIST.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-12 items-center gap-4 py-3 px-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 rounded-lg transition-all group cursor-pointer"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-100 group-hover:border-[#F27124]/50 transition-colors">
                      <AvatarFallback className="bg-orange-50 text-[#F27124] text-xs font-bold">
                        {s.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block group-hover:text-[#F27124] transition-colors">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        SE170{s.id}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-3 text-xs text-gray-600 font-medium bg-gray-50 px-2 py-1 rounded w-fit">
                    {s.topic}
                  </div>
                  <div className="col-span-2 text-xs font-bold text-gray-800">
                    {s.grade}
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={`border-0 font-medium px-2 py-0.5
                              ${
                                s.status === "In Progress"
                                  ? "bg-blue-50 text-blue-600"
                                  : s.status === "Reviewed"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-orange-50 text-orange-600"
                              }
                           `}
                    >
                      {s.status === "In Progress"
                        ? "Đang làm"
                        : s.status === "Reviewed"
                        ? "Đã chấm"
                        : "Chưa xem"}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Timetable (Span 4) */}
        <Card className="md:col-span-4 border-none shadow-sm bg-[#FDF8F3] ring-1 ring-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#F27124]" /> Lịch dạy hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SCHEDULE.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-orange-100/50 hover:border-orange-200 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#F27124] mb-0.5">
                    {item.time}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {item.class}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500 font-medium">
                    <MapPin className="h-3 w-3" /> {item.room}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-[#F27124] hover:bg-orange-50"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Quick Note Area */}
            <div className="mt-4">
              <textarea
                className="w-full text-xs p-3 bg-white/50 border border-orange-100 rounded-lg focus:ring-1 focus:ring-[#F27124] resize-none h-20 outline-none text-gray-700 placeholder:text-gray-400 focus:bg-white transition-colors"
                placeholder="Ghi chú nhanh cho lớp..."
              ></textarea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
