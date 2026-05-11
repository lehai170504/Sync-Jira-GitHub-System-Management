"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import type { MyClass } from "@/features/student/types/my-class-types";
import type { StudentClassItem } from "../types/course-types";
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
      <div className="flex flex-col h-[400px] items-center justify-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[48px] border border-white/40 dark:border-white/10 shadow-2xl transition-all duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 animate-pulse" />
          <div className="relative h-20 w-20 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#F27124] relative z-10" />
            <div className="absolute inset-0 border-4 border-orange-500/10 rounded-full" />
            <div className="absolute inset-0 border-t-4 border-orange-500 rounded-full animate-spin [animation-duration:1.5s]" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-zinc-900 dark:text-zinc-100 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
            Đang khởi tạo
          </p>
          <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            Không gian học tập của bạn
          </p>
        </div>
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
