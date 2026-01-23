"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Loader2,
  CheckCircle2,
  Save,
  ExternalLink,
  User,
  Calendar,
  Unplug, // Import Unplug icon
} from "lucide-react";
// Import Alert Dialog Components
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

// Hooks
import { useGithubIntegration } from "@/features/integration/hooks/use-github-integration";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useDisconnectGithub } from "@/features/integration/hooks/use-disconnect"; // Hook mới

export function GithubFormLeader() {
  const { connectToGithub, isConnecting } = useGithubIntegration();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();

  // Hook Ngắt kết nối
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectGithub();

  const githubInfo = profileData?.user?.integrations?.github;
  const isConnected = !!githubInfo;

  // State & Logic lưu Repo (như cũ)
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const savedRepoId = localStorage.getItem("selected_github_repo_id");
      if (savedRepoId) setSelectedRepoId(savedRepoId);
    }
  }, [isConnected]);

  // --- UI Loading ---
  if (isProfileLoading)
    return <div className="h-64 bg-slate-100 animate-pulse rounded-lg" />;

  // --- UI: ĐÃ KẾT NỐI ---
  if (isConnected) {
    return (
      <Card className="border-l-4 border-l-[#24292F] bg-slate-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" /> GitHub Integration
              </CardTitle>
              <CardDescription>Đã liên kết thành công.</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Connected
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Thông tin GitHub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm">
              <User className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  GitHub User
                </p>
                <a
                  href={`https://github.com/${githubInfo.username}`}
                  target="_blank"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {githubInfo.username}
                </a>
              </div>
            </div>
            <div className="flex gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm">
              <ExternalLink className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  GitHub ID
                </p>
                <p className="text-sm font-medium text-slate-900 font-mono">
                  {githubInfo.githubId}
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
                {githubInfo.linkedAt
                  ? new Date(githubInfo.linkedAt).toLocaleString("vi-VN")
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
                  <AlertDialogTitle>Ngắt kết nối GitHub?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hệ thống sẽ ngừng theo dõi commit từ tài khoản{" "}
                    <strong>{githubInfo.username}</strong>. Bạn có thể kết nối
                    lại bất cứ lúc nào.
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
          <Github className="h-5 w-5" /> GitHub Integration
        </CardTitle>
        <CardDescription>
          Kết nối tài khoản GitHub để đồng bộ Repository và Commits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 bg-slate-50/50">
          <Button
            onClick={connectToGithub}
            disabled={isConnecting}
            className="bg-[#24292F] text-white"
          >
            {isConnecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" /> Kết nối với GitHub
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
