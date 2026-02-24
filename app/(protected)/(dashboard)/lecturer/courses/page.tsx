"use client";

import { useState, useMemo, useEffect } from "react";
import { Loader2, BookOpen } from "lucide-react";

import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
import { LecturerClassesSection } from "@/components/features/courses/lecturer-classes-section";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useLecturerClasses } from "@/features/management/lecturers/hooks/use-lecturer-classes";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";

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
      <div className="flex h-screen items-center justify-center bg-[#FDFDFD] dark:bg-slate-950 font-sans transition-colors duration-300">
        <div className="flex flex-col items-center gap-4 animate-fade-up">
          <Loader2 className="h-12 w-12 animate-spin text-[#F27124]" />
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 flex flex-col font-sans selection:bg-orange-100 dark:selection:bg-orange-900/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-orange-100/30 dark:bg-orange-900/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-50/20 dark:bg-blue-900/10 blur-[120px]" />
      </div>

      <CourseHeader />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-8 md:px-12 py-10 space-y-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CourseFilter
            title="Các lớp giảng dạy"
            description={`Hệ thống ghi nhận ${lecturerData?.stats?.active_classes ?? 0} lớp học đang đồng bộ dữ liệu.`}
            icon={
              <BookOpen className="h-8 w-8 text-[#F27124] dark:text-orange-400" />
            }
            semesters={semesterOptions}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            // Truyền props viewMode
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

      <footer className="px-12 py-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center opacity-40">
        <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          Hệ thống quản lý Sync v4.0
        </p>
        <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          Tích hợp DevOps
        </p>
      </footer>
    </div>
  );
}
