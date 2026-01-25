"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, MoreVertical, Clock } from "lucide-react";

interface DeadlineViewProps {
  events: any[];
}

export function DeadlineView({ events }: DeadlineViewProps) {
  // 1. Lọc ra các sự kiện Grading
  const gradingEvents = events.filter((e) => e.type === "Grading");

  // 2. Sắp xếp theo ngày tăng dần (để deadline gần nhất lên đầu)
  const sortedEvents = gradingEvents.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <Card className="border border-gray-200 shadow-sm h-full">
      <CardHeader className="pb-3 bg-red-50/50 border-b border-red-100">
        <CardTitle className="text-base text-red-700 flex items-center gap-2">
          <FileCheck className="h-4 w-4" /> Deadline Chấm Bài
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((ev) => {
            // 3. Xử lý hiển thị ngày tháng chuẩn từ chuỗi YYYY-MM-DD
            // split("-") an toàn hơn new Date() để tránh lệch múi giờ
            const [year, month, day] = ev.date.split("-");

            return (
              <div
                key={ev.id}
                className="group flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5">
                  {/* Block Ngày Tháng */}
                  <div className="flex flex-col items-center justify-center w-[52px] h-[52px] bg-red-50 text-red-600 rounded-xl border border-red-100 shrink-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider opacity-70 leading-none mb-0.5">
                      Thg {parseInt(month)}
                    </p>
                    <p className="text-xl font-black leading-none tracking-tight">
                      {day}
                    </p>
                  </div>

                  {/* Nội dung */}
                  <div className="space-y-1">
                    <p
                      className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors"
                      title={ev.title}
                    >
                      {ev.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>
                        Hạn chót:{" "}
                        <span className="text-red-600 font-bold">
                          {ev.time.split(" ")[0]}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <FileCheck className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              Không có deadline
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Bạn đã hoàn thành hết công việc chấm bài!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
