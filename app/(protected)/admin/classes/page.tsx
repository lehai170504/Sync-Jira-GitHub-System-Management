"use client";

import { useState, useMemo } from "react";
import { ClassStats } from "@/components/features/classes/class-stats";
import { ClassToolbar } from "@/components/features/classes/class-toolbar";
import { ClassList } from "@/components/features/classes/class-list";
import { ClassDetailDrawer } from "@/components/features/classes/class-detail-drawer";
import {
  classesData,
  mockStudents,
} from "@/components/features/classes/class-data";
import { ClassItem } from "@/components/features/classes/class-types";
import { EditClassDialog } from "@/components/features/classes/edit-class-dialog";

export default function ClassManagementPage() {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  // State quản lý Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "all",
    status: "all",
    semester: "all",
  });

  // Derived Data (Tính toán dữ liệu lọc)
  const uniqueSubjects = useMemo(
    () => Array.from(new Set(classesData.map((c) => c.subject))),
    [],
  );
  const uniqueSemesters = useMemo(
    () => Array.from(new Set(classesData.map((c) => c.semester))),
    [],
  );

  const activeFiltersCount = [
    filters.subject !== "all",
    filters.status !== "all",
    filters.semester !== "all",
  ].filter(Boolean).length;

  const filteredClasses = useMemo(() => {
    return classesData.filter((cls) => {
      const matchesSearch =
        cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        filters.subject === "all" || cls.subject === filters.subject;
      const matchesStatus =
        filters.status === "all" || cls.status === filters.status;
      const matchesSemester =
        filters.semester === "all" || cls.semester === filters.semester;

      return (
        matchesSearch && matchesSubject && matchesStatus && matchesSemester
      );
    });
  }, [searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ subject: "all", status: "all", semester: "all" });
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

      {/* STATS DASHBOARD */}
      <ClassStats data={classesData} />

      {/* TOOLBAR */}
      <ClassToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        uniqueSubjects={uniqueSubjects}
        uniqueSemesters={uniqueSemesters}
        activeFiltersCount={activeFiltersCount}
        clearFilters={clearFilters}
      />

      {/* CLASS LIST */}
      <ClassList
        classes={filteredClasses}
        onSelectClass={setSelectedClass}
        onEditClass={(cls) => setEditingClass(cls)}
        onClearFilters={clearFilters}
      />
      {/* DETAIL DRAWER */}
      <ClassDetailDrawer
        isOpen={!!selectedClass}
        onOpenChange={(open) => !open && setSelectedClass(null)}
        selectedClass={selectedClass}
        students={mockStudents}
      />
      {/* EDIT CLASS DIALOG */}
      <EditClassDialog
        open={!!editingClass}
        onOpenChange={(open) => !open && setEditingClass(null)}
        classData={editingClass}
        onSuccess={() => {
          // Logic reload data nếu cần
          console.log("Edit success");
        }}
      />
    </div>
  );
}
