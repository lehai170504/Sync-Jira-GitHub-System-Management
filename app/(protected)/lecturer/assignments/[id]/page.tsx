"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Search,
  MoreHorizontal,
  FileText,
  Send,
  Github,
  Users,
  User,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- CẤU HÌNH TEST: ĐỔI "Group" <-> "Individual" ĐỂ XEM GIAO DIỆN ---
const ASSIGNMENT_MODE: "Individual" | "Group" = "Group";

// --- MOCK DATA: BÀI TẬP CÁ NHÂN ---
const INDIVIDUAL_SUBMISSIONS = [
  {
    id: "SV001",
    name: "Nguyễn Văn An",
    code: "SE1701",
    avatar: "A",
    submittedAt: "20/01 10:30 AM",
    status: "On Time",
    grade: 9.0,
    file: "Lab1_AnNV.zip",
  },
  {
    id: "SV002",
    name: "Trần Thị Bích",
    code: "SE1702",
    avatar: "B",
    submittedAt: "20/01 11:45 PM",
    status: "Late",
    grade: null,
    file: "Lab1_BichTT.zip",
  },
  {
    id: "SV003",
    name: "Lê Văn Cường",
    code: "SE1703",
    avatar: "C",
    submittedAt: "--",
    status: "Missing",
    grade: null,
    file: null,
  },
];

// --- MOCK DATA: BÀI TẬP NHÓM ---
const GROUP_SUBMISSIONS = [
  {
    id: "T01",
    teamName: "Team 1 - E-Commerce",
    members: ["An", "Bình", "Cường", "Dũng"],
    submittedBy: "Nguyễn Văn An",
    submittedAt: "10/02 08:00 PM",
    status: "On Time",
    grade: 8.5,
    repoUrl: "https://github.com/team1",
    docsUrl: "SRS_v1.0.pdf",
  },
  {
    id: "T02",
    teamName: "Team 2 - LMS System",
    members: ["Em", "F", "G"],
    submittedBy: "--",
    submittedAt: "--",
    status: "Missing",
    grade: null,
    repoUrl: null,
    docsUrl: null,
  },
];

export default function AssignmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("submissions");

  // Logic xác định chế độ xem
  const isGroup = ASSIGNMENT_MODE === "Group";
  const data = isGroup ? GROUP_SUBMISSIONS : INDIVIDUAL_SUBMISSIONS;

  // Tính toán thống kê nhanh
  const totalCount = isGroup ? 6 : 30; // Giả định sĩ số
  const submittedCount = data.filter((i) => i.status !== "Missing").length;
  const gradedCount = data.filter((i) => i.grade !== null).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 pb-10">
      {/* 1. BREADCRUMBS & NAV */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="hover:text-[#F27124] cursor-pointer transition-colors"
          onClick={() => router.push("/lecturer/assignments")}
        >
          Bài tập
        </span>
        <span>/</span>
        <span className="text-gray-900 font-medium">Chi tiết chấm điểm</span>
      </div>

      {/* 2. HEADER INFO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-6">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full border-gray-200 hover:border-[#F27124] hover:text-[#F27124] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="secondary"
                className={`font-medium px-2.5 py-0.5 rounded-md border-0 flex items-center gap-1.5 
                    ${
                      isGroup
                        ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
              >
                {isGroup ? (
                  <Users className="h-3.5 w-3.5" />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
                {isGroup ? "Project Group" : "Individual Lab"}
              </Badge>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50 rounded-md"
              >
                Đang mở
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isGroup
                ? "Assignment 1: SRS & System Design"
                : "Lab 1: Java Basics"}
            </h1>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" /> Tải tất cả bài làm
          </Button>
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] rounded-full shadow-lg shadow-orange-500/20 px-6 transition-all hover:scale-105">
            <Send className="mr-2 h-4 w-4" /> Công bố điểm
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: MAIN CONTENT (Stats & Table) */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-blue-50/50">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                  Đã nộp
                </span>
                <span className="text-2xl font-bold text-blue-900">
                  {submittedCount}/{totalCount}
                </span>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50/50">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wider">
                  Đã chấm
                </span>
                <span className="text-2xl font-bold text-green-900">
                  {gradedCount}/{submittedCount}
                </span>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-orange-50/50">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-orange-600 font-semibold mb-1 uppercase tracking-wider">
                  Deadline
                </span>
                <span className="text-lg font-bold text-orange-900">10/02</span>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-white border border-gray-100 rounded-xl p-1 h-auto w-full justify-start shadow-sm">
              <TabsTrigger
                value="submissions"
                className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 transition-all"
              >
                Danh sách bài nộp
              </TabsTrigger>
              <TabsTrigger
                value="instructions"
                className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 transition-all"
              >
                Đề bài & Hướng dẫn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="mt-6">
              <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50/50 border-b border-gray-100">
                  <CardTitle className="text-base font-bold text-gray-700">
                    {isGroup ? "Các nhóm dự án" : "Danh sách sinh viên"}
                  </CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={
                        isGroup ? "Tìm tên nhóm..." : "Tìm tên sinh viên..."
                      }
                      className="pl-9 bg-white border-gray-200 rounded-lg focus:border-[#F27124] focus:ring-1 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </CardHeader>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[280px] pl-6 py-3">
                          {isGroup ? "Thông tin Nhóm" : "Sinh viên"}
                        </TableHead>
                        <TableHead>
                          {isGroup ? "Người nộp (Leader)" : "Thời gian nộp"}
                        </TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>
                          {isGroup ? "Sản phẩm (Artifacts)" : "File đính kèm"}
                        </TableHead>
                        <TableHead className="text-center w-[100px]">
                          Điểm số
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item: any) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-orange-50/10 transition-colors group"
                        >
                          {/* COLUMN 1: NAME & AVATAR */}
                          <TableCell className="pl-6 py-4">
                            {isGroup ? (
                              <div className="flex flex-col gap-2">
                                <span className="font-bold text-gray-900 text-sm">
                                  {item.teamName}
                                </span>
                                {/* Avatar Stack for Team */}
                                <div className="flex -space-x-2 overflow-hidden pl-1">
                                  {item.members.map(
                                    (mem: string, idx: number) => (
                                      <TooltipProvider key={idx}>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <div className="h-6 w-6 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 cursor-default select-none">
                                              {mem.charAt(0)}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{mem}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-gray-100">
                                  <AvatarFallback className="bg-orange-50 text-[#F27124] text-xs font-bold">
                                    {item.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.code}
                                  </p>
                                </div>
                              </div>
                            )}
                          </TableCell>

                          {/* COLUMN 2: SUBMITTER / TIME */}
                          <TableCell className="text-gray-600 text-sm">
                            {isGroup ? (
                              <div className="flex flex-col">
                                <span className="font-medium text-xs">
                                  {item.submittedBy}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {item.submittedAt}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs font-medium">
                                {item.submittedAt}
                              </span>
                            )}
                          </TableCell>

                          {/* COLUMN 3: STATUS */}
                          <TableCell>
                            {item.status === "On Time" && (
                              <Badge
                                variant="outline"
                                className="text-green-600 bg-green-50 border-green-100 px-2 py-0.5"
                              >
                                Đúng hạn
                              </Badge>
                            )}
                            {item.status === "Late" && (
                              <Badge
                                variant="outline"
                                className="text-orange-600 bg-orange-50 border-orange-100 px-2 py-0.5"
                              >
                                Trễ hạn
                              </Badge>
                            )}
                            {item.status === "Missing" && (
                              <Badge
                                variant="outline"
                                className="text-red-600 bg-red-50 border-red-100 px-2 py-0.5"
                              >
                                Chưa nộp
                              </Badge>
                            )}
                          </TableCell>

                          {/* COLUMN 4: FILES / ARTIFACTS */}
                          <TableCell>
                            {isGroup ? (
                              <div className="flex gap-2">
                                {item.repoUrl && (
                                  <a
                                    href={item.repoUrl}
                                    target="_blank"
                                    className="flex items-center gap-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-black text-xs font-medium px-2.5 py-1.5 rounded-md transition-all border border-gray-200"
                                  >
                                    <Github className="h-3.5 w-3.5" /> Repo
                                  </a>
                                )}
                                {item.docsUrl && (
                                  <a
                                    href="#"
                                    className="flex items-center gap-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 text-xs font-medium px-2.5 py-1.5 rounded-md transition-all border border-blue-100"
                                  >
                                    <FileText className="h-3.5 w-3.5" /> Docs
                                  </a>
                                )}
                                {!item.repoUrl && !item.docsUrl && (
                                  <span className="text-gray-300 text-xs">
                                    -
                                  </span>
                                )}
                              </div>
                            ) : item.file ? (
                              <div className="flex items-center gap-2 group/file cursor-pointer">
                                <div className="p-1.5 bg-blue-50 rounded text-blue-600 group-hover/file:bg-blue-100 transition-colors">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <span
                                  className="text-sm text-gray-600 hover:text-blue-600 hover:underline decoration-blue-300 underline-offset-2 transition-all truncate max-w-[120px]"
                                  title={item.file}
                                >
                                  {item.file}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-sm">-</span>
                            )}
                          </TableCell>

                          {/* COLUMN 5: GRADE INPUT */}
                          <TableCell className="text-center">
                            {item.status !== "Missing" ? (
                              <Input
                                defaultValue={item.grade?.toString()}
                                className="h-9 w-16 text-center mx-auto font-bold text-gray-900 border-gray-200 focus:border-[#F27124] focus:ring-1 focus:ring-orange-200 bg-white"
                                placeholder="--"
                              />
                            ) : (
                              <span className="text-gray-300 text-sm">-</span>
                            )}
                          </TableCell>

                          {/* COLUMN 6: ACTION */}
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="instructions">
              <Card className="border-none shadow-sm ring-1 ring-gray-100 p-8 min-h-[300px] flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p>Nội dung đề bài và hướng dẫn sẽ hiển thị ở đây.</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: INFO PANEL */}
        <div className="space-y-6">
          <Card className="border border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Thông tin bài tập
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Ngày giao</p>
                  <p className="font-semibold text-sm text-gray-900">
                    01/02/2026
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                  <Clock className="h-4 w-4 text-[#F27124]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Hạn chót (Deadline)
                  </p>
                  <p className="font-semibold text-sm text-[#F27124]">
                    10/02/2026 - 23:59
                  </p>
                  <p className="text-[10px] text-orange-600/80 mt-0.5">
                    Còn 3 ngày nữa
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isGroup ? "bg-purple-50" : "bg-blue-50"
                  }`}
                >
                  {isGroup ? (
                    <Users className="h-4 w-4 text-purple-600" />
                  ) : (
                    <User className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Hình thức nộp</p>
                  <p className="font-semibold text-sm text-gray-900">
                    {isGroup ? "Đại diện Nhóm" : "Từng cá nhân"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-gray-100 bg-[#FFF8F3]">
            <CardContent className="p-4">
              <h4 className="font-bold text-[#F27124] text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Lưu ý chấm điểm
              </h4>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {isGroup
                  ? "Điểm nhập tại đây là điểm cơ sở (Base Score) cho cả nhóm. Bạn có thể điều chỉnh điểm thành phần (Contribution) trong trang chi tiết nhóm."
                  : "Vui lòng tải file đính kèm về kiểm tra trước khi nhập điểm. Điểm số sẽ được tự động đồng bộ sang Sổ điểm."}
              </p>
              {isGroup && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white border-[#F27124]/30 text-[#F27124] hover:bg-[#F27124] hover:text-white text-xs h-8"
                  onClick={() =>
                    router.push("/lecturer/class-management?tab=team_view")
                  }
                >
                  <ExternalLink className="h-3 w-3 mr-2" /> Xem chi tiết Nhóm
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
