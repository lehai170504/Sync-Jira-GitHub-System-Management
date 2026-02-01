"use client";

import { useState, useMemo } from "react";
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

  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const lecturerId = profile?.user?._id;
  const { data: lecturerData } = useLecturerClasses(lecturerId);
  const { data: semestersData } = useSemesters();

  const semesterOptions = useMemo(
    () => semestersData?.map((s) => s.name) ?? [],
    [semestersData],
  );

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedSemester("all");
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFDFD] font-mono">
        <div className="flex flex-col items-center gap-4 animate-fade-up">
          <Loader2 className="h-12 w-12 animate-spin text-[#F27124]" />
          <p className="text-slate-400 text-[10px] font-bold tracking-widest">
            Đang xác thực hồ sơ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-mono selection:bg-orange-100 relative overflow-x-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-50/20 blur-[120px]" />
      </div>

      <CourseHeader />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-8 md:px-12 py-10 space-y-12">
        <div className="animate-reveal">
          <CourseFilter
            title="Các lớp giảng dạy"
            description={`Hệ thống ghi nhận ${lecturerData?.stats?.active_classes ?? 0} lớp học đang đồng bộ dữ liệu.`}
            icon={<BookOpen className="h-8 w-8 text-[#F27124]" />}
            semesters={semesterOptions}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <LecturerClassesSection
          searchTerm={searchTerm}
          selectedSemester={selectedSemester}
          onClearFilter={handleClearFilter}
        />
      </main>

      <footer className="px-12 py-8 border-t border-slate-100 flex justify-between items-center opacity-30">
        <p className="text-[9px] font-bold tracking-widest">
          Hệ thống quản lý Sync v4.0
        </p>
        <p className="text-[9px] font-bold tracking-widest italic">
          Tích hợp DevOps
        </p>
      </footer>
    </div>
  );
}
