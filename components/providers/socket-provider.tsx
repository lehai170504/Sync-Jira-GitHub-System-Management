"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const userIdRef = useRef<string | undefined>(userId);
  const activeClassIdRef = useRef<string>("");
  const activeTeamIdRef = useRef<string>("");
  const activeProjectIdRef = useRef<string>("");
  const lastEventToastRef = useRef<{ key: string; at: number }>({ key: "", at: 0 });

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const classIdFromUrl = searchParams.get("classId") ?? "";
  const teamIdFromUrl = searchParams.get("teamId") ?? "";
  const projectIdFromUrl = searchParams.get("projectId") ?? "";
  const classIdFromCookie =
    Cookies.get("lecturer_class_id") || Cookies.get("student_class_id") || "";
  const teamIdFromCookie =
    Cookies.get("student_team_id") || Cookies.get("lecturer_team_id") || "";
  const projectIdFromCookie =
    Cookies.get("student_project_id") || Cookies.get("lecturer_project_id") || "";
  const activeClassId = classIdFromUrl || classIdFromCookie;
  const activeTeamId = teamIdFromUrl || teamIdFromCookie;
  const activeProjectId = projectIdFromUrl || projectIdFromCookie;

  /** Giống app mobile (useMyProject): join_project cần projectId — cookie `student_project_id` chỉ set ở /tasks; fallback từ team detail. */
  const { data: teamDetailForSocket } = useTeamDetail(activeTeamId || undefined);
  const projectIdFromTeamDetail = teamDetailForSocket?.project?._id
    ? String(teamDetailForSocket.project._id)
    : "";
  const projectIdFromTeamRef = useRef("");
  useEffect(() => {
    projectIdFromTeamRef.current = projectIdFromTeamDetail;
  }, [projectIdFromTeamDetail]);

  useEffect(() => {
    activeClassIdRef.current = activeClassId;
  }, [activeClassId]);
  useEffect(() => {
    activeTeamIdRef.current = activeTeamId;
  }, [activeTeamId]);
  useEffect(() => {
    activeProjectIdRef.current = activeProjectId;
  }, [activeProjectId]);

  useEffect(() => {
    if (!token) {
      if (socket.connected) socket.disconnect();
      return;
    }

    const socketAuthToken = token ? `Bearer ${token}` : "";

    const emitJoinRooms = () => {
      const uid = userIdRef.current;
      // Cookie có thể đổi sau khi socket đã connect (do user điều hướng trang),
      // nên đọc lại trực tiếp để tránh join nhầm room.
      const cid =
        Cookies.get("lecturer_class_id") ||
        Cookies.get("student_class_id") ||
        activeClassIdRef.current;
      const tid =
        Cookies.get("student_team_id") ||
        Cookies.get("lecturer_team_id") ||
        activeTeamIdRef.current;
      const pid =
        Cookies.get("student_project_id") ||
        Cookies.get("lecturer_project_id") ||
        activeProjectIdRef.current ||
        projectIdFromTeamRef.current;

      if (uid) {
        try {
          // eslint-disable-next-line no-console
          console.log("[RT] emit join_user", { uid });
        } catch {
          // ignore
        }
        socket.emit("join_user", uid);
        socket.emit("joinUser", uid);
      }
      if (cid) {
        try {
          // eslint-disable-next-line no-console
          console.log("[RT] emit join_class", { cid });
        } catch {
          // ignore
        }
        socket.emit("join_class", cid);
        socket.emit("joinClass", cid);
      }
      if (tid) {
        try {
          // eslint-disable-next-line no-console
          console.log("[RT] emit join_team", { tid });
        } catch {
          // ignore
        }
        socket.emit("join_team", tid);
        socket.emit("joinTeam", tid);
      }
      if (pid) {
        const normalizedProjectId = String(pid).replace(/^project:/, "");
        try {
          // eslint-disable-next-line no-console
          console.log("[RT] emit join_project", { pid: normalizedProjectId });
        } catch {
          // ignore
        }
        socket.emit("join_project", normalizedProjectId);
        socket.emit("joinProject", normalizedProjectId);
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

    /** Refetch mọi query đang mount có queryKey[0] thuộc roots (React Query — không polling HTTP). */
    function refetchQueriesByKeyRoots(roots: string[]) {
      const queries = queryClient.getQueryCache().findAll({
        predicate: (q) => {
          const k = q.queryKey;
          return (
            Array.isArray(k) &&
            typeof k[0] === "string" &&
            roots.includes(k[0])
          );
        },
      });
      queries.forEach((q) => {
        void queryClient.refetchQueries({
          queryKey: q.queryKey,
          exact: true,
          type: "all",
        });
      });
    }

    // Debug throttle: log các event liên quan Jira nếu FE nhận được.
    // Trường hợp hiện tại bạn đang thấy "không có gì", log này sẽ giúp biết có event nào tới không.
    let lastJiraAnyEventLogAt = 0;
    let lastAnyEventLogAt = 0;

    function onConnect() {
      setIsConnected(true);
      try {
        // eslint-disable-next-line no-console
        console.log("[RT] socket connected", {
          tokenPresent: !!token,
          userId: userIdRef.current,
          classIdCookie:
            Cookies.get("lecturer_class_id") || Cookies.get("student_class_id") || "",
          teamIdCookie:
            Cookies.get("student_team_id") || Cookies.get("lecturer_team_id") || "",
          classIdRef: activeClassIdRef.current,
          teamIdRef: activeTeamIdRef.current,
        });
      } catch {
        // ignore
      }
      emitJoinRooms();
    }

    function onDisconnect() {
      setIsConnected(false);
      try {
        // eslint-disable-next-line no-console
        console.log("[RT] socket disconnected");
      } catch {
        // ignore
      }
    }

    function onConnectError(err: any) {
      try {
        // eslint-disable-next-line no-console
        console.log("[RT] socket connect_error", { message: err?.message, err });
      } catch {
        // ignore
      }
      if (err.message === "Authentication error") {
        const nextToken = Cookies.get("token");
        socket.auth = { token: nextToken ? `Bearer ${nextToken}` : "" };
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
      const projectName = typeof data?.projectName === "string" ? data.projectName : undefined;
      const toastKey = `gh:${message}:${commitsCount ?? "na"}`;
      if (isDuplicatedToast(toastKey)) return;
      const title = projectName ? `${projectName}: ${message}` : message;
      const descParts: string[] = [];
      if (projectName) descParts.push(`Dự án: ${projectName}`);
      if (commitsCount !== undefined) descParts.push(`${commitsCount} commit mới`);
      toast.success(title, {
        description: descParts.length ? descParts.join(" · ") : undefined,
        className: "border-l-4 border-l-emerald-500",
      });

      refetchQueriesByKeyRoots([
        "team-commits",
        "team-commits-by-team",
        "member-commits",
        "my-commits",
        "integration-team-commits-grouped",
        "jira-issue-commits",
        // Leader overview: useTeamDashboard — overview.commits / thống kê
        "team-dashboard",
        // Trang tiến độ / ranking (mobile cũng invalidate team-ranking)
        "team-ranking",
      ]);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("rt:github-new-commits", {
            detail: data,
          }),
        );
      }
    }

    function onJiraIssueUpdated(data: any) {
      const message = data?.message || "Kanban Jira vừa có cập nhật!";
      const issueKey =
        data?.issueKey ??
        data?.issue_key ??
        data?.issue?.key ??
        "";
      const status =
        data?.status ??
        data?.status_name ??
        data?.issue?.fields?.status?.name ??
        "";
      // Debug: giúp xác nhận FE có nhận event socket từ BE hay không.
      // Nếu log này không xuất hiện => vấn đề nằm ở socket room/join hoặc event name.
      try {
        // eslint-disable-next-line no-console
        console.log("[RT] JIRA_ISSUE_UPDATED", { issueKey, status, raw: data });
      } catch {
        // ignore
      }
      const toastKey = `jira:${message}:${issueKey}:${status}`;
      const shouldToast = !isDuplicatedToast(toastKey);
      if (shouldToast) {
        const desc =
          [issueKey && `Task ${issueKey}`, status && `Trạng thái: ${status}`]
            .filter(Boolean)
            .join(" · ") || undefined;
        toast.info(message, {
          description: desc,
          className: "border-l-4 border-l-sky-500",
        });
      }

      // Kanban / task list: refetch React Query (socket-driven, không dùng polling).
      let shouldRefetch = true;
      if (typeof window !== "undefined") {
        const now = Date.now();
        const last = (window as any).__rtJiraRefreshAt as number | undefined;
        if (typeof last === "number" && now - last < 1200) {
          shouldRefetch = false;
        } else {
          (window as any).__rtJiraRefreshAt = now;
        }
      }
      if (shouldRefetch) {
        refetchQueriesByKeyRoots([
          "team-tasks",
          "team-all-tasks",
          "member-tasks",
          "my-tasks",
          // LeaderOverviewTab — danh sách task từ API tổng hợp
          "my-tasks-response",
        ]);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("rt:jira-issue-updated", {
            // luôn dispatch payload đã normalize để /tasks không phụ thuộc format BE
            detail: {
              ...data,
              issueKey,
              status,
              message,
            },
          }),
        );
      }
    }

    function onTaskCreated(data: any) {
      onJiraIssueUpdated({
        message: data?.message || "Task Jira mới vừa được tạo",
        issueKey: data?.issue_key || data?.issueKey || data?.issue?.key || "",
        status:
          data?.status_name ||
          data?.status ||
          data?.issue?.fields?.status?.name ||
          "",
        ...data,
      });
    }

    function onTaskUpdated(data: any) {
      // payload có thể là taskData hoặc { action:'delete', issueKey, ... }
      const action = String(data?.action || "").toLowerCase();
      const issueKey = data?.issueKey || data?.issue_key || data?.issue?.key || "";
      const status =
        data?.status ||
        data?.status_name ||
        data?.issue?.fields?.status?.name ||
        "";
      onJiraIssueUpdated({
        message:
          action === "delete"
            ? "Task Jira vừa bị xóa"
            : data?.message || "Task Jira vừa được cập nhật",
        issueKey,
        status,
        action,
        ...data,
      });
    }

    function onMemberUpdated(data: any) {
      // Một số BE emit generic MEMBER_UPDATED sau Jira webhook.
      // Treat as Kanban update trigger để UI tự đồng bộ.
      onJiraIssueUpdated({
        message: data?.message || "Dữ liệu task vừa được cập nhật",
        issueKey: data?.issueKey || data?.issue_key || "",
        status: data?.status || data?.status_name || "",
      });
    }

    function onAnyEvent(eventName: string, data: any) {
      const ev = String(eventName || "").toLowerCase();
      const now = Date.now();
      if (now - lastAnyEventLogAt > 5000) {
        lastAnyEventLogAt = now;
        try {
          // eslint-disable-next-line no-console
            console.log("[RT] onAnyEvent", {
            eventName,
            dataType: typeof data,
          });
        } catch {
          // ignore
        }
      }
      if (ev.includes("jira")) {
        if (now - lastJiraAnyEventLogAt > 2000) {
          lastJiraAnyEventLogAt = now;
          try {
            // eslint-disable-next-line no-console
          console.log("[RT] onAnyEvent (jira)", { eventName, data });
          } catch {
            // ignore
          }
        }
      }
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
    socket.on("task_created", onTaskCreated);
    socket.on("task_updated", onTaskUpdated);
    // Fallback: hỗ trợ event names khác casing/format
    socket.on("github_new_commits", onGithubNewCommits);
    socket.on("GITHUB_NEW_COMMIT", onGithubNewCommits);
    socket.on("github_new_commit", onGithubNewCommits);
    socket.on("jira_issue_updated", onJiraIssueUpdated);
    socket.on("JIRA_ISSUE_UPDATE", onJiraIssueUpdated);
    socket.on("jira_issue_update", onJiraIssueUpdated);
    socket.on("jiraIssueUpdated", onJiraIssueUpdated);
    socket.on("leaderboard_updated", onLeaderboardUpdated);
    socket.on("MEMBER_UPDATED", onMemberUpdated);
    socket.on("member_updated", onMemberUpdated);
    socket.onAny(onAnyEvent);

    socket.auth = { token: socketAuthToken };
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
      socket.off("task_created", onTaskCreated);
      socket.off("task_updated", onTaskUpdated);
      socket.off("github_new_commits", onGithubNewCommits);
      socket.off("GITHUB_NEW_COMMIT", onGithubNewCommits);
      socket.off("github_new_commit", onGithubNewCommits);
      socket.off("jira_issue_updated", onJiraIssueUpdated);
      socket.off("JIRA_ISSUE_UPDATE", onJiraIssueUpdated);
      socket.off("jira_issue_update", onJiraIssueUpdated);
      socket.off("jiraIssueUpdated", onJiraIssueUpdated);
      socket.off("leaderboard_updated", onLeaderboardUpdated);
      socket.off("MEMBER_UPDATED", onMemberUpdated);
      socket.off("member_updated", onMemberUpdated);
      socket.offAny(onAnyEvent);
      socket.disconnect();
    };
  }, [token, queryClient]); // listener effect nên ổn định

  /**
   * Sau khi connect (hoặc khi đổi class/team/project trong session): join room để BE bắn
   * GITHUB_NEW_COMMITS / LEADERBOARD_UPDATED đúng client.
   * Nếu vẫn không thấy event: kiểm tra GitHub webhook → URL BE, và author commit khớp TeamMember (email/github_username).
   */
  useEffect(() => {
    if (!isConnected) return;

    if (userId) {
      socket.emit("join_user", userId);
      socket.emit("joinUser", userId);
    }
    if (activeClassId) {
      socket.emit("join_class", activeClassId);
      socket.emit("joinClass", activeClassId);
    }
    if (activeTeamId) {
      socket.emit("join_team", activeTeamId);
      socket.emit("joinTeam", activeTeamId);
    }
    const pid =
      Cookies.get("student_project_id") ||
      Cookies.get("lecturer_project_id") ||
      activeProjectId ||
      projectIdFromTeamDetail;
    if (pid) {
      const normalizedProjectId = String(pid).replace(/^project:/, "");
      socket.emit("join_project", normalizedProjectId);
      socket.emit("joinProject", normalizedProjectId);
    }
  }, [isConnected, userId, activeClassId, activeTeamId, activeProjectId, projectIdFromTeamDetail]);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
