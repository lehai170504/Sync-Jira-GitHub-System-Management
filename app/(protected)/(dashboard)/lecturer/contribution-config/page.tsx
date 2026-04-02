"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { Loader2, Save, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { ContributionConfigCard } from "@/features/lecturer/components/grading-config/contribution-config-card";
import { useUpdateContributionConfig } from "@/features/lecturer/hooks/use-contribution-config";

export default function LecturerContributionConfigPage() {
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("classId") ?? undefined;

  const [classId, setClassId] = useState<string | undefined>(urlClassId);

  useEffect(() => {
    if (urlClassId) {
      setClassId(urlClassId);
      return;
    }
    const cookieClassId = Cookies.get("lecturer_class_id") ?? undefined;
    setClassId((prev) => prev ?? cookieClassId);
  }, [urlClassId]);

  const { data: classDetails, isLoading, isError } = useClassDetails(classId);
  const { mutate: saveConfig, isPending } =
    useUpdateContributionConfig(classId);

  const initialConfig = useMemo(() => {
    return (
      classDetails?.class?.contributionConfig ?? {
        jiraWeight: 0.4,
        gitWeight: 0.4,
        reviewWeight: 0.2,
        allowOverCeiling: false,
      }
    );
  }, [classDetails]);

  const [config, setConfig] = useState(initialConfig);
  useEffect(() => setConfig(initialConfig), [initialConfig]);

  const totalPercent = Math.round(
    (config.jiraWeight + config.gitWeight + config.reviewWeight) * 100,
  );

  const handleSave = () => {
    if (totalPercent !== 100) return;
    saveConfig(config);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-7 w-7 text-[#F27124]" />
            Trọng số đóng góp
          </h2>
          <p className="text-muted-foreground">
            Thiết lập trọng số Jira/Git/Review cho toàn bộ assignment của lớp.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending || isLoading || totalPercent !== 100}
          className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Lưu cấu hình
        </Button>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Đang tải dữ liệu lớp...
        </div>
      ) : isError || !classDetails?.class ? (
        <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100">
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription>
            Không thể tải thông tin lớp. Vui lòng thử lại.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">
              {classDetails.class.name} • {classDetails.class.class_code}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Tổng trọng số hiện tại:{" "}
              <span
                className={
                  "font-semibold " +
                  (totalPercent === 100
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-300")
                }
              >
                {totalPercent}%
              </span>
            </p>
          </CardHeader>
          <CardContent>
            <ContributionConfigCard config={config} onChange={setConfig} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
