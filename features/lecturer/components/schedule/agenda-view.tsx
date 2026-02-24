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
          "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
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
        accentLine: "bg-blue-500",
        iconBg:
          "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
        icon: Users,
      };
    case "Grading":
      return {
        accentLine: "bg-orange-500",
        iconBg:
          "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400",
        icon: FileCheck,
      };
    case "Meeting":
      return {
        accentLine: "bg-purple-500",
        iconBg:
          "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
        icon: Video,
      };
    default:
      return {
        accentLine: "bg-slate-400 dark:bg-slate-600",
        iconBg:
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
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
      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#F27124] dark:text-orange-400" />
            {isViewToday
              ? "Lịch hôm nay"
              : `Lịch ngày ${format(date, "dd/MM")}`}
          </CardTitle>
          <Badge
            variant="secondary"
            className="font-semibold text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm"
          >
            {format(date, "EEEE, dd/MM", { locale: vi })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-100 p-4 custom-scrollbar">
          <div className="space-y-4">
            {dailyEvents.length > 0 ? (
              dailyEvents.map((ev) => {
                const statusConfig = getStatusConfig(ev.status);
                const typeConfig = getTypeConfig(ev.type);
                const TypeIcon = typeConfig.icon;
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={ev.id}
                    className="group relative flex flex-col p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    {/* Đường kẻ Accent báo loại sự kiện bên trái */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${typeConfig.accentLine}`}
                    />

                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                        <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        {ev.time.split(" ")[0]}
                        <span className="text-slate-400 dark:text-slate-500 font-medium">
                          - {ev.time.split("-")[1]?.trim() || "..."}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 gap-1.5 border font-semibold tracking-wider uppercase ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${typeConfig.iconBg}`}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {ev.title}
                        </h4>
                        {ev.location && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {ev.note && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
                          Ghi chú: {ev.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800">
                  <Coffee className="h-8 w-8 text-slate-300 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Trống lịch!
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 px-4 leading-relaxed">
                    {isViewToday
                      ? "Hôm nay bạn không có lịch dạy hay deadline nào. Hãy tận hưởng thời gian nghỉ ngơi nhé!"
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
