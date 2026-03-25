"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { Calculator, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { useReviewCalculate } from "@/features/lecturer/hooks/use-review-calculate";
import type { StudentFinalGrade } from "@/features/lecturer/types/grading-types";
import { exportClassGradesExcelApi } from "@/features/lecturer/api/class-grades-export-api";
import { toast } from "sonner";

function pickGradeArray(res: any): StudentFinalGrade[] {
  const a = res?.results ?? res?.students ?? res?.data;
  return Array.isArray(a) ? a : [];
}

export default function LecturerReviewCalculatePage() {
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

  const { data: classDetails, isLoading: isClassLoading, isError: isClassError } =
    useClassDetails(classId);

  const teams = useMemo(() => classDetails?.teams ?? [], [classDetails]);

  const [teamId, setTeamId] = useState<string>("");
  useEffect(() => {
    if (!teamId && teams.length > 0) setTeamId(teams[0]._id);
  }, [teamId, teams]);

  const [groupGrade, setGroupGrade] = useState<string>("10");
  const [isExportingGrades, setIsExportingGrades] = useState(false);

  const { mutate: calculate, data: calcRes, isPending } = useReviewCalculate();
  const grades = useMemo(() => pickGradeArray(calcRes), [calcRes]);

  const canSubmit = !!teamId && Number(groupGrade) >= 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    calculate({
      teamId,
      groupGrade: Number(groupGrade),
    });
  };

  const handleExportClassGrades = async () => {
    if (!classId) {
      toast.error("Không tìm thấy classId để xuất bảng điểm.");
      return;
    }

    try {
      setIsExportingGrades(true);
      const { blob, filename } = await exportClassGradesExcelApi(
        classId,
        classDetails?.class?.name,
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `class-grades-${classId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Đã tải file Excel bảng điểm lớp.");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Không thể xuất file Excel bảng điểm.";
      toast.error(msg);
    } finally {
      setIsExportingGrades(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calculator className="h-7 w-7 text-[#F27124]" />
            Tính điểm cá nhân
          </h2>
          <p className="text-muted-foreground">
            Chọn team, nhập điểm nhóm (hệ 10) để tính điểm từng thành viên.
          </p>
        </div>
        <Button
          onClick={handleExportClassGrades}
          disabled={!classId || isExportingGrades}
          className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
        >
          {isExportingGrades ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          Xuất bảng điểm Excel
        </Button>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Tham số tính điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {isClassLoading ? (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tải dữ liệu lớp...
            </div>
          ) : isClassError || !classDetails?.class ? (
            <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100">
              <AlertTitle>Không thể tải lớp</AlertTitle>
              <AlertDescription>
                Vui lòng mở từ “Lớp học của tôi” hoặc truyền `classId` trên URL.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lớp</Label>
                <div className="text-sm font-medium">
                  {classDetails.class.name} • {classDetails.class.class_code}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Chọn team" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    {teams.map((t: any) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.project_name || t._id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label>Điểm nhóm (0–10)</Label>
                <Input
                  value={groupGrade}
                  onChange={(e) => setGroupGrade(e.target.value)}
                  inputMode="decimal"
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isPending}
                  className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="h-4 w-4 mr-2" />
                  )}
                  Tính điểm
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {calcRes && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Kết quả: {grades.length} thành viên
            </Badge>
            {typeof (calcRes as any)?.message === "string" && (
              <span className="text-xs text-muted-foreground">
                {(calcRes as any).message}
              </span>
            )}
          </div>

          <Separator />

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bảng điểm cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {grades.length === 0 ? (
                <Alert className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-100">
                  <AlertTitle>Chưa có dữ liệu</AlertTitle>
                  <AlertDescription>
                    API trả về không có danh sách điểm. Bạn có thể kiểm tra payload
                    hoặc sprint/team đã chọn.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thành viên</TableHead>
                        <TableHead className="text-right">%Jira</TableHead>
                        <TableHead className="text-right">%Git</TableHead>
                        <TableHead className="text-right">%Review</TableHead>
                        <TableHead className="text-right">Base</TableHead>
                        <TableHead className="text-right">Factor</TableHead>
                        <TableHead className="text-right">Điểm</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((g) => (
                        <TableRow key={g.studentId}>
                          <TableCell className="min-w-[220px]">
                            <div className="space-y-0.5">
                              <div className="font-medium">
                                {g.studentName || "—"}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">
                                {g.studentId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {Math.round((g.percentJira ?? 0) * 100)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {Math.round((g.percentGit ?? 0) * 100)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {Math.round((g.percentReview ?? 0) * 100)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {Number(g.baseContribution ?? 0).toFixed(3)}
                          </TableCell>
                          <TableCell className="text-right">
                            {Number(g.normalizedFactor ?? 0).toFixed(3)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {Number(g.finalGrade ?? 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

