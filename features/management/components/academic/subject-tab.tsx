"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubjectDialog } from "./subject-dialog"; // ✅ Import component vừa tách

// Mock Data
const initialSubjects = [
  {
    id: 1,
    code: "SWP391",
    name: "Đồ án phần mềm",
    manager: "Nguyễn Văn A",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    code: "PRN231",
    name: "Lập trình Cross-Platform",
    manager: "Trần Thị B",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    code: "SWR302",
    name: "Kiểm thử phần mềm",
    manager: "Lê Hoàng C",
    color: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    code: "SWT301",
    name: "Kiểm thử nâng cao",
    manager: "Phạm Văn D",
    color: "bg-pink-100 text-pink-700",
  },
];

export function SubjectTab() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [searchTerm, setSearchTerm] = useState("");

  // State quản lý Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null); // State để biết đang sửa môn nào

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm mở dialog tạo mới
  const handleOpenCreate = () => {
    setEditingSubject(null); // Reset mode về create
    setIsDialogOpen(true);
  };

  // Hàm mở dialog chỉnh sửa
  const handleOpenEdit = (subject: any) => {
    setEditingSubject(subject); // Set data để fill vào form
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm kiếm môn học..."
            className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* BUTTON 1: TRÊN TOOLBAR */}
        <Button
          onClick={handleOpenCreate}
          className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 w-full sm:w-auto h-11 px-6 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Thêm Môn học
        </Button>
      </div>

      {/* GRID CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSubjects.map((sub) => (
          <Card
            key={sub.id}
            className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-100 hover:border-orange-200 cursor-pointer rounded-2xl overflow-hidden bg-white"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 pt-5 px-5">
              <Badge
                variant="secondary"
                className={`${sub.color} border-0 font-bold px-3 py-1 text-xs rounded-md shadow-sm`}
              >
                {sub.code}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  {/* Kích hoạt Edit Mode */}
                  <DropdownMenuItem
                    onClick={() => handleOpenEdit(sub)}
                    className="rounded-lg cursor-pointer"
                  >
                    Chỉnh sửa thông tin
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 rounded-lg cursor-pointer focus:text-red-700 focus:bg-red-50">
                    Xóa môn học
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div
                className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-[#F27124] transition-colors mb-4"
                title={sub.name}
              >
                {sub.name}
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-orange-50/30 group-hover:border-orange-100 transition-colors">
                <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-extrabold text-gray-500 uppercase shadow-sm">
                  {sub.manager.charAt(0)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                    Manager
                  </span>
                  <span className="truncate text-sm font-medium text-gray-700">
                    {sub.manager}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* BUTTON 2: QUICK ADD CARD */}
        <button
          onClick={handleOpenCreate}
          className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-[#F27124] hover:bg-orange-50/20 transition-all group h-full min-h-[180px] cursor-pointer outline-none focus:ring-2 focus:ring-[#F27124] focus:ring-offset-2"
        >
          <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#F27124] group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-orange-200">
            <Plus className="h-7 w-7 text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm font-semibold text-gray-500 group-hover:text-[#F27124] transition-colors">
            Tạo môn học mới
          </span>
        </button>
      </div>

      {/* ✅ CALL COMPONENT DIALOG - SẠCH SẼ HƠN RẤT NHIỀU */}
      <SubjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={editingSubject ? "edit" : "create"}
        defaultValues={editingSubject}
      />
    </div>
  );
}
