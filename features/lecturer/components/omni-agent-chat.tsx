"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { sendClassChatApi } from "@/features/lecturer/api/ai-api";
import { toast } from "sonner";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function OmniAgentChat({ classId }: { classId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Chào Giảng viên! Thầy/Cô muốn kiểm tra tiến độ, xem báo cáo hay nhắc nhở nhóm nào trong lớp hôm nay ạ?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMsg = message;
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      // Gọi API gửi tin nhắn (Tự kèm classId theo role Giảng viên)
      const res = await sendClassChatApi(classId, userMsg);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.reply || res.message },
      ]);
    } catch (error) {
      toast.error("AI đang bận, vui lòng thử lại sau!");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Xin lỗi, kết nối đến hệ thống AI bị gián đoạn. Thầy/Cô thử lại nhé!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Nút Bong Bóng nổi */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
            isOpen
              ? "bg-slate-800 hover:bg-slate-700 rotate-90"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">
                AI Assistant (Lecturer)
              </h3>
              <p className="text-[10px] text-blue-100 mt-1">
                Đang giám sát lớp học
              </p>
            </div>
          </div>

          {/* Body Chat */}
          <div
            className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50"
            ref={scrollRef}
          >
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <Avatar className="w-8 h-8 shrink-0 border border-slate-200 shadow-sm">
                    {msg.role === "ai" ? (
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-50"
                    )}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {/* Hiệu ứng Đang gõ... (3 chấm) */}
              {isTyping && (
                <div className="flex gap-2 max-w-[85%]">
                  <Avatar className="w-8 h-8 shrink-0 border border-slate-200 shadow-sm">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 w-fit">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-center">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Hỏi AI về tiến độ lớp học..."
              className="border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 rounded-xl"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl shrink-0 px-3"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
