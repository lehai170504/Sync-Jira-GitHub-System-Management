"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, MoreVertical } from "lucide-react";

interface DeadlineViewProps {
  events: any[];
}

export function DeadlineView({ events }: DeadlineViewProps) {
  const gradingEvents = events.filter((e) => e.type === "Grading");

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2 bg-red-50/50 border-b border-red-100">
        <CardTitle className="text-base text-red-700 flex items-center gap-2">
          <FileCheck className="h-4 w-4" /> Deadline Chấm Bài
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {gradingEvents.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="text-center px-2 py-1 bg-gray-100 rounded">
                <p className="text-[10px] text-gray-500 uppercase">Tháng 1</p>
                <p className="text-lg font-bold text-gray-900 leading-none">
                  {ev.date.split("-")[2]}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                {ev.title}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
