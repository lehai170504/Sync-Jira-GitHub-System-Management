"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Github,
  Trello,
  CalendarDays,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// IMPORT CÁC COMPONENT CON (Đã chuẩn hóa tên)
import { TeamAnalytics } from "@/components/features/lecturer/team-analytics";
import { TeamRequirements } from "@/components/features/lecturer/team-requirements";
import { TeamArtifacts } from "@/components/features/lecturer/team-artifacts";
import { TeamMembers } from "@/components/features/lecturer/team-members";

export default function TeamDetailPage({
  params,
}: {
  params: { teamId: string };
}) {
  const router = useRouter();

  // Mock Data
  const teamInfo = {
    name: "Team 1 - E-Commerce System",
    topic: "Xây dựng sàn thương mại điện tử thiết bị IoT",
    sprint: "Sprint 3 (Testing phase)",
    status: "On Track",
    jira: "https://jira.com",
    github: "https://github.com",
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* 1. HEADER NAV */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="hover:underline cursor-pointer"
          onClick={() => router.push("/lecturer/dashboard")}
        >
          Lớp SE1783
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">Chi tiết nhóm</span>
      </div>

      {/* 2. TITLE & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b pb-6">
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              {teamInfo.name}
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none">
                {teamInfo.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">{teamInfo.topic}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border">
                <CalendarDays className="h-3.5 w-3.5" /> {teamInfo.sprint}
              </span>
              <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                <AlertTriangle className="h-3.5 w-3.5" /> 3 Bugs Open
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(teamInfo.jira)}
            className="gap-2"
          >
            <Trello className="h-4 w-4 text-blue-600" /> Jira Board
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(teamInfo.github)}
            className="gap-2"
          >
            <Github className="h-4 w-4" /> GitHub Repo
          </Button>
        </div>
      </div>

      {/* 3. TABS CONTENT */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-white border p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="analytics">Tiến độ & Thống kê</TabsTrigger>
          <TabsTrigger value="members">Thành viên & Đánh giá</TabsTrigger>
          <TabsTrigger value="artifacts">Tài liệu & Sản phẩm</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt nhóm</TabsTrigger>
        </TabsList>

        {/* TAB 1: ANALYTICS */}
        <TabsContent value="analytics">
          <TeamAnalytics />
        </TabsContent>

        <TabsContent value="requirements">
          <TeamRequirements />
        </TabsContent>

        {/* TAB 2: MEMBERS (Dùng TeamMembers mới nhất) */}
        <TabsContent value="members">
          <TeamMembers />
        </TabsContent>

        {/* TAB 3: ARTIFACTS (Dùng TeamArtifacts) */}
        <TabsContent value="artifacts">
          <TeamArtifacts />
        </TabsContent>

        {/* TAB 4: SETTINGS (Inline component nhỏ gọn cho setting nhóm) */}
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label>Tên đề tài</Label>
                <Input defaultValue={teamInfo.topic} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Jira Project URL</Label>
                  <Input defaultValue={teamInfo.jira} />
                </div>
                <div className="grid gap-2">
                  <Label>GitHub Repository URL</Label>
                  <Input defaultValue={teamInfo.github} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button className="bg-[#F27124] hover:bg-[#d65d1b]">
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
