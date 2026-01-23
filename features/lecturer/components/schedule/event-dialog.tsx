"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Teams
const TEAMS = [
  { id: "t1", name: "Team 1: E-Commerce" },
  { id: "t2", name: "Team 2: LMS System" },
  { id: "t3", name: "Team 3: Grab Clone" },
];

interface EventDialogProps {
  onAddEvent: (event: any) => void;
}

export function EventDialog({ onAddEvent }: EventDialogProps) {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState("Meeting");
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    team: "",
    note: "",
  });

  const handleSave = () => {
    const title =
      eventType === "Meeting"
        ? `Meeting: ${newEvent.team}`
        : `Chấm bài: ${newEvent.title}`;
    const location = eventType === "Meeting" ? "Google Meet" : "System";

    onAddEvent({
      title,
      time: newEvent.time || "00:00",
      type: eventType,
      location,
      note: newEvent.note,
    });

    setOpen(false);
    setNewEvent({ title: "", time: "", team: "", note: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tạo Lịch Mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm sự kiện mới vào lịch</DialogTitle>
          <DialogDescription>
            Chọn loại sự kiện bạn muốn ghi chú.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="Meeting"
          onValueChange={setEventType}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="Meeting">Lịch Hẹn (Meeting)</TabsTrigger>
            <TabsTrigger value="Grading">Lịch Chấm (Grading)</TabsTrigger>
          </TabsList>

          <TabsContent value="Meeting" className="space-y-4">
            <div className="grid gap-2">
              <Label>Chọn Nhóm</Label>
              <Select
                onValueChange={(v) => setNewEvent({ ...newEvent, team: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm cần gặp" />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Ngày</Label>
                <Input type="date" />
              </div>
              <div className="grid gap-2">
                <Label>Giờ bắt đầu</Label>
                <Input
                  type="time"
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Hình thức</Label>
              <Select defaultValue="online">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online (Google Meet)</SelectItem>
                  <SelectItem value="offline">Offline (Tại trường)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="Grading" className="space-y-4">
            <div className="grid gap-2">
              <Label>Tiêu đề</Label>
              <Input
                placeholder="VD: Chấm Lab 3..."
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Deadline</Label>
                <Input type="date" />
              </div>
              <div className="grid gap-2">
                <Label>Giờ</Label>
                <Input
                  type="time"
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Ghi chú</Label>
              <Textarea placeholder="Note..." />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b]"
            onClick={handleSave}
          >
            Lưu vào Lịch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
