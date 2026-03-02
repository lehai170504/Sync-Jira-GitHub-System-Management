"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JiraFormLeader } from "@/features/integration/components/config/jira-form-leader";
import { GithubFormLeader } from "@/features/integration/components/config/github-form-leader";
import { LinkIcon, Cpu, Zap } from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";
import { cn } from "@/lib/utils";

export function IntegrationTab() {
  const [activeSubTab, setActiveSubTab] = useState("jira");

  // UX Fix: Đồng bộ style "Pill" (nút bo tròn nổi) giống với menu tab bên ngoài
  const subTabTriggerStyle = cn(
    "relative flex flex-1 items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all duration-300",
    "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50",
    "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900",
    "data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400",
    "data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 dark:data-[state=active]:border-slate-800",
  );

  return (
    <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- PHẦN 2: TABS CẤU HÌNH --- */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <Tabs
          value={activeSubTab}
          onValueChange={setActiveSubTab}
          className="w-full"
        >
          {/* TAB LIST */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
            <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1.5 h-auto rounded-[24px] flex w-full max-w-md border border-slate-200/50 dark:border-slate-800 mx-auto md:mx-0">
              <TabsTrigger value="jira" className={subTabTriggerStyle}>
                <SiJira
                  className={cn(
                    "w-4 h-4",
                    activeSubTab === "jira"
                      ? "text-[#0052CC] dark:text-[#2684FF]"
                      : "",
                  )}
                />
                Jira Software
              </TabsTrigger>
              <TabsTrigger value="github" className={subTabTriggerStyle}>
                <SiGithub
                  className={cn(
                    "w-4 h-4",
                    activeSubTab === "github"
                      ? "text-black dark:text-white"
                      : "",
                  )}
                />
                GitHub DevOps
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-8 opacity-70">
              <Zap className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Dữ liệu cấu hình {activeSubTab}
              </span>
            </div>

            {/* Nội dung cấu hình Jira */}
            <TabsContent
              value="jira"
              className="mt-0 focus-visible:outline-none outline-none border-none animate-in fade-in zoom-in-95 duration-500"
            >
              <JiraFormLeader />
            </TabsContent>

            {/* Nội dung cấu hình GitHub */}
            <TabsContent
              value="github"
              className="mt-0 focus-visible:outline-none outline-none border-none animate-in fade-in zoom-in-95 duration-500"
            >
              <GithubFormLeader />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* --- FOOTER NHẮC NHỞ --- */}
      <div className="px-8 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(242,113,36,0.6)] animate-pulse" />
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
          Lưu ý: Mọi thay đổi về Token hoặc Webhook sẽ ảnh hưởng trực tiếp đến
          dữ liệu đồng bộ trên Dashboard của toàn bộ thành viên nhóm.
        </p>
      </div>
    </div>
  );
}
