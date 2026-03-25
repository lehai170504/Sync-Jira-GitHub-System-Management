"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { usePathname, useSearchParams } from "next/navigation";

interface SocketContextType {
  isConnected: boolean;
  socket: typeof socket;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: socket,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const token = Cookies.get("token");
  const queryClient = useQueryClient();

  const { data: profileData } = useProfile();
  const userId = profileData?.user?._id;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathnameRef = useRef(pathname);
  const userIdRef = useRef<string | undefined>(userId);
  const activeClassIdRef = useRef<string>("");
  const activeTeamIdRef = useRef<string>("");
  const lastEventToastRef = useRef<{ key: string; at: number }>({ key: "", at: 0 });

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const classIdFromUrl = searchParams.get("classId") ?? "";
  const teamIdFromUrl = searchParams.get("teamId") ?? "";
  const classIdFromCookie =
    Cookies.get("lecturer_class_id") || Cookies.get("student_class_id") || "";
  const teamIdFromCookie =
    Cookies.get("student_team_id") || Cookies.get("lecturer_team_id") || "";
  const activeClassId = classIdFromUrl || classIdFromCookie;
  const activeTeamId = teamIdFromUrl || teamIdFromCookie;

  useEffect(() => {
    activeClassIdRef.current = activeClassId;
  }, [activeClassId]);
  useEffect(() => {
    activeTeamIdRef.current = activeTeamId;
  }, [activeTeamId]);

  const isOnTasksPage = useMemo(() => {
    return (p: string) =>
      p === "/tasks" || p.startsWith("/tasks") || p.includes("/tasks");
  }, []);

  useEffect(() => {
    if (!token) {
      if (socket.connected) socket.disconnect();
      return;
    }

    const emitJoinRooms = () => {
      const uid = userIdRef.current;
      const cid = activeClassIdRef.current;
      const tid = activeTeamIdRef.current;

      if (uid) {
        socket.emit("join_user", uid);
        socket.emit("joinUser", uid);
      }
      if (cid) {
        socket.emit("join_class", cid);
        socket.emit("joinClass", cid);
      }
      if (tid) {
        socket.emit("join_team", tid);
        socket.emit("joinTeam", tid);
      }
    };

    const isDuplicatedToast = (key: string) => {
      const now = Date.now();
      const prev = lastEventToastRef.current;
      if (prev.key === key && now - prev.at < 1200) {
        return true;
      }
      lastEventToastRef.current = { key, at: now };
      return false;
    };

    function onConnect() {
      setIsConnected(true);
      emitJoinRooms();
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onConnectError(err: any) {
      if (err.message === "Authentication error") {
        socket.auth = { token: Cookies.get("token") };
        socket.connect();
      }
    }

    function onSystemNotification(data: any) {
      toast.info(data.title || "Thông báo hệ thống", {
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }

    // Lắng nghe thông báo cá nhân mới và cập nhật UI (chuông, badge)
    function onNewNotification(data: any) {
      toast.success(data?.title || "Bạn có thông báo mới!");

      // Lệnh này sẽ làm chuông tự động nảy số (cập nhật unread count)
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }

    function onGithubNewCommits(data: any) {
      const message = data?.message || "Có code mới từ GitHub";
      const commitsCount = typeof data?.commitsCount === "number" ? data.commitsCount : undefined;
      const toastKey = `gh:${message}:${commitsCount ?? "na"}`;
      if (isDuplicatedToast(toastKey)) return;
      toast.success(
        commitsCount !== undefined ? `${message} (${commitsCount} commits)` : message,
      );
    }

    function onJiraIssueUpdated(data: any) {
      const message = data?.message || "Kanban Jira vừa có cập nhật!";
      const issueKey = data?.issueKey ?? "";
      const status = data?.status ?? "";
      const toastKey = `jira:${message}:${issueKey}:${status}`;
      if (isDuplicatedToast(toastKey)) return;
      toast.info(`${message}${issueKey || status ? ` - Task ${issueKey} -> ${status}` : ""}`);

      const p = pathnameRef.current || "";
      if (isOnTasksPage(p)) {
        // Refetch Kanban tasks theo role hiện tại (bao gồm cả filter theo member/team)
        queryClient.invalidateQueries({ queryKey: ["team-tasks"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["team-all-tasks"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["member-tasks"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["my-tasks"], exact: false });
        // Ép refetch ngay để UI cập nhật tức thì, không chờ vòng re-render kế tiếp
        queryClient.refetchQueries({ queryKey: ["team-tasks"], exact: false, type: "active" });
        queryClient.refetchQueries({ queryKey: ["team-all-tasks"], exact: false, type: "active" });
        queryClient.refetchQueries({ queryKey: ["member-tasks"], exact: false, type: "active" });
        queryClient.refetchQueries({ queryKey: ["my-tasks"], exact: false, type: "active" });
      }
    }

    function onAnyEvent(eventName: string, data: any) {
      const ev = String(eventName || "").toLowerCase();
      if (ev.includes("github") && ev.includes("commit")) {
        onGithubNewCommits(data);
        return;
      }
      if (ev.includes("jira") && (ev.includes("issue") || ev.includes("task"))) {
        onJiraIssueUpdated(data);
      }
    }

    function onLeaderboardUpdated(data: any) {
      const teamId = data?.teamId;
      const leaderboard = data?.leaderboard;
      if (!teamId || !Array.isArray(leaderboard)) return;

      // Cache-only: UI nào subscribe key này sẽ tự nhảy số ngay, không cần F5
      queryClient.setQueryData(["team-leaderboard-rt", teamId], {
        teamId,
        leaderboard,
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("system_notification", onSystemNotification);
    socket.on("new_notification", onNewNotification);
    socket.on("GITHUB_NEW_COMMITS", onGithubNewCommits);
    socket.on("JIRA_ISSUE_UPDATED", onJiraIssueUpdated);
    socket.on("LEADERBOARD_UPDATED", onLeaderboardUpdated);
    // Fallback: hỗ trợ event names khác casing/format
    socket.on("github_new_commits", onGithubNewCommits);
    socket.on("GITHUB_NEW_COMMIT", onGithubNewCommits);
    socket.on("github_new_commit", onGithubNewCommits);
    socket.on("jira_issue_updated", onJiraIssueUpdated);
    socket.on("JIRA_ISSUE_UPDATE", onJiraIssueUpdated);
    socket.on("jira_issue_update", onJiraIssueUpdated);
    socket.on("jiraIssueUpdated", onJiraIssueUpdated);
    socket.on("leaderboard_updated", onLeaderboardUpdated);
    socket.onAny(onAnyEvent);

    socket.auth = { token };
    if (socket.connected) {
      // Tránh miss connect event nếu socket đã lên trước khi bind listeners
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("system_notification", onSystemNotification);
      socket.off("new_notification", onNewNotification);
      socket.off("GITHUB_NEW_COMMITS", onGithubNewCommits);
      socket.off("JIRA_ISSUE_UPDATED", onJiraIssueUpdated);
      socket.off("LEADERBOARD_UPDATED", onLeaderboardUpdated);
      socket.off("github_new_commits", onGithubNewCommits);
      socket.off("GITHUB_NEW_COMMIT", onGithubNewCommits);
      socket.off("github_new_commit", onGithubNewCommits);
      socket.off("jira_issue_updated", onJiraIssueUpdated);
      socket.off("JIRA_ISSUE_UPDATE", onJiraIssueUpdated);
      socket.off("jira_issue_update", onJiraIssueUpdated);
      socket.off("jiraIssueUpdated", onJiraIssueUpdated);
      socket.off("leaderboard_updated", onLeaderboardUpdated);
      socket.offAny(onAnyEvent);
      socket.disconnect();
    };
  }, [token, queryClient]); // listener effect nên ổn định

  // Xử lý case: nếu socket đã connect trước khi API profile trả về userId
  useEffect(() => {
    if (isConnected && userId) {
      socket.emit("join_user", userId);
      socket.emit("joinUser", userId);
    }
    if (isConnected && activeClassId) {
      socket.emit("join_class", activeClassId);
      socket.emit("joinClass", activeClassId);
    }
    const tid = activeTeamIdRef.current;
    if (isConnected && tid) {
      socket.emit("join_team", tid);
      socket.emit("joinTeam", tid);
    }
  }, [isConnected, userId, activeClassId]);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
