"use client";

import { History, BookOpen, Layout, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import { AppearanceSettings } from "@/components/features/settings/appearance-card";
import { NotificationSettings } from "@/components/features/settings/notification-card";
import { GradingConfig } from "@/features/lecturer/components/settings/grading-config";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl space-y-8 animate-in fade-in-50 font-sans pb-20">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F27124] mb-2">
            <Settings className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Settings & Configurations
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Cài đặt & Cấu hình
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Quản lý tham số vận hành cho lớp{" "}
            <span className="font-bold text-[#F27124] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
              SE1783
            </span>
          </p>
        </div>

        <Button
          variant="outline"
          className="bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-sm"
        >
          <History className="mr-2 h-4 w-4" /> Xem lịch sử thay đổi
        </Button>
      </div>

      <Separator className="bg-slate-200" />

      {/* 2. MAIN TABS */}
      <Tabs defaultValue="class-config" className="space-y-8">
        <TabsList className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 inline-flex h-auto w-full md:w-auto gap-1">
          <TabsTrigger
            value="class-config"
            className="gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-md data-[state=active]:font-bold text-slate-500 font-medium transition-all"
          >
            <BookOpen className="h-4 w-4" /> Cấu hình Điểm số (Scoring)
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:font-bold text-slate-500 font-medium transition-all"
          >
            <Layout className="h-4 w-4" /> Giao diện & Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: CLASS CONFIGURATION --- */}
        <TabsContent value="class-config" className="outline-none">
          <GradingConfig />
        </TabsContent>

        {/* --- TAB 2: SYSTEM SETTINGS --- */}
        <TabsContent
          value="system"
          className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-lg text-slate-800">
              Tùy chỉnh trải nghiệm cá nhân
            </h3>
          </div>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <AppearanceSettings />
            <NotificationSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
