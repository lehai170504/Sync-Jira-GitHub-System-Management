"use client";

import { useState } from "react";
import {
  GradeColumn,
  ContributionConfig,
  GradingConfigPayload,
} from "../../types/grading-types";

import { updateGradingConfigApi } from "../../api/grading-api"; // Chỉnh lại đường dẫn import
import { Button } from "@/components/ui/button";
import { Save, Loader2, BookCheck } from "lucide-react";
import { toast } from "sonner"; // Hoặc thay bằng library toast bạn dùng
import { GradeStructureCard } from "./grade-structure-card";
import { ContributionConfigCard } from "./contribution-config-card";

interface GradingConfigProps {
  classId: string;
}

export function GradingConfig({ classId }: GradingConfigProps) {
  const [isSaving, setIsSaving] = useState(false);

  // State quản lý mảng cột điểm (Tạm thời default 1 vài dữ liệu mẫu hoặc bạn có thể fetch API ban đầu)
  const [gradeStructure, setGradeStructure] = useState<GradeColumn[]>([
    { name: "Assignment 1", weight: 0.2, isGroupGrade: true },
    { name: "Assignment 2", weight: 0.3, isGroupGrade: true },
    { name: "Final Project", weight: 0.5, isGroupGrade: true },
  ]);

  // State quản lý cấu hình đánh giá nhóm
  const [contributionConfig, setContributionConfig] =
    useState<ContributionConfig>({
      jiraWeight: 0.4,
      gitWeight: 0.4,
      reviewWeight: 0.2,
      allowOverCeiling: false,
    });

  const handleSave = async () => {
    // 1. Validation kiểm tra tổng trọng số = 100%
    const totalGrade = gradeStructure.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    const totalContrib =
      contributionConfig.jiraWeight +
      contributionConfig.gitWeight +
      contributionConfig.reviewWeight;

    if (Math.round(totalGrade * 100) !== 100) {
      toast.error("Lỗi: Tổng trọng số các Cột điểm phải đúng bằng 100%.");
      return;
    }

    if (Math.round(totalContrib * 100) !== 100) {
      toast.error("Lỗi: Tổng trọng số Đánh giá nhóm phải đúng bằng 100%.");
      return;
    }

    // 2. Gọi API Lưu
    setIsSaving(true);
    try {
      const payload: GradingConfigPayload = {
        gradeStructure: gradeStructure.map((item) => ({
          name: item.name,
          weight: item.weight,
          isGroupGrade: item.isGroupGrade,
        })),
        contributionConfig,
      };

      await updateGradingConfigApi(classId, payload);
      toast.success("Cập nhật cấu hình điểm thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi lưu cấu hình điểm.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <BookCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Thiết lập Điểm số & Trọng số
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Định nghĩa cấu trúc các cột điểm trong lớp và tỷ lệ phân bổ để tự
              động tính điểm cá nhân cho sinh viên từ các bài tập nhóm.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#F27124] hover:bg-[#e0661e] text-white px-6 py-5 rounded-xl shadow-md transition-all font-semibold"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Lưu Cấu Hình
        </Button>
      </div>

      {/* Grid chứa 2 form UI */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <GradeStructureCard
          gradeStructure={gradeStructure}
          onChange={setGradeStructure}
        />

        <ContributionConfigCard
          config={contributionConfig}
          onChange={setContributionConfig}
        />
      </div>
    </div>
  );
}
