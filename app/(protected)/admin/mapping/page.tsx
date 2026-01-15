"use client";

import { MappingTable } from "@/components/features/mapping/mapping-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Users, Link2, AlertTriangle, CheckCircle2 } from "lucide-react";

// --- MOCK DATA ---
const mockStudents = [
  {
    id: "s1",
    name: "Nguyễn Văn An",
    email: "annv@fpt.edu.vn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
  },
  {
    id: "s2",
    name: "Trần Thị Bình",
    email: "binhtt@fpt.edu.vn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Binh",
  },
  {
    id: "s3",
    name: "Lê Hoàng Cường",
    email: "cuonglh@fpt.edu.vn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong",
  },
  {
    id: "s4",
    name: "Phạm Minh Dung",
    email: "dungpm@fpt.edu.vn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dung",
  },
  {
    id: "s5",
    name: "Vũ Đức Em",
    email: "emvd@fpt.edu.vn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Em",
  },
];

const mockJiraUsers = [
  { accountId: "j1", displayName: "An Nguyen (Jira)", avatarUrl: "" },
  { accountId: "j2", displayName: "Binh Tran (Software)", avatarUrl: "" },
  { accountId: "j3", displayName: "Cuong Le Dev", avatarUrl: "" },
  { accountId: "j4", displayName: "Dung Pham Tester", avatarUrl: "" },
  { accountId: "j5", displayName: "Vu Duc Em", avatarUrl: "" },
];

const mockGithubUsers = [
  { login: "dev_an_vip", avatarUrl: "https://github.com/shadcn.png" },
  { login: "binh_code_dao", avatarUrl: "https://github.com/vercel.png" },
  { login: "cuong_fullstack", avatarUrl: "" },
  { login: "dung_bug_hunter", avatarUrl: "" },
];

const initialMappings = {
  s1: { jira: "j1", github: "dev_an_vip" },
  s2: { jira: "j2" },
};

export default function MappingPage() {
  // Tính toán nhanh số liệu
  const totalStudents = mockStudents.length;
  const fullyMapped = 1; // Giả lập từ initialMappings
  const missing = totalStudents - fullyMapped;

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto py-8 px-4 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Ánh xạ tài khoản
          </h2>
          <p className="text-muted-foreground mt-1">
            Định danh sinh viên với các tài khoản Jira & GitHub để tính điểm tự
            động.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sinh viên
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Thành viên trong lớp
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã liên kết xong
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fullyMapped}</div>
            <p className="text-xs text-muted-foreground">
              Sẵn sàng đồng bộ dữ liệu
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-orange-500 bg-orange-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cần cập nhật
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{missing}</div>
            <p className="text-xs text-muted-foreground">
              Sinh viên thiếu thông tin Jira/Git
            </p>
          </CardContent>
        </Card>
      </div>

      {/* INFO ALERT */}
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">
          Gợi ý từ hệ thống
        </AlertTitle>
        <AlertDescription className="text-sm mt-1 opacity-90">
          Sử dụng nút <b>"Tự động ghép"</b> để hệ thống tự động điền các tài
          khoản có Email hoặc Tên hiển thị giống nhau. Việc này giúp tiết kiệm
          80% thời gian thao tác.
        </AlertDescription>
      </Alert>

      {/* MAIN TABLE */}
      <MappingTable
        students={mockStudents}
        jiraUsers={mockJiraUsers}
        githubUsers={mockGithubUsers}
        initialMappings={initialMappings}
      />
    </div>
  );
}
