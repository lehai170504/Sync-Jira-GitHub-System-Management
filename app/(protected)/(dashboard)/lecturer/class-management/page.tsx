"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Search, AlertCircle } from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeletons";

import { Input } from "@/components/ui/input";

import { ClassHeader } from "@/features/management/classes/components/class-header";
import { ClassStats } from "@/features/management/classes/components/lecturer/class-stats-lecturer";
import { StudentList } from "@/features/management/classes/components/lecturer/student-list";

import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { useClassStudents } from "@/features/management/classes/hooks/use-classes";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useSocket } from "@/components/providers/socket-provider";

import { ClassStudent } from "@/features/management/classes/types/class-types";

export default function ClassManagementPage() {
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("classId") ?? undefined;
  const [classId, setClassId] = useState<string | undefined>(
    urlClassId ?? undefined
  );

  useEffect(() => {
    if (urlClassId) {
      setClassId(urlClassId);
      return;
    }

    const cookieClassId = Cookies.get("lecturer_class_id") ?? undefined;
    setClassId((prev) => prev ?? cookieClassId);
  }, [urlClassId]);

  const { data: classDetails, isLoading: isDetailsLoading } =
    useClassDetails(classId);

  const {
    data: studentsData,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useClassStudents(classId);

  // Vẫn giữ lại teamsData vì StudentList cần dùng để hiển thị/map sinh viên với nhóm
  const { data: teamsData, refetch: refetchTeams } = useClassTeams(classId);

  const { socket, isConnected } = useSocket();
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (studentsData?.students) {
      setStudents(
        studentsData.students.map((s: any) => ({ ...s, _id: s._id || s.id }))
      );
    }
  }, [studentsData]);

  useEffect(() => {
    if (!socket || !isConnected || !classId) return;

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
      <div className="space-y-6 px-4 md:px-8 py-6">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <TableSkeleton rows={8} cols={5} />
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!classId || !classDetails?.class) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-slate-500 dark:text-slate-400 animate-in fade-in duration-500 font-sans transition-colors">
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-full mb-6 border border-slate-100 dark:border-slate-800">
          <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Chưa xác định lớp học
        </h2>
        <p className="font-medium text-sm text-slate-500 dark:text-slate-400 max-w-md text-center">
          Vui lòng chọn một lớp học từ danh sách "Lớp đang dạy" để bắt đầu quản
          lý.
        </p>
      </div>
    );
  }

  const { class: classInfo, stats } = classDetails;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans p-4 md:p-8 max-w-400 mx-auto transition-colors">
      {/* HEADER */}
      <ClassHeader
        className={classInfo.name}
        subjectName={classInfo.subjectName}
        subjectCode={classInfo.subject_id?.code}
        semesterName={classInfo.semester_id?.name}
        classId={classId}
        students={students}
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

      <div className="space-y-6">
        {/* SEARCH BAR */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
          <Input
            placeholder="Tìm sinh viên, mã số hoặc tên nhóm..."
            className="w-full pl-12 pr-6 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DANH SÁCH SINH VIÊN (Bỏ Tabs) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-125 overflow-hidden transition-colors p-4 md:p-6">
          {isStudentsLoading ? (
            <TableSkeleton rows={6} cols={5} />
          ) : (
            <StudentList
              classId={classId}
              students={students}
              teams={teamsData?.teams || []}
              filterTerm={searchTerm}
              onRefresh={refetchStudents}
            />
          )}
        </div>
      </div>
    </div>
  );
}
