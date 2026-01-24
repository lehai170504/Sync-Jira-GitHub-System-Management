"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, BookOpen } from "lucide-react";

// Components
import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
// Import CourseItem và CourseGrid từ cùng 1 nguồn
import {
  CourseGrid,
  CourseItem,
} from "@/components/common/courses/course-grid";

// Hooks & Types
import { useClasses } from "@/features/management/classes/hooks/use-classes";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useSubjects } from "@/features/management/subjects/hooks/use-subjects";

// Helper để tạo màu ngẫu nhiên
const GRADES_COLORS = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-blue-600 to-indigo-700",
  "bg-gradient-to-br from-teal-400 to-emerald-500",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
];

const getClassColor = (index: number) => {
  return GRADES_COLORS[index % GRADES_COLORS.length];
};

export default function LecturerCoursesPage() {
  const router = useRouter();

  // 1. Lấy thông tin User hiện tại
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const lecturerId = profile?.user?._id;

  // State Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // 2. Fetch Data (Học kỳ & Môn học)
  const { data: semestersData } = useSemesters();
  const { data: subjectsData } = useSubjects("Active");

  const semesterOptions = useMemo(() => {
    return semestersData?.map((s) => s.name) || [];
  }, [semestersData]);

  const selectedSemesterId = useMemo(() => {
    if (selectedSemester === "all") return undefined;
    return semestersData?.find((s) => s.name === selectedSemester)?._id;
  }, [selectedSemester, semestersData]);

  // 3. Fetch Classes
  const { data: classesData, isLoading: isClassesLoading } = useClasses({
    lecturer_id: lecturerId,
    semester_id: selectedSemesterId,
    limit: 100,
  });

  // 4. Process Data: Sử dụng CourseItem để khớp Type
  const processedClasses = useMemo<CourseItem[]>(() => {
    if (!classesData?.classes) return [];

    const subjectsList = (subjectsData as any)?.subjects || subjectsData || [];

    let result: CourseItem[] = classesData.classes.map((cls, index) => {
      const subject = subjectsList.find((s: any) => s._id === cls.subject_id);

      return {
        id: cls._id,
        subjectCode: subject?.code || "UNKNOWN",
        subjectName: subject?.name || cls.subjectName || "Unknown Subject",
        className: cls.name,
        semester: cls.semester_id?.name,
        color: getClassColor(index),

        students: 0,
        role: undefined,
        teamName: undefined,
        isLeader: undefined,
      };
    });

    // Client-side Filter
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
  }, [classesData, subjectsData, searchTerm]);

  // Handle chọn lớp
  const handleSelectClass = (cls: CourseItem) => {
    Cookies.set("lecturer_class_id", cls.id);
    Cookies.set("lecturer_class_name", cls.className);
    Cookies.set("lecturer_subject", cls.subjectName);
    router.push("/dashboard");
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedSemester("all");
  };

  // 5. Loading State
  if (isProfileLoading || !lecturerId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
          <p className="text-gray-500 text-sm">
            Đang tải thông tin giảng viên...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in-50">
      {/* Header (Navbar) */}
      <CourseHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* Filter Bar (có Title) */}
        <CourseFilter
          title="Các lớp giảng dạy"
          description="Chọn lớp học để bắt đầu quản lý và chấm điểm."
          icon={<BookOpen className="h-8 w-8 text-[#F27124]" />}
          semesters={semesterOptions}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {isClassesLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
              <p className="text-gray-500 text-sm">Đang tải danh sách lớp...</p>
            </div>
          </div>
        ) : (
          <CourseGrid
            classes={processedClasses}
            onSelectClass={handleSelectClass}
            onClearFilter={handleClearFilter}
          />
        )}
      </main>
    </div>
  );
}
