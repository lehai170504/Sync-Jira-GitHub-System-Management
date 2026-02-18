"use client";

import { useState, useMemo } from "react";
import { GraduationCap, LayoutGrid, FilterX } from "lucide-react";

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

  // Filter Logic (Client-side search text)
  const filteredClasses = useMemo(() => {
    return classes.filter((cls: Class) => {
      const searchLower = searchTerm.toLowerCase();

      const nameMatch = cls.name?.toLowerCase().includes(searchLower);
      const codeMatch = cls.class_code?.toLowerCase().includes(searchLower);
      const lecturerNameMatch = cls.lecturer_id?.full_name
        ?.toLowerCase()
        .includes(searchLower);
      const lecturerEmailMatch = cls.lecturer_id?.email
        ?.toLowerCase()
        .includes(searchLower);

      return nameMatch || codeMatch || lecturerNameMatch || lecturerEmailMatch;
    });
  }, [classes, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
    setSemesterFilter("all");
    setLecturerFilter("all");
  };

  // Handler mở Drawer
  const handleViewDetails = (cls: Class) => {
    setSelectedClassId({ _id: cls._id });
    setIsDrawerOpen(true);
  };

  return (
    // FIX: Nền tối cho toàn trang
    <div className="h-full pb-20 font-sans animate-in fade-in duration-700 relative">
      {/* Background Decor cho Dark Mode */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/50 via-slate-50/50 to-transparent dark:from-slate-900/50 dark:via-slate-950/50 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200/60 dark:border-slate-800 pb-8 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#F27124] dark:text-orange-400 font-black uppercase tracking-[0.2em] text-[10px] bg-orange-50 dark:bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-100 dark:border-orange-500/20">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Hệ thống quản lý đào tạo</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-50 md:text-5xl lg:text-6xl transition-colors">
              Danh sách Lớp học
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
              Quản lý vận hành lớp học, phân công giảng viên và theo dõi tiến độ
              đào tạo tập trung.
            </p>
          </div>
        </div>

        {/* --- 2. STATS DASHBOARD --- */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-100 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <ClassStats data={classes} />
          </div>
        </div>

        {/* --- 3. FILTER & TOOLBAR AREA --- */}
        {/* FIX: Nền trắng -> Nền tối (bg-white dark:bg-slate-900) */}
        <div className="bg-white dark:bg-slate-900 p-2 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
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

        {/* --- 4. DATA LIST SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">
                Kết quả tìm kiếm ({filteredClasses.length})
              </h3>
            </div>

            {searchTerm ||
            semesterFilter !== "all" ||
            lecturerFilter !== "all" ? (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 gap-1"
              >
                <FilterX className="w-3 h-3" /> Xóa bộ lọc
              </Button>
            ) : null}
          </div>

          <div className="min-h-[500px]">
            <ClassList
              classes={filteredClasses}
              isLoading={isLoading}
              onEditClass={(cls: Class) =>
                console.log("Edit functionality pending", cls)
              }
              onClearFilters={clearFilters}
              onViewClassDetails={handleViewDetails}
            />
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
