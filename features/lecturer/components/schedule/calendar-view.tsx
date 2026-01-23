"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarViewProps {
  events: any[];
  onAddClick: () => void; // Callback để mở dialog từ nút plus nhỏ (nếu cần)
}

export function CalendarView({ events }: CalendarViewProps) {
  return (
    <Card className="lg:col-span-2 border border-gray-200 shadow-sm h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Tháng 1, 2026</h2>
          <div className="flex items-center rounded-md border border-gray-200 bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none border-r"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-100 text-gray-900 border-0"
          >
            Hôm nay
          </Button>
          <Select defaultValue="month">
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Tháng</SelectItem>
              <SelectItem value="week">Tuần</SelectItem>
              <SelectItem value="day">Ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
            <div
              key={d}
              className="py-3 border-r last:border-r-0 border-gray-200"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px] text-sm">
          {[...Array(3)].map((_, i) => (
            <div
              key={`prev-${i}`}
              className="border-b border-r bg-gray-50/30 p-2 text-gray-300"
            >
              {29 + i}
            </div>
          ))}
          {[...Array(31)].map((_, i) => {
            const day = i + 1;
            const dateStr = `2026-01-${day.toString().padStart(2, "0")}`;
            const dayEvents = events.filter((e) => e.date === dateStr);
            const isToday = day === 22;

            return (
              <div
                key={day}
                className={`border-b border-r p-2 transition-colors hover:bg-gray-50 relative group ${
                  isToday ? "bg-blue-50/30" : ""
                }`}
              >
                <span
                  className={`font-medium ${
                    isToday
                      ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-2 space-y-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[10px] px-1.5 py-1 rounded border truncate cursor-pointer hover:opacity-80 font-medium
                      ${
                        ev.type === "Teaching"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : ev.type === "Grading"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-purple-100 text-purple-700 border-purple-200"
                      }`}
                    >
                      {ev.time.split(" ")[0]} {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
