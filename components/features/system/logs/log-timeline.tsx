"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { LogEntry, LogStatus } from "./log-types";

interface LogTimelineProps {
  logs: LogEntry[];
}

export function LogTimeline({ logs }: LogTimelineProps) {
  // Logic gom nhóm logs theo ngày
  const groupedLogs = logs.reduce(
    (acc, log) => {
      if (!acc[log.date]) acc[log.date] = [];
      acc[log.date].push(log);
      return acc;
    },
    {} as Record<string, LogEntry[]>,
  );

  // Helper: Style theo trạng thái
  const getStatusConfig = (status: LogStatus) => {
    switch (status) {
      case "Success":
        return {
          color: "text-green-600 bg-green-50",
          icon: CheckCircle2,
          border: "border-green-200",
        };
      case "Warning":
        return {
          color: "text-orange-600 bg-orange-50",
          icon: ShieldAlert,
          border: "border-orange-200",
        };
      case "Error":
        return {
          color: "text-red-600 bg-red-50",
          icon: AlertCircle,
          border: "border-red-200",
        };
      default:
        return {
          color: "text-blue-600 bg-blue-50",
          icon: Terminal,
          border: "border-blue-200",
        };
    }
  };

  return (
    <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm ring-1 ring-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dòng thời gian (Timeline)</CardTitle>
          <Badge variant="secondary" className="font-normal bg-gray-100">
            Hiển thị {logs.length} bản ghi
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white">
        <ScrollArea className="h-[600px] px-6 py-6">
          <div className="space-y-8 ml-2">
            {Object.keys(groupedLogs).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Không tìm thấy dữ liệu phù hợp.
              </div>
            ) : (
              Object.keys(groupedLogs).map((date) => (
                <div key={date} className="relative">
                  {/* Sticky Date Header */}
                  <div className="sticky top-0 z-10 bg-white pb-4 pt-2 mb-4 flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="px-3 py-1 bg-slate-100 text-slate-600 border-slate-200 font-medium text-sm rounded-md shadow-sm"
                    >
                      {date === "2024-02-20"
                        ? "Hôm nay, 20/02"
                        : date === "2024-02-19"
                          ? "Hôm qua, 19/02"
                          : date}
                    </Badge>
                    <div className="h-px bg-slate-100 flex-1"></div>
                  </div>

                  {/* List Items */}
                  <div className="border-l-2 border-slate-100 ml-4 space-y-6 pb-4">
                    {groupedLogs[date].map((log) => {
                      const config = getStatusConfig(log.status);
                      return (
                        <div key={log.id} className="relative pl-8 group">
                          {/* Dot */}
                          <div
                            className={`absolute -left-[9px] top-4 h-4 w-4 rounded-full border-2 bg-white transition-all group-hover:scale-110 ${config.color.split(" ")[0].replace("text", "border")}`}
                          ></div>

                          {/* Content Card */}
                          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#F27124]/30 hover:shadow-md transition-all cursor-default">
                            {/* Icon */}
                            <div
                              className={`p-3 rounded-xl h-fit ${config.color}`}
                            >
                              <config.icon className="h-5 w-5" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {log.action}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
                                  <Clock className="h-3 w-3" /> {log.timestamp}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {log.detail}
                              </p>
                              <div className="flex items-center gap-3 pt-2">
                                <Badge
                                  variant="secondary"
                                  className="rounded-md text-[10px] px-1.5 font-normal h-5 bg-slate-100 text-slate-600"
                                >
                                  User: {log.user}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="rounded-md text-[10px] px-1.5 font-normal h-5 text-slate-400 border-slate-200"
                                >
                                  IP: {log.ip}
                                </Badge>
                              </div>
                            </div>

                            {/* Desktop Timestamp */}
                            <div className="hidden sm:flex flex-col items-end justify-center min-w-[80px] border-l pl-4 border-slate-50">
                              <span className="text-lg font-bold text-gray-700 font-mono">
                                {log.timestamp}
                              </span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                Thời gian
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Pagination Footer */}
        <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Hiển thị {logs.length > 0 ? 1 : 0}-{logs.length} trong số 1248
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100"
            >
              1
            </Button>
            <Button variant="ghost" size="sm">
              2
            </Button>
            <Button variant="ghost" size="sm">
              ...
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 text-[#F27124] hover:text-[#d65d1b]"
            >
              Tiếp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
