"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  User,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Topic } from "./topic-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopicReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
}

export function TopicReviewDialog({
  open,
  onOpenChange,
  topic,
}: TopicReviewDialogProps) {
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset comment khi mở dialog mới
  useEffect(() => {
    if (open) setComment("");
  }, [open, topic]);

  if (!topic) return null;

  const isPending = topic.status === "Pending"; // Kiểm tra trạng thái

  const handleAction = async (action: "Approved" | "Rejected") => {
    if (action === "Rejected" && !comment.trim()) {
      toast.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    setIsProcessing(true);
    // Mock API Call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (action === "Approved") {
      toast.success(`Đã duyệt đề tài: ${topic.name}`);
    } else {
      toast.error(`Đã từ chối đề tài: ${topic.name}`);
    }

    setIsProcessing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isPending ? "Duyệt Đề tài" : "Chi tiết Đề tài"}
            {!isPending && (
              <Badge
                variant={
                  topic.status === "Approved" ? "default" : "destructive"
                }
                className="ml-2"
              >
                {topic.status === "Approved" ? "Đã duyệt" : "Đã từ chối"}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Xem xét chi tiết và đưa ra quyết định cho nhóm{" "}
            <strong className="text-gray-900">{topic.team}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* INFO CARD */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-900 text-lg leading-snug">
                  {topic.name}
                </h4>
                <Badge
                  variant="outline"
                  className="bg-white whitespace-nowrap ml-2"
                >
                  {topic.major}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" /> Ngày nộp: {topic.submittedDate}
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-3">
              {topic.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-white border px-2 py-1 rounded-md text-gray-500 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* MEMBERS & MENTOR */}
          <div className="grid grid-cols-2 gap-4">
            {/* Members */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Thành viên (
                {topic.members.length})
              </h5>
              <ul className="text-sm space-y-1 bg-white border rounded-lg p-2 max-h-[120px] overflow-y-auto">
                {topic.members.map((mem, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>{" "}
                    {mem}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mentor */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Mentor
              </h5>
              <div className="flex items-center gap-3 bg-white border rounded-lg p-2">
                <Avatar className="h-8 w-8 border border-gray-100">
                  <AvatarFallback className="bg-orange-50 text-[#F27124] text-xs font-bold">
                    {topic.mentor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {topic.mentor}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {topic.mentorEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COMMENT SECTION - Chỉ hiện khi Pending hoặc nếu có comment cũ (trong thực tế) */}
          {isPending && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-900">
                Nhận xét / Lý do (Bắt buộc nếu từ chối)
              </span>
              <Textarea
                placeholder="Nhập nhận xét của hội đồng chuyên môn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] rounded-xl resize-none focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
              />
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-gray-100">
          {isPending ? (
            <div className="flex w-full gap-3 sm:justify-end">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl h-11"
                onClick={() => handleAction("Rejected")}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Từ chối
              </Button>
              <Button
                className="flex-1 sm:flex-none bg-[#F27124] hover:bg-[#d65d1b] rounded-xl h-11 min-w-[140px] shadow-lg shadow-orange-500/20"
                onClick={() => handleAction("Approved")}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Phê duyệt
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-end">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-11 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Đóng
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
