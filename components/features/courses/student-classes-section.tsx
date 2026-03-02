"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import type { MyClass } from "@/features/student/types/my-class-types";
import type { StudentClassItem } from "./types";
import { StudentClassesGrid } from "./student-classes-grid";

const CLASS_COLORS = [
  "bg-linear-to-br from-emerald-500 to-teal-600",
  "bg-linear-to-br from-blue-500 to-cyan-600",
  "bg-linear-to-br from-indigo-500 to-purple-600",
  "bg-linear-to-br from-orange-400 to-amber-500",
];

const getClassColor = (index: number) =>
  CLASS_COLORS[index % CLASS_COLORS.length];

interface StudentClassesSectionProps {
  searchTerm: string;
  selectedSemester: string;
  onClearFilter: () => void;
}

/**
 * Component lấy lớp học của sinh viên qua API và hiển thị grid
 */
export function StudentClassesSection({
  searchTerm,
  selectedSemester,
  onClearFilter,
}: StudentClassesSectionProps) {
  const router = useRouter();
  const { data: myClassesData, isLoading } = useMyClasses();

  const processedClasses = useMemo<StudentClassItem[]>(() => {
    const classesList = myClassesData?.classes ?? [];

    if (classesList.length === 0) return [];

    let result: StudentClassItem[] = classesList.map(
      (item: MyClass, index: number) => {
        const classInfo = item.class;
        return {
          id: classInfo._id,
          className: classInfo.name,
          subjectCode: classInfo.class_code || "CLASS",
          subjectName: classInfo.subject?.name || classInfo.name || "",
          semester: classInfo.semester?.name || "",
          color: getClassColor(index),
          role: item.role_in_team,
          teamName: item.team_name || "",
          teamId: item.team_id,
          isLeader: item.is_leader,
        };
      },
    );

    if (selectedSemester !== "all") {
      result = result.filter((c) => c.semester === selectedSemester);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.className.toLowerCase().includes(lowerTerm) ||
          c.subjectCode.toLowerCase().includes(lowerTerm) ||
          c.subjectName.toLowerCase().includes(lowerTerm),
      );
    }

    return result;
  }, [myClassesData, selectedSemester, searchTerm]);

  const handleSelectClass = (cls: StudentClassItem) => {
    Cookies.set("student_class_id", cls.id);
    Cookies.set("student_class_name", cls.className);
    Cookies.set("student_team_name", cls.teamName);
    if (cls.teamId) Cookies.set("student_team_id", cls.teamId);
    Cookies.set("student_is_leader", String(cls.isLeader));
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-80 items-center justify-center bg-white/60 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white dark:border-slate-800 shadow-inner">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#F27124] relative z-10" />
          <div className="absolute inset-0 h-12 w-12 bg-orange-200 dark:bg-orange-900 blur-xl opacity-50 animate-ping" />
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium animate-pulse">
          Đang chuẩn bị không gian học tập...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StudentClassesGrid
        classes={processedClasses}
        onSelectClass={handleSelectClass}
        onClearFilter={onClearFilter}
      />
    </div>
  );
}
