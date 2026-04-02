"use client";

import { useState, useMemo } from "react";
import {
  GraduationCap,
  LayoutGrid,
  FilterX,
  Search,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { ClassStats } from "@/features/management/classes/components/class-stats";
import { ClassToolbar } from "@/features/management/classes/components/class-toolbar";
import { ClassList } from "@/features/management/classes/components/class-list";
import { ClassDetailDrawer } from "@/features/management/classes/components/class-detail-drawer";
import { Button } from "@/components/ui/button";

// Hooks & Types
import { useClasses } from "@/features/management/classes/hooks/use-classes";
import { Class } from "@/features/management/classes/types/class-types";

export default function ClassManagementPage() {
  const [selectedClassId, setSelectedClassId] = useState<{
    _id: string;
  } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [lecturerFilter, setLecturerFilter] = useState<string>("all");

  const apiSemesterId = semesterFilter === "all" ? undefined : semesterFilter;
  const apiLecturerId = lecturerFilter === "all" ? undefined : lecturerFilter;

  // Fetch Data
  const { data, isLoading } = useClasses({
    semester_id: apiSemesterId,
    lecturer_id: apiLecturerId,
  });

  const classes = data?.classes || [];

  // --- TÍNH TOÁN DỮ LIỆU CHO STATS ---
  const statsSummary = useMemo(() => {
    // API list và API detail có thể khác naming key cho count.
    // Ví dụ: lecturer dùng `stats.total_students` / `stats.total_teams`.
    // nên ở đây fallback để không bị 0 khi server không trả `student_count`/`team_count`.
    const totalStudents = classes.reduce((sum: number, cls: any) => {
      const v =
        cls.student_count ??
        cls.total_students ??
        cls.stats?.total_students ??
        0;
      return sum + (Number(v) || 0);
    }, 0);

    const totalTeams = classes.reduce((sum: number, cls: any) => {
      const v =
        cls.team_count ??
        cls.total_teams ??
        cls.stats?.total_teams ??
        0;
      return sum + (Number(v) || 0);
    }, 0);
    const avgJiraWeight =
      classes.length > 0 ? classes[0].contributionConfig?.jiraWeight || 0 : 0;

    return { totalStudents, totalTeams, avgJiraWeight };
  }, [classes]);

  // Filter Logic (Search text)
  const filteredClasses = useMemo(() => {
    return classes.filter((cls: Class) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        cls.name?.toLowerCase().includes(searchLower) ||
        cls.class_code?.toLowerCase().includes(searchLower) ||
        cls.lecturer_id?.full_name?.toLowerCase().includes(searchLower)
      );
    });
  }, [classes, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
    setSemesterFilter("all");
    setLecturerFilter("all");
  };

  const handleViewDetails = (cls: Class) => {
    setSelectedClassId({ _id: cls._id });
    setIsDrawerOpen(true);
  };

  return (
    <div className="h-full pb-20 font-sans animate-in fade-in duration-700 relative transition-colors">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent dark:from-slate-900/20 pointer-events-none" />

      <div className="max-w-400 mx-auto space-y-10 p-4 md:p-8">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-200 dark:border-slate-800 pb-8 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[10px] bg-blue-50 dark:bg-blue-950/30 w-fit px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Hệ thống quản lý đào tạo</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
              Danh sách Lớp học
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
              Vận hành và theo dõi hiệu suất các lớp học, phân công giảng viên
              và cấu hình trọng số đánh giá.
            </p>
          </div>
        </div>

        {/* --- 2. STATS DASHBOARD --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-blue-100 to-purple-100 dark:from-slate-800 dark:to-slate-900 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative">
            <ClassStats
              totalStudents={statsSummary.totalStudents}
              totalTeams={statsSummary.totalTeams}
              jiraWeight={statsSummary.avgJiraWeight}
            />
          </div>
        </motion.div>

        {/* --- 3. FILTER & TOOLBAR (Sticky) --- */}
        <div className="sticky top-6 z-40">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
            <ClassToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              semesterFilter={semesterFilter}
              setSemesterFilter={setSemesterFilter}
              lecturerFilter={lecturerFilter}
              setLecturerFilter={setLecturerFilter}
              clearFilters={clearFilters}
            />
          </div>
        </div>

        {/* --- 4. DATA LIST SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
                Kết quả tìm kiếm ({filteredClasses.length})
              </h3>
            </div>

            <AnimatePresence>
              {(searchTerm ||
                semesterFilter !== "all" ||
                lecturerFilter !== "all") && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 gap-2 h-9 px-4 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <FilterX className="w-3.5 h-3.5" /> Xóa bộ lọc
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="min-h-125">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Đang nạp dữ liệu...
                </p>
              </div>
            ) : (
              <ClassList
                classes={filteredClasses}
                isLoading={isLoading}
                onEditClass={(cls: Class) => console.log("Edit:", cls)}
                onClearFilters={clearFilters}
                onViewClassDetails={handleViewDetails}
              />
            )}
          </div>
        </div>

        {/* --- 5. DETAIL DRAWER --- */}
        <ClassDetailDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          selectedClass={selectedClassId}
        />
      </div>
    </div>
  );
}
