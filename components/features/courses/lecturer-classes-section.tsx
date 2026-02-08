"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
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

// FIX: Hàm lấy màu dựa trên ID (hash) để màu cố định
const getStableColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CLASS_COLORS.length;
  return CLASS_COLORS[index];
};

interface LecturerClassesSectionProps {
  classes: LecturerClassItem[]; // Nhận data từ props
  searchTerm: string;
  selectedSemester: string;
  onClearFilter: () => void;
}

export function LecturerClassesSection({
  classes,
  searchTerm,
  selectedSemester,
  onClearFilter,
}: LecturerClassesSectionProps) {
  const router = useRouter();

  // Logic lọc dữ liệu (Client-side filtering)
  const processedClasses = useMemo<LecturerClassDisplayItem[]>(() => {
    if (!classes || classes.length === 0) return [];

    // 1. Map màu sắc trước khi filter để đảm bảo màu không đổi
    let result: LecturerClassDisplayItem[] = classes.map((cls) => ({
      ...cls,
      color: getStableColor(cls._id), // Dùng ID để lấy màu
      subjectName: cls.subjectName ?? cls.subject_id?.name ?? "Môn học",
    }));

    // 2. Filter theo kỳ
    if (selectedSemester !== "all") {
      result = result.filter((c) => c.semester_id?.name === selectedSemester);
    }

    // 3. Filter theo từ khóa
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase().trim();
      result = result.filter((c) => {
        return (
          c.name?.toLowerCase().includes(lowerTerm) ||
          c.subject_id?.code?.toLowerCase().includes(lowerTerm) ||
          c.subjectName?.toLowerCase().includes(lowerTerm)
        );
      });
    }

    return result;
  }, [classes, searchTerm, selectedSemester]);

  const handleSelectClass = (cls: LecturerClassDisplayItem) => {
    Cookies.set("lecturer_class_id", cls._id);
    router.push(`/dashboard?classId=${cls._id}`);
  };

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
