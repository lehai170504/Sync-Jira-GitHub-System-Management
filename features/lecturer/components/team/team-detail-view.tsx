"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Trello,
  Github,
  Settings,
  ArrowUpRight,
} from "lucide-react";

// Import sub-components
import { TeamHeader } from "./team-header";
import { TeamStats } from "./team-stats";
import { JiraBoard } from "./jira-board";
import { GithubStats } from "./github-stats";
import { TeamSettings } from "./team-settings";

interface TeamDetailViewProps {
  teamId: string;
  teamName: string;
}

export function TeamDetailView({ teamName }: TeamDetailViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* 1. Header */}
      <TeamHeader teamName={teamName} />

      {/* 2. Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100/50 p-1 rounded-xl border border-gray-200 inline-flex h-auto">
            <TabsTrigger
              value="overview"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <LayoutDashboard className="h-4 w-4" /> Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="jira"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0052CC] data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <Trello className="h-4 w-4" /> Bảng Jira
            </TabsTrigger>
            <TabsTrigger
              value="github"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <Github className="h-4 w-4" /> Kho GitHub
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <Settings className="h-4 w-4" /> Cài đặt
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-9 gap-2"
            >
              <ArrowUpRight className="h-4 w-4" /> Liên kết ngoài
            </Button>
          </div>
        </div>

        <TabsContent value="overview">
          <TeamStats />
        </TabsContent>
        <TabsContent value="jira">
          <JiraBoard />
        </TabsContent>
        <TabsContent value="github">
          <GithubStats />
        </TabsContent>
        <TabsContent value="settings">
          <TeamSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
