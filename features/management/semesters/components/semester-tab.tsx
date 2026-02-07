"use client";

import { useState } from "react";
import { Loader2, Plus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import Hooks
import {
  useSemesters,
  useCreateSemester,
} from "@/features/management/semesters/hooks/use-semesters";

// Import Components đã tách
import { SemesterDetailSheet } from "@/features/management/semesters/components/semester-detail-sheet";
import { CreateSemesterModal } from "./create-semester-modal"; // File vừa tách
import { SemesterCard } from "./semester-card"; // File vừa tách

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
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Danh sách Học kỳ
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Quản lý và theo dõi tiến độ các kỳ học.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-800 hover:bg-[#F27124] text-white rounded-xl font-bold shadow-xl transition-all active:scale-95 h-11 px-6"
        >
          <Plus className="mr-1 h-4 w-4" /> Tạo Học Kỳ
        </Button>
      </div>

      {/* 2. GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSemesters?.map((semester) => (
          <SemesterCard
            key={semester._id}
            semester={semester}
            onClick={() => setSelectedSemesterId(semester._id)}
          />
        ))}

        {/* Empty State */}
        {sortedSemesters?.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Archive className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">
              Chưa có dữ liệu
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mt-1">
              Bắt đầu bằng cách tạo một học kỳ mới cho hệ thống.
            </p>
            <Button
              variant="link"
              className="text-[#F27124] font-bold mt-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Tạo ngay &rarr;
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
