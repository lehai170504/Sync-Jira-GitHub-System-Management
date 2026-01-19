"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveUserMappings } from "@/server/actions/mapping-actions";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Search,
  Filter,
  Wand2,
  Lock, // Icon khóa cho chế độ Read-only
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { UserSelect } from "./user-select";
import { FieldError } from "@/components/ui/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- Types ---
type Student = { id: string; name: string; email: string; avatar?: string };
type JiraUser = { accountId: string; displayName: string; avatarUrl?: string };
type GithubUser = { login: string; avatarUrl?: string };

interface MappingTableProps {
  students: Student[];
  jiraUsers: JiraUser[];
  githubUsers: GithubUser[];
  initialMappings: Record<string, { jira?: string; github?: string }>;
  readOnly?: boolean; // ✅ Prop quy định quyền sửa đổi
}

export function MappingTable({
  students,
  jiraUsers,
  githubUsers,
  initialMappings,
  readOnly = false, // Mặc định là false (cho phép sửa)
}: MappingTableProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "missing" | "completed"
  >("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // State lưu trữ mapping cục bộ
  const [mappings, setMappings] = useState(initialMappings);

  // --- Validation: Kiểm tra trùng account ---
  const getValidationErrors = () => {
    const errors: Record<string, { jira?: string; github?: string }> = {};
    
    // Lấy tất cả các giá trị đã được map
    const jiraAccounts = Object.entries(mappings)
      .map(([id, map]) => ({ studentId: id, accountId: map?.jira }))
      .filter((item) => item.accountId);
    
    const githubAccounts = Object.entries(mappings)
      .map(([id, map]) => ({ studentId: id, username: map?.github }))
      .filter((item) => item.username);

    // Kiểm tra trùng Jira account
    const jiraCounts: Record<string, string[]> = {};
    jiraAccounts.forEach(({ studentId, accountId }) => {
      if (accountId) {
        if (!jiraCounts[accountId]) {
          jiraCounts[accountId] = [];
        }
        jiraCounts[accountId].push(studentId);
      }
    });

    Object.entries(jiraCounts).forEach(([accountId, studentIds]) => {
      if (studentIds.length > 1) {
        studentIds.forEach((studentId) => {
          if (!errors[studentId]) errors[studentId] = {};
          errors[studentId].jira = `Tài khoản Jira này đã được sử dụng bởi ${studentIds.length - 1} sinh viên khác`;
        });
      }
    });

    // Kiểm tra trùng GitHub account
    const githubCounts: Record<string, string[]> = {};
    githubAccounts.forEach(({ studentId, username }) => {
      if (username) {
        if (!githubCounts[username]) {
          githubCounts[username] = [];
        }
        githubCounts[username].push(studentId);
      }
    });

    Object.entries(githubCounts).forEach(([username, studentIds]) => {
      if (studentIds.length > 1) {
        studentIds.forEach((studentId) => {
          if (!errors[studentId]) errors[studentId] = {};
          errors[studentId].github = `Tài khoản GitHub này đã được sử dụng bởi ${studentIds.length - 1} sinh viên khác`;
        });
      }
    });

    return errors;
  };

  const validationErrors = getValidationErrors();
  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  // --- Logic Lọc ---
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const currentMap = mappings[s.id] || {};
    const isFullyMapped = currentMap.jira && currentMap.github;

    if (filterStatus === "completed") return matchesSearch && isFullyMapped;
    if (filterStatus === "missing") return matchesSearch && !isFullyMapped;
    return matchesSearch;
  });

  // --- Xử lý thay đổi (Chỉ chạy khi không Read-only) ---
  const handleChange = (
    studentId: string,
    type: "jira" | "github",
    value: string
  ) => {
    if (readOnly) return; // Chặn logic nếu đang xem
    setMappings((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [type]: value },
    }));
  };

  // --- Tính toán số lượng thay đổi ---
  const getSaveSummary = () => {
    const totalMappings = Object.keys(mappings).length;
    const jiraMapped = Object.values(mappings).filter((m) => m?.jira).length;
    const githubMapped = Object.values(mappings).filter(
      (m) => m && "github" in m && m.github
    ).length;
    const fullyMapped = Object.values(mappings).filter(
      (m) => m?.jira && m && "github" in m && m.github
    ).length;

    // So sánh với initial để tính số thay đổi
    const changes = Object.entries(mappings).filter(([id, map]) => {
      const initial = initialMappings[id] || {};
      return (
        map?.jira !== initial?.jira || map?.github !== initial?.github
      );
    }).length;

    return {
      totalMappings,
      jiraMapped,
      githubMapped,
      fullyMapped,
      changes,
    };
  };

  // --- Lưu dữ liệu (sau khi confirm) ---
  const handleSaveConfirmed = async () => {
    setShowConfirmDialog(false);
    setLoading(true);

    const payload = {
      mappings: Object.entries(mappings).map(([studentId, data]) => ({
        studentId,
        jiraAccountId: data?.jira,
        githubUsername: data?.github,
      })),
    };
    const res = await saveUserMappings(payload);
    setLoading(false);

    if (res.error) {
      toast.error("Lưu thất bại", { description: res.error });
    } else {
      toast.success("Đã lưu thành công", { description: res.message });
    }
  };

  // --- Mở dialog xác nhận ---
  const handleSave = () => {
    if (readOnly) return;

    // Kiểm tra validation trước khi lưu
    if (hasValidationErrors) {
      toast.error("Không thể lưu", {
        description: "Vui lòng sửa các lỗi trùng lặp tài khoản trước khi lưu.",
      });
      return;
    }

    // Mở dialog xác nhận
    setShowConfirmDialog(true);
  };

  // --- Tự động ghép nối (Giả lập) ---
  const handleAutoMap = () => {
    if (readOnly) return;

    toast.info("Đang quét dữ liệu...", { duration: 1000 });
    setTimeout(() => {
      toast.success("Đã tự động ghép nối 3 sinh viên dựa trên Email!", {
        icon: <Wand2 className="w-4 h-4 text-purple-500" />,
      });
      // Ở đây bạn sẽ update state `mappings` dựa trên thuật toán match string
    }, 1200);
  };

  return (
    <Card className="border shadow-sm bg-white">
      {/* HEADER TOOLBAR */}
      <CardHeader className="border-b bg-muted/20 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* SEARCH & FILTER GROUP */}
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, email..."
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={filterStatus}
              onValueChange={(v: any) => setFilterStatus(v)}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="missing">Chưa hoàn thành</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ACTION GROUP: Ẩn nút chức năng nếu là Admin (Read-only) */}
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleAutoMap}
                className="hidden md:flex hover:bg-purple-50 hover:text-purple-600 border-dashed"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Tự động ghép
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || hasValidationErrors}
                className="min-w-[100px] bg-primary hover:bg-primary/90 text-white shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>
              {hasValidationErrors && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>Có lỗi validation</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      {/* CONFIRMATION DIALOG */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Save className="h-5 w-5 text-primary" />
              </div>
              <AlertDialogTitle>Xác nhận lưu ánh xạ tài khoản</AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild>
              <div className="text-left space-y-3 pt-2">
                <div className="text-sm font-medium text-foreground">
                  Bạn có chắc chắn muốn lưu các thay đổi ánh xạ tài khoản?
                </div>
                
                {/* Summary Stats */}
                {(() => {
                  const summary = getSaveSummary();
                  return (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tổng số ánh xạ:</span>
                        <span className="font-semibold">{summary.totalMappings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Đã map Jira:</span>
                        <span className="font-semibold text-blue-600">{summary.jiraMapped}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Đã map GitHub:</span>
                        <span className="font-semibold text-gray-700">{summary.githubMapped}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2 mt-2">
                        <span className="text-muted-foreground">Hoàn thành:</span>
                        <span className="font-semibold text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          {summary.fullyMapped}
                        </span>
                      </div>
                      {summary.changes > 0 && (
                        <div className="flex items-center justify-between border-t pt-2 mt-2">
                          <span className="text-muted-foreground">Số thay đổi:</span>
                          <span className="font-semibold text-orange-600">{summary.changes}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="text-xs text-muted-foreground pt-2">
                  Hành động này sẽ cập nhật thông tin ánh xạ cho tất cả sinh viên đã chọn.
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveConfirmed}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Xác nhận lưu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* VALIDATION ALERT */}
      {!readOnly && hasValidationErrors && (
        <CardContent className="px-6 py-4 border-b bg-red-50/50">
          <div className="flex items-start gap-3 text-sm text-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Có lỗi validation phát hiện:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {Object.entries(validationErrors).map(([studentId, errors]) => {
                  const student = students.find((s) => s.id === studentId);
                  return (
                    <li key={studentId}>
                      <span className="font-medium">{student?.name}</span>:{" "}
                      {errors.jira && <span className="text-red-700">{errors.jira}</span>}
                      {errors.jira && errors.github && " | "}
                      {errors.github && <span className="text-red-700">{errors.github}</span>}
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs mt-2 text-red-700">
                Vui lòng sửa các lỗi trên trước khi lưu thay đổi.
              </p>
            </div>
          </div>
        </CardContent>
      )}

      {/* TABLE CONTENT */}
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%] pl-6">
                  Thông tin Sinh viên
                </TableHead>
                <TableHead className="w-[30%]">Tài khoản Jira</TableHead>
                <TableHead className="w-[30%]">Tài khoản GitHub</TableHead>
                <TableHead className="w-[10%] text-right pr-6">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const currentMap = mappings[student.id] || {};
                const isFullyMapped = currentMap.jira && currentMap.github;

                const studentErrors = validationErrors[student.id] || {};
                const hasError = Object.keys(studentErrors).length > 0;

                return (
                  <TableRow
                    key={student.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      hasError ? "bg-red-50/30 border-l-2 border-l-red-500" : ""
                    }`}
                  >
                    {/* CỘT 1: THÔNG TIN SINH VIÊN */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border shadow-sm">
                          {student.avatar && <AvatarImage src={student.avatar} />}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* CỘT 2: JIRA ACCOUNT */}
                    <TableCell>
                      {readOnly ? (
                        /* CHẾ ĐỘ XEM: Chỉ hiện text */
                        <div className="flex items-center gap-2 text-sm pl-1">
                          {currentMap.jira ? (
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-blue-50/50 border border-blue-100/50">
                              <Avatar className="h-5 w-5">
                                {(() => {
                                  const jiraUser = jiraUsers.find(
                                    (u) => u.accountId === currentMap.jira
                                  );
                                  return jiraUser?.avatarUrl ? (
                                    <AvatarImage src={jiraUser.avatarUrl} />
                                  ) : null;
                                })()}
                                <AvatarFallback className="text-[9px]">
                                  J
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-blue-900">
                                {jiraUsers.find(
                                  (u) => u.accountId === currentMap.jira
                                )?.displayName || "Unknown User"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic text-xs pl-2">
                              Chưa liên kết
                            </span>
                          )}
                        </div>
                      ) : (
                        /* CHẾ ĐỘ SỬA: Hiện Dropdown */
                        <div className="space-y-1">
                          <UserSelect
                            value={currentMap.jira}
                            onChange={(val) =>
                              handleChange(student.id, "jira", val)
                            }
                            placeholder="Chọn Jira User"
                            error={!!studentErrors.jira}
                            options={jiraUsers.map((u) => ({
                              id: u.accountId,
                              label: u.displayName,
                              subLabel: "Member",
                              avatarUrl: u.avatarUrl,
                            }))}
                          />
                          {studentErrors.jira && (
                            <FieldError className="text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {studentErrors.jira}
                            </FieldError>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* CỘT 3: GITHUB ACCOUNT */}
                    <TableCell>
                      {readOnly ? (
                        /* CHẾ ĐỘ XEM */
                        <div className="flex items-center gap-2 text-sm pl-1">
                          {currentMap.github ? (
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-gray-100 border border-gray-200">
                              <Avatar className="h-5 w-5">
                                {(() => {
                                  const githubUser = githubUsers.find(
                                    (u) => u.login === currentMap.github
                                  );
                                  return githubUser?.avatarUrl ? (
                                    <AvatarImage src={githubUser.avatarUrl} />
                                  ) : null;
                                })()}
                                <AvatarFallback className="text-[9px]">
                                  G
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-mono text-gray-700">
                                @{currentMap.github}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic text-xs pl-2">
                              Chưa liên kết
                            </span>
                          )}
                        </div>
                      ) : (
                        /* CHẾ ĐỘ SỬA */
                        <div className="space-y-1">
                          <UserSelect
                            value={currentMap.github}
                            onChange={(val) =>
                              handleChange(student.id, "github", val)
                            }
                            placeholder="Chọn GitHub User"
                            error={!!studentErrors.github}
                            options={githubUsers.map((u) => ({
                              id: u.login,
                              label: u.login,
                              subLabel: "Contributor",
                              avatarUrl: u.avatarUrl,
                            }))}
                          />
                          {studentErrors.github && (
                            <FieldError className="text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {studentErrors.github}
                            </FieldError>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* CỘT 4: TRẠNG THÁI */}
                    <TableCell className="text-right pr-6">
                      {isFullyMapped ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 px-2 py-1 gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          Done
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200 px-2 py-1 gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                          Missing
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                        <Search className="h-6 w-6 opacity-50" />
                      </div>
                      <p className="font-medium">
                        Không tìm thấy sinh viên nào
                      </p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                        }}
                        className="mt-2 text-primary"
                      >
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
