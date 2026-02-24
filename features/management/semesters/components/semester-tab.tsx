"use client";

import { useState } from "react";
import { Loader2, Plus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import Hooks
import {
  useSemesters,
  useCreateSemester,
} from "@/features/management/semesters/hooks/use-semesters";

// Import Components
import { SemesterDetailSheet } from "@/features/management/semesters/components/semester-detail-sheet";
import { CreateSemesterModal } from "./create-semester-modal";
import { SemesterCard } from "./semester-card";

export function SemesterTab() {
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: semesters, isLoading } = useSemesters();
  const { mutate: createSemester, isPending: isCreating } = useCreateSemester();

  // Sắp xếp: Active lên đầu, sau đó đến mới nhất
  const sortedSemesters = semesters?.sort((a, b) => {
    if (a.status === "OPEN") return -1;
    if (b.status === "OPEN") return 1;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-100 items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium animate-pulse">
          Đang tải dữ liệu học kỳ...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Danh sách Học kỳ
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Quản lý và theo dõi tiến độ các kỳ học trong năm.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95 h-11 px-6 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo Học Kỳ
        </Button>
      </div>

      {/* 2. GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedSemesters?.map((semester) => (
          <SemesterCard
            key={semester._id}
            semester={semester}
            onClick={() => setSelectedSemesterId(semester._id)}
          />
        ))}

        {/* Empty State */}
        {sortedSemesters?.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-slate-50 dark:bg-slate-900/50 transition-colors">
            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
              <Archive className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-slate-900 dark:text-slate-50 font-bold text-lg">
              Chưa có dữ liệu
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-1">
              Bắt đầu bằng cách tạo một học kỳ mới cho hệ thống.
            </p>
            <Button
              variant="outline"
              className="mt-6 font-bold rounded-xl"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Tạo học kỳ
            </Button>
          </div>
        )}
      </div>

      {/* 3. MODALS & DRAWERS */}
      <CreateSemesterModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={createSemester}
        isCreating={isCreating}
      />

      <SemesterDetailSheet
        semesterId={selectedSemesterId}
        open={!!selectedSemesterId}
        onOpenChange={(open) => !open && setSelectedSemesterId(null)}
      />
    </div>
  );
}
