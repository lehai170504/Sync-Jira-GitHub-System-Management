"use client";

import {
  useSemesters,
  useCreateSemester,
} from "@/features/management/semesters/hooks/use-semesters";
import { SemesterForm } from "./semester-form";
import { SemesterHistory } from "./semester-history";

export function SemesterTab() {
  // 1. Fetch Data logic
  const { data: semesters, isLoading } = useSemesters();
  const { mutate: createSemester, isPending: isCreating } = useCreateSemester();

  const activeSemester = semesters?.find((s) => s.status === "OPEN");
  const pastSemesters = semesters?.filter((s) => s.status !== "OPEN") || [];

  // Loading Skeleton (đơn giản)
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
          {/* LEFT: FORM */}
          <SemesterForm
            activeSemester={activeSemester}
            isCreating={isCreating}
            onCreate={createSemester}
          />

          {/* RIGHT: HISTORY (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 self-start space-y-6">
            <SemesterHistory
              activeSemester={activeSemester}
              pastSemesters={pastSemesters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
