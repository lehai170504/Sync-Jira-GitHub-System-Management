"use client";

import { useState, useEffect } from "react";
// 1. Import useSearchParams
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Search, Loader2, Users, Layers, AlertCircle } from "lucide-react";

// UI Components (Shadcn Tabs)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"; 

// Custom Components
import { ClassHeader } from "@/features/management/classes/components/class-header";
import { ClassStats } from "@/features/management/classes/components/lecturer/class-stats-lecturer";
import { StudentList } from "@/features/management/classes/components/lecturer/student-list";
import { TeamList } from "@/features/management/classes/components/lecturer/team-list";

// Hooks
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { useClassStudents } from "@/features/management/classes/hooks/use-classes";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useSocket } from "@/components/providers/socket-provider";

// Types
import { ClassStudent } from "@/features/management/classes/types/class-types";

export default function ClassManagementPage() {
  // 2. Logic lấy Class ID (Hybrid Strategy)
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("classId");

  // Fallback Cookie
  const cookieClassId =
    typeof window !== "undefined"
      ? Cookies.get("lecturer_class_id")
      : undefined;

  // ID chốt hạ
  const classId = urlClassId || cookieClassId;

  // 1. Hook: Chi tiết lớp (Header)
  // Tự động refetch khi classId đổi
  const { data: classDetails, isLoading: isDetailsLoading } =
    useClassDetails(classId);

  // 2. Hook: Danh sách SINH VIÊN
  const {
    data: studentsData,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useClassStudents(classId);

  // 3. Hook: Danh sách NHÓM
  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    refetch: refetchTeams,
  } = useClassTeams(classId);

  // State & Socket
  const { socket, isConnected } = useSocket();
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync Students Data
  useEffect(() => {
    if (studentsData?.students) {
      setStudents(
        studentsData.students.map((s: any) => ({ ...s, _id: s._id || s.id })),
      );
    }
  }, [studentsData]);

  // Socket Logic (Giữ nguyên, chỉ đảm bảo classId đúng)
  useEffect(() => {
    if (!socket || !isConnected || !classId) return;

    // Join room mới khi classId đổi
    socket.emit("join_class", classId);

    const handleRefreshClass = () => {
      refetchStudents();
      refetchTeams();
    };

    socket.on("refresh_class", handleRefreshClass);

    return () => {
      socket.off("refresh_class", handleRefreshClass);
      socket.emit("leave_class", classId);
    };
  }, [socket, isConnected, classId, refetchStudents, refetchTeams]);

  // --- LOADING STATE ---
  if (isDetailsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="p-4 bg-white rounded-full shadow-xl shadow-orange-100 border border-orange-50">
          <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Đang tải dữ liệu lớp học...
        </p>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!classId || !classDetails?.class) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-500 animate-in fade-in duration-500">
        <div className="p-6 bg-slate-50 rounded-full mb-6">
          <AlertCircle className="h-12 w-12 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">
          Chưa xác định lớp học
        </h2>
        <p className="font-medium text-sm text-slate-400">
          Vui lòng chọn lớp học từ danh sách để xem chi tiết.
        </p>
      </div>
    );
  }

  const { class: classInfo, stats } = classDetails;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans p-4 md:p-10 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <ClassHeader
        className={classInfo.name}
        subjectName={classInfo.subjectName}
        subjectCode={classInfo.subject_id?.code}
        semesterName={classInfo.semester_id?.name}
        classId={classId}
        isConnected={isConnected}
        onRefresh={() => {
          refetchStudents();
          refetchTeams();
        }}
      />

      {/* STATS */}
      <ClassStats
        totalStudents={stats?.total_students || 0}
        totalTeams={stats?.total_teams || 0}
        jiraWeight={classInfo.contributionConfig?.jiraWeight || 0}
      />

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#F27124] transition-colors z-10" />
        <Input
          placeholder="Tìm kiếm sinh viên, mã số hoặc tên nhóm..."
          className="w-full pl-14 pr-6 h-14 bg-white border-2 border-slate-100 rounded-[20px] shadow-sm focus:ring-4 focus:ring-[#F27124]/10 focus:border-[#F27124] transition-all text-slate-800 font-semibold text-base tracking-tight placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABS CONTENT */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl mb-8 h-auto inline-flex border border-slate-200/60 shadow-inner">
          <TabsTrigger
            value="students"
            className="rounded-xl px-6 py-3 text-sm font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all gap-2"
          >
            <Users className="w-4 h-4" /> Danh sách Sinh viên
          </TabsTrigger>
          <TabsTrigger
            value="teams"
            className="rounded-xl px-6 py-3 text-sm font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all gap-2"
          >
            <Layers className="w-4 h-4" /> Danh sách Nhóm
          </TabsTrigger>
        </TabsList>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-1 min-h-[500px]">
          <TabsContent
            value="students"
            className="mt-0 outline-none p-4 md:p-6"
          >
            {isStudentsLoading ? (
              <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Đang tải danh sách...
                </p>
              </div>
            ) : (
              <StudentList
                classId={classId}
                students={students}
                filterTerm={searchTerm}
                onRefresh={refetchStudents}
              />
            )}
          </TabsContent>

          <TabsContent value="teams" className="mt-0 outline-none p-4 md:p-6">
            <TeamList
              teams={
                teamsData?.teams?.filter((t: any) =>
                  t.project_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                ) || []
              }
              isLoading={isTeamsLoading}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
