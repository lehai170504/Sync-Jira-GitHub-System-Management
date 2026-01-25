"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; // Nếu chưa có component này thì dùng div overflow-auto
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
import { format, isSameDay, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface AgendaViewProps {
  events: any[];
}

// 1. Helper Config cho Trạng thái (Status)
const getStatusConfig = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return {
        color: "text-green-600 bg-green-50 border-green-200",
        icon: CheckCircle2,
        label: "Đã xong",
      };
    case "CANCELLED":
      return {
        color: "text-red-600 bg-red-50 border-red-200",
        icon: XCircle,
        label: "Đã hủy",
      };
    case "SCHEDULED":
    default:
      return {
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: CircleDashed,
        label: "Sắp tới",
      };
  }
};

// 2. Helper Config cho Loại sự kiện (Type) - Để tô màu nền card
const getTypeConfig = (type: string) => {
  switch (type) {
    case "Teaching":
      return {
        bg: "bg-blue-50/50 hover:bg-blue-50",
        iconBg: "bg-blue-100 text-blue-600",
        icon: Users,
      };
    case "Grading":
      return {
        bg: "bg-red-50/50 hover:bg-red-50",
        iconBg: "bg-red-100 text-red-600",
        icon: FileCheck,
      };
    case "Meeting":
      return {
        bg: "bg-purple-50/50 hover:bg-purple-50",
        iconBg: "bg-purple-100 text-purple-600",
        icon: Video,
      };
    default:
      return {
        bg: "bg-gray-50/50 hover:bg-gray-50",
        iconBg: "bg-gray-100 text-gray-600",
        icon: CalendarDays,
      };
  }
};

export function AgendaView({ events }: AgendaViewProps) {
  const today = new Date();
  const todayEvents = events.filter((e) => isSameDay(parseISO(e.date), today));

  // Sắp xếp sự kiện theo giờ
  todayEvents.sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Card className="border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden bg-white">
      {/* HEADER */}
      <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#F27124]" />
            Lịch hôm nay
          </CardTitle>
          <Badge
            variant="secondary"
            className="font-normal text-xs bg-white border border-slate-200 text-slate-600"
          >
            {format(today, "EEEE, dd/MM", { locale: vi })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {/* ScrollArea giúp danh sách dài không phá vỡ layout */}
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-3">
            {todayEvents.length > 0 ? (
              todayEvents.map((ev) => {
                const statusConfig = getStatusConfig(ev.status);
                const typeConfig = getTypeConfig(ev.type);
                const TypeIcon = typeConfig.icon;
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={ev.id}
                    className={`group relative flex flex-col gap-2 p-3 rounded-xl border border-slate-100 transition-all duration-300 ${typeConfig.bg}`}
                  >
                    {/* Hàng 1: Thời gian & Trạng thái */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/80 px-2 py-1 rounded-md shadow-sm border border-slate-100">
                        <Clock className="h-3 w-3 text-[#F27124]" />
                        {ev.time.split(" ")[0]}{" "}
                        {/* Chỉ lấy giờ bắt đầu cho gọn */}
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

                    {/* Hàng 2: Nội dung chính */}
                    <div className="flex gap-3 items-start mt-1">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${typeConfig.iconBg}`}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#F27124] transition-colors">
                          {ev.title}
                        </h4>

                        {/* Địa điểm */}
                        {ev.location && (
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hàng 3: Note (nếu có) */}
                    {ev.note && (
                      <div className="mt-1 pt-2 border-t border-slate-200/60">
                        <p className="text-[10px] text-slate-500 italic line-clamp-1">
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
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                  <Coffee className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Trống lịch!
                  </p>
                  <p className="text-xs text-slate-500 mt-1 px-4">
                    Hôm nay bạn không có lịch dạy hay deadline nào. Hãy tận
                    hưởng ngày nghỉ nhé! ☕
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
