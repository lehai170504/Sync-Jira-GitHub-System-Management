"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, Video, Clock, MapPin } from "lucide-react";

interface AgendaViewProps {
  events: any[];
}

export function AgendaView({ events }: AgendaViewProps) {
  const todayEvents = events.filter((e) => e.date === "2026-01-22");

  return (
    <Card className="border-l-4 border-l-[#F27124] shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Hôm nay (22/01)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayEvents.length > 0 ? (
          todayEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex gap-3 items-start pb-3 border-b last:border-0 border-gray-100"
            >
              <div className="mt-1">
                {ev.type === "Teaching" ? (
                  <Users className="h-4 w-4 text-blue-500" />
                ) : ev.type === "Grading" ? (
                  <FileCheck className="h-4 w-4 text-red-500" />
                ) : (
                  <Video className="h-4 w-4 text-purple-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{ev.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {ev.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {ev.location}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            Không có lịch trình hôm nay.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
