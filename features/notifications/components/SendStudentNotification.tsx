"use client";

import { useState } from "react";
import { Mail, Loader2, SendHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { sendStudentNotificationApi } from "@/features/notifications/api/notification-api";
import { toast } from "sonner";

interface SendStudentNotificationProps {
  student: {
    _id: string;
    full_name: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendStudentNotification({
  student,
  open,
  onOpenChange,
}: SendStudentNotificationProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const { mutate: sendNotification, isPending } = useMutation({
    mutationFn: sendStudentNotificationApi,
    onSuccess: () => {
      toast.success(`Đã gửi thông báo tới ${student.full_name}`);
      onOpenChange(false);
      setTitle("");
      setMessage("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể gửi thông báo");
    },
  });

  const handleSend = () => {
    if (!title || !message) return;
    sendNotification({ studentId: student._id, title, message });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" /> Nhắn tin cho sinh viên
          </DialogTitle>
          <DialogDescription>
            Gửi thông báo riêng đến <b>{student.full_name}</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400">
              Tiêu đề
            </Label>
            <Input
              placeholder="VD: Nhắc nhở nộp bài..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400">
              Nội dung
            </Label>
            <Textarea
              placeholder="Nhập nội dung tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl border-slate-200 min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSend}
            disabled={isPending || !title || !message}
            className="w-full bg-slate-900 hover:bg-black text-white rounded-xl font-bold"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendHorizontal className="w-4 h-4 mr-2" />
            )}
            Gửi tin nhắn riêng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
