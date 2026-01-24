"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JiraFormLeader } from "@/features/integration/components/config/jira-form-leader";
import { GithubFormLeader } from "@/features/integration/components/config/github-form-leader";
import { Settings, Link as LinkIcon } from "lucide-react";

export function IntegrationTab() {
  const [activeSubTab, setActiveSubTab] = useState("jira");

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header nhỏ trong Tab */}
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-[#F27124]" />
          Tích hợp hệ thống
        </h3>
        <p className="text-sm text-muted-foreground">
          Kết nối tài khoản của bạn với Jira và GitHub để đồng bộ tiến độ dự án.
        </p>
      </div>

      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">
            Chọn nền tảng cấu hình
          </CardTitle>
          <CardDescription>
            Chuyển đổi giữa các tab để thiết lập kết nối.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeSubTab}
            onValueChange={setActiveSubTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 h-11">
              <TabsTrigger
                value="jira"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0052CC] data-[state=active]:shadow-sm"
              >
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
                  alt="Jira"
                  className="w-4 h-4 mr-2"
                />
                Jira Software
              </TabsTrigger>
              <TabsTrigger
                value="github"
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                GitHub
              </TabsTrigger>
            </TabsList>

            {/* Nội dung cấu hình Jira */}
            <TabsContent
              value="jira"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="bg-white rounded-lg border border-slate-100 p-1">
                <JiraFormLeader />
              </div>
            </TabsContent>

            {/* Nội dung cấu hình GitHub */}
            <TabsContent
              value="github"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="bg-white rounded-lg border border-slate-100 p-1">
                <GithubFormLeader />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
