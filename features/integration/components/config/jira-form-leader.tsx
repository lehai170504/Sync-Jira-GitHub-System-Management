"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  Globe,
  Mail,
  Calendar,
  Unplug,
} from "lucide-react";
import { SiJira } from "react-icons/si";
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
import { useJiraIntegration } from "@/features/integration/hooks/use-jira-integration";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useDisconnectJira } from "@/features/integration/hooks/use-disconnect";

export function JiraFormLeader() {
  const { connectToJira, isConnecting } = useJiraIntegration();
  const {
    data: profileData,
    isLoading,
    refetch: refetchProfile,
  } = useProfile();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectJira();

  const jiraInfo = profileData?.user?.integrations?.jira;
  const isConnected = !!jiraInfo;

  // --- LẮNG NGHE KẾT QUẢ TỪ POPUP ---
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const data = event.data as {
        type?: string;
        provider?: string;
        success?: boolean;
        email?: string | null;
        error?: string;
      };

      if (data && data.type === "OAUTH_CALLBACK" && data.provider === "jira") {
        if (data.success) {
          toast.success("Kết nối Jira thành công!");

          setTimeout(() => {
            refetchProfile();
          }, 800);
        } else {
          toast.error(`Kết nối Jira thất bại: ${data.error}`);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [refetchProfile]);

  if (isLoading)
    return (
      <div className="h-64 bg-slate-50 dark:bg-slate-900/60 animate-pulse rounded-[32px] border border-slate-100 dark:border-slate-800" />
    );

  return (
    <div className="font-mono space-y-6">
      {isConnected ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0052CC]/10 dark:bg-[#0052CC]/20 rounded-2xl">
                  <SiJira className="w-6 h-6 text-[#0052CC]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
                    Jira Software Sync
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase opacity-70">
                    Atlassian Cloud Integration Active
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">
                <CheckCircle2 className="w-3 h-3 mr-2" /> Live Connection
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBox
                icon={Globe}
                label="Cloud Identifier"
                value={jiraInfo.cloudId}
              />
              <InfoBox
                icon={Mail}
                label="Authorized Account"
                value={jiraInfo.email}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5" />
                Liên kết từ:{" "}
                {jiraInfo.linkedAt
                  ? new Date(jiraInfo.linkedAt).toLocaleDateString("vi-VN")
                  : "N/A"}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  >
                    <Unplug className="h-3.5 w-3.5 mr-2" /> Ngắt kết nối hệ
                    thống
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="font-mono rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="uppercase font-black tracking-tight text-slate-900 dark:text-slate-100">
                      Ngắt kết nối Jira?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs uppercase font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                      Hệ thống sẽ ngừng đồng bộ dữ liệu từ Cloud ID:{" "}
                      <span className="text-slate-900 dark:text-slate-100 font-black">
                        {jiraInfo.cloudId}
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl uppercase text-[10px] font-black text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700">
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => disconnect()}
                      disabled={isDisconnecting}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-xl uppercase text-[10px] font-black text-white"
                    >
                      {isDisconnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Xác nhận"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 dark:bg-slate-900/40 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <SiJira className="w-10 h-10 text-slate-300 dark:text-slate-600 opacity-50" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-slate-100">
              Jira Core Pending
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              Kết nối để đồng bộ hóa Sprint và Tasks
            </p>
          </div>
          <Button
            onClick={connectToJira} // Gọi Hook
            disabled={isConnecting}
            className="h-14 bg-[#0052CC] hover:bg-[#0747A6] text-white rounded-2xl px-10 transition-all active:scale-95 shadow-xl hover:shadow-blue-500/20"
          >
            {isConnecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="font-black uppercase tracking-widest text-xs">
                Cấp quyền hệ thống Jira
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }: any) {
  return (
    <div className="p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:bg-white dark:hover:bg-slate-900 hover:border-[#0052CC]/20 dark:hover:border-slate-500 transition-all">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-[#0052CC] dark:group-hover:text-[#2684FF] transition-colors" />
        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 break-all">
        {value || "N/A"}
      </p>
    </div>
  );
}
