"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";

// Components
import { ClassStats } from "@/features/management/classes/components/class-stats";
import { ClassToolbar } from "@/features/management/classes/components/class-toolbar";
import { ClassList } from "@/features/management/classes/components/class-list";

// Import các component Drawer/Dialog cũ (Cần update type cho các file này sau)
import { ClassDetailDrawer } from "@/components/features/classes/class-detail-drawer";
import { EditClassDialog } from "@/components/features/classes/edit-class-dialog";

// Hooks & Types
import { useClasses } from "@/features/management/classes/hooks/use-classes";
import { Class } from "@/features/management/classes/types";

export default function ClassManagementPage() {
  // 1. State quản lý
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // State Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  // 2. Fetch Data từ API
  // Nếu chọn "all", gửi undefined để API lấy tất cả, ngược lại gửi ID học kỳ
  const apiSemesterId = semesterFilter === "all" ? undefined : semesterFilter;

  const { data, isLoading } = useClasses({
    semester_id: apiSemesterId,
  });

  const classes = data?.classes || [];

  // 3. Logic Filter Client-side (Search Text)
  // API đã lọc theo học kỳ rồi, giờ ta chỉ cần lọc theo tên/giảng viên ở client
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        cls.name.toLowerCase().includes(searchLower) ||
        cls.lecturer?.full_name?.toLowerCase().includes(searchLower) ||
        cls.lecturer?.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [classes, searchTerm]);

  // 4. Clear Filters
  const clearFilters = () => {
    setSearchTerm("");
    setSemesterFilter("all");
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
      {/* Truyền dữ liệu thật từ API vào Stats */}
      <ClassStats data={classes} />

      {/* TOOLBAR */}
      {/* Sử dụng Component Toolbar mới đã tích hợp sẵn Select Học kỳ từ API */}
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
        onSelectClass={setSelectedClass}
        onEditClass={(cls) => setEditingClass(cls)}
        onClearFilters={clearFilters}
      />

      {/* --- CÁC COMPONENT PHỤ (DRAWER/DIALOG) --- */}
      {/* Lưu ý: Bạn cần cập nhật Type trong các file này để khớp với interface Class mới (_id thay vì id) */}

      {/* DETAIL DRAWER */}
      {/* Giả định ClassDetailDrawer đã được update để nhận prop `selectedClass` kiểu `Class`.
        Nếu chưa, bạn cần vào file đó sửa `id: number` thành `_id: string`.
      */}
      {/* <ClassDetailDrawer
        isOpen={!!selectedClass}
        onOpenChange={(open) => !open && setSelectedClass(null)}
        selectedClass={selectedClass} 
      /> */}

      {/* EDIT CLASS DIALOG */}
      {/* <EditClassDialog
        open={!!editingClass}
        onOpenChange={(open) => !open && setEditingClass(null)}
        classData={editingClass}
        onSuccess={() => {
          // React Query sẽ tự động invalidate cache nên không cần reload thủ công
          console.log("Edit success");
        }}
      /> */}
    </div>
  );
}
