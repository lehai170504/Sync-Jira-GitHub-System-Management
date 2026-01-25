"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSchedule } from "@/features/lecturer/hooks/use-schedules";
import { format } from "date-fns";

interface EventDialogProps {
  classId?: string;
  // 👇 THÊM PROPS NÀY ĐỂ ĐIỀU KHIỂN TỪ BÊN NGOÀI
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultDate?: Date;
}

export function EventDialog({
  classId,
  open,
  onOpenChange,
  defaultDate,
}: EventDialogProps) {
  // Logic: Nếu có props 'open' truyền vào thì dùng nó, không thì dùng state nội bộ
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const { mutate: createSchedule, isPending } = useCreateSchedule();

  const [formData, setFormData] = useState({
    date: "",
    slot: "1",
    room: "",
    topic: "",
    content: "",
    note: "",
  });

  // 👇 TỰ ĐỘNG ĐIỀN NGÀY KHI MỞ DIALOG
  useEffect(() => {
    if (isOpen && defaultDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(defaultDate, "yyyy-MM-dd"),
      }));
    } else if (isOpen && !formData.date) {
      // Nếu mở mà chưa có ngày, set ngày hôm nay
      setFormData((prev) => ({
        ...prev,
        date: format(new Date(), "yyyy-MM-dd"),
      }));
    }
  }, [isOpen, defaultDate]);

  const handleSave = () => {
    if (!classId) return;

    createSchedule(
      {
        classId,
        date: formData.date,
        slot: parseInt(formData.slot),
        room: formData.room,
        topic: formData.topic,
        content: formData.content || "Nội dung buổi học",
        note: formData.note,
      },
      {
        onSuccess: () => {
          setIsOpen?.(false); // Đóng dialog
          setFormData({
            date: "",
            slot: "1",
            room: "",
            topic: "",
            content: "",
            note: "",
          });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Chỉ hiện nút Trigger nếu KHÔNG ĐƯỢC điều khiển từ ngoài (để dùng cho nút Header) */}
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
            <Plus className="mr-2 h-4 w-4" /> Tạo Lịch Dạy
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm lịch giảng dạy mới</DialogTitle>
          <DialogDescription>
            Tạo lịch dạy (Teaching Schedule) cho lớp học hiện tại.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* ... (GIỮ NGUYÊN CODE FORM INPUT NHƯ CŨ) ... */}
          {/* Để gọn code tôi không paste lại phần Input, bạn giữ nguyên phần Input nhé */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Ngày dạy</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Ca học (Slot)</Label>
              <Select
                value={formData.slot}
                onValueChange={(v) => setFormData({ ...formData, slot: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Slot 1 (07:30 - 09:00)</SelectItem>
                  <SelectItem value="2">Slot 2 (09:10 - 10:40)</SelectItem>
                  <SelectItem value="3">Slot 3 (10:50 - 12:20)</SelectItem>
                  <SelectItem value="4">Slot 4 (12:50 - 14:20)</SelectItem>
                  <SelectItem value="5">Slot 5 (14:30 - 16:00)</SelectItem>
                  <SelectItem value="6">Slot 6 (16:10 - 17:40)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Phòng học (Room)</Label>
            <Input
              placeholder="VD: BE-401, Online..."
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Chủ đề (Topic)</Label>
            <Input
              placeholder="VD: Bài 1 - Giới thiệu React..."
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Nội dung (Content)</Label>
            <Textarea
              placeholder="Mô tả nội dung buổi học..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Ghi chú (Note)</Label>
            <Input
              placeholder="Ghi chú thêm (tùy chọn)..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen?.(false)}>
            Hủy
          </Button>
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b]"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu lịch học
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
