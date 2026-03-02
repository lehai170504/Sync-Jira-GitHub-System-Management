"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import { toast } from "sonner";

// Components
import { StudentList } from "@/features/management/classes/components/student-class-list";
import { AddProjectDialog } from "@/features/projects/components/add-project-dialog";

// Hooks
import { useClassStudents } from "@/features/management/classes/hooks/use-classes";
import { useMyProject } from "@/features/projects/hooks/use-my-project";
import { useSocket } from "@/components/providers/socket-provider";

export default function StudentClassListPage() {
  const classId = Cookies.get("student_class_id");
  const className = Cookies.get("student_class_name");
  const myTeamName = Cookies.get("student_team_name");
  const teamId = Cookies.get("student_team_id");
  const isLeader = Cookies.get("student_is_leader") === "true";

  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: studentsData,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useClassStudents(classId);

  const {
    data: allMyProjects = [],
    isLoading: isProjectLoading,
    refetch: refetchProject,
  } = useMyProject();

  const { socket, isConnected } = useSocket();
  const prevConnected = useRef(false);

  // Refetch khi vừa reconnect
  useEffect(() => {
    const justReconnected = !prevConnected.current && isConnected;
    prevConnected.current = isConnected;
    if (justReconnected && classId) refetchStudents();
  }, [isConnected, classId, refetchStudents]);

  // Fallback: refetch khi quay lại tab (giảng viên import ở tab khác)
  useEffect(() => {
    if (!classId) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") refetchStudents();
    };
    window.addEventListener("visibilitychange", onVisible);
    return () => window.removeEventListener("visibilitychange", onVisible);
  }, [classId, refetchStudents]);

  // Socket: join room + nghe refresh_class (đồng bộ khi GV import/thêm/xóa thành viên)
  useEffect(() => {
    if (!socket || !isConnected || !classId) return;

    const roomId = (classId ?? "").trim();
    const roomName = (className ?? "").trim() || roomId;

    const onAny = (event: string, ...args: unknown[]) => {
      console.log("[Socket] ←", event, args?.length ? args : "");
    };
    socket.onAny(onAny);

    socket.emit("join_class", roomId);
    if (roomName !== roomId) socket.emit("join_class", roomName);

    const handleRefreshClass = () => {
      toast.promise(refetchStudents(), {
        loading: "Đang đồng bộ danh sách lớp...",
        success: "Đã cập nhật!",
        error: "Lỗi đồng bộ.",
      });
    };

    socket.on("refresh_class", handleRefreshClass);

    return () => {
      socket.offAny(onAny);
      socket.off("refresh_class", handleRefreshClass);
      socket.emit("leave_class", roomId);
      if (roomName !== roomId) socket.emit("leave_class", roomName);
    };
  }, [socket, isConnected, classId, className, refetchStudents]);

  const students = studentsData?.students || [];
  const totalCount = studentsData?.total || 0;
  const enrolledCount = studentsData?.enrolled_count || 0;

  const myTeamMembers = students.filter((s: any) => s.team === myTeamName);

  // Project thuộc lớp đang chọn mới coi là "đã có project"
  const hasValidProject = useMemo(() => {
    if (!allMyProjects?.length || !classId) return false;
    return allMyProjects.some(
      (p) =>
        p.class_id &&
        (p.class_id._id === classId || p.class_id.name === className)
    );
  }, [allMyProjects, classId, className]);

  // 3. Render Guard: Trạng thái chưa chọn lớp
  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500 dark:text-slate-400 animate-in fade-in zoom-in-95">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-full mb-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <Users className="w-12 h-12 text-gray-300 dark:text-slate-500" />
        </div>
        <p className="text-xl font-semibold text-gray-800 dark:text-slate-100">
          Chưa chọn lớp học
        </p>
        <p className="text-sm mt-2 text-gray-400 dark:text-slate-400">
          Vui lòng chọn lớp học từ màn hình chính để xem danh sách.
        </p>
        <Button
          asChild
          className="mt-6 bg-[#F27124] hover:bg-[#d45d1d] dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          <Link href="/courses">Quay lại danh sách lớp</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10 text-slate-900 dark:text-slate-100">
      {/* --- TOP TITLE SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F27124] mb-1">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Thông tin lớp học
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
            Thành viên lớp {className}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
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
            ) : hasValidProject ? (
              // 👇 Hiển thị khi đã có Project thuộc lớp hiện tại
              <Button
                variant="outline"
                className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 font-bold uppercase tracking-tight rounded-xl gap-2 px-4 h-10 text-xs cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã tạo project
              </Button>
            ) : (
              // Chưa có project hoặc project thuộc lớp khác → hiện nút khởi tạo
              <AddProjectDialog
                members={myTeamMembers}
                classId={classId}
                teamId={teamId}
                onSuccess={() => refetchProject()}
              />
            )}
          </div>
        )}
      </div>

      {/* --- STATS CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md dark:hover:shadow-lg/5">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-[#F27124]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase tracking-widest">
              Tổng số
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
              {totalCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md dark:hover:shadow-lg/5">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase tracking-widest">
              Đã tham gia
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
              {enrolledCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md dark:hover:shadow-lg/5">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase tracking-widest">
              Nhóm của bạn
            </p>
            <p
              className="text-xl font-bold text-gray-900 dark:text-slate-50 truncate"
              title={myTeamName}
            >
              {myTeamName || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* --- SEARCH FILTER --- */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-[#F27124] transition-colors" />
        <input
          placeholder="Tìm kiếm đồng đội theo tên hoặc MSSV..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-500/5 focus:border-[#F27124] transition-all outline-none text-gray-700 dark:text-slate-100 font-medium placeholder:text-gray-400 dark:placeholder:text-slate-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- DATA LIST SECTION --- */}
      <div className="relative min-h-[400px]">
        {isStudentsLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
            <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
            <p className="mt-4 text-sm text-gray-500 dark:text-slate-400 font-medium animate-pulse">
              Đang đồng bộ dữ liệu lớp học...
            </p>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-700 ease-out">
            <StudentList students={students} filterTerm={searchTerm} />
          </div>
        )}
      </div>
    </div>
  );
}
