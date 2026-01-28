"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  User,
  Calendar,
  Unplug,
  ExternalLink,
} from "lucide-react";
import { SiGithub } from "react-icons/si"; 
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
import { useGithubIntegration } from "@/features/integration/hooks/use-github-integration";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useDisconnectGithub } from "@/features/integration/hooks/use-disconnect";

export function GithubFormLeader() {
  const { connectToGithub, isConnecting } = useGithubIntegration();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectGithub();

  const githubInfo = profileData?.user?.integrations?.github;
  const isConnected = !!githubInfo;

  if (isProfileLoading)
    return (
      <div className="h-64 bg-slate-50 animate-pulse rounded-[32px] border border-slate-100" />
    );

  return (
    <div className="font-mono space-y-6">
      {isConnected ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-2xl text-white">
                  <SiGithub className="w-6 h-6" />{" "}
                  {/* Thay thế bằng SiGithub */}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Github DevOps Sync
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium uppercase opacity-70">
                    Source Control Integration Active
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">
                <CheckCircle2 className="w-3 h-3 mr-2" /> Authorized
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <User className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Account User
                  </span>
                </div>
                <a
                  href={`https://github.com/${githubInfo.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  {githubInfo.username} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Developer ID
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {githubInfo.githubId}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5" />
                Liên kết từ:{" "}
                {githubInfo.linkedAt
                  ? new Date(githubInfo.linkedAt).toLocaleDateString("vi-VN")
                  : "N/A"}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  >
                    <Unplug className="h-3.5 w-3.5 mr-2" /> Thu hồi quyền truy
                    cập
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="font-mono rounded-3xl border-slate-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="uppercase font-black tracking-tight">
                      Ngắt kết nối GitHub?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs uppercase font-medium leading-relaxed">
                      Dữ liệu Commit từ tài khoản{" "}
                      <span className="text-slate-900 font-black">
                        @{githubInfo.username}
                      </span>{" "}
                      sẽ ngừng cập nhật.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl uppercase text-[10px] font-black">
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => disconnect()}
                      className="bg-red-600 hover:bg-red-700 rounded-xl uppercase text-[10px] font-black"
                    >
                      Xác nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200 space-y-6">
          <div className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100 text-slate-900">
            <SiGithub className="w-10 h-10 text-slate-300 opacity-50" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">
              GitHub Pending
            </h4>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Kết nối để đồng bộ Repository và Commits
            </p>
          </div>
          <Button
            onClick={connectToGithub}
            disabled={isConnecting}
            className="h-14 bg-slate-900 hover:bg-black text-white rounded-2xl px-10 transition-all active:scale-95 shadow-xl hover:shadow-slate-500/20"
          >
            {isConnecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="font-black uppercase tracking-widest text-xs">
                Cấp quyền tài khoản GitHub
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
