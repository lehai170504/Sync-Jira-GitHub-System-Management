"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Search,
  Users,
  Calendar,
  LogOut,
  ArrowRight,
  Filter,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// MOCK DATA: Các lớp học của giảng viên (Thêm vài kỳ cũ để test filter)
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
  {
    id: "CLS004",
    subjectCode: "PRM392",
    subjectName: "Mobile Programming",
    className: "SE1601",
    students: 28,
    semester: "Fall 2025",
    schedule: "Mon-Wed (Slot 1)",
    color: "bg-gradient-to-br from-gray-500 to-gray-600", // Màu cũ cho kỳ cũ
  },
];

// Lấy danh sách các kỳ học duy nhất từ data
const SEMESTERS = Array.from(new Set(TEACHING_CLASSES.map((c) => c.semester)))
  .sort()
  .reverse();

export default function LecturerCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Spring 2026"); // Mặc định chọn kỳ mới nhất

  const handleSelectClass = (cls: any) => {
    Cookies.set("lecturer_class_id", cls.id);
    Cookies.set("lecturer_class_name", cls.className);
    Cookies.set("lecturer_subject", cls.subjectCode);
    router.push("/dashboard");
  };

  const handleLogout = () => {
    Cookies.remove("user_role");
    Cookies.remove("lecturer_class_id");
    Cookies.remove("lecturer_class_name");
    Cookies.remove("lecturer_subject");
    router.push("/login");
  };

  // Logic lọc dữ liệu
  const filtered = useMemo(() => {
    return TEACHING_CLASSES.filter((c) => {
      const matchSearch =
        c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSemester =
        selectedSemester === "ALL" || c.semester === selectedSemester;
      return matchSearch && matchSemester;
    });
  }, [searchTerm, selectedSemester]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in-50">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#F27124] rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-200">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none tracking-tight">
              SyncSystem
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Lecturer Portal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-800">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500">Giảng viên FPT</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-white shadow-sm hover:ring-2 hover:ring-[#F27124] transition-all">
                <AvatarFallback className="bg-[#F27124] text-white font-bold">
                  GV
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* FILTER BAR SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-[#F27124]" /> Các lớp giảng dạy
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Chọn lớp học để bắt đầu quản lý và chấm điểm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* SEMESTER SELECTOR */}
            <div className="w-full sm:w-[180px]">
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="h-11 bg-white border-gray-200 shadow-sm rounded-lg focus:ring-2 focus:ring-[#F27124]/20">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Chọn học kỳ" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả các kỳ</SelectItem>
                  {SEMESTERS.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SEARCH INPUT */}
            <div className="flex items-center gap-2 bg-white px-3 h-11 rounded-lg border border-gray-200 shadow-sm w-full md:w-80 focus-within:ring-2 focus-within:ring-[#F27124]/20 focus-within:border-[#F27124] transition-all">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <Input
                placeholder="Tìm lớp hoặc môn học..."
                className="border-0 focus-visible:ring-0 h-full p-0 text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CLASS GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {filtered.map((cls) => (
              <Card
                key={cls.id}
                className="group overflow-hidden border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full bg-white ring-1 ring-gray-200 hover:ring-[#F27124]/50"
                onClick={() => handleSelectClass(cls)}
              >
                {/* Card Header Color */}
                <div
                  className={`h-32 ${cls.color} relative p-6 flex flex-col justify-between`}
                >
                  <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
                    <ArrowRight className="text-white w-4 h-4" />
                  </div>

                  <span className="bg-black/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-fit backdrop-blur-md uppercase tracking-wide border border-white/10">
                    {cls.semester}
                  </span>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-0.5 tracking-tight group-hover:underline decoration-2 underline-offset-4 decoration-white/50">
                      {cls.className}
                    </h3>
                    <p className="text-white/90 text-xs font-bold uppercase tracking-wider opacity-80">
                      {cls.subjectCode}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="flex-1 p-5">
                  <h4 className="font-bold text-gray-800 line-clamp-2 h-10 text-base mb-4 group-hover:text-[#F27124] transition-colors">
                    {cls.subjectName}
                  </h4>
                  <div className="space-y-2.5 pt-3 border-t border-dashed border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-6 flex justify-center mr-2">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900 mr-1">
                        {cls.students}
                      </span>
                      <span className="text-gray-500 text-xs">sinh viên</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-6 flex justify-center mr-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-700 font-medium text-xs">
                        {cls.schedule}
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Card Footer */}
                <CardFooter className="px-5 py-3 bg-gray-50 border-t flex justify-between items-center group-hover:bg-[#FFF8F3] transition-colors">
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#F27124] uppercase tracking-wider flex items-center gap-1">
                    <Filter className="h-3 w-3" /> Dashboard
                  </span>
                  <div className="h-6 w-6 rounded-full bg-white border flex items-center justify-center group-hover:border-[#F27124] transition-colors shadow-sm">
                    <ArrowRight className="h-3 w-3 text-[#F27124]" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Không tìm thấy lớp học nào
            </h3>
            <p className="text-gray-500 text-sm max-w-md mt-1">
              Thử thay đổi bộ lọc học kỳ hoặc từ khóa tìm kiếm của bạn.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-dashed"
              onClick={() => {
                setSearchTerm("");
                setSelectedSemester("ALL");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
