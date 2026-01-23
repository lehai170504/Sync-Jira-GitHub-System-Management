"use client";

import { useState } from "react";
import { History, RefreshCw, Save, BookOpen, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import components

import { AppearanceSettings } from "@/components/features/settings/appearance-card";
import { NotificationSettings } from "@/components/features/settings/notification-card";
import { GradingConfig } from "@/features/lecturer/components/settings/grading-config";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã cập nhật cấu hình lớp học thành công!");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl space-y-8 animate-in fade-in-50">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Cài đặt & Cấu hình
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Quản lý tham số vận hành cho lớp{" "}
            <span className="font-semibold text-[#F27124]">SE1783</span> và tùy
            chỉnh hệ thống.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
          >
            <History className="mr-2 h-4 w-4 text-gray-500" /> Lịch sử log
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white min-w-[140px]"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <Separator />

      {/* 2. MAIN TABS */}
      <Tabs defaultValue="class-config" className="space-y-8">
        <TabsList className="bg-gray-100/50 p-1 rounded-xl border border-gray-200 inline-flex h-auto w-full md:w-auto">
          <TabsTrigger
            value="class-config"
            className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm font-medium transition-all"
          >
            <BookOpen className="h-4 w-4" /> Cấu hình Lớp học (Scoring)
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium transition-all"
          >
            <Layout className="h-4 w-4" /> Giao diện & Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: CLASS CONFIGURATION --- */}
        <TabsContent value="class-config" className="space-y-8">
          <GradingConfig />
        </TabsContent>

        {/* --- TAB 2: SYSTEM SETTINGS --- */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <AppearanceSettings />
            <NotificationSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
