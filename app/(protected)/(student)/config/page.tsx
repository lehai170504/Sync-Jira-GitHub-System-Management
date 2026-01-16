"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { JiraForm } from "@/components/features/config/jira-form";
import { GithubForm } from "@/components/features/config/github-form";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ConfigPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Cấu hình tích hợp
          </h2>
          <p className="text-muted-foreground">
            Quản lý kết nối tới Jira và GitHub để đồng bộ dữ liệu tự động.
          </p>
        </div>
        {/* Global Status (Optional) */}
        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Hệ thống đang hoạt động
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="jira" className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] h-11">
            <TabsTrigger value="jira" className="text-sm">
              Jira Software
            </TabsTrigger>
            <TabsTrigger value="github" className="text-sm">
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
