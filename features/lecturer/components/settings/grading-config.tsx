"use client";

import { useState } from "react";
// Bỏ import Cookies vì không cần thiết ở file này nữa
import { Loader2, Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import Hooks & Types & Components
import { useUpdateGradingConfig } from "@/features/lecturer/hooks/use-grading";
import { GradeColumn } from "@/features/lecturer/types/grading-types";
import { GradeStructureCard } from "@/features/lecturer/components/grading-config/grade-structure-card";
import { ContributionConfigCard } from "@/features/lecturer/components/grading-config/contribution-config-card";

interface GradingConfigProps {
  classId: string;
}

export function GradingConfig({ classId }: GradingConfigProps) {
  // ĐÃ XÓA DÒNG CONST CLASSID Ở ĐÂY VÌ ĐÃ CÓ TỪ PROPS
  const { mutate: updateConfig, isPending } = useUpdateGradingConfig(classId);

  // State
  // TODO: Bạn nên thêm hook useGetGradingConfig(classId) để lấy dữ liệu ban đầu từ API
  const [gradeStructure, setGradeStructure] = useState<GradeColumn[]>([
    { name: "Assignment 1", weight: 0.2, isGroupGrade: false },
    { name: "Assignment 2", weight: 0.3, isGroupGrade: false },
    { name: "Final Project", weight: 0.5, isGroupGrade: true },
  ]);

  const [contribution, setContribution] = useState({
    jiraWeight: 0.4,
    gitWeight: 0.4,
    reviewWeight: 0.2,
    allowOverCeiling: false,
  });

  const handleSave = () => {
    // Validate trước khi submit
    const totalGrade = Math.round(
      gradeStructure.reduce((sum, i) => sum + Number(i.weight), 0) * 100
    );
    const totalContrib = Math.round(
      (contribution.jiraWeight +
        contribution.gitWeight +
        contribution.reviewWeight) *
        100
    );

    if (totalGrade !== 100)
      return toast.error(
        `Tổng trọng số cột điểm phải bằng 100%. Hiện tại: ${totalGrade}%`
      );
    if (totalContrib !== 100)
      return toast.error(
        `Tổng trọng số đánh giá nhóm phải bằng 100%. Hiện tại: ${totalContrib}%`
      );

    updateConfig({ gradeStructure, contributionConfig: contribution });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION IN TAB */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-orange-100 dark:border-orange-900/50 transition-colors">
            <Settings2 className="h-6 w-6 text-[#F27124] dark:text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 transition-colors">
              Cấu hình trọng số (Weighting)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
              Thiết lập quy tắc tính điểm cho toàn bộ lớp học này.
            </p>
          </div>
        </div>

        {/* Nút Save riêng cho tab này */}
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-full sm:w-auto bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/20 dark:shadow-none"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Áp dụng cấu hình
        </Button>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <GradeStructureCard
          gradeStructure={gradeStructure}
          onChange={setGradeStructure}
        />
        <ContributionConfigCard
          config={contribution}
          onChange={setContribution}
        />
      </div>
    </div>
  );
}
