"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, BookOpen, Sparkles } from "lucide-react";

// Components
import { CourseHeader } from "@/components/common/courses/course-header";
import { CourseFilter } from "@/components/common/courses/course-filter";
import {
  CourseGrid,
  CourseItem,
} from "@/components/common/courses/course-grid";

// Hooks
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useLecturerClasses } from "@/features/management/lecturers/hooks/use-lecturer-classes";
import { LecturerClassItem } from "@/features/management/lecturers/types/lecturer-classes-types";

// Bảng màu Gradient
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

  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const lecturerId = profile?.user?._id;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const { data: semestersData } = useSemesters();
  const { data: lecturerData, isLoading: isClassesLoading } =
    useLecturerClasses(lecturerId);

  const semesterOptions = useMemo(() => {
    return semestersData?.map((s) => s.name) || [];
  }, [semestersData]);

  // --- XỬ LÝ DỮ LIỆU ---
  const processedClasses = useMemo<CourseItem[]>(() => {
    if (!lecturerData?.classes) return [];

    let result: CourseItem[] = lecturerData.classes.map(
      (cls: LecturerClassItem, index: number) => {
        return {
          ...cls,

          color: getClassColor(index),

          subjectName: cls.subjectName || cls.subject_id?.name || "Môn học",
        };
      },
    );

    // 1. Lọc theo học kỳ (Sử dụng semester_id.name)
    if (selectedSemester !== "all") {
      result = result.filter((c) => c.semester_id?.name === selectedSemester);
    }

    // 2. Lọc theo tìm kiếm (Sử dụng name, subject_id.code)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((c) => {
        const classNameMatch = c.name?.toLowerCase().includes(lowerTerm);
        const subjectCodeMatch = c.subject_id?.code
          ?.toLowerCase()
          .includes(lowerTerm);
        const subjectNameMatch = c.subjectName
          ?.toLowerCase()
          .includes(lowerTerm);

        return classNameMatch || subjectCodeMatch || subjectNameMatch;
      });
    }

    return result;
  }, [lecturerData, searchTerm, selectedSemester]);

  // --- ACTIONS ---
  const handleSelectClass = (cls: CourseItem) => {
    Cookies.set("lecturer_class_id", cls._id);
    Cookies.set("lecturer_class_name", cls.name);
    Cookies.set("lecturer_subject", cls.subjectName);
    router.push("/dashboard");
  };

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
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-50/20 blur-[120px]"></div>
      </div>

      <CourseHeader />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-8 md:px-12 py-10 space-y-12">
        <div className="animate-reveal">
          <CourseFilter
            title="Các lớp giảng dạy"
            description={`Hệ thống ghi nhận ${lecturerData?.stats?.active_classes || 0} lớp học đang đồng bộ dữ liệu.`}
            icon={<BookOpen className="h-8 w-8 text-[#F27124]" />}
            semesters={semesterOptions}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {isClassesLoading ? (
          <div className="flex h-96 items-center justify-center animate-fade-up">
            <div className="flex flex-col items-center gap-4">
              <Sparkles className="h-8 w-8 text-slate-200 animate-pulse" />
              <p className="text-slate-400 text-[10px] font-bold tracking-widest">
                Đang lấy dữ liệu lớp học...
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up">
            <CourseGrid
              classes={processedClasses}
              onSelectClass={handleSelectClass}
              onClearFilter={handleClearFilter}
            />
          </div>
        )}
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
