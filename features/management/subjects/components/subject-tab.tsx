"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, FileText } from "lucide-react"; // Đổi icon cho hợp context
import { SubjectDialog } from "./subject-dialog";
import { useSubjects } from "../hooks/use-subjects"; // Import Hook GET
import { Skeleton } from "@/components/ui/skeleton";

export function SubjectTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. Gọi API GET lấy danh sách
  const { data, isLoading } = useSubjects(); // Mặc định lấy status=Active
  const subjects = data?.subjects || [];

  // 2. Filter Client-side (Tìm kiếm)
  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 w-full sm:w-auto h-11 px-6 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Thêm Môn học
        </Button>
      </div>

      {/* GRID CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Loading State */}
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="h-48 rounded-2xl border-gray-100 p-5 space-y-4"
            >
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full mt-4" />
            </Card>
          ))}

        {/* Data List */}
        {!isLoading &&
          filteredSubjects.map((sub) => (
            <Card
              key={sub._id}
              className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-100 hover:border-orange-200 cursor-pointer rounded-2xl overflow-hidden bg-white flex flex-col justify-between"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-5 px-5">
                <Badge
                  variant="secondary"
                  className="bg-orange-50 text-orange-700 border-0 font-bold px-3 py-1 text-xs rounded-md shadow-sm"
                >
                  {sub.code}
                </Badge>

                {/* Hiển thị số tín chỉ thay vì Menu Edit */}
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  <BookOpen className="h-3 w-3" />
                  {sub.credits} tín chỉ
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5">
                <div
                  className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-[#F27124] transition-colors mb-3 h-14"
                  title={sub.name}
                >
                  {sub.name}
                </div>

                {/* Description Section (Thay cho Manager) */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-orange-50/30 group-hover:border-orange-100 transition-colors h-20">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {sub.description || "Chưa có mô tả cho môn học này."}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

        {/* BUTTON: QUICK ADD CARD (Luôn hiển thị cuối cùng) */}
        {!isLoading && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-[#F27124] hover:bg-orange-50/20 transition-all group h-full min-h-[220px] cursor-pointer outline-none focus:ring-2 focus:ring-[#F27124] focus:ring-offset-2"
          >
            <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#F27124] group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-orange-200">
              <Plus className="h-7 w-7 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm font-semibold text-gray-500 group-hover:text-[#F27124] transition-colors">
              Tạo môn học mới
            </span>
          </button>
        )}
      </div>

      <SubjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
