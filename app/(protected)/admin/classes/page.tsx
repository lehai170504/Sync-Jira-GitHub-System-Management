"use client";

import { useState, useMemo } from "react";

// Components
import { ClassStats } from "@/features/management/classes/components/class-stats";
import { ClassToolbar } from "@/features/management/classes/components/class-toolbar";
import { ClassList } from "@/features/management/classes/components/class-list";
import { ClassDetailDrawer } from "@/features/management/classes/components/class-detail-drawer";

// Hooks & Types
import { useClasses } from "@/features/management/classes/hooks/use-classes";
import { Class } from "@/features/management/classes/types";

export default function ClassManagementPage() {
  // 1. State quản lý
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // State Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  // 2. Fetch Data từ API
  const apiSemesterId = semesterFilter === "all" ? undefined : semesterFilter;

  const { data, isLoading } = useClasses({
    semester_id: apiSemesterId,
  });

  const classes = data?.classes || [];

  // 3. Logic Filter Client-side
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

  // 4. Handlers
  const clearFilters = () => {
    setSearchTerm("");
    setSemesterFilter("all");
  };

  const handleViewDetails = (cls: Class) => {
    setSelectedClass(cls);
    setIsDrawerOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Danh sách Lớp học
        </h2>
        <p className="text-muted-foreground mt-1">
          Quản lý các lớp học, theo dõi tiến độ và thành viên.
        </p>
      </div>

      {/* STATS DASHBOARD 

[Image of dashboard metrics ui]
 */}
      <ClassStats data={classes} />

      {/* TOOLBAR */}
      <ClassToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        semesterFilter={semesterFilter}
        setSemesterFilter={setSemesterFilter}
        clearFilters={clearFilters}
      />

      {/* CLASS LIST */}
      <ClassList
        classes={filteredClasses}
        isLoading={isLoading}
        onEditClass={(cls) => console.log("Edit functionality pending", cls)}
        onClearFilters={clearFilters}
        onViewClassDetails={handleViewDetails}
      />

      {/* DETAIL DRAWER */}
      <ClassDetailDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedClass={selectedClass}
        students={[]}
      />
    </div>
  );
}
