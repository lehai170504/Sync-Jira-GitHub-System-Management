"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Search, Loader2, Users, UserCheck, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

// Components
import { StudentImport } from "@/features/management/classes/components/student-import";
import { AddStudentDialog } from "@/features/management/classes/components/add-student-dialog";
import { StudentList } from "@/features/management/classes/components/student-list";

// Hooks & Types
import { useClassStudents } from "@/features/management/classes/hooks/use-classes";
import { ClassStudent } from "@/features/management/classes/types";

export default function ClassManagementPage() {
  // 1. Lấy thông tin Lớp học từ Cookie
  const classId = Cookies.get("lecturer_class_id");
  const className = Cookies.get("lecturer_class_name");
  const subjectCode = Cookies.get("lecturer_subject");

  // 2. Fetch Data Sinh viên từ API
  const { data: studentsData, isLoading, refetch } = useClassStudents(classId);

  // --- TRÍCH XUẤT & CHUẨN HÓA DỮ LIỆU (FIX QUAN TRỌNG) ---
  const rawStudents = studentsData?.students || [];

  // Map dữ liệu để đảm bảo tương thích với các component con
  const students: ClassStudent[] = rawStudents.map((s: any) => ({
    ...s,
    _id: s._id || s.id,
    pending_id: s.pending_id,

    // Các trường khác giữ nguyên
    student_code: s.student_code,
    full_name: s.full_name,
    email: s.email,
    avatar_url: s.avatar_url,
    team: s.team,
    role: s.role,
    status: s.status,
  }));

  const totalCount = studentsData?.total || 0;
  const enrolledCount = studentsData?.enrolled_count || 0;
  const pendingCount = studentsData?.pending_count || 0;

  // State Filter Client-side
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Handlers
  const handleImportSuccess = () => {
    refetch();
  };
  const handleSuccess = () => {
    refetch();
  };

  // Guard: Nếu chưa chọn lớp
  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 animate-in fade-in">
        <Users className="w-16 h-16 mb-4 text-gray-200" />
        <p className="text-lg font-medium">Chưa chọn lớp học</p>
        <p className="text-sm">
          Vui lòng quay lại danh sách và chọn một lớp để quản lý.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-3">
          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Lớp & Nhóm
          </h1>

          {/* Class Info & Stats Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            {/* Tên lớp & Môn */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F27124] bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
                {className || "Unknown Class"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="font-medium text-gray-700">
                {subjectCode || "Unknown Subject"}
              </span>
            </div>

            {/* Thống kê Enrolled / Pending */}
            {!isLoading && (
              <div className="flex items-center gap-3">
                {/* Enrolled Badge */}
                <div
                  title={`${enrolledCount} sinh viên đã có tài khoản`}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-medium"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>
                    Đã tham gia: <b>{enrolledCount}</b>
                  </span>
                </div>

                {/* Pending Badge */}
                {pendingCount > 0 && (
                  <div
                    title={`${pendingCount} sinh viên chưa đăng ký hệ thống`}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100 text-xs font-medium"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Chờ đăng ký: <b>{pendingCount}</b>
                    </span>
                  </div>
                )}

                <span className="text-xs text-gray-400">
                  Tổng: {totalCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <StudentImport classId={classId} onSuccess={handleImportSuccess} />
          <AddStudentDialog classId={classId} onSuccess={handleSuccess} />
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc MSSV..."
            className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-[#F27124] focus:ring-2 focus:ring-orange-100 rounded-xl transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STUDENT LIST */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
            <p className="text-sm text-gray-500">
              Đang tải danh sách sinh viên...
            </p>
          </div>
        </div>
      ) : (
        <StudentList
          classId={classId}
          // Truyền danh sách đã được chuẩn hóa (có pending_id)
          students={students}
          filterTerm={searchTerm}
          onRefresh={refetch}
        />
      )}
    </div>
  );
}
