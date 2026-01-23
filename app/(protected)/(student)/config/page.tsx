"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config"; // Hoặc path file định nghĩa role của bạn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { toast } from "sonner";

// Import Components
import { JiraFormLeader } from "@/features/integration/components/config/jira-form-leader";
import { GithubFormLeader } from "@/features/integration/components/config/github-form-leader";

export default function ConfigPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [activeTab, setActiveTab] = useState("jira");

  // 1. INIT ROLE
  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  // --- UI CHÍNH: LEADER & MEMBER (Được quyền cấu hình) ---
  if (role === "STUDENT") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0 animate-in slide-in-from-bottom-4 duration-500">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 -mt-5">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Settings className="h-8 w-8 text-[#F27124]" />
              </div>
              Cấu hình dự án
            </h2>
            <p className="text-muted-foreground text-sm md:text-base pl-1">
              Thiết lập kết nối với Jira và GitHub để đồng bộ dữ liệu tự động.
            </p>
          </div>
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-sm border-orange-200 text-orange-700 bg-orange-50 w-fit"
          >
            Project Setup Mode
          </Badge>
        </div>

        <Separator className="bg-slate-100" />

        {/* TABS CONFIGURATION */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-8"
        >
          <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-2 max-w-[600px] h-12 bg-slate-100/50 p-1">
              <TabsTrigger
                value="jira"
                className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Jira Software
              </TabsTrigger>
              <TabsTrigger
                value="github"
                className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                GitHub
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: JIRA */}
          <TabsContent
            value="jira"
            className="space-y-4 focus-visible:outline-none"
          >
            <JiraFormLeader />
          </TabsContent>

          {/* TAB 2: GITHUB */}
          <TabsContent
            value="github"
            className="space-y-4 focus-visible:outline-none"
          >
            <GithubFormLeader />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // --- UI PHỤ: STUDENT (Chỉ xem trạng thái) ---
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 -mt-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Thông tin tích hợp
          </h2>
          <p className="text-muted-foreground">
            Xem trạng thái kết nối tới các hệ thống quản lý.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Hệ thống đang hoạt động
        </div>
      </div>

      <Separator />
    </div>
  );
}
