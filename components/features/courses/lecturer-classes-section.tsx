"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { LecturerClassItem } from "@/features/management/lecturers/types/lecturer-classes-types";
import {
  LecturerClassesGrid,
  type LecturerClassDisplayItem,
} from "./lecturer-classes-grid";
import { LecturerClassesList } from "./lecturer-classes-list";

const CLASS_COLORS = [
  "bg-indigo-500",
  "bg-blue-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-purple-500",
];

const getStableColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CLASS_COLORS.length;
  return CLASS_COLORS[index];
};

interface LecturerClassesSectionProps {
  classes: LecturerClassItem[];
  searchTerm: string;
  selectedSemester: string;
  onClearFilter: () => void;
  viewMode: "grid" | "list";
}

export function LecturerClassesSection({
  classes,
  searchTerm,
  selectedSemester,
  onClearFilter,
  viewMode,
}: LecturerClassesSectionProps) {
  const router = useRouter();

  const processedClasses = useMemo<LecturerClassDisplayItem[]>(() => {
    if (!classes || classes.length === 0) return [];

    let result: LecturerClassDisplayItem[] = classes.map((cls) => ({
      ...cls,
      color: getStableColor(cls._id),
      subjectName: cls.subjectName ?? cls.subject_id?.name ?? "Môn học",
    }));

    if (selectedSemester !== "all") {
      result = result.filter((c) => c.semester_id?.name === selectedSemester);
    }

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      {viewMode === "grid" ? (
        <LecturerClassesGrid
          classes={processedClasses}
          onSelectClass={handleSelectClass}
          onClearFilter={onClearFilter}
        />
      ) : (
        <LecturerClassesList
          classes={processedClasses}
          onSelectClass={handleSelectClass}
          onClearFilter={onClearFilter}
        />
      )}
    </div>
  );
}
