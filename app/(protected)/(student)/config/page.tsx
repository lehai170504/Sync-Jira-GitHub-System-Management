"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { JiraForm } from "@/components/features/config/jira-form";
import { JiraFormLeader } from "@/components/features/config/jira-form-leader";
import { GithubForm } from "@/components/features/config/github-form";
import { GithubFormLeader } from "@/components/features/config/github-form-leader";
import { SavedConfigurations } from "@/components/features/config/saved-configurations";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { toast } from "sonner";

export default function ConfigPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  // LEADER và MEMBER: Hiển thị Jira + GitHub Configuration với Test Connection
  if (role === "LEADER" || role === "MEMBER") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4 md:py-8 px-4 md:px-0">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 -mt-5">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Settings className="h-6 w-6 md:h-8 md:w-8 text-[#F27124]" />
              Cấu hình dự án
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Thiết lập kết nối với Jira và GitHub để đồng bộ dữ liệu tự động.
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1.5 text-xs md:text-sm w-fit">
            Project Setup
          </Badge>
        </div>

        <Separator />

        {/* TABS: Jira, GitHub & Saved */}
        <Tabs defaultValue="jira" className="w-full space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-3 max-w-[600px] h-10 md:h-11">
              <TabsTrigger value="jira" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Jira Software</span>
                <span className="sm:hidden">Jira</span>
              </TabsTrigger>
              <TabsTrigger value="github" className="text-xs md:text-sm">
                GitHub
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs md:text-sm">
                Đã lưu
              </TabsTrigger>
            </TabsList>
          </div>

          {/* JIRA CONFIGURATION */}
          <TabsContent
            value="jira"
            className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
          >
            <JiraFormLeader />
          </TabsContent>

          {/* GITHUB CONFIGURATION */}
          <TabsContent
            value="github"
            className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
          >
            <GithubFormLeader />
          </TabsContent>

          {/* SAVED CONFIGURATIONS */}
          <TabsContent
            value="saved"
            className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
          >
            <SavedConfigurations
              onEdit={(type) => {
                // Switch to corresponding tab when edit is clicked
                const tabValue = type === "jira" ? "jira" : "github";
                // Note: This would require state management, but for now just show toast
                toast.info(`Chuyển sang tab ${type === "jira" ? "Jira" : "GitHub"} để chỉnh sửa`);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // STUDENT/OTHER ROLES: Hiển thị tabs Jira + GitHub (form cũ)
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 md:py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1 -mt-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Cấu hình tích hợp
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Quản lý kết nối tới Jira và GitHub để đồng bộ dữ liệu tự động.
          </p>
        </div>
        {/* Global Status (Optional) */}
        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-medium w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="hidden sm:inline">Hệ thống đang hoạt động</span>
          <span className="sm:hidden">Hoạt động</span>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="jira" className="w-full space-y-8 -mt-5">
        <div className="flex justify-center">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] h-10 md:h-11">
            <TabsTrigger value="jira" className="text-xs md:text-sm">
              <span className="hidden sm:inline">Jira Software</span>
              <span className="sm:hidden">Jira</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="text-xs md:text-sm">
              GitHub
            </TabsTrigger>
          </TabsList>
        </div>

        {/* NỘI DUNG TAB JIRA */}
        <TabsContent
          value="jira"
          className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          <JiraForm />
        </TabsContent>

        {/* NỘI DUNG TAB GITHUB */}
        <TabsContent
          value="github"
          className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          <GithubForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

