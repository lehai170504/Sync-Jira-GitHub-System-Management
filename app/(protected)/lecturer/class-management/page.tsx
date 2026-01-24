"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StudentImport } from "@/features/lecturer/components/class/student-import";
import { AddStudentDialog } from "@/features/lecturer/components/class/add-student-dialog";
import { StudentList } from "@/features/lecturer/components/class/student-list";

// MOCK INITIAL DATA
const INITIAL_STUDENTS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    code: "SE1701",
    email: "an@fpt.edu.vn",
    group: "Team 1",
    isLeader: true,
  },
  {
    id: "2",
    name: "Trần Thị B",
    code: "SE1702",
    email: "binh@fpt.edu.vn",
    group: "Team 1",
    isLeader: false,
  },
];

export default function ClassManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // Xử lý Import: Reset data cũ -> Set data mới
  const handleImport = (importedData: any[]) => {
    setStudents(importedData); // Gán trực tiếp data mới, thay thế data cũ
  };

  // Xử lý Add Manual: Nối thêm vào data hiện tại
  const handleAddManual = (newStudent: any) => {
    setStudents([...students, newStudent]);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Lớp & Nhóm
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <span className="font-semibold text-[#F27124]">SE1783</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Danh sách sinh viên & Cấu trúc nhóm</span>
          </p>
        </div>
        <div className="flex gap-2">
          {/* Component Import */}
          <StudentImport onImport={handleImport} />
          {/* Component Add Manual */}
          <AddStudentDialog onAdd={handleAddManual} />
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc MSSV..."
            className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-[#F27124] focus:ring-2 focus:ring-orange-100 rounded-xl transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STUDENT LIST */}
      <StudentList students={students} filterTerm={searchTerm} />
    </div>
  );
}
