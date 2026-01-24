"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  Search,
  Loader2,
  Users,
  UserCheck,
  LayoutGrid,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

// Components
import { StudentImport } from "@/features/management/classes/components/student-import";
import { AddStudentDialog } from "@/features/management/classes/components/add-student-dialog";
import { StudentList } from "@/features/management/classes/components/student-list";

// Hooks & Types
import { useClassStudents } from "@/features/management/classes/hooks/use-classes";
import { ClassStudent } from "@/features/management/classes/types";
import { useSocket } from "@/components/providers/socket-provider";

export default function ClassManagementPage() {
  const classId = Cookies.get("lecturer_class_id");
  const className = Cookies.get("lecturer_class_name");
  const subjectCode = Cookies.get("lecturer_subject");

  const { socket, isConnected } = useSocket();
  const { data: studentsData, isLoading, refetch } = useClassStudents(classId);

  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);
  const prevConnected = useRef(false);

  // 1. Đồng bộ dữ liệu ban đầu
  useEffect(() => {
    if (studentsData?.students) {
      setStudents(
        studentsData.students.map((s: any) => ({ ...s, _id: s._id || s.id })),
      );
    }
  }, [studentsData]);

  // 2. Refetch chỉ khi vừa reconnect (false → true), tránh refetch thừa lúc mount
  useEffect(() => {
    const justReconnected = !prevConnected.current && isConnected;
    prevConnected.current = isConnected;
    if (justReconnected) {
      refetch();
    }
  }, [isConnected, refetch]);

  // 3. Fallback: refetch khi user quay lại tab (vd. import từ Swagger/tab khác, socket chưa kịp)
  useEffect(() => {
    if (!classId) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") refetch();
    };
    window.addEventListener("visibilitychange", onVisible);
    return () => window.removeEventListener("visibilitychange", onVisible);
  }, [classId, refetch]);

  // 4. Socket: join room + lắng nghe refresh / team_member_changed
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

    const handleMemberChange = ({
      action,
      data,
    }: {
      action: string;
      data: any;
    }) => {
      const studentId = data._id || data.id;
      setLastUpdatedId(studentId);
      setTimeout(() => setLastUpdatedId(null), 3000);
      setStudents((prev) => {
        const newStudent = { ...data, _id: studentId };
        if (action === "insert")
          return prev.find((s) => s._id === studentId)
            ? prev
            : [...prev, newStudent];
        if (action === "update")
          return prev.map((s) => (s._id === studentId ? newStudent : s));
        if (action === "delete") return prev.filter((s) => s._id !== studentId);
        return prev;
      });
    };

    const handleRefreshClass = () => {
      toast.promise(refetch(), {
        loading: "Đang đồng bộ danh sách lớp...",
        success: "Đã cập nhật!",
        error: "Lỗi đồng bộ.",
      });
    };

    socket.on("team_member_changed", handleMemberChange);
    socket.on("refresh_class", handleRefreshClass);

    return () => {
      socket.offAny(onAny);
      socket.off("team_member_changed", handleMemberChange);
      socket.off("refresh_class", handleRefreshClass);
      socket.emit("leave_class", roomId);
      if (roomName !== roomId) socket.emit("leave_class", roomName);
    };
  }, [socket, isConnected, classId, className, refetch]);

  const handleImportSuccess = () => refetch();
  const handleSuccess = () => refetch();

  if (!classId)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500 animate-in fade-in zoom-in-95 font-sans">
        <div className="p-8 bg-white rounded-full mb-6 shadow-sm border border-gray-100">
          <Users className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">
          Chưa chọn lớp học
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#F27124] mb-1">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Hệ thống giảng viên
            </span>
            {isConnected && (
              <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase tracking-widest animate-pulse">
                Live Sync
              </div>
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Quản lý Lớp {className}
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StudentImport classId={classId} onSuccess={handleImportSuccess} />
          <AddStudentDialog classId={classId} onSuccess={handleSuccess} />
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Tổng sinh viên"
          value={students.length}
          color="orange"
        />
        <StatCard
          icon={<UserCheck className="h-6 w-6" />}
          label="Đã tham gia"
          value={students.filter((s) => s.status === "Enrolled").length}
          color="emerald"
        />
        <StatCard
          icon={<LayoutGrid className="h-6 w-6" />}
          label="Mã môn học"
          value={subjectCode || "N/A"}
          color="blue"
          isUpper
        />
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#F27124] transition-colors" />
        <input
          placeholder="Tìm kiếm đồng đội bằng tên hoặc MSSV..."
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-50 rounded-[20px] shadow-sm focus:ring-8 focus:ring-[#F27124]/5 focus:border-[#F27124] transition-all outline-none text-slate-700 font-bold text-lg tracking-tight"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* DATA LIST */}
      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/40 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-slate-100">
            <Loader2 className="h-12 w-12 animate-spin text-[#F27124] opacity-20" />
            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              Syncing Data...
            </p>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-700">
            <StudentList
              classId={classId}
              students={students}
              filterTerm={searchTerm}
              onRefresh={refetch}
              lastUpdatedId={lastUpdatedId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, isUpper = false }: any) {
  const bgColors: any = {
    orange: "bg-orange-50 text-[#F27124]",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-orange-100 group">
      <div
        className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${bgColors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p
          className={`font-black text-slate-900 ${isUpper ? "text-xl uppercase tracking-tighter" : "text-3xl tracking-tight"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
