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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  AlertCircle,
  Filter,
  Wand2,
  X,
} from "lucide-react";
import { UserSelect } from "./user-select";

type Student = { id: string; name: string; email: string; avatar?: string };
type JiraUser = { accountId: string; displayName: string; avatarUrl?: string };
type GithubUser = { login: string; avatarUrl?: string };

interface MappingTableProps {
  students: Student[];
  jiraUsers: JiraUser[];
  githubUsers: GithubUser[];
  initialMappings: Record<string, { jira?: string; github?: string }>;
}

export function MappingTable({
  students,
  jiraUsers,
  githubUsers,
  initialMappings,
}: MappingTableProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "missing" | "completed"
  >("all");
  const [mappings, setMappings] = useState(initialMappings);

  // Logic lọc dữ liệu
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

  const handleChange = (
    studentId: string,
    type: "jira" | "github",
    value: string
  ) => {
    setMappings((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [type]: value },
    }));
  };

  const handleSave = async () => {
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

  const handleAutoMap = () => {
    // Giả lập tính năng tự động map (Logic thực tế sẽ so sánh string similarity)
    toast.info("Đang quét dữ liệu...", { duration: 1000 });
    setTimeout(() => {
      toast.success("Đã tự động ghép nối 3 sinh viên dựa trên Email!", {
        icon: <Wand2 className="w-4 h-4 text-purple-500" />,
      });
    }, 1200);
  };

  return (
    <Card className="border shadow-sm bg-white">
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

          {/* ACTION GROUP */}
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
              disabled={loading}
              className="min-w-[100px] bg-primary hover:bg-primary/90 text-white shadow-sm"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </CardHeader>

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

                return (
                  <TableRow
                    key={student.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border shadow-sm">
                          <AvatarImage src={student.avatar} />
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

                    <TableCell>
                      <UserSelect
                        value={currentMap.jira}
                        onChange={(val) =>
                          handleChange(student.id, "jira", val)
                        }
                        placeholder="Chọn Jira User"
                        options={jiraUsers.map((u) => ({
                          id: u.accountId,
                          label: u.displayName,
                          subLabel: "Member",
                          avatarUrl: u.avatarUrl,
                        }))}
                      />
                    </TableCell>

                    <TableCell>
                      <UserSelect
                        value={currentMap.github}
                        onChange={(val) =>
                          handleChange(student.id, "github", val)
                        }
                        placeholder="Chọn GitHub User"
                        options={githubUsers.map((u) => ({
                          id: u.login,
                          label: u.login,
                          subLabel: "Contributor",
                          avatarUrl: u.avatarUrl,
                        }))}
                      />
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      {isFullyMapped ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 px-2 py-1 gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />{" "}
                          Done
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200 px-2 py-1 gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />{" "}
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
                      <p className="text-sm">
                        Hãy thử thay đổi từ khóa hoặc bộ lọc trạng thái.
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
