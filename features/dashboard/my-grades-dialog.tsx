"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import { getMyGradesApi } from "@/features/management/reviews/api/my-grades-api";

interface MyGradesDialogProps {
  classId?: string;
}

const formatNumber = (value: number | undefined) =>
  typeof value === "number" ? value.toFixed(1) : "—";

const formatDateTime = (value: string | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function MyGradesDialog({ classId }: MyGradesDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: myClasses } = useMyClasses();

  const teamId = useMemo(() => {
    if (!classId || !myClasses?.classes?.length) return undefined;
    const currentClass = myClasses.classes.find((cls) => cls.class._id === classId);
    return currentClass?.team_id;
  }, [classId, myClasses]);

  const {
    data: gradesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-grades", teamId],
    queryFn: () => getMyGradesApi(teamId!),
    enabled: open && !!teamId,
    staleTime: 30 * 1000,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-[#F27124] hover:bg-[#d65d1b] text-white">
          <BookCheck className="h-4 w-4 mr-2" />
          Xem bảng điểm
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Bảng điểm cá nhân
          </DialogTitle>
          <DialogDescription>
            Dữ liệu điểm cuối kỳ sau khi giảng viên chốt điểm.
          </DialogDescription>
        </DialogHeader>

        {!teamId ? (
          <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30">
            <CardContent className="pt-6 text-sm text-amber-900 dark:text-amber-100">
              Không xác định được team hiện tại để lấy bảng điểm.
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
          </div>
        ) : isError ? (
          <Card className="border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30">
            <CardContent className="pt-6 text-sm text-red-800 dark:text-red-200">
              {(error as any)?.response?.data?.message ||
                (error as any)?.message ||
                "Không thể tải bảng điểm."}
            </CardContent>
          </Card>
        ) : !gradesData?.data?.length ? (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Chưa có dữ liệu bảng điểm cá nhân.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {gradesData.data.map((item, index) => (
              <Card
                key={`${item.assignment_name}-${index}`}
                className="border-slate-200 dark:border-slate-800"
              >
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.assignment_name || `Assignment ${index + 1}`}
                    </p>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">
                      Final: {formatNumber(item.final_score)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <Badge variant="outline">Group: {formatNumber(item.group_grade)}</Badge>
                    <Badge variant="outline">Jira: {formatNumber(item.jira_percentage)}</Badge>
                    <Badge variant="outline">Git: {formatNumber(item.git_percentage)}</Badge>
                    <Badge variant="outline">Review: {formatNumber(item.review_percentage)}</Badge>
                    <Badge variant="outline">
                      Factor: {formatNumber(item.contribution_factor)}
                    </Badge>
                    <Badge variant="outline">
                      Cập nhật: {formatDateTime(item.updated_at)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

