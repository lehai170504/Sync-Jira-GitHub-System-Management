"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, GraduationCap } from "lucide-react";

// Components
import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
// Import CourseItem từ CourseGrid để đồng nhất Type
import {
  CourseGrid,
  CourseItem,
} from "@/components/common/courses/course-grid";

// Hooks
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";

// Types (Backend response type)
import { MyClass } from "@/features/student/types/my-class-types";

// Helper màu sắc
const GRADES_COLORS = [
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-orange-400 to-amber-500",
];

const getClassColor = (index: number) => {
  return GRADES_COLORS[index % GRADES_COLORS.length];
};

export default function StudentCoursesPage() {
  const router = useRouter();

  // State Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // 1. Fetch Data
  const { data: myClassesData, isLoading: isClassesLoading } = useMyClasses();
  const { data: semestersData } = useSemesters();

  const semesterOptions = useMemo(() => {
    return semestersData?.map((s) => s.name) || [];
  }, [semestersData]);

  // 2. Process Data
  // Sử dụng CourseItem làm Type trả về để khớp với props của CourseGrid
  const processedClasses = useMemo<CourseItem[]>(() => {
    const classesList = myClassesData?.classes || [];

    if (classesList.length === 0) return [];

    let result: CourseItem[] = classesList.map(
      (item: MyClass, index: number) => {
        const classInfo = item.class;

        return {
          id: classInfo._id,
          subjectCode: classInfo.class_code || "CLASS",
          subjectName: classInfo.subject?.name || classInfo.name,
          className: classInfo.name,
          semester: classInfo.semester?.name,
          color: getClassColor(index),

          // 👇 Quan trọng: Gán giá trị cụ thể hoặc undefined rõ ràng
          students: undefined,

          // Thông tin Student
          role: item.role_in_team,
          teamName: item.team_name,
          isLeader: item.is_leader,
        };
      },
    );

    // 3. Client-side Filter
    if (selectedSemester !== "all") {
      result = result.filter((c) => c.semester === selectedSemester);
    }

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
  }, [myClassesData, selectedSemester, searchTerm]);

  // 4. Handle Select Class
  // Type của cls bây giờ là CourseItem -> Khớp hoàn toàn
  const handleSelectClass = (cls: CourseItem) => {
    Cookies.set("student_class_id", cls.id);
    Cookies.set("student_class_name", cls.className);

    // Ép kiểu về string an toàn
    Cookies.set("student_team_name", cls.teamName || "");
    Cookies.set("student_is_leader", String(cls.isLeader || false));

    router.push("/dashboard");
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setSelectedSemester("all");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      {/* Background Decor - Tạo cảm giác hiện đại */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10" />

      <CourseHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 z-10">
        {/* PAGE INTRO SECTION */}
        <section className="space-y-6">
          <CourseFilter
            title="Lớp học của tôi"
            description="Theo dõi tiến độ và quản lý các nhóm học tập hiệu quả."
            icon={
              <div className="p-3 bg-white shadow-sm border border-orange-100 rounded-2xl">
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

        {/* CONTENT SECTION */}
        <div className="relative">
          {isClassesLoading ? (
            <div className="flex flex-col h-80 items-center justify-center bg-white/50 backdrop-blur-md rounded-3xl border border-white shadow-inner">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-[#F27124] relative z-10" />
                <div className="absolute inset-0 h-12 w-12 bg-orange-200 blur-xl opacity-50 animate-ping" />
              </div>
              <p className="mt-4 text-slate-500 font-medium animate-pulse">
                Đang chuẩn bị không gian học tập...
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CourseGrid
                classes={processedClasses}
                onSelectClass={handleSelectClass}
                onClearFilter={handleClearFilter}
              />
            </div>
          )}
        </div>
      </main>

      {/* FOOTER NẾU CẦN */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        © 2026 SyncSystem • FPT University
      </footer>
    </div>
  );
}
