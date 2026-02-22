"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  FileCheck,
  Video,
  Clock,
  MapPin,
  CheckCircle2,
  CircleDashed,
  XCircle,
  Coffee,
  CalendarDays,
} from "lucide-react";
import { format, isSameDay, parseISO, isToday } from "date-fns";
import { vi } from "date-fns/locale";

interface AgendaViewProps {
  events: any[];
  date: Date;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return {
        color:
          "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
        icon: CheckCircle2,
        label: "Đã xong",
      };
    case "CANCELLED":
      return {
        color:
          "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        icon: XCircle,
        label: "Đã hủy",
      };
    case "SCHEDULED":
    default:
      return {
        color:
          "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        icon: CircleDashed,
        label: "Sắp tới",
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "Teaching":
      return {
        bg: "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",
        iconBg:
          "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
        icon: Users,
      };
    case "Grading":
      return {
        bg: "bg-red-50/50 hover:bg-red-50 dark:bg-red-900/10 dark:hover:bg-red-900/20 border-red-100 dark:border-red-900/30",
        iconBg: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
        icon: FileCheck,
      };
    case "Meeting":
      return {
        bg: "bg-purple-50/50 hover:bg-purple-50 dark:bg-purple-900/10 dark:hover:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",
        iconBg:
          "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
        icon: Video,
      };
    default:
      return {
        bg: "bg-gray-50/50 hover:bg-gray-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-700",
        iconBg:
          "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400",
        icon: CalendarDays,
      };
  }
};

export function AgendaView({ events, date }: AgendaViewProps) {
  const dailyEvents = events.filter((e) => isSameDay(parseISO(e.date), date));
  dailyEvents.sort((a, b) => a.time.localeCompare(b.time));
  const isViewToday = isToday(date);

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#F27124]" />
            {isViewToday
              ? "Lịch hôm nay"
              : `Lịch ngày ${format(date, "dd/MM")}`}
          </CardTitle>
          <Badge
            variant="secondary"
            className="font-normal text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
          >
            {format(date, "EEEE, dd/MM", { locale: vi })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-3">
            {dailyEvents.length > 0 ? (
              dailyEvents.map((ev) => {
                const statusConfig = getStatusConfig(ev.status);
                const typeConfig = getTypeConfig(ev.type);
                const TypeIcon = typeConfig.icon;
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={ev.id}
                    className={`group relative flex flex-col gap-2 p-3 rounded-xl border transition-all duration-300 ${typeConfig.bg}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-800">
                        <Clock className="h-3 w-3 text-[#F27124]" />
                        {ev.time.split(" ")[0]}
                        <span className="text-slate-400 font-normal ml-1">
                          - {ev.time.split("-")[1]?.trim() || "..."}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-5 gap-1 border ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="flex gap-3 items-start mt-1">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${typeConfig.iconBg}`}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-[#F27124] dark:group-hover:text-orange-400 transition-colors">
                          {ev.title}
                        </h4>
                        {ev.location && (
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {ev.note && (
                      <div className="mt-1 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                          Note: {ev.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/10 rounded-full flex items-center justify-center">
                  <Coffee className="h-8 w-8 text-orange-400 dark:text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Trống lịch!
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 px-4">
                    {isViewToday
                      ? "Hôm nay bạn không có lịch dạy hay deadline nào. Hãy tận hưởng ngày nghỉ nhé! ☕"
                      : "Ngày này không có lịch trình nào được ghi nhận."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
