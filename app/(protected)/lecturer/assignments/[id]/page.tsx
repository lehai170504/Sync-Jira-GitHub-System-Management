"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, Users, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

// Import các components con
import { KPICards } from "@/features/lecturer/components/assignment/kpi-cards";
import { SubmissionTable } from "@/features/lecturer/components/assignment/submission-table";
import { AssignmentInfo } from "@/features/lecturer/components/assignment/assignment-info";

// --- MOCK CONFIG ---
const ASSIGNMENT_MODE: "Individual" | "Group" = "Group";

// Mock Data
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

  const isGroup = ASSIGNMENT_MODE === "Group";
  const data = isGroup ? GROUP_SUBMISSIONS : INDIVIDUAL_SUBMISSIONS;

  // Tính toán
  const totalCount = isGroup ? 6 : 30;
  const submittedCount = data.filter((i) => i.status !== "Missing").length;
  const gradedCount = data.filter((i) => i.grade !== null).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 pb-10">
      {/* 1. NAV & HEADER */}
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
                className={`font-medium px-2.5 py-0.5 rounded-md border-0 flex items-center gap-1.5 ${
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
            <Download className="mr-2 h-4 w-4" /> Tải tất cả
          </Button>
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] rounded-full shadow-lg shadow-orange-500/20 px-6 transition-all hover:scale-105">
            <Send className="mr-2 h-4 w-4" /> Công bố điểm
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: STATS & TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <KPICards
            submitted={submittedCount}
            total={totalCount}
            graded={gradedCount}
            deadline="10/02"
          />

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

            <TabsContent value="submissions">
              <SubmissionTable isGroup={isGroup} data={data} />
            </TabsContent>

            <TabsContent value="instructions">
              <Card className="border-none shadow-sm ring-1 ring-gray-100 p-8 min-h-[300px] flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl mt-6">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p>Nội dung đề bài và hướng dẫn sẽ hiển thị ở đây.</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: INFO */}
        <AssignmentInfo
          isGroup={isGroup}
          dueDate="10/02/2026 - 23:59"
          assignDate="01/02/2026"
        />
      </div>
    </div>
  );
}
