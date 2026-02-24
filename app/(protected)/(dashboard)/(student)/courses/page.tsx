"use client";

import { useState, useMemo } from "react";
import { GraduationCap } from "lucide-react";

import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
import { StudentClassesSection } from "@/components/features/courses/student-classes-section";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const { data: semestersData } = useSemesters();
  const semesterOptions = useMemo(
    () => semestersData?.map((s) => s.name) ?? [],
    [semestersData],
  );

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedSemester("all");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/50 dark:bg-orange-900/30 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-100/50 dark:bg-blue-900/30 rounded-full blur-3xl -z-10" />

      <CourseHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 z-10">
        <section className="space-y-6">
          <CourseFilter
            title="Lớp học của tôi"
            description="Theo dõi tiến độ và quản lý các nhóm học tập hiệu quả."
            icon={
              <div className="p-3 bg-white dark:bg-slate-900 shadow-sm border border-orange-100 dark:border-orange-900/40 rounded-2xl">
                <GraduationCap className="h-8 w-8 text-[#F27124]" />
              </div>
            }
            semesters={semesterOptions}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </section>

        <div className="relative">
          <StudentClassesSection
            searchTerm={searchTerm}
            selectedSemester={selectedSemester}
            onClearFilter={handleClearFilter}
          />
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
        © 2026 SyncSystem • FPT University
      </footer>
    </div>
  );
}
