"use client";

import { useState } from "react";
import {
  FileText,
  List,
  Download,
  CheckCircle2,
  AlertCircle,
  GitCommit,
  Search,
  ExternalLink,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- MOCK DATA FROM JIRA ---
const SRS_DATA = [
  {
    id: "EPIC-1",
    title: "Quản lý Người dùng & Xác thực",
    description:
      "Cho phép người dùng đăng ký, đăng nhập và quản lý hồ sơ cá nhân.",
    stories: [
      {
        id: "SWP-101",
        title: "Đăng nhập bằng Google",
        priority: "High",
        status: "Done",
        commit: "a1b2c3d",
        commitMsg: "feat: implement google oauth",
      },
      {
        id: "SWP-102",
        title: "Đăng ký tài khoản mới",
        priority: "High",
        status: "Done",
        commit: "d4e5f6g",
        commitMsg: "feat: register api endpoint",
      },
      {
        id: "SWP-103",
        title: "Quên mật khẩu",
        priority: "Medium",
        status: "In Progress",
        commit: null,
        commitMsg: null,
      },
    ],
  },
  {
    id: "EPIC-2",
    title: "Giỏ hàng & Thanh toán",
    description:
      "Quy trình thêm sản phẩm vào giỏ và thực hiện thanh toán online.",
    stories: [
      {
        id: "SWP-201",
        title: "Xem giỏ hàng",
        priority: "High",
        status: "Done",
        commit: "h7i8j9k",
        commitMsg: "ui: shopping cart layout",
      },
      {
        id: "SWP-202",
        title: "Thêm mã giảm giá",
        priority: "Low",
        status: "To Do",
        commit: null,
        commitMsg: null,
      },
    ],
  },
];

export function TeamRequirements() {
  const [viewMode, setViewMode] = useState("doc"); // 'doc' or 'trace'

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <FileText className="mr-1 h-3 w-3" /> Total: 5 Stories
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed: 3
          </Badge>
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> Missing Code: 1
          </Badge>
        </div>

        <div className="flex gap-2">
          <Tabs
            value={viewMode}
            onValueChange={setViewMode}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger value="doc" className="text-xs">
                Tài liệu
              </TabsTrigger>
              <TabsTrigger value="trace" className="text-xs">
                Truy vết
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" variant="outline" className="h-9">
            <Download className="mr-2 h-4 w-4" /> Xuất PDF
          </Button>
        </div>
      </div>

      {/* CONTENT VIEW */}
      {viewMode === "doc" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table of Contents (Mục lục) */}
          <Card className="lg:col-span-1 h-fit sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Mục lục SRS</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-900 py-1">
                    1. Giới thiệu chung
                  </p>
                  <p className="font-medium text-gray-900 py-1">
                    2. Yêu cầu Chức năng
                  </p>
                  <div className="pl-3 space-y-1 text-gray-500 border-l-2 border-gray-100 ml-1">
                    {SRS_DATA.map((epic) => (
                      <p
                        key={epic.id}
                        className="cursor-pointer hover:text-[#F27124] transition-colors truncate"
                      >
                        2.{epic.id.split("-")[1]}. {epic.title}
                      </p>
                    ))}
                  </div>
                  <p className="font-medium text-gray-900 py-1 mt-2">
                    3. Yêu cầu Phi chức năng
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Document Content */}
          <Card className="lg:col-span-3 min-h-[600px]">
            <CardContent className="p-8 space-y-8">
              {/* Header Doc */}
              <div className="text-center border-b pb-6">
                <h1 className="text-3xl font-bold text-gray-900 uppercase">
                  Đặc tả Yêu cầu Phần mềm
                </h1>
                <p className="text-gray-500 mt-2">
                  Dự án: E-Commerce System • Version 1.2
                </p>
              </div>

              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  1. Giới thiệu
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Tài liệu này mô tả các yêu cầu chức năng và phi chức năng cho
                  hệ thống thương mại điện tử... (Nội dung này có thể lấy từ
                  Jira Project Description hoặc Wiki).
                </p>
              </section>

              {/* Section 2: Functional Requirements (Generated) */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  2. Yêu cầu Chức năng
                </h2>

                <Accordion type="single" collapsible className="w-full">
                  {SRS_DATA.map((epic, index) => (
                    <div key={epic.id} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Badge variant="secondary">EPIC</Badge> 2.{index + 1}{" "}
                        {epic.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 italic pl-1 border-l-2 border-gray-300">
                        {epic.description}
                      </p>

                      <div className="grid gap-3 pl-2">
                        {epic.stories.map((story, sIndex) => (
                          <div
                            key={story.id}
                            className="border rounded-md p-3 bg-gray-50/50 hover:bg-white transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono text-xs text-blue-600 font-bold mr-2">
                                  [{story.id}]
                                </span>
                                <span className="font-medium text-sm text-gray-800">
                                  {story.title}
                                </span>
                              </div>
                              <Badge
                                className={
                                  story.priority === "High"
                                    ? "bg-red-100 text-red-700"
                                    : story.priority === "Medium"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-blue-100 text-blue-700"
                                }
                              >
                                {story.priority}
                              </Badge>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Acceptance Criteria: (Dữ liệu này sẽ pull từ Jira
                              field)
                              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                <li>User nhập email đúng định dạng.</li>
                                <li>Hệ thống gửi OTP về email.</li>
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Accordion>
              </section>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* TRACEABILITY MATRIX VIEW */
        <Card>
          <CardHeader>
            <CardTitle>Ma trận Truy vết (Traceability Matrix)</CardTitle>
            <CardDescription>
              Kiểm tra sự liên kết giữa Yêu cầu (Jira) và Mã nguồn (GitHub)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Jira ID</TableHead>
                  <TableHead>Yêu cầu (User Story)</TableHead>
                  <TableHead>Trạng thái Jira</TableHead>
                  <TableHead>GitHub Commit</TableHead>
                  <TableHead>Chất lượng Code</TableHead>
                  <TableHead className="text-right">Đánh giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SRS_DATA.flatMap((epic) => epic.stories).map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="font-mono font-bold text-blue-600">
                      <a
                        href="#"
                        className="hover:underline flex items-center gap-1"
                      >
                        {story.id} <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">{story.title}</TableCell>
                    <TableCell>
                      {story.status === "Done" && (
                        <Badge className="bg-green-100 text-green-700">
                          Done
                        </Badge>
                      )}
                      {story.status === "In Progress" && (
                        <Badge className="bg-blue-100 text-blue-700">
                          In Progress
                        </Badge>
                      )}
                      {story.status === "To Do" && (
                        <Badge variant="outline">To Do</Badge>
                      )}
                    </TableCell>

                    {/* GitHub Commit Check */}
                    <TableCell>
                      {story.commit ? (
                        <div className="flex items-center gap-2 text-sm">
                          <GitCommit className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-mono text-xs bg-gray-100 px-1 rounded">
                              {story.commit}
                            </p>
                            <p
                              className="text-[10px] text-gray-500 max-w-[150px] truncate"
                              title={story.commitMsg || ""}
                            >
                              {story.commitMsg}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          Chưa có commit
                        </span>
                      )}
                    </TableCell>

                    {/* Code Quality (Mock) */}
                    <TableCell>
                      {story.commit ? (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="h-3 w-3" /> Pass (SonarQube)
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">--</span>
                      )}
                    </TableCell>

                    {/* Evaluation */}
                    <TableCell className="text-right">
                      {story.status === "Done" && !story.commit ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" /> Fake Done
                        </Badge>
                      ) : story.status === "Done" && story.commit ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
