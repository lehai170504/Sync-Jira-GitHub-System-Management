"use client";

import { useState } from "react";
import { Github, Trello, CalendarDays, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import các component con (Đảm bảo đường dẫn import đúng)
import { TeamAnalytics } from "@/components/features/lecturer/team-analytics";
import { TeamMembers } from "@/components/features/lecturer/team-members";
import { TeamArtifacts } from "@/components/features/lecturer/team-artifacts";
import { TeamRequirements } from "@/components/features/lecturer/team-requirements";

interface TeamDetailViewProps {
  teamId: string;
  teamName: string;
}

export function TeamDetailView({ teamId, teamName }: TeamDetailViewProps) {
  // Mock Data dựa trên teamId (Thực tế sẽ fetch API ở đây)
  const teamInfo = {
    name: teamName,
    topic: "Xây dựng sàn thương mại điện tử thiết bị IoT",
    sprint: "Sprint 3 (Testing phase)",
    status: "On Track",
    jira: "https://jira.com",
    github: "https://github.com",
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* 1. TITLE & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
            {teamInfo.name}
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none">
              {teamInfo.status}
            </Badge>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{teamInfo.topic}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border">
              <CalendarDays className="h-3 w-3" /> {teamInfo.sprint}
            </span>
            <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">
              <AlertTriangle className="h-3 w-3" /> 3 Bugs Open
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(teamInfo.jira)}
            className="gap-2 h-8"
          >
            <Trello className="h-3.5 w-3.5 text-blue-600" /> Jira
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(teamInfo.github)}
            className="gap-2 h-8"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </Button>
        </div>
      </div>

      {/* 2. TABS CONTENT */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="bg-white border p-0.5 w-full justify-start overflow-x-auto h-9">
          <TabsTrigger value="analytics" className="text-xs">
            Tiến độ
          </TabsTrigger>
          <TabsTrigger value="members" className="text-xs">
            Thành viên
          </TabsTrigger>
          <TabsTrigger value="requirements" className="text-xs">
            SRS & Yêu cầu
          </TabsTrigger>
          <TabsTrigger value="artifacts" className="text-xs">
            Sản phẩm
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-4">
          <TeamAnalytics />
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <TeamMembers />
        </TabsContent>

        <TabsContent value="requirements" className="mt-4">
          <TeamRequirements />
        </TabsContent>

        <TabsContent value="artifacts" className="mt-4">
          <TeamArtifacts />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label>Tên đề tài</Label>
                <Input defaultValue={teamInfo.topic} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Jira URL</Label>
                  <Input defaultValue={teamInfo.jira} />
                </div>
                <div className="grid gap-2">
                  <Label>GitHub URL</Label>
                  <Input defaultValue={teamInfo.github} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button size="sm" className="bg-[#F27124] hover:bg-[#d65d1b]">
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
