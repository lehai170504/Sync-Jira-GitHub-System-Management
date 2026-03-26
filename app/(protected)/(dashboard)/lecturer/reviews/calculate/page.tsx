"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { Calculator, FileDown, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
// Import 2 Hook mình vừa làm
import {
  useReviewCalculate,
  useClassGrades,
} from "@/features/lecturer/hooks/use-review-calculate";
import { exportClassGradesExcelApi } from "@/features/lecturer/api/class-grades-export-api";
import { toast } from "sonner";

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

  const {
    data: classDetails,
    isLoading: isClassLoading,
    isError: isClassError,
  } = useClassDetails(classId);

  const teams = useMemo(
    () => classDetails?.class?.teams ?? classDetails?.teams ?? [],
    [classDetails]
  );

  const [teamId, setTeamId] = useState<string>("");
  useEffect(() => {
    if (!teamId && teams.length > 0) setTeamId(teams[0]._id);
  }, [teamId, teams]);

  const [groupGrade, setGroupGrade] = useState<string>("10");
  const [isExportingGrades, setIsExportingGrades] = useState(false);

  // --- KẾT NỐI API Ở ĐÂY ---
  // 1. Lấy bảng điểm CỦA CẢ LỚP
  const { data: classGradesRes, isFetching: isGradesFetching } =
    useClassGrades(classId);
  const allGrades = useMemo(() => classGradesRes?.data || [], [classGradesRes]);

  // Lọc ra danh sách sinh viên chỉ thuộc về teamId đang chọn trên giao diện
  const teamGrades = useMemo(
    () => allGrades.filter((g: any) => g.team?._id === teamId),
    [allGrades, teamId]
  );

  // 2. Tính điểm cho nhóm
  const { mutate: calculate, isPending: isCalculating } =
    useReviewCalculate(classId);

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
        classDetails?.class?.name
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
            Chốt điểm & Bảng điểm
          </h2>
          <p className="text-muted-foreground">
            Nhập điểm cho từng nhóm (Thang 10). Hệ thống sẽ tự động phân bổ điểm
            cá nhân.
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
          Xuất bảng điểm toàn Lớp
        </Button>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Tham số tính điểm
          </CardTitle>
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
                <Label>Chọn Nhóm (Team)</Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Chọn team" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    {teams.map((t: any) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.project_name || t.name || t._id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label>Điểm nhóm (0–10)</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={groupGrade}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 10) setGroupGrade("10");
                    else if (val < 0) setGroupGrade("0");
                    else setGroupGrade(e.target.value);
                  }}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold text-lg text-blue-600"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isCalculating}
                  className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
                >
                  {isCalculating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="h-4 w-4 mr-2" />
                  )}
                  {isCalculating ? "Đang tính toán..." : "Chốt điểm Nhóm này"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-xs font-medium">
            Đang xem kết quả nhóm: {teamGrades.length} thành viên
          </Badge>

          {isGradesFetching && (
            <span className="flex items-center text-xs font-bold text-blue-500">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Đang cập nhật
              bảng điểm...
            </span>
          )}
        </div>

        <Separator />

        <Card
          className={cn(
            "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-opacity",
            isGradesFetching && "opacity-60 pointer-events-none"
          )}
        >
          <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base">
              Kết quả phân bổ Điểm Cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {teamGrades.length === 0 ? (
              <Alert className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-100">
                <AlertTitle>Nhóm chưa được chấm điểm</AlertTitle>
                <AlertDescription>
                  Nhóm này chưa có dữ liệu điểm. Vui lòng nhập điểm nhóm và nhấn
                  "Chốt điểm" ở trên.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900">
                    <TableRow>
                      <TableHead>Thành viên</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead className="text-right">
                        Điểm gốc Nhóm
                      </TableHead>
                      <TableHead className="text-right">
                        Hệ số (Factor)
                      </TableHead>
                      <TableHead className="text-right font-black text-[#F27124]">
                        Điểm Nhận Được
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamGrades.map((g: any, index: number) => {
                      const student = g.student || {};
                      const gradesInfo = g.grades?.[0] || {}; // Lấy cục điểm từ mảng grades theo JSON trả về

                      const factor = Number(
                        gradesInfo.contribution_factor ?? 0
                      );

                      return (
                        <TableRow
                          key={student._id || index}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                        >
                          {/* Cột 1: Thông tin sinh viên có Avatar */}
                          <TableCell className="min-w-[220px]">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                                <AvatarImage src={student.avatar_url} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
                                  {student.full_name?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-0.5">
                                <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                  {student.full_name || "Chưa rõ tên"}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 w-fit px-1.5 rounded">
                                  {student.student_code || "Unknown"}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Cột 2: Vai trò */}
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-bold px-2",
                                g.role_in_team === "Leader"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-slate-50 text-slate-600"
                              )}
                            >
                              {g.role_in_team || "Member"}
                            </Badge>
                          </TableCell>

                          {/* Cột 3: Điểm Nhóm */}
                          <TableCell className="text-right font-medium text-slate-600 dark:text-slate-400">
                            {Number(gradesInfo.group_grade ?? 0).toFixed(1)}
                          </TableCell>

                          {/* Cột 4: Hệ số Factor */}
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                factor > 1.05
                                  ? "default"
                                  : factor < 0.95
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={cn(
                                "font-mono px-2",
                                factor > 1.05 &&
                                  "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none dark:bg-emerald-900/30 dark:text-emerald-400"
                              )}
                            >
                              {factor.toFixed(2)}
                            </Badge>
                          </TableCell>

                          {/* Cột 5: Điểm cuối cùng */}
                          <TableCell className="text-right font-black text-xl text-slate-900 dark:text-white">
                            {Number(gradesInfo.final_score ?? 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
