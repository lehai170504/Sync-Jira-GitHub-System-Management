"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, CheckCircle2, Gavel } from "lucide-react";
import { CouncilSession } from "./council-types";

export function CouncilStats({ data }: { data: CouncilSession[] }) {
  const total = data.length;
  const upcoming = data.filter((c) => c.status === "Upcoming").length;
  const completed = data.filter((c) => c.status === "Completed").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm border-l-4 border-l-[#F27124]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng Hội đồng
            </p>
            <h3 className="text-2xl font-bold">{total}</h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F27124]">
            <Gavel className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Sắp diễn ra
            </p>
            <h3 className="text-2xl font-bold text-blue-600">{upcoming}</h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <CalendarClock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Đã hoàn thành
            </p>
            <h3 className="text-2xl font-bold text-green-600">{completed}</h3>
          </div>
          <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
