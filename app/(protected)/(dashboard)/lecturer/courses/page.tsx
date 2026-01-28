"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, BookOpen } from "lucide-react";

// Components
import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
import {
  CourseGrid,
  CourseItem,
} from "@/components/common/courses/course-grid";

// Hooks - Auth & Semesters
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { useProfile } from "@/features/auth/hooks/use-profile";

import { useLecturerClasses } from "@/features/management/lecturers/hooks/use-lecturer-classes";
import { LecturerClassItem } from "@/features/management/lecturers/types/lecturer-classes-types";

// Helper màu sắc
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

  // 1. Lấy thông tin Giảng viên (để lấy ID)
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const lecturerId = profile?.user?._id;

  // State Filter UI
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // 2. Fetch Data
  // Lấy danh sách học kỳ cho Dropdown Filter
  const { data: semestersData } = useSemesters();

  const { data: lecturerData, isLoading: isClassesLoading } =
    useLecturerClasses(lecturerId);

  // Tạo danh sách tùy chọn cho Filter Học kỳ
  const semesterOptions = useMemo(() => {
    return semestersData?.map((s) => s.name) || [];
  }, [semestersData]);

  // 3. Xử lý dữ liệu (Mapping & Filtering)
  const processedClasses = useMemo<CourseItem[]>(() => {
    // Nếu chưa có data hoặc list rỗng
    if (!lecturerData?.classes) return [];

    // BƯỚC A: Map dữ liệu từ API (LecturerClassItem) -> UI (CourseItem)
    let result: CourseItem[] = lecturerData.classes.map(
      (cls: LecturerClassItem, index: number) => {
        // Lấy thông tin an toàn từ object lồng nhau
        const subjectName =
          cls.subject_id?.name || cls.subjectName || "Unknown Subject";
        const subjectCode = cls.subject_id?.code || "N/A";
        const semesterName = cls.semester_id?.name || "Unknown Semester";

        return {
          id: cls._id,
          subjectCode: subjectCode,
          subjectName: subjectName,
          className: cls.name,
          semester: semesterName,
          color: getClassColor(index),

          // Các trường UI cần nhưng API chưa có (để mặc định)
          students: 0,
          role: undefined,
          teamName: undefined,
          isLeader: undefined,
        };
      },
    );

    // BƯỚC B: Client-side Filtering
    // 1. Lọc theo Học kỳ
    if (selectedSemester !== "all") {
      result = result.filter((c) => c.semester === selectedSemester);
    }

    // 2. Lọc theo Search Term (Tên lớp, Mã môn, Tên môn)
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
  }, [lecturerData, searchTerm, selectedSemester]);

  // 4. Handle Actions
  const handleSelectClass = (cls: CourseItem) => {
    // Lưu Context vào Cookie
    Cookies.set("lecturer_class_id", cls.id);
    Cookies.set("lecturer_class_name", cls.className);
    Cookies.set("lecturer_subject", cls.subjectName);

    router.push("/dashboard");
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedSemester("all");
  };

  // 5. Loading State (Profile)
  if (isProfileLoading) {
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
      {/* Header */}
      <CourseHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* Filter Bar */}
        <CourseFilter
          title="Các lớp giảng dạy"
          // Hiển thị thống kê từ API (nếu có)
          description={`Danh sách các lớp bạn đang phụ trách (${lecturerData?.stats?.active_classes || 0} lớp đang hoạt động).`}
          icon={<BookOpen className="h-8 w-8 text-[#F27124]" />}
          semesters={semesterOptions}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Content Grid */}
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
