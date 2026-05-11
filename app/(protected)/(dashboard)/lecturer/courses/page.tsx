"use client";

import { useState, useMemo, useEffect } from "react";
import { Loader2, BookOpen } from "lucide-react";

import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
import { LecturerClassesSection } from "@/features/management/courses/components/lecturer-classes-section";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useLecturerClasses } from "@/features/management/lecturers/hooks/use-lecturer-classes";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { BackgroundBeams } from "@/features/home/components/background-beams";

export default function LecturerCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  // Thêm state viewMode (Lưu vào localStorage để nhớ tùy chọn của user)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Đọc viewMode từ localStorage khi component mount
  useEffect(() => {
    const savedMode = localStorage.getItem("courseViewMode");
    if (savedMode === "grid" || savedMode === "list") {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("courseViewMode", mode);
  };

  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const lecturerId = profile?.user?._id;

  const { data: lecturerData, isLoading: isClassesLoading } =
    useLecturerClasses(lecturerId);
  const { data: semestersData } = useSemesters();

  const semesterOptions = useMemo(
    () => semestersData?.map((s) => s.name) ?? [],
    [semestersData],
  );

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedSemester("all");
  };

  if (isProfileLoading || (!lecturerData && isClassesLoading)) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500">
      {/* 1. NỀN ĐỘNG PREMIUM */}
      <BackgroundBeams />

      {/* Tech Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Background Decoration Glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-orange-100/20 dark:bg-orange-900/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-50/20 dark:bg-blue-900/5 blur-[120px]" />
      </div>

      <CourseHeader />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-8 md:px-12 py-10 space-y-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CourseFilter
            title="Các lớp giảng dạy"
            description={`Hệ thống ghi nhận ${lecturerData?.stats?.active_classes ?? 0} lớp học đang đồng bộ dữ liệu.`}
            icon={
              <div className="p-3.5 bg-white dark:bg-zinc-900 shadow-xl border border-orange-100 dark:border-white/5 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <BookOpen className="h-8 w-8 text-[#F27124] relative z-10" />
              </div>
            }
            semesters={semesterOptions}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </div>

        <LecturerClassesSection
          classes={lecturerData?.classes ?? []}
          searchTerm={searchTerm}
          selectedSemester={selectedSemester}
          onClearFilter={handleClearFilter}
          viewMode={viewMode}
        />
      </main>
    </div>
  );
}
