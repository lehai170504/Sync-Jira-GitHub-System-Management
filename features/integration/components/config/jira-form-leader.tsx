"use client";

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
  const { data: profileData, isLoading } = useProfile();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectJira();

  const jiraInfo = profileData?.user?.integrations?.jira;
  const isConnected = !!jiraInfo;

  if (isLoading)
    return (
      <div className="h-64 bg-slate-50 animate-pulse rounded-[32px] border border-slate-100" />
    );

  return (
    <div className="font-mono space-y-6">
      {isConnected ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Card chính phong cách Bento */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0052CC]/10 rounded-2xl">
                  <SiJira className="w-6 h-6 text-[#0052CC]" />{" "}
                  {/* Thay thế bằng SiJira */}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Jira Software Sync
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium uppercase opacity-70">
                    Atlassian Cloud Integration Active
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">
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

            <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  >
                    <Unplug className="h-3.5 w-3.5 mr-2" /> Ngắt kết nối hệ
                    thống
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="font-mono rounded-3xl border-slate-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="uppercase font-black tracking-tight">
                      Ngắt kết nối Jira?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs uppercase font-medium leading-relaxed">
                      Hệ thống sẽ ngừng đồng bộ dữ liệu từ Cloud ID:{" "}
                      <span className="text-slate-900 font-black">
                        {jiraInfo.cloudId}
                      </span>
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
        /* UI CHƯA KẾT NỐI */
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200 space-y-6">
          <div className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100">
            <SiJira className="w-10 h-10 text-slate-300 opacity-50" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">
              Jira Core Pending
            </h4>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Kết nối để đồng bộ hóa Sprint và Tasks
            </p>
          </div>
          <Button
            onClick={connectToJira}
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
    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-[#0052CC]/20 transition-all">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0052CC] transition-colors" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-900 break-all">
        {value || "N/A"}
      </p>
    </div>
  );
}
