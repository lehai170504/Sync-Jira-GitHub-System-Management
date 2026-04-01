"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import Hooks & Types & Components
import { useUpdateGradingConfig } from "@/features/lecturer/hooks/use-grading";
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details"; // Dùng lại hook này để lấy data
import { ContributionConfigCard } from "@/features/lecturer/components/grading-config/contribution-config-card";

interface GradingConfigProps {
  classId: string;
}

export function GradingConfig({ classId }: GradingConfigProps) {
  // Hook gọi API lấy thông tin lớp (có chứa contributionConfig)
  const { data: classData, isLoading: isFetching } = useClassDetails(classId);

  // Hook gọi API Cập nhật
  const { mutate: updateConfig, isPending: isUpdating } =
    useUpdateGradingConfig(classId);

  // State mặc định (fallback)
  const [contribution, setContribution] = useState({
    jiraWeight: 0.4,
    gitWeight: 0.4,
    reviewWeight: 0.2,
    allowOverCeiling: false,
  });

  useEffect(() => {
    if (classData?.class?.contributionConfig) {
      const config = classData.class.contributionConfig;
      setContribution({
        jiraWeight: config.jiraWeight ?? 0.4,
        gitWeight: config.gitWeight ?? 0.4,
        reviewWeight: config.reviewWeight ?? 0.2,
        allowOverCeiling: config.allowOverCeiling ?? false,
      });
    }
  }, [classData]);

  const handleSave = () => {
    // Validate tổng trọng số phải bằng 100% (hoặc 1.0)
    const totalContrib = Math.round(
      (contribution.jiraWeight +
        contribution.gitWeight +
        contribution.reviewWeight) *
        100
    );

    if (totalContrib !== 100)
      return toast.error(
        `Tổng trọng số đánh giá nhóm phải bằng 100%. Hiện tại: ${totalContrib}%`
      );

    // Gửi đúng 4 field xuống API
    updateConfig({
      jiraWeight: contribution.jiraWeight,
      gitWeight: contribution.gitWeight,
      reviewWeight: contribution.reviewWeight,
      allowOverCeiling: contribution.allowOverCeiling,
    });
  };

  // Hiển thị loading trong lúc đợi kéo config cũ về
  if (isFetching) {
    return (
      <div className="flex flex-col h-[40vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#F27124] mb-4" />
        <p className="text-sm font-medium">Đang tải cấu hình hiện tại...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      {/* HEADER SECTION IN TAB */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-orange-100 dark:border-orange-900/50 transition-colors">
            <Settings2 className="h-6 w-6 text-[#F27124] dark:text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 transition-colors">
              Cấu hình trọng số Đồ án
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
              Thiết lập quy tắc tính điểm (Jira, Git, Review) cho toàn bộ lớp
              học này.
            </p>
          </div>
        </div>

        {/* Nút Save */}
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="w-full sm:w-auto bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/20 dark:shadow-none"
        >
          {isUpdating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Áp dụng cấu hình
        </Button>
      </div>

      {/* CONTENT: Chỉ hiển thị Card cấu hình trọng số nhóm */}
      <div>
        <ContributionConfigCard
          config={contribution}
          onChange={setContribution}
        />
      </div>
    </div>
  );
}
