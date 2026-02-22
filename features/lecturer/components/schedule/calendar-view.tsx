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
    <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden transition-colors">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <CalendarDays className="h-5 w-5 text-[#F27124]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize leading-none">
              {format(currentMonth, "MMMM", { locale: vi })}
            </h2>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
              Năm {format(currentMonth, "yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-medium border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#F27124] dark:hover:text-[#F27124] hover:border-orange-200 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
            onClick={jumpToToday}
          >
            Hôm nay
          </Button>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
          {["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"].map((d) => (
            <div key={d} className="py-3 uppercase tracking-wider text-[10px]">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr min-h-[500px] bg-slate-50/30 dark:bg-slate-900/50">
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
                className={`group relative flex flex-col border-b border-r border-slate-100 dark:border-slate-800 p-2 transition-all duration-200 min-h-[100px] cursor-pointer
                  ${!isCurrentMonth ? "bg-slate-50/50 dark:bg-slate-950/50 text-slate-300 dark:text-slate-600" : "bg-white dark:bg-slate-900 hover:bg-orange-50/10 dark:hover:bg-slate-800"} 
                  ${isDayToday ? "bg-orange-50/20 dark:bg-orange-900/10" : ""}
                  ${isSelected ? "ring-2 ring-inset ring-[#F27124]/50 z-10" : ""}
                `}
              >
                {/* Header Ngày */}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all
                    ${
                      isDayToday
                        ? "bg-[#F27124] text-white shadow-md shadow-orange-200 dark:shadow-none"
                        : isSelected
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                          : isCurrentMonth
                            ? "text-slate-700 dark:text-slate-300 group-hover:text-[#F27124]"
                            : "text-slate-300 dark:text-slate-600"
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
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-100 dark:hover:bg-slate-700 text-orange-500 dark:text-orange-400 transition-all transform hover:scale-110"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Danh sách sự kiện Compact */}
                <div className="flex-1 flex flex-col gap-1.5 mt-1">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[10px] px-1.5 py-1 rounded-md truncate font-medium border transition-all hover:shadow-sm
                      ${
                        ev.type === "Teaching"
                          ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50"
                          : ev.type === "Grading"
                            ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50"
                            : "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/50"
                      }`}
                      title={`${ev.time} - ${ev.title}`}
                    >
                      <span className="opacity-70 mr-1 font-normal">
                        {ev.time.split(" ")[0]}
                      </span>
                      {ev.title}
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 pl-1">
                      +{dayEvents.length - 3} khác
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
