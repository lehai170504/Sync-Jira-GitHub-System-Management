"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Layers,
  ChevronRight,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Components
import { SubjectDialog } from "./subject-dialog";
import { SubjectDetailSheet } from "./subject-detail-sheet";

// Hooks
import { useSubjects } from "../hooks/use-subjects";

export function SubjectTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Quản lý trạng thái môn học được chọn để xem chi tiết
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );

  // 1. Gọi API lấy danh sách môn học
  const { data, isLoading } = useSubjects();
  const subjects = data?.subjects || [];

  // 2. Lọc danh sách theo từ khóa tìm kiếm
  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* TOOLBAR: Tìm kiếm & Thêm mới */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm mã môn hoặc tên môn học..."
            className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#F27124] focus:ring-[#F27124]/10 rounded-2xl transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 w-full sm:w-auto h-12 px-8 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 gap-2"
        >
          <Plus className="h-5 w-5" /> Thêm Môn học
        </Button>
      </div>

      {/* GRID DANH SÁCH MÔN HỌC */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Loading State Skeleton */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="h-[240px] rounded-[32px] border-slate-100 p-6 space-y-4 shadow-none"
            >
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-2xl mt-4" />
            </Card>
          ))}

        {/* Danh sách môn học */}
        {!isLoading &&
          filteredSubjects.map((sub) => (
            <Card
              key={sub._id}
              onClick={() => setSelectedSubjectId(sub._id)}
              className="group relative hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1.5 transition-all duration-500 border-slate-100 hover:border-[#F27124]/30 cursor-pointer rounded-[32px] overflow-hidden bg-white flex flex-col h-[240px]"
            >
              {/* Overlay trang trí khi hover */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-[#F27124]/10 rounded-full">
                  <ChevronRight className="h-4 w-4 text-[#F27124]" />
                </div>
              </div>

              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <Badge
                  variant="outline"
                  className="bg-orange-50/50 text-[#F27124] border-orange-100 font-black px-3 py-1 text-[10px] rounded-lg tracking-widest"
                >
                  {sub.code}
                </Badge>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                  <Layers className="h-3 w-3" />
                  {sub.credits} Tín chỉ
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6 flex-1 flex flex-col justify-between">
                <div
                  className="text-xl font-black text-slate-900 line-clamp-2 group-hover:text-[#F27124] transition-colors tracking-tight leading-tight"
                  title={sub.name}
                >
                  {sub.name}
                </div>

                {/* Mô tả ngắn */}
                <div className="mt-4 flex items-start gap-3 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100 group-hover:bg-white group-hover:border-orange-100 transition-all duration-500">
                  <FileText className="h-4 w-4 text-slate-300 mt-0.5 flex-shrink-0 group-hover:text-[#F27124]/50" />
                  <span className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {sub.description ||
                      "Chưa có nội dung mô tả chi tiết cho môn học này."}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

        {/* QUICK ADD CARD: Luôn hiển thị cuối cùng */}
        {!isLoading && filteredSubjects.length > 0 && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 rounded-[32px] p-6 hover:border-[#F27124] hover:bg-orange-50/20 transition-all group h-[240px] outline-none focus:ring-4 focus:ring-orange-100"
          >
            <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#F27124] group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-orange-200">
              <Plus className="h-8 w-8 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-slate-500 group-hover:text-[#F27124] transition-colors">
                Tạo môn học mới
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Thêm vào danh mục hệ thống
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredSubjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
          <div className="p-6 bg-white rounded-full shadow-sm mb-4">
            <BookOpen className="h-12 w-12 text-slate-200" />
          </div>
          <p className="text-slate-500 font-bold text-lg">
            Không tìm thấy môn học nào
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Hãy thử tìm kiếm với từ khóa khác
          </p>
          <Button
            variant="link"
            className="mt-4 text-[#F27124] font-bold"
            onClick={() => setSearchTerm("")}
          >
            Xóa tìm kiếm
          </Button>
        </div>
      )}

      {/* MODALS & SHEETS */}
      <SubjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <SubjectDetailSheet
        subjectId={selectedSubjectId}
        open={!!selectedSubjectId}
        onOpenChange={(open) => !open && setSelectedSubjectId(null)}
      />
    </div>
  );
}
