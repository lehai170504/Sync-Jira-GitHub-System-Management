"use client";

import { useState, useMemo } from "react";
import { GraduationCap } from "lucide-react";

import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
import { StudentClassesSection } from "@/features/management/courses/components/student-classes-section";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { BackgroundBeams } from "@/features/home/components/background-beams";

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
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col relative overflow-hidden transition-colors duration-500">
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

      <CourseHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 z-10">
        <section className="space-y-6">
          <CourseFilter
            title="Lớp học của tôi"
            description="Theo dõi tiến độ và quản lý các nhóm học tập hiệu quả."
            icon={
              <div className="p-3.5 bg-white dark:bg-zinc-900 shadow-xl border border-orange-100 dark:border-white/5 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <GraduationCap className="h-8 w-8 text-[#F27124] relative z-10" />
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
        © 2026 SAG-CA • FPT University
      </footer>
    </div>
  );
}
