"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { FileSpreadsheet, FileText } from "lucide-react";

import { UserRole } from "@/components/layouts/sidebar-config";
import { exportScoreReport, exportSRSReport } from "@/server/actions/report-actions";
import { downloadBase64File } from "@/lib/download-utils";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportHeader } from "./export-header";
import { ExportScoreCard } from "./export-score-card";
import { ExportWorklogCard } from "./export-worklog-card";

const LAST_EXPORT_SCORE_KEY = "leader_export_score_lastRun";
const LAST_EXPORT_WORKLOG_KEY = "leader_export_worklog_lastRun";

export function ExportPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeader, setIsLeader] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [loadingWorklog, setLoadingWorklog] = useState(false);
  const [lastExportScoreAt, setLastExportScoreAt] = useState<string | null>(null);
  const [lastExportWorklogAt, setLastExportWorklogAt] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeader(leaderStatus);

    if (typeof window !== "undefined") {
      const lastScore = window.localStorage.getItem(LAST_EXPORT_SCORE_KEY);
      const lastWorklog = window.localStorage.getItem(LAST_EXPORT_WORKLOG_KEY);
      if (lastScore) setLastExportScoreAt(lastScore);
      if (lastWorklog) setLastExportWorklogAt(lastWorklog);
    }
  }, []);

  const handleExportScore = async () => {
    try {
      setLoadingScore(true);
      const res = await exportScoreReport();

      if (res.success && res.data && res.filename) {
        downloadBase64File(res.data, res.filename);
        const now = new Date().toISOString();
        window.localStorage.setItem(LAST_EXPORT_SCORE_KEY, now);
        setLastExportScoreAt(now);
        toast.success("Đã tải xuống bảng điểm Excel!");
        return;
      }

      toast.error(res.error || "Có lỗi xảy ra khi xuất bảng điểm.");
    } catch (e) {
      toast.error("Có lỗi xảy ra khi xuất bảng điểm.");
    } finally {
      setLoadingScore(false);
    }
  };

  const handleExportWorklog = async () => {
    try {
      setLoadingWorklog(true);
      const res = await exportSRSReport();

      if (res.success && res.data && res.filename) {
        downloadBase64File(res.data, res.filename);
        const now = new Date().toISOString();
        window.localStorage.setItem(LAST_EXPORT_WORKLOG_KEY, now);
        setLastExportWorklogAt(now);
        toast.success("Đã tải xuống file Worklog Word!");
        return;
      }

      toast.error(res.error || "Có lỗi xảy ra khi xuất Worklog Word.");
    } catch (e) {
      toast.error("Có lỗi xảy ra khi xuất Worklog Word.");
    } finally {
      setLoadingWorklog(false);
    }
  };

  // Chỉ LEADER mới được truy cập
  if (!isLeader) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <ExportHeader />
        <Separator />
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800">
          <h3 className="font-semibold mb-1">Không có quyền truy cập</h3>
          <p className="text-sm">
            Bạn đang đăng nhập với vai trò Member. Vui lòng liên hệ Leader.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
      <ExportHeader />

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      <Tabs defaultValue="score" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-muted/50 p-1">
            <TabsTrigger
              value="score"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="font-medium">Bảng điểm</span>
            </TabsTrigger>
            <TabsTrigger
              value="worklog"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Worklog</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* EXPORT SCORE TAB */}
        <TabsContent value="score" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <ExportScoreCard
            lastExportAt={lastExportScoreAt}
            loading={loadingScore}
            onExport={handleExportScore}
          />
        </TabsContent>

        {/* EXPORT WORKLOG TAB */}
        <TabsContent value="worklog" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <ExportWorklogCard
            lastExportAt={lastExportWorklogAt}
            loading={loadingWorklog}
            onExport={handleExportWorklog}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

