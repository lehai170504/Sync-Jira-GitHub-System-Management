"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RotateCcw, Unplug } from "lucide-react";

import { useProfile } from "@/features/auth/hooks/use-profile";
import { useGithubIntegration } from "@/features/integration/hooks/use-github-integration";
import { useDisconnectGithub } from "@/features/integration/hooks/use-disconnect";
import { useJiraIntegration } from "@/features/integration/hooks/use-jira-integration";
import { useDisconnectJira } from "@/features/integration/hooks/use-disconnect";
import { getGithubConnectUrlApi } from "@/features/integration/api/github-api";
import { getJiraConnectUrlApi } from "@/features/integration/api/jira-api";

const LS_WEBHOOK_OAUTH_RELINK_V2_ACK = "webhook_oauth_relink_v2_ack";

export function WebhookOAuthRelinkAlert() {
  const { data: profile, isLoading: isProfileLoading, refetch } = useProfile();
  const user = profile?.user;

  const linkedGithub = !!user?.integrations?.github;
  const linkedJira = !!user?.integrations?.jira;

  const [relinkRunId, setRelinkRunId] = useState(0);

  const shouldPrompt = useMemo(() => {
    if (isProfileLoading) return false;
    // Nếu user đã link Jira/GitHub từ trước thì BE cần thêm scopes webhook mới,
    // nên FE phải yêu cầu user ngắt kết nối và kết nối lại.
    if (!linkedGithub && !linkedJira) return false;

    if (typeof window === "undefined") return false;
    return localStorage.getItem(LS_WEBHOOK_OAUTH_RELINK_V2_ACK) !== "true";
  }, [isProfileLoading, linkedGithub, linkedJira]);

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<null | "github" | "jira" | "all">(null);

  const { connectToGithub, isConnecting: isGithubConnecting } = useGithubIntegration();
  const { mutateAsync: disconnectGithubAsync, isPending: isDisconnectingGithub } =
    useDisconnectGithub();
  const { connectToJira, isConnecting: isJiraConnecting } = useJiraIntegration();
  const { mutateAsync: disconnectJiraAsync, isPending: isDisconnectingJira } = useDisconnectJira();

  // Dùng ref để điều khiển luồng reconnect "cả hai" theo kiểu tuần tự:
  // open GitHub trước, khi callback GitHub thành công thì mới mở Jira.
  const relinkFlowRef = useRef<{
    active: boolean;
    expectGithub: boolean;
    expectJira: boolean;
    githubDone: boolean;
    jiraDone: boolean;
  }>({
    active: false,
    expectGithub: false,
    expectJira: false,
    githubDone: false,
    jiraDone: false,
  });

  const githubPopupRef = useRef<Window | null>(null);
  const jiraPopupRef = useRef<Window | null>(null);
  const jiraRedirectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!shouldPrompt) return;
    setOpen(true);
  }, [shouldPrompt]);

  // Lắng nghe OAuth callback để mở Jira sau khi GitHub đã thành công.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as any;
      if (!data || data.type !== "OAUTH_CALLBACK") return;
      const providerRaw = String(data.provider ?? "");
      const provider = providerRaw.toLowerCase().trim();
      const normalizedProvider = provider.includes("github")
        ? "github"
        : provider.includes("jira")
          ? "jira"
          : "";
      if (!normalizedProvider) return;

      if (!relinkFlowRef.current.active) return;

      const success = data.success === true || data.success === "true";
      // Note: tránh log debug quá nhiều ở production.

      if (normalizedProvider === "github") {
        const prevDone = relinkFlowRef.current.githubDone;
        relinkFlowRef.current.githubDone = success;
        if (success && !prevDone) {
          toast.success("Kết nối GitHub thành công!");

          // Điều hướng Jira OAuth popup sau khi GitHub OK
          if (
            relinkFlowRef.current.expectJira &&
            !relinkFlowRef.current.jiraDone &&
            jiraPopupRef.current &&
            jiraRedirectUrlRef.current
          ) {
            jiraPopupRef.current.location.href = jiraRedirectUrlRef.current;
          }
        }
        if (!success) {
          toast.error(
            `Kết nối GitHub thất bại: ${data.error || "Bad credentials"}`,
          );
          relinkFlowRef.current.active = false;
        }
      }

      if (normalizedProvider === "jira") {
        const prevDone = relinkFlowRef.current.jiraDone;
        relinkFlowRef.current.jiraDone = success;
        if (success && !prevDone) {
          toast.success("Kết nối Jira thành công!");

          // Khi cả hai (nếu được yêu cầu) đã xong thì ack + đóng popup.
          const shouldClose =
            (!relinkFlowRef.current.expectGithub || relinkFlowRef.current.githubDone) &&
            (!relinkFlowRef.current.expectJira || relinkFlowRef.current.jiraDone);
          if (shouldClose) closeAndAck();
        }
        if (!success) {
          toast.error(`Kết nối Jira thất bại: ${data.error || "Error"}`);
          relinkFlowRef.current.active = false;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chốt kết quả theo trạng thái profile để tránh trường hợp
  // popup OAuth của 1 provider không gửi postMessage về FE.
  useEffect(() => {
    if (!open) return;
    if (!relinkFlowRef.current.active) return;

    let pollTimer: number | null = null;
    let stopTimer: number | null = null;

    const expectedGithub = relinkFlowRef.current.expectGithub;
    const expectedJira = relinkFlowRef.current.expectJira;

    const checkAndToast = () => {
      const flow = relinkFlowRef.current;
      if (!flow.active) return;

      if (expectedGithub && linkedGithub && !flow.githubDone) {
        flow.githubDone = true;
        toast.success("Kết nối GitHub thành công!");
      }

      if (expectedJira && linkedJira && !flow.jiraDone) {
        flow.jiraDone = true;
        toast.success("Kết nối Jira thành công!");
      }

      const shouldClose =
        (!expectedGithub || flow.githubDone) && (!expectedJira || flow.jiraDone);
      if (shouldClose) {
        if (pollTimer) window.clearInterval(pollTimer);
        if (stopTimer) window.clearTimeout(stopTimer);
        closeAndAck();
      }
    };

    // Poll refetch profile trong thời gian ngắn
    pollTimer = window.setInterval(() => {
      refetch().finally(() => {
        // Sau refetch, trạng thái profile sẽ update ở render cycle kế tiếp
        // nhưng gọi checkAndToast lại vẫn là an toàn (idempotent theo githubDone/jiraDone).
        checkAndToast();
      });
    }, 1600);

    stopTimer = window.setTimeout(() => {
      const flow = relinkFlowRef.current;
      if (!flow.active) return;

      if (expectedGithub && !flow.githubDone) {
        toast.error("Chưa xác nhận được kết nối GitHub. Vui lòng thử lại.");
      }
      if (expectedJira && !flow.jiraDone) {
        toast.error("Chưa xác nhận được kết nối Jira. Vui lòng thử lại.");
      }

      flow.active = false;
      if (pollTimer) window.clearInterval(pollTimer);
    }, 24000);

    // eslint-disable-next-line consistent-return
    return () => {
      if (pollTimer) window.clearInterval(pollTimer);
      if (stopTimer) window.clearTimeout(stopTimer);
    };
    // relinkRunId để effect chạy lại mỗi lần bấm nút
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, relinkRunId, linkedGithub, linkedJira]);

  const isAnyBusy = busy !== null || isGithubConnecting || isJiraConnecting || isDisconnectingGithub || isDisconnectingJira;

  const closeAndAck = () => {
    localStorage.setItem(LS_WEBHOOK_OAUTH_RELINK_V2_ACK, "true");
    setOpen(false);
  };

  const handleRelinkGithub = async () => {
    if (!linkedGithub || isAnyBusy) return;
    setBusy("github");
    try {
      await disconnectGithubAsync();
      // Đợi state backend cập nhật xong mới mở OAuth lại.
      setTimeout(() => connectToGithub(), 300);
      toast.message("Đang ngắt kết nối GitHub và mở popup OAuth mới...");
    } catch (e: any) {
      toast.error(e?.message || "Không thể ngắt kết nối GitHub");
    } finally {
      setBusy(null);
    }
  };

  const handleRelinkJira = async () => {
    if (!linkedJira || isAnyBusy) return;
    setBusy("jira");
    try {
      await disconnectJiraAsync();
      setTimeout(() => connectToJira(), 300);
      toast.message("Đang ngắt kết nối Jira và mở popup OAuth mới...");
    } catch (e: any) {
      toast.error(e?.message || "Không thể ngắt kết nối Jira");
    } finally {
      setBusy(null);
    }
  };

  const handleRelinkAll = async () => {
    if ((!linkedGithub && !linkedJira) || isAnyBusy) return;
    setBusy("all");
    try {
      relinkFlowRef.current = {
        active: true,
        expectGithub: linkedGithub,
        expectJira: linkedJira,
        githubDone: false,
        jiraDone: false,
      };

      // Important:
      // OAuth luôn cần user xác nhận trên provider (GitHub/Jira), FE không thể auto-approve.
      // Tuy nhiên để không bị popup blocker và không "random" thứ tự,
      // ta mở popup trống cho cả 2 ngay trong 1 user click, rồi điều hướng tuần tự:
      // GitHub trước -> Jira sau.

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const featureStr = `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no`;

      githubPopupRef.current = linkedGithub
        ? window.open("about:blank", "GithubOAuthPopup", featureStr)
        : null;
      jiraPopupRef.current = linkedJira
        ? window.open("about:blank", "JiraOAuthPopup", featureStr)
        : null;

      const [githubRedirectUrl, jiraRedirectUrl] = await Promise.all([
        linkedGithub ? getGithubConnectUrlApi() : Promise.resolve<string | null>(null),
        linkedJira ? getJiraConnectUrlApi() : Promise.resolve<string | null>(null),
      ]);

      jiraRedirectUrlRef.current = jiraRedirectUrl;

      if (githubPopupRef.current && githubRedirectUrl) {
        githubPopupRef.current.location.href = githubRedirectUrl;
      }

      toast.message("Đang kết nối lại jira và github...");
      setRelinkRunId((x) => x + 1);
    } catch (e: any) {
      toast.error(e?.message || "Không thể thực hiện ngắt kết nối lại");
      relinkFlowRef.current.active = false;
    } finally {
      setBusy(null);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:max-w-[720px] max-w-[720px] bg-white dark:bg-slate-950 border-none rounded-3xl p-0 overflow-y-auto max-h-[90vh]"
      >
        <div className="p-6 sm:p-8">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-slate-100">
              Cần đăng nhập lại để kích hoạt Webhook Real-time
            </DialogTitle>
          </DialogHeader>

          <div className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <Unplug className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                <span className="font-bold">GitHub</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {linkedGithub ? "Đang được link" : "Chưa link"}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <Unplug className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                <span className="font-bold">Jira</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {linkedJira ? "Đang được link" : "Chưa link"}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/60 dark:bg-slate-900/30 px-6 sm:px-8 py-4 gap-3 flex flex-col sm:flex-row sm:items-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full rounded-xl whitespace-normal wrap-break-word"
              onClick={() => closeAndAck()}
              disabled={isAnyBusy}
            >
              Để sau
            </Button>

            <Button
              className="w-full rounded-xl whitespace-normal wrap-break-word bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-400 focus-visible:ring-orange-400"
              onClick={handleRelinkAll}
              disabled={isAnyBusy || (!linkedGithub && !linkedJira)}
            >
              {busy === "all" || isAnyBusy ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Hủy liên kết & kết nối lại cả hai
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

