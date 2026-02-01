"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, Sparkles } from "lucide-react";

import { useProfile } from "@/features/auth/hooks/use-profile";
import { useLecturerClasses } from "@/features/management/lecturers/hooks/use-lecturer-classes";
import type { LecturerClassItem } from "@/features/management/lecturers/types/lecturer-classes-types";
import {
  LecturerClassesGrid,
  type LecturerClassDisplayItem,
} from "./lecturer-classes-grid";

const CLASS_COLORS = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-blue-600 to-indigo-700",
  "bg-gradient-to-br from-teal-400 to-emerald-500",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
];

const getClassColor = (index: number) =>
  CLASS_COLORS[index % CLASS_COLORS.length];

interface LecturerClassesSectionProps {
  searchTerm: string;
  selectedSemester: string;
  onClearFilter: () => void;
}

/**
 * Component lấy lớp học của giảng viên qua API và hiển thị grid
 */
export function LecturerClassesSection({
  searchTerm,
  selectedSemester,
  onClearFilter,
}: LecturerClassesSectionProps) {
  const router = useRouter();
  const { data: profile } = useProfile();
  const lecturerId = profile?.user?._id;
  const { data: lecturerData, isLoading } =
    useLecturerClasses(lecturerId);

  const processedClasses = useMemo<LecturerClassDisplayItem[]>(() => {
    const classesList = lecturerData?.classes ?? [];

    if (classesList.length === 0) return [];

    let result: LecturerClassDisplayItem[] = classesList.map(
      (cls: LecturerClassItem, index: number) => ({
        ...cls,
        color: getClassColor(index),
        subjectName: cls.subjectName ?? cls.subject_id?.name ?? "Môn học",
      }),
    );

    if (selectedSemester !== "all") {
      result = result.filter(
        (c) => c.semester_id?.name === selectedSemester,
      );
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((c) => {
        const classNameMatch = c.name?.toLowerCase().includes(lowerTerm);
        const subjectCodeMatch = c.subject_id?.code
          ?.toLowerCase()
          .includes(lowerTerm);
        const subjectNameMatch = c.subjectName
          ?.toLowerCase()
          .includes(lowerTerm);
        return classNameMatch || subjectCodeMatch || subjectNameMatch;
      });
    }

    return result;
  }, [lecturerData, searchTerm, selectedSemester]);

  const handleSelectClass = (cls: LecturerClassDisplayItem) => {
    Cookies.set("lecturer_class_id", cls._id);
    Cookies.set("lecturer_class_name", cls.name);
    Cookies.set("lecturer_subject", cls.subjectName ?? "");
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center animate-fade-up">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-8 w-8 text-slate-200 animate-pulse" />
          <p className="text-slate-400 text-[10px] font-bold tracking-widest">
            Đang lấy dữ liệu lớp học...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <LecturerClassesGrid
        classes={processedClasses}
        onSelectClass={handleSelectClass}
        onClearFilter={onClearFilter}
      />
    </div>
  );
}
