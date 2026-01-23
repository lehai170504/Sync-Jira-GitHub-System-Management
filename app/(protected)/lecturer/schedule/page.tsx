"use client";

import { AgendaView } from "@/components/features/lecturer/schedule/agenda-view";
import { CalendarView } from "@/components/features/lecturer/schedule/calendar-view";
import { DeadlineView } from "@/components/features/lecturer/schedule/deadline-view";
import { EventDialog } from "@/components/features/lecturer/schedule/event-dialog";
import { useState } from "react";

// INITIAL DATA
const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Dạy lớp SE1783",
    date: "2026-01-22",
    time: "07:30 - 09:00",
    type: "Teaching",
    location: "BE-401",
  },
  {
    id: 2,
    title: "Dạy lớp SE1783",
    date: "2026-01-22",
    time: "09:10 - 10:40",
    type: "Teaching",
    location: "BE-401",
  },
  {
    id: 3,
    title: "Hạn chấm Lab 1",
    date: "2026-01-23",
    time: "23:59",
    type: "Grading",
    location: "Hệ thống",
  },
  {
    id: 4,
    title: "Review Team 1 (E-Com)",
    date: "2026-01-24",
    time: "14:00 - 15:00",
    type: "Meeting",
    location: "Google Meet",
  },
];

export default function SchedulePage() {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  // Callback thêm sự kiện từ Dialog
  const handleAddEvent = (newEvent: any) => {
    const eventToAdd = {
      id: events.length + 1,
      ...newEvent,
      date: new Date().toISOString().split("T")[0], // Demo lấy ngày hôm nay
    };
    setEvents([...events, eventToAdd]);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lịch trình & Công việc
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý lịch giảng dạy, hẹn gặp nhóm và hạn chấm bài
          </p>
        </div>
        <EventDialog onAddEvent={handleAddEvent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CALENDAR (Left - 2 Cols) */}
        <CalendarView events={events} onAddClick={() => {}} />

        {/* SIDEBAR (Right - 1 Col) */}
        <div className="space-y-6">
          <AgendaView events={events} />
          <DeadlineView events={events} />

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Giảng
              dạy
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Họp
              nhóm
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Chấm bài
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
