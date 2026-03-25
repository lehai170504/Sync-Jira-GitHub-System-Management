"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, SendHorizonal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useProfile } from "@/features/auth/hooks/use-profile";
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { useProjectChat } from "../hooks/use-project-chat";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

function pickReply(res: any): string {
  return (
    res?.reply ??
    res?.data?.reply ??
    res?.message ??
    "Mình chưa nhận được nội dung trả lời từ hệ thống."
  );
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="h-2 w-2 rounded-full bg-slate-400/70 dark:bg-slate-500/70 animate-bounce [animation-delay:-0.2s]" />
      <span className="h-2 w-2 rounded-full bg-slate-400/70 dark:bg-slate-500/70 animate-bounce [animation-delay:-0.1s]" />
      <span className="h-2 w-2 rounded-full bg-slate-400/70 dark:bg-slate-500/70 animate-bounce" />
    </div>
  );
}

export function AiChatWidget() {
  const token = Cookies.get("token");
  const searchParams = useSearchParams();

  const { data: profile } = useProfile();
  const role = profile?.user?.role;

  const classIdFromUrl = searchParams.get("classId") ?? "";
  const classIdFromCookie =
    Cookies.get("lecturer_class_id") || Cookies.get("student_class_id") || "";
  const classId = classIdFromUrl || classIdFromCookie;
  const classNameFromCookie = Cookies.get("student_class_name") || "";

  const { data: classDetails } = useClassDetails(classId || undefined);
  const className =
    classDetails?.class?.name || classNameFromCookie || classId || "—";

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: uid(),
      role: "assistant",
      content:
        "Chào bạn! Hỏi mình về tiến độ nhóm, commits, tasks Jira, hoặc yêu cầu tạo/sửa task. Mình sẽ tự dò ngữ cảnh theo lớp.",
      createdAt: Date.now(),
    },
  ]);

  const { mutateAsync, isPending } = useProjectChat();

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
    return () => window.clearTimeout(t);
  }, [open, messages.length, isPending]);

  const canChat = !!token && !!classId;
  const isCoolingDown = cooldownUntil != null && cooldownUntil > Date.now();
  const cooldownSeconds = isCoolingDown
    ? Math.max(1, Math.ceil((cooldownUntil - Date.now()) / 1000))
    : 0;

  const headerSubtitle = useMemo(() => {
    if (!token) return "Vui lòng đăng nhập để chat.";
    if (!classId) return "Chưa xác định lớp (thiếu classId).";
    return role === "LECTURER"
      ? "Omni-Agent • Ngữ cảnh: cả lớp"
      : "Omni-Agent • Ngữ cảnh: nhóm của bạn";
  }, [token, classId, role]);

  const send = async () => {
    const text = draft.trim();
    if (!text || isPending || isCoolingDown) return;

    if (!canChat) {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "user", content: text, createdAt: Date.now() },
        {
          id: uid(),
          role: "assistant",
          content:
            !token
              ? "Bạn cần đăng nhập để dùng Chatbot."
              : "Không tìm thấy classId. Hãy vào trang có `?classId=...` hoặc chọn lớp để hệ thống lưu cookie.",
          createdAt: Date.now(),
        },
      ]);
      setDraft("");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content: text, createdAt: Date.now() },
    ]);
    setDraft("");

    try {
      // NOTE: BE hiện tại có thể chỉ accept { classId, message }.
      // Khi BE support "gián điệp ngữ cảnh", mình sẽ bật gửi context lại.
      const res = await mutateAsync({ classId, message: text });
      const reply = pickReply(res);
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: reply, createdAt: Date.now() },
      ]);
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      const errorText =
        (typeof data?.error === "string" && data.error) ||
        (typeof data?.message === "string" && data.message) ||
        "";
      const isQuotaError =
        /Too Many Requests|quota exceeded|rate.?limit/i.test(errorText) ||
        /Too Many Requests|quota exceeded|rate.?limit/i.test(String(e?.message ?? ""));
      const retryMatch = errorText.match(/retry in\s+(\d+(?:\.\d+)?)s/i);
      const retrySeconds = retryMatch?.[1] ? Math.ceil(Number(retryMatch[1])) : null;
      const msg =
        isQuotaError
          ? `AI đang quá tải quota. Vui lòng thử lại sau ${retrySeconds ?? 60} giây.`
          : (typeof data?.message === "string" && data.message) ||
            (typeof data?.error === "string" && data.error) ||
            e?.message ||
            "Không thể gửi tin nhắn. Vui lòng thử lại.";
      const details =
        data != null
          ? typeof data === "string"
            ? data
            : (() => {
                try {
                  return JSON.stringify(data);
                } catch {
                  return String(data);
                }
              })()
          : null;
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: `**Lỗi:** ${msg}`, createdAt: Date.now() },
        ...(status || details
          ? ([
              {
                id: uid(),
                role: "assistant",
                content: `**Debug:** status=${status ?? "?"}${
                  details ? `, body=${details}` : ""
                }`,
                createdAt: Date.now(),
              },
            ] as ChatMsg[])
          : []),
      ]);

      if (isQuotaError) {
        const waitMs = (retrySeconds ?? 60) * 1000;
        setCooldownUntil(Date.now() + waitMs);
      }
    }
  };

  if (!token) return null;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <div className="fixed bottom-5 right-5 z-2147483647">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon-lg"
                className="rounded-full shadow-xl bg-slate-900 hover:bg-slate-950 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                onClick={() => setOpen(true)}
              >
                <Bot className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>
              <span className="text-xs">Chat với Omni-Agent</span>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-2147483647 w-[calc(100vw-2.5rem)] max-w-[420px]">
          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm text-slate-900 dark:text-slate-100 truncate">
                      AI Omni-Agent
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {headerSubtitle}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setOpen(false)}
                  className="rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-900/20">
              <div className="px-4 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    Lớp: {className}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    role: {role || "—"}
                  </Badge>
                  {!classId && (
                    <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-200">
                      Thiếu classId
                    </Badge>
                  )}
                </div>
              </div>

              <ScrollArea className="h-[420px] px-4 py-3">
                <div className="space-y-3">
                  {messages.map((m) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex",
                          isUser ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm border",
                            isUser
                              ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-slate-100"
                              : "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200/70 dark:border-slate-800",
                          )}
                        >
                          {m.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {m.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap wrap-break-word">
                              {m.content}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isPending && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200/70 dark:border-slate-800">
                        <TypingDots />
                      </div>
                    </div>
                  )}

                  <div ref={scrollAnchorRef} />
                </div>
              </ScrollArea>
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
              <div className="flex items-end gap-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    isCoolingDown
                      ? `AI đang quá tải, thử lại sau ${cooldownSeconds}s...`
                      : 'Ví dụ: "Tiến độ nhóm tao tới đâu rồi?" hoặc "Tạo cho tao task Fix Bug"...'
                  }
                  className="min-h-10 max-h-28 resize-none rounded-2xl"
                  disabled={isPending || isCoolingDown}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <Button
                  size="icon-lg"
                  className="rounded-2xl bg-[#F27124] hover:bg-[#d65d1b] text-white shrink-0"
                  onClick={send}
                  disabled={isPending || isCoolingDown || !draft.trim()}
                >
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Enter để gửi • Shift+Enter xuống dòng
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

