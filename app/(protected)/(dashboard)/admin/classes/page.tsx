"use client";

import { useState, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Plus,
  FilterX,
  LayoutGrid,
  ListFilter,
} from "lucide-react";

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
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [lecturerFilter, setLecturerFilter] = useState<string>("all");

  const apiSemesterId = semesterFilter === "all" ? undefined : semesterFilter;
  const apiLecturerId = lecturerFilter === "all" ? undefined : lecturerFilter;

  const { data, isLoading } = useClasses({
    semester_id: apiSemesterId,
    lecturer_id: apiLecturerId,
  });

  const classes = data?.classes || [];

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        cls.name.toLowerCase().includes(searchLower) ||
        cls.class_code.toLowerCase().includes(searchLower) ||
        cls.lecturer_id?.full_name?.toLowerCase().includes(searchLower) ||
        cls.lecturer_id?.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [classes, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
    setSemesterFilter("all");
    setLecturerFilter("all");
  };

  const handleViewDetails = (cls: Class) => {
    setSelectedClass(cls);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#F27124] font-black uppercase tracking-[0.2em] text-[10px]">
              <GraduationCap className="h-4 w-4" />
              <span>Hệ thống quản lý đào tạo</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
              Danh sách Lớp học
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-2xl">
              Quản lý vận hành lớp học, phân công giảng viên và theo dõi tiến độ
              đào tạo tập trung.
            </p>
          </div>
        </div>

        {/* --- 2. STATS DASHBOARD --- */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-100 to-blue-100 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <ClassStats data={classes} />
          </div>
        </div>

        {/* --- 3. FILTER & TOOLBAR AREA --- */}
        <div className="bg-white p-2 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
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
              <LayoutGrid className="w-5 h-5 text-slate-400" />
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                Kết quả tìm kiếm ({filteredClasses.length})
              </h3>
            </div>

            {searchTerm ||
            semesterFilter !== "all" ||
            lecturerFilter !== "all" ? (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 gap-1"
              >
                <FilterX className="w-3 h-3" /> Xóa bộ lọc
              </Button>
            ) : null}
          </div>

          <div className="min-h-[500px]">
            <ClassList
              classes={filteredClasses}
              isLoading={isLoading}
              onEditClass={(cls) =>
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
          selectedClass={selectedClass}
          students={[]}
        />
      </div>
    </div>
  );
}
