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

  // Style cho các Tab Trigger mang đậm chất kỹ thuật nhưng dùng dấu cách
  const subTabTriggerStyle = cn(
    "flex items-center gap-3 px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em] transition-all",
    "text-slate-400 border-b-2 border-transparent",
    "hover:text-slate-900 hover:bg-slate-50/50",
    "data-[state=active]:text-[#F27124] data-[state=active]:border-[#F27124] data-[state=active]:bg-white",
  );

  return (
    <div className="space-y-10 font-mono animate-in fade-in slide-in-from-top-4 duration-700">
      {/* --- PHẦN 1: HEADER & GIỚI THIỆU (BENTO STYLE) --- */}
      <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[#F27124]" />
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900">
                Bảng điều khiển tích hợp
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider opacity-70 max-w-xl leading-relaxed">
              Thiết lập kết nối thời gian thực giữa SyncSystem với các nền tảng
              quản trị mã nguồn và quy trình nghiệp vụ để tự động hóa báo cáo
              tiến độ dự án.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <Cpu className="w-5 h-5 text-emerald-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </span>
              <span className="text-[10px] font-black text-slate-900 uppercase">
                Hệ thống hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: TABS CẤU HÌNH --- */}
      <div className="bg-white rounded-[32px] border border-slate-200/60 overflow-hidden shadow-sm">
        <Tabs
          value={activeSubTab}
          onValueChange={setActiveSubTab}
          className="w-full"
        >
          {/* TAB LIST: Dạng thanh điều hướng tinh tế */}
          <div className="border-b border-slate-100 bg-slate-50/30">
            <TabsList className="bg-transparent p-0 h-auto w-full justify-start space-x-0">
              <TabsTrigger value="jira" className={subTabTriggerStyle}>
                <SiJira
                  className={cn(
                    "w-4 h-4",
                    activeSubTab === "jira" ? "text-[#0052CC]" : "",
                  )}
                />
                Jira Software
              </TabsTrigger>
              <TabsTrigger value="github" className={subTabTriggerStyle}>
                <SiGithub
                  className={cn(
                    "w-4 h-4",
                    activeSubTab === "github" ? "text-black" : "",
                  )}
                />
                GitHub DevOps
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-8 opacity-50">
              <Zap className="w-3 h-3 text-[#F27124]" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                Dữ liệu cấu hình
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
        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(242,113,36,0.5)]" />
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          Lưu ý: Mọi thay đổi về Token hoặc Webhook sẽ ảnh hưởng trực tiếp đến
          dữ liệu đồng bộ trên Dashboard của toàn bộ thành viên nhóm.
        </p>
      </div>
    </div>
  );
}
