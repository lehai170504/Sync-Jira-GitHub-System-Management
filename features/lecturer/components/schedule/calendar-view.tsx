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
}

export function CalendarView({ events, onAddClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const jumpToToday = () => setCurrentMonth(new Date());

  return (
    <Card className="lg:col-span-2 border border-slate-200 shadow-sm h-full flex flex-col bg-white overflow-hidden">
      {/* HEADER HIỆN ĐẠI */}
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <CalendarDays className="h-5 w-5 text-[#F27124]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 capitalize leading-none">
              {format(currentMonth, "MMMM", { locale: vi })}
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Năm {format(currentMonth, "yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-medium border-slate-200 text-slate-600 hover:text-[#F27124] hover:border-orange-200 hover:bg-orange-50"
            onClick={jumpToToday}
          >
            Hôm nay
          </Button>
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-white hover:shadow-sm text-slate-500"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-white hover:shadow-sm text-slate-500"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 border-b border-slate-100">
          {["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"].map((d) => (
            <div key={d} className="py-3 uppercase tracking-wider text-[10px]">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr min-h-[500px] bg-slate-50/30">
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);
            const dayEvents = events.filter((ev) =>
              isSameDay(parseISO(ev.date), day),
            );

            return (
              <div
                key={day.toString()}
                className={`group relative flex flex-col border-b border-r border-slate-100 p-2 transition-all duration-200 min-h-[100px]
                  ${!isCurrentMonth ? "bg-slate-50/50" : "bg-white hover:bg-orange-50/10"} 
                  ${isDayToday ? "bg-orange-50/20" : ""}`}
              >
                {/* Header Ngày */}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all
                    ${
                      isDayToday
                        ? "bg-[#F27124] text-white shadow-md shadow-orange-200"
                        : isCurrentMonth
                          ? "text-slate-700 group-hover:text-[#F27124]"
                          : "text-slate-300"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Nút thêm nhanh (chỉ hiện khi hover) */}
                  {isCurrentMonth && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddClick(day);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-100 text-orange-500 transition-all transform hover:scale-110"
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
                      className={`text-[10px] px-1.5 py-1 rounded-md truncate font-medium cursor-pointer border transition-all hover:shadow-sm
                      ${
                        ev.type === "Teaching"
                          ? "bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300"
                          : ev.type === "Grading"
                            ? "bg-red-50 text-red-700 border-red-100 hover:border-red-300"
                            : "bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300"
                      }`}
                      title={`${ev.time} - ${ev.title}`}
                    >
                      <span className="opacity-70 mr-1 font-normal">
                        {ev.time.split(" ")[0]}
                      </span>
                      {ev.title}
                    </div>
                  ))}

                  {/* Indicator xem thêm */}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] font-medium text-slate-400 pl-1 hover:text-slate-600 cursor-pointer">
                      +{dayEvents.length - 3} sự kiện khác
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
