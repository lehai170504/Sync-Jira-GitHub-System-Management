"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Search, Loader2, Users, Layers } from "lucide-react";
import { toast } from "sonner";

// UI Components (Shadcn Tabs)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Components
import { ClassHeader } from "@/features/management/classes/components/class-header";
import { ClassStats } from "@/features/management/classes/components/class-stats-lecturer";
import { StudentList } from "@/features/management/classes/components/student-list";
import { TeamList } from "@/features/management/classes/components/team-list";

// Hooks
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { useClassStudents } from "@/features/management/classes/hooks/use-classes";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useSocket } from "@/components/providers/socket-provider";

// Types
import { ClassStudent } from "@/features/management/classes/types/class-types";

export default function ClassManagementPage() {
  const classId = Cookies.get("lecturer_class_id");
  const { data: profile, isLoading: isProfileLoading } = useProfile();

  // 1. Hook: Chi tiết lớp (Header)
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
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);

  // Sync Students Data
  useEffect(() => {
    if (studentsData?.students) {
      setStudents(
        studentsData.students.map((s: any) => ({ ...s, _id: s._id || s.id })),
      );
    }
  }, [studentsData]);

  // Socket Logic (Giữ nguyên phần join room)...
  useEffect(() => {
    if (!socket || !isConnected || !classId) return;
    socket.emit("join_class", classId);

    // Khi có sự kiện thay đổi, refresh cả 2 danh sách
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

  // --- RENDER ---
  if (isProfileLoading || isDetailsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!classId || !classDetails)
    return <div className="p-10 text-center">Chưa chọn lớp học.</div>;

  const { class: classInfo, stats } = classDetails;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 font-sans">
      {/* HEADER */}
      <ClassHeader
        className={classInfo.name}
        subjectName={classInfo.subjectName}
        subjectCode={classInfo.subject_id.code}
        semesterName={classInfo.semester_id.name}
        classId={classId}
        isConnected={isConnected}
        onRefresh={() => {
          refetchStudents();
          refetchTeams();
        }}
      />

      {/* STATS */}
      <ClassStats
        totalStudents={stats.total_students}
        totalTeams={stats.total_teams}
        jiraWeight={classInfo.contributionConfig.jiraWeight}
      />

      {/* SEARCH BAR (Dùng chung cho cả 2 tab) */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#F27124] transition-colors" />
        <input
          placeholder="Tìm kiếm sinh viên hoặc tên nhóm..."
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-50 rounded-[20px] shadow-sm focus:ring-8 focus:ring-[#F27124]/5 focus:border-[#F27124] transition-all outline-none text-slate-700 font-bold text-lg tracking-tight"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABS: SINH VIÊN | NHÓM */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6 h-auto inline-flex">
          <TabsTrigger
            value="students"
            className="rounded-lg px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all gap-2"
          >
            <Users className="w-4 h-4" /> Danh sách Sinh viên
          </TabsTrigger>
          <TabsTrigger
            value="teams"
            className="rounded-lg px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all gap-2"
          >
            <Layers className="w-4 h-4" /> Danh sách Nhóm
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SINH VIÊN */}
        <TabsContent value="students" className="mt-0">
          <div className="relative min-h-[400px]">
            {isStudentsLoading ? (
              <div className="flex justify-center pt-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
              </div>
            ) : (
              <StudentList
                classId={classId}
                students={students}
                filterTerm={searchTerm}
                onRefresh={refetchStudents}
                lastUpdatedId={lastUpdatedId}
              />
            )}
          </div>
        </TabsContent>

        {/* TAB 2: NHÓM */}
        <TabsContent value="teams" className="mt-0">
          <TeamList
            teams={
              teamsData?.teams?.filter((t) =>
                t.project_name.toLowerCase().includes(searchTerm.toLowerCase()),
              ) || []
            }
            isLoading={isTeamsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
