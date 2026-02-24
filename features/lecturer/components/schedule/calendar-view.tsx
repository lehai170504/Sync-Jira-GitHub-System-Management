"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import { CalendarEvent } from "../../types/schedule-type";

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddClick: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export function CalendarView({
  events,
  onAddClick,
  onDateSelect,
  selectedDate,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const jumpToToday = () => {
    const now = new Date();
    setCurrentMonth(now);
    onDateSelect(now);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden font-sans transition-colors">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 capitalize leading-none tracking-tight">
              Tháng {format(currentMonth, "M, yyyy")}
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-widest">
              Lịch biểu giảng dạy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 text-xs font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors rounded-xl"
            onClick={jumpToToday}
          >
            Hôm nay
          </Button>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          {["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"].map((d) => (
            <div
              key={d}
              className="py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr min-h-150 bg-slate-100/50 dark:bg-slate-950/50 gap-px border-b border-slate-100 dark:border-slate-800">
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);
            const isSelected = selectedDate
              ? isSameDay(day, selectedDate)
              : false;

            const dayEvents = events.filter((ev) =>
              isSameDay(parseISO(ev.date), day),
            );

            return (
              <div
                key={day.toString()}
                onClick={() => onDateSelect(day)}
                className={`group relative flex flex-col p-2 transition-all duration-200 cursor-pointer overflow-hidden
                  ${!isCurrentMonth ? "bg-slate-50/50 dark:bg-slate-900/30" : "bg-white dark:bg-slate-900"} 
                  ${isDayToday ? "bg-orange-50/30 dark:bg-orange-900/10" : ""}
                  ${isSelected ? "ring-2 ring-inset ring-blue-500 dark:ring-blue-400 z-10" : "hover:bg-slate-50 dark:hover:bg-slate-800"}
                `}
              >
                {/* Header Ngày */}
                <div className="flex justify-between items-center mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all
                    ${
                      isDayToday
                        ? "bg-blue-600 text-white shadow-md dark:shadow-none"
                        : isSelected
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                          : isCurrentMonth
                            ? "text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Nút thêm nhanh */}
                  {isCurrentMonth && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddClick(day);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 text-slate-500 transition-all transform hover:scale-105"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Danh sách sự kiện Compact */}
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-0.5">
                  {dayEvents.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[10px] px-1.5 py-1 rounded truncate font-medium border-l-2 transition-all
                      ${
                        ev.type === "Teaching"
                          ? "bg-blue-50/50 text-blue-700 border-l-blue-500 dark:bg-blue-900/20 dark:text-blue-300"
                          : ev.type === "Grading"
                            ? "bg-orange-50/50 text-orange-700 border-l-orange-500 dark:bg-orange-900/20 dark:text-orange-300"
                            : "bg-purple-50/50 text-purple-700 border-l-purple-500 dark:bg-purple-900/20 dark:text-purple-300"
                      }`}
                      title={`${ev.time} - ${ev.title}`}
                    >
                      <span className="opacity-70 mr-1 font-semibold">
                        {ev.time.split(" ")[0]}
                      </span>
                      {ev.title}
                    </div>
                  ))}

                  {dayEvents.length > 4 && (
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 pl-1 mt-0.5 uppercase">
                      +{dayEvents.length - 4} sự kiện
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
