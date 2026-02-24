"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Layers,
  ChevronRight,
  FilterX,
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
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );

  const { data, isLoading } = useSubjects();
  const subjects = data?.subjects || [];

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="relative w-full sm:w-100 group flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Tìm mã môn hoặc tên môn học..."
              className="pl-11 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all font-medium dark:text-slate-100 dark:placeholder:text-slate-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="hidden sm:flex text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <FilterX className="w-4 h-4 mr-1.5" /> Xóa
            </Button>
          )}
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 w-full sm:w-auto h-11 px-6 rounded-xl font-bold transition-all active:scale-95 gap-2 text-white shadow-sm"
        >
          <Plus className="h-4 w-4" /> Thêm Môn học
        </Button>
      </div>

      {/* GRID DANH SÁCH MÔN HỌC */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Loading State Skeleton */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="h-55 rounded-4x1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm"
            >
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20 rounded-md dark:bg-slate-800" />
                <Skeleton className="h-6 w-16 rounded-md dark:bg-slate-800" />
              </div>
              <Skeleton className="h-6 w-full rounded-md dark:bg-slate-800" />
              <Skeleton className="h-16 w-full rounded-xl mt-4 dark:bg-slate-800" />
            </Card>
          ))}

        {/* Danh sách môn học */}
        {!isLoading &&
          filteredSubjects.map((sub) => (
            <Card
              key={sub._id}
              onClick={() => setSelectedSubjectId(sub._id)}
              className="group relative hover:shadow-md hover:-translate-y-1 transition-all duration-300 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800/50 cursor-pointer rounded-4x1 overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-55"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-5 px-5">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none font-bold px-2.5 py-0.5 text-[10px] rounded-md tracking-widest uppercase transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                  {sub.code}
                </Badge>

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <Layers className="h-3 w-3" />
                  {sub.credits} Tín chỉ
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5 flex-1 flex flex-col justify-between">
                <div
                  className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  title={sub.name}
                >
                  {sub.name}
                </div>

                {/* Mô tả ngắn */}
                <div className="mt-3 flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <FileText className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                    {sub.description || "Chưa có nội dung mô tả chi tiết."}
                  </span>
                </div>
              </CardContent>

              {/* Action Indicator */}
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4 w-4 text-blue-500" />
              </div>
            </Card>
          ))}

        {/* QUICK ADD CARD */}
        {!isLoading && filteredSubjects.length > 0 && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-4x1 p-5 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group h-55 outline-none"
          >
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300">
              <Plus className="h-6 w-6 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Tạo môn học
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredSubjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
            <BookOpen className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-bold text-lg">
            Không tìm thấy môn học
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">
            Hãy thử tìm kiếm với từ khóa khác hoặc tạo mới.
          </p>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            onClick={() => setSearchTerm("")}
          >
            <FilterX className="w-4 h-4 mr-2" /> Xóa bộ lọc
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
