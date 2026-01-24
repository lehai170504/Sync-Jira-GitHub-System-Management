"use client";

import { useState } from "react";
import { Megaphone, Loader2, SendHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSendClassNotification } from "@/features/notifications/hooks/use-notifications";

export function SendClassNotification({
  classId,
  className,
}: {
  classId: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const { mutate: sendNotification, isPending } = useSendClassNotification();

  const handleSend = () => {
    if (!title || !message) return;

    sendNotification(
      { classId, title, message },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setMessage("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
          <Megaphone className="w-4 h-4" />
          Gửi thông báo lớp
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            Gửi thông báo cho {className}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Thông báo sẽ được gửi trực tiếp đến trình duyệt của toàn bộ sinh
            viên trong lớp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-400 tracking-widest">
              Tiêu đề
            </Label>
            <Input
              placeholder="VD: Nhắc nhở nộp bài tập..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-200 h-12 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-400 tracking-widest">
              Nội dung
            </Label>
            <Textarea
              placeholder="Nhập nội dung thông báo chi tiết tại đây..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl border-slate-200 min-h-[120px] focus:ring-blue-500/20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSend}
            disabled={isPending || !title || !message}
            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase gap-2 transition-all active:scale-[0.98]"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SendHorizontal className="w-5 h-5" />
            )}
            Xác nhận gửi thông báo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
