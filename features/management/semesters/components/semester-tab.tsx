"use client";

import { useState } from "react"; // 1. Import useState
import {
  useSemesters,
  useCreateSemester,
} from "@/features/management/semesters/hooks/use-semesters";
// 👇 Import Hook chi tiết (dùng cho phần Active trên màn hình chính)
import { useSemesterDetails } from "@/features/management/semesters/hooks/use-semester-details";
// 👇 Import Component Drawer Mới
import { SemesterDetailSheet } from "@/features/management/semesters/components/semester-detail-sheet";
import { SemesterForm } from "./semester-form";
import { SemesterHistory } from "./semester-history";
import { Loader2, BookOpen, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SemesterTab() {
  // State quản lý việc mở Drawer
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );

  // 1. Fetch List Data
  const { data: semesters, isLoading } = useSemesters();
  const { mutate: createSemester, isPending: isCreating } = useCreateSemester();

  const activeSemester = semesters?.find((s) => s.status === "OPEN");
  const pastSemesters = semesters?.filter((s) => s.status !== "OPEN") || [];

  // 2. Fetch chi tiết cho Active Semester (để hiển thị tóm tắt trên UI chính)
  const { data: activeSemesterDetail, isLoading: isDetailLoading } =
    useSemesterDetails(activeSemester?._id);

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-10 flex items-center justify-center">
        <div className="h-32 w-32 bg-slate-200 animate-pulse rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Quản lý Học kỳ
          </h1>
          <p className="text-slate-500 text-lg">
            Thiết lập thời gian và theo dõi tiến độ các kỳ học tại FPT
            University.
          </p>
        </div>

        {/* LAYOUT GRID */}
        <div className="grid gap-8 lg:grid-cols-12 items-start relative">
          {/* LEFT: FORM & ACTIVE SEMESTER SUMMARY */}
          <div className="lg:col-span-8 space-y-8">
            <SemesterForm
              activeSemester={activeSemester}
              isCreating={isCreating}
              onCreate={createSemester}
            />

            {/* Active Semester Summary Card */}
            {activeSemester && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Lớp học trong kỳ {activeSemester.name}
                  </h3>
                  {/* Nút Xem Chi Tiết -> Mở Drawer */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setSelectedSemesterId(activeSemester._id)}
                  >
                    Xem tất cả <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                {/* Phần hiển thị tóm tắt (Preview 4 lớp) */}
                {isDetailLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeSemesterDetail?.classes &&
                    activeSemesterDetail.classes.length > 0 ? (
                      activeSemesterDetail.classes.slice(0, 4).map(
                        (
                          cls, // Chỉ hiện 4 lớp đầu tiên
                        ) => (
                          <div
                            key={cls._id}
                            className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-bold text-sm text-gray-800">
                                {cls.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {cls.subjectName}
                              </p>
                            </div>
                            <div className="text-right">
                              {cls.lecturer_id ? (
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                  <Users className="w-3 h-3" />
                                  <span className="truncate max-w-[80px]">
                                    {cls.lecturer_id.full_name}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                                  No Lecturer
                                </span>
                              )}
                            </div>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-sm text-gray-400 col-span-2 text-center py-4">
                        Chưa có lớp nào trong kỳ này.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: HISTORY */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 self-start space-y-6">
            <SemesterHistory
              activeSemester={activeSemester}
              pastSemesters={pastSemesters}
              onSelect={(id) => setSelectedSemesterId(id)}
            />
          </div>
        </div>
      </div>

      {/* 👇 DRAWER HIỂN THỊ CHI TIẾT */}
      <SemesterDetailSheet
        semesterId={selectedSemesterId}
        open={!!selectedSemesterId}
        onOpenChange={(open) => !open && setSelectedSemesterId(null)}
      />
    </div>
  );
}
