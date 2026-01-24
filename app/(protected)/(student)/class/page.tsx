"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import {
  Search,
  Loader2,
  Users,
  UserCheck,
  GraduationCap,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Components
import { StudentClassList } from "@/features/management/classes/components/student-class-list";
import { AddProjectDialog } from "@/features/projects/components/AddProjectDialog";

// Hooks
import { useClassStudents } from "@/features/management/classes/hooks/use-classes";
import { useMyProject } from "@/features/projects/hooks/use-my-project";

export default function StudentClassListPage() {
  // 1. Lấy thông tin từ Cookie
  const classId = Cookies.get("student_class_id");
  const className = Cookies.get("student_class_name");
  const myTeamName = Cookies.get("student_team_name");
  const isLeader = Cookies.get("student_is_leader") === "true";

  // 2. Fetch Data
  const [searchTerm, setSearchTerm] = useState("");
  const { data: studentsData, isLoading: isStudentsLoading } =
    useClassStudents(classId);

  const {
    data: project,
    isLoading: isProjectLoading,
    refetch,
  } = useMyProject();

  const students = studentsData?.students || [];
  const totalCount = studentsData?.total || 0;
  const enrolledCount = studentsData?.enrolled_count || 0;

  const myTeamMembers = students.filter((s: any) => s.team === myTeamName);

  // 3. Render Guard: Trạng thái chưa chọn lớp
  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500 animate-in fade-in zoom-in-95">
        <div className="p-8 bg-white rounded-full mb-6 shadow-sm border border-gray-100">
          <Users className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-xl font-semibold text-gray-800">Chưa chọn lớp học</p>
        <p className="text-sm mt-2 text-gray-400">
          Vui lòng chọn lớp học từ màn hình chính để xem danh sách.
        </p>
        <Button asChild className="mt-6 bg-[#F27124] hover:bg-[#d45d1d]">
          <Link href="/courses">Quay lại danh sách lớp</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10">
      {/* --- TOP TITLE SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F27124] mb-1">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Thông tin lớp học
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Thành viên lớp {className}
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý và theo dõi danh sách đồng đội tham gia dự án.
          </p>
        </div>

        {/* --- Nút Action cho Leader --- */}
        {isLeader && myTeamName && (
          <div className="shrink-0">
            {isProjectLoading ? (
              <Button disabled className="rounded-xl gap-2 px-4 h-10 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang kiểm tra...
              </Button>
            ) : project ? (
              // 👇 Hiển thị khi đã có Project
              <Button
                variant="outline"
                className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 font-bold uppercase tracking-tight rounded-xl gap-2 px-4 h-10 text-xs cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã tạo project
              </Button>
            ) : (
              <AddProjectDialog
                members={myTeamMembers}
                onSuccess={() => refetch()}
              />
            )}
          </div>
        )}
      </div>

      {/* --- STATS CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-orange-50 rounded-xl text-[#F27124]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Tổng số
            </p>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Đã tham gia
            </p>
            <p className="text-2xl font-bold text-gray-900">{enrolledCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Nhóm của bạn
            </p>
            <p
              className="text-xl font-bold text-gray-900 truncate"
              title={myTeamName}
            >
              {myTeamName || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* --- SEARCH FILTER --- */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
        <input
          placeholder="Tìm kiếm đồng đội theo tên hoặc MSSV..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-500/5 focus:border-[#F27124] transition-all outline-none text-gray-700 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- DATA LIST SECTION --- */}
      <div className="relative min-h-[400px]">
        {isStudentsLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200">
            <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
            <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">
              Đang đồng bộ dữ liệu lớp học...
            </p>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-700 ease-out">
            <StudentClassList students={students} filterTerm={searchTerm} />
          </div>
        )}
      </div>
    </div>
  );
}
