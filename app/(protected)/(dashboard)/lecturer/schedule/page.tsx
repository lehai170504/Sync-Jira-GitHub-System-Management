"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, Plus, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import { AgendaView } from "@/features/lecturer/components/schedule/agenda-view";
import { CalendarView } from "@/features/lecturer/components/schedule/calendar-view";
import { EventDialog } from "@/features/lecturer/components/schedule/event-dialog";
import { Card, CardContent } from "@/components/ui/card";

// Hooks & Types
import { useClassSchedules } from "@/features/lecturer/hooks/use-schedules";
import {
  CalendarEvent,
  Schedule,
} from "@/features/lecturer/types/schedule-type";

const getSlotTime = (slot: number) => {
  const slots: Record<number, string> = {
    1: "07:30 - 09:00",
    2: "09:10 - 10:40",
    3: "10:50 - 12:20",
    4: "12:50 - 14:20",
    5: "14:30 - 16:00",
    6: "16:10 - 17:40",
  };
  return slots[slot] || "Tự do";
};

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("classId");
  const cookieClassId =
    typeof window !== "undefined"
      ? Cookies.get("lecturer_class_id")
      : undefined;

  const classId = urlClassId || cookieClassId;

  // --- State & Hooks ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State quản lý ngày đang được chọn để xem (Mặc định là hôm nay)
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // State quản lý ngày được chọn để thêm sự kiện (cho Dialog)
  const [dialogDate, setDialogDate] = useState<Date | undefined>(undefined);

  const { data: schedules = [], isLoading } = useClassSchedules(classId);

  // --- Data Transformation ---
  const events: CalendarEvent[] = schedules.map((s: Schedule) => {
    let type: "Teaching" | "Meeting" | "Grading" = "Teaching";
    const lowerTopic = s.topic?.toLowerCase() || "";
    if (
      lowerTopic.includes("chấm") ||
      lowerTopic.includes("hạn") ||
      lowerTopic.includes("deadline") ||
      lowerTopic.includes("lab")
    ) {
      type = "Grading";
    } else if (
      lowerTopic.includes("họp") ||
      lowerTopic.includes("meeting") ||
      lowerTopic.includes("review")
    ) {
      type = "Meeting";
    }
    return {
      id: s._id,
      title: s.topic || "Sự kiện",
      date: s.date.split("T")[0],
      time: getSlotTime(s.slot),
      type: type,
      location: s.room,
      note: s.note,
      status: s.status || "SCHEDULED",
    };
  });

  // --- Handlers ---

  // 1. Click vào nút "+" trên Calendar để thêm sự kiện
  const handleCalendarAddClick = (date: Date) => {
    setDialogDate(date);
    setIsDialogOpen(true);
  };

  // 2. Click vào ô ngày trên Calendar để xem chi tiết (Agenda)
  const handleDateSelect = (date: Date) => {
    setViewDate(date);
  };

  // 3. Click nút to ở Header để thêm sự kiện (Mặc định hôm nay)
  const handleHeaderAddClick = () => {
    setDialogDate(new Date());
    setIsDialogOpen(true);
  };

  if (!classId) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-sm font-medium">
          Vui lòng chọn lớp học để xem lịch trình.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="p-4 bg-white rounded-full shadow-xl shadow-orange-100 border border-orange-50">
          <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Đang tải lịch trình...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-20 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F27124] mb-1">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Dashboard
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
            Lịch trình & Công việc
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Quản lý lịch giảng dạy, cuộc họp và các hạn chót quan trọng.
          </p>
        </div>

        <Button
          onClick={handleHeaderAddClick}
          className="h-12 px-6 bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Tạo Sự Kiện Mới
        </Button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: CALENDAR */}
        <div className="xl:col-span-2 shadow-sm rounded-2xl overflow-hidden border border-slate-200">
          <CalendarView
            events={events}
            onAddClick={handleCalendarAddClick}
            onDateSelect={handleDateSelect}
            selectedDate={viewDate}
          />
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-6 xl:sticky xl:top-4">
          <AgendaView events={events} date={viewDate} />

          {/* Legend */}
          <Card className="border-none shadow-sm bg-slate-50">
            <CardContent className="p-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Chú thích loại sự kiện
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                  <span className="text-sm font-medium text-slate-700">
                    Giảng dạy (Teaching)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                  <span className="text-sm font-medium text-slate-700">
                    Họp / Meeting
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                  <span className="text-sm font-medium text-slate-700">
                    Deadline / Chấm bài
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DIALOG CONTROL */}
      <EventDialog
        classId={classId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultDate={dialogDate}
      />
    </div>
  );
}
