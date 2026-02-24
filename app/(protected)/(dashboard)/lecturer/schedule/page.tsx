"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, Plus, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AgendaView } from "@/features/lecturer/components/schedule/agenda-view";
import { CalendarView } from "@/features/lecturer/components/schedule/calendar-view";
import { EventDialog } from "@/features/lecturer/components/schedule/event-dialog";
import { Card, CardContent } from "@/components/ui/card";

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [dialogDate, setDialogDate] = useState<Date | undefined>(undefined);

  const { data: schedules = [], isLoading } = useClassSchedules(classId);

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

  const handleCalendarAddClick = (date: Date) => {
    setDialogDate(date);
    setIsDialogOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    setViewDate(date);
  };

  const handleHeaderAddClick = () => {
    setDialogDate(new Date());
    setIsDialogOpen(true);
  };

  if (!classId) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 animate-in fade-in duration-500 font-sans">
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
          Vui lòng chọn lớp học để xem lịch trình.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 font-sans">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-xl shadow-orange-100 dark:shadow-none border border-orange-50 dark:border-slate-800 transition-colors">
          <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
        </div>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium animate-pulse">
          Đang tải lịch trình...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-20 font-sans p-4 md:p-8 max-w-[1600px] mx-auto transition-colors duration-300">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-8 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F27124] dark:text-orange-400 mb-2 bg-orange-50 dark:bg-orange-900/20 w-fit px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-900/30 transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Dashboard
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight transition-colors">
            Lịch trình & Công việc
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base transition-colors">
            Quản lý lịch giảng dạy, cuộc họp và các hạn chót quan trọng của lớp
            học.
          </p>
        </div>

        <Button
          onClick={handleHeaderAddClick}
          className="h-12 px-6 bg-[#F27124] hover:bg-[#d65d1b] dark:bg-orange-500 dark:hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-none rounded-xl font-bold transition-all active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Tạo Sự Kiện Mới
        </Button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CALENDAR (Chiếm 8 cột trên màn lớn) */}
        <div className="xl:col-span-8 shadow-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
          <CalendarView
            events={events}
            onAddClick={handleCalendarAddClick}
            onDateSelect={handleDateSelect}
            selectedDate={viewDate}
          />
        </div>

        {/* RIGHT COLUMN: SIDEBAR (Chiếm 4 cột trên màn lớn) */}
        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-4">
          <AgendaView events={events} date={viewDate} />

          {/* Legend */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors">
            <CardContent className="p-5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Chú thích sự kiện
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Giảng dạy
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Họp / Đánh giá
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <span className="w-3.5 h-3.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
