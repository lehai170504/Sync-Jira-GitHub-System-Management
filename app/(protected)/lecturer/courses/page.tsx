"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CourseHeader } from "@/components/features/lecturer/courses/course-header";
import { CourseFilter } from "@/components/features/lecturer/courses/course-filter";
import { CourseGrid } from "@/components/features/lecturer/courses/course-grid";

// MOCK DATA
const TEACHING_CLASSES = [
  {
    id: "CLS001",
    subjectCode: "PRM392",
    subjectName: "Mobile Programming",
    className: "SE1783",
    students: 30,
    semester: "Spring 2026",
    schedule: "Mon-Wed (Slot 2)",
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "CLS002",
    subjectCode: "SWP391",
    subjectName: "Software Development Project",
    className: "SE1831",
    students: 25,
    semester: "Spring 2026",
    schedule: "Tue-Thu (Slot 4)",
    color: "bg-gradient-to-br from-blue-600 to-indigo-700",
  },
  {
    id: "CLS003",
    subjectCode: "SDN302",
    subjectName: "Server-Side with NodeJS",
    className: "SE1704",
    students: 32,
    semester: "Spring 2026",
    schedule: "Fri (Slot 1-2)",
    color: "bg-gradient-to-br from-teal-400 to-emerald-500",
  },
  {
    id: "CLS004",
    subjectCode: "PRM392",
    subjectName: "Mobile Programming",
    className: "SE1601",
    students: 28,
    semester: "Fall 2025",
    schedule: "Mon-Wed (Slot 1)",
    color: "bg-gradient-to-br from-gray-500 to-gray-600",
  },
];

const SEMESTERS = Array.from(new Set(TEACHING_CLASSES.map((c) => c.semester)))
  .sort()
  .reverse();

export default function LecturerCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Spring 2026");

  // Logic lọc dữ liệu
  const filteredClasses = useMemo(() => {
    return TEACHING_CLASSES.filter((c) => {
      const matchSearch =
        c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSemester =
        selectedSemester === "ALL" || c.semester === selectedSemester;
      return matchSearch && matchSemester;
    });
  }, [searchTerm, selectedSemester]);

  // Handle chọn lớp
  const handleSelectClass = (cls: any) => {
    Cookies.set("lecturer_class_id", cls.id);
    Cookies.set("lecturer_class_name", cls.className);
    Cookies.set("lecturer_subject", cls.subjectCode);
    router.push("/dashboard");
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedSemester("ALL");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in-50">
      {/* 1. Header (Có Logout Hook bên trong) */}
      <CourseHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* 2. Filter Bar */}
        <CourseFilter
          semesters={SEMESTERS}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* 3. Grid Class */}
        <CourseGrid
          classes={filteredClasses}
          onSelectClass={handleSelectClass}
          onClearFilter={handleClearFilter}
        />
      </main>
    </div>
  );
}
