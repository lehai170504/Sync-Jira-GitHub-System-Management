"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Search,
  Users,
  Calendar,
  LogOut,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// MOCK DATA: Các lớp học của giảng viên
const TEACHING_CLASSES = [
  {
    id: "CLS001",
    subjectCode: "PRM392",
    subjectName: "Mobile Programming",
    className: "SE1783",
    students: 30,
    semester: "Spring 2026",
    schedule: "Mon-Wed (Slot 2)",
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "CLS002",
    subjectCode: "SWP391",
    subjectName: "Software Development Project",
    className: "SE1831",
    students: 25,
    semester: "Spring 2026",
    schedule: "Tue-Thu (Slot 4)",
    color: "bg-gradient-to-br from-blue-600 to-indigo-700",
  },
  {
    id: "CLS003",
    subjectCode: "SDN302",
    subjectName: "Server-Side with NodeJS",
    className: "SE1704",
    students: 32,
    semester: "Spring 2026",
    schedule: "Fri (Slot 1-2)",
    color: "bg-gradient-to-br from-teal-400 to-emerald-500",
  },
];

export default function LecturerCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectClass = (cls: any) => {
    // 1. Lưu thông tin lớp vào Cookie để Sidebar và Dashboard đọc được
    Cookies.set("lecturer_class_id", cls.id);
    Cookies.set("lecturer_class_name", cls.className);
    Cookies.set("lecturer_subject", cls.subjectCode);

    // 2. Chuyển hướng sang Dashboard chung của lớp đó
    router.push("/dashboard");
  };

  const handleLogout = () => {
    Cookies.remove("user_role");
    // Xóa luôn cookie lớp học nếu có
    Cookies.remove("lecturer_class_id");
    Cookies.remove("lecturer_class_name");
    Cookies.remove("lecturer_subject");
    router.push("/login");
  };

  const filtered = TEACHING_CLASSES.filter(
    (c) =>
      c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in-50">
      {/* HEADER RIÊNG (Vì trang này Full Screen, không có Sidebar) */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#F27124] rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">
              SyncSystem
            </h1>
            <p className="text-xs text-gray-500 font-medium">Lecturer Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-700">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500">Giảng viên</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-white shadow-sm hover:ring-2 hover:ring-[#F27124] transition-all">
                <AvatarFallback className="bg-[#F27124] text-white">
                  GV
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Các lớp giảng dạy
            </h2>
            <p className="text-gray-500 mt-1 text-lg">Học kỳ Spring 2026</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border shadow-sm w-full md:w-auto focus-within:ring-2 focus-within:ring-[#F27124]/20 transition-all">
            <Search className="h-4 w-4 text-gray-400 ml-2" />
            <Input
              placeholder="Tìm lớp hoặc môn học..."
              className="border-0 focus-visible:ring-0 h-9 w-full md:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Lớp học */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((cls) => (
            <Card
              key={cls.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full bg-white ring-1 ring-gray-200"
              onClick={() => handleSelectClass(cls)}
            >
              {/* Card Header Color */}
              <div
                className={`h-36 ${cls.color} relative p-6 flex flex-col justify-between`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <ArrowRight className="text-white w-5 h-5" />
                  </div>
                </div>

                <span className="bg-black/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-fit backdrop-blur-md uppercase tracking-wide">
                  {cls.semester}
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">
                    {cls.className}
                  </h3>
                  <p className="text-white/90 text-sm font-medium uppercase tracking-wider opacity-90">
                    {cls.subjectCode}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <CardContent className="flex-1 p-6 pt-5">
                <h4 className="font-semibold text-gray-900 line-clamp-2 mb-4 h-12 text-lg group-hover:text-[#F27124] transition-colors">
                  {cls.subjectName}
                </h4>
                <div className="space-y-3 pt-3 border-t border-dashed border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900 mr-1">
                      {cls.students}
                    </span>{" "}
                    sinh viên
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    {cls.schedule}
                  </div>
                </div>
              </CardContent>

              {/* Card Footer */}
              <CardFooter className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center group-hover:bg-[#FFF8F3] transition-colors">
                <span className="text-xs font-semibold text-gray-400 group-hover:text-[#F27124] uppercase tracking-wider">
                  Truy cập lớp học
                </span>
                <div className="h-6 w-6 rounded-full bg-white border flex items-center justify-center group-hover:border-[#F27124] transition-colors shadow-sm">
                  <span className="text-[#F27124] text-xs font-bold">→</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
