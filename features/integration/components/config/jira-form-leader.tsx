"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  Globe,
  Mail,
  Calendar,
  Unplug,
} from "lucide-react";
// Import Alert Dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Import Hooks
import { useJiraIntegration } from "@/features/integration/hooks/use-jira-integration";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useDisconnectJira } from "@/features/integration/hooks/use-disconnect"; // Hook mới

export function JiraFormLeader() {
  const { connectToJira, isConnecting } = useJiraIntegration();
  const { data: profileData, isLoading } = useProfile();

  // Hook Ngắt kết nối
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectJira();

  const jiraInfo = profileData?.user?.integrations?.jira;
  const isConnected = !!jiraInfo;

  // --- UI Loading ---
  if (isLoading)
    return <div className="h-64 bg-slate-100 animate-pulse rounded-lg" />;

  // --- UI: ĐÃ KẾT NỐI ---
  if (isConnected) {
    return (
      <Card className="border-l-4 border-l-[#0052CC] bg-slate-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
                  alt="Jira"
                  className="w-5 h-5"
                />
                Jira Software
              </CardTitle>
              <CardDescription>
                Dự án đang được đồng bộ với Atlassian Jira.
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Connected
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cloud ID */}
            <div className="flex gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm">
              <Globe className="h-5 w-5 text-slate-500 mt-0.5" />
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Cloud ID
                </p>
                <p className="text-sm font-medium text-slate-900 font-mono break-all text-xs">
                  {jiraInfo.cloudId || "N/A"}
                </p>
              </div>
            </div>
            {/* Email */}
            <div className="flex gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm">
              <Mail className="h-5 w-5 text-slate-500 mt-0.5" />
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Account Email
                </p>
                <p className="text-sm font-medium text-slate-900 truncate">
                  {jiraInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* Footer: Disconnect */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Linked At:{" "}
                {jiraInfo.linkedAt
                  ? new Date(jiraInfo.linkedAt).toLocaleString("vi-VN")
                  : "N/A"}
              </span>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <Unplug className="h-3 w-3 mr-2" />
                  )}
                  Ngắt kết nối
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ngắt kết nối Jira?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hệ thống sẽ ngừng đồng bộ dữ liệu từ Cloud ID{" "}
                    <strong>{jiraInfo.cloudId}</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => disconnect()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- UI: CHƯA KẾT NỐI (Giữ nguyên) ---
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
            alt="Jira"
            className="w-6 h-6"
          />
          Jira Software Integration
        </CardTitle>
        <CardDescription>
          Kết nối với Atlassian Jira để đồng bộ dữ liệu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 bg-slate-50/50">
          <Button
            onClick={connectToJira}
            disabled={isConnecting}
            className="bg-[#0052CC] text-white"
          >
            {isConnecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Kết nối với Jira Software"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
