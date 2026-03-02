"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Settings,
  ToyBrick,
  BellDot,
  Cpu,
  X,
  Layout,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AppearanceSettings } from "./appearance-card";
import { NotificationSettings } from "./notification-card";
// Lưu ý: Đảm bảo đường dẫn import của GradingConfig là chính xác
import { GradingConfig } from "@/features/lecturer/components/settings/grading-config";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: string; // Để xác định xem có nên hiện tab cấu hình lớp (Grading) không
}

export function SettingsDialog({
  open,
  onOpenChange,
  userRole,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("appearance");

  const tabTriggerStyle = cn(
    "relative flex justify-start items-center gap-3 px-4 py-3 font-bold text-[11px] uppercase tracking-wider transition-all rounded-xl",
    "text-slate-500 dark:text-slate-400 border border-transparent",
    "hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/50",
    "data-[state=active]:text-[#F27124] dark:data-[state=active]:text-orange-400",
    "data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-900/10",
    "data-[state=active]:border-orange-100 dark:data-[state=active]:border-orange-900/30",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-none shadow-2xl rounded-3xl md:rounded-[40px] flex flex-col h-[85vh] transition-colors font-mono">
        {/* Nút tắt custom */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* --- HEADER --- */}
        <div className="shrink-0 px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-slate-50">
                Cài đặt hệ thống
              </DialogTitle>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
                Tùy biến trải nghiệm & thông số vận hành
              </p>
            </div>
          </div>
        </div>

        {/* --- BODY: TABS --- */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col md:flex-row min-h-0"
        >
          {/* Cột trái: Tab Navigation (Dọc) */}
          <div className="w-full md:w-64 border-r border-slate-100 dark:border-slate-800 shrink-0 p-4 bg-slate-50/30 dark:bg-slate-950/30 overflow-y-auto">
            <TabsList className="bg-transparent p-0 h-auto w-full flex flex-col items-stretch space-y-1">
              <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-1">
                Trải nghiệm
              </div>
              <TabsTrigger value="appearance" className={tabTriggerStyle}>
                <ToyBrick className="w-4 h-4 shrink-0" />
                Giao diện & Ngôn ngữ
              </TabsTrigger>
              <TabsTrigger value="notifications" className={tabTriggerStyle}>
                <BellDot className="w-4 h-4 shrink-0" />
                Thông báo
              </TabsTrigger>

              {userRole === "LECTURER" && (
                <>
                  <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-1 border-t border-slate-200/50 dark:border-slate-800 pt-4">
                    Quản lý lớp học
                  </div>
                  <TabsTrigger value="grading" className={tabTriggerStyle}>
                    <BookOpen className="w-4 h-4 shrink-0" />
                    Cấu hình Điểm số
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {/* Cột phải: Tab Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar">
            <TabsContent
              value="appearance"
              className="m-0 border-none outline-none"
            >
              <div className="flex items-center gap-3 mb-6">
                <Layout className="w-5 h-5 text-[#F27124] dark:text-orange-400" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                  Cài đặt giao diện
                </h3>
              </div>
              <AppearanceSettings />
            </TabsContent>

            <TabsContent
              value="notifications"
              className="m-0 border-none outline-none"
            >
              <div className="flex items-center gap-3 mb-6">
                <BellDot className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                  Thông báo thời gian thực
                </h3>
              </div>
              <NotificationSettings />
            </TabsContent>

            {userRole === "LECTURER" && (
              <TabsContent
                value="grading"
                className="m-0 border-none outline-none"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Cpu className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                    Cấu hình lớp học
                  </h3>
                </div>
                <GradingConfig />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
