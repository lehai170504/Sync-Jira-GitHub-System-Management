"use client";

import { Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SendClassNotification } from "@/features/notifications/components/SendClassNotification";

interface LecturerBroadcastProps {
  classId: string;
  className: string;
}

export function LecturerBroadcast({ classId, className }: LecturerBroadcastProps) {
  return (
    <Card className="lg:col-span-4 border-none shadow-2xl shadow-orange-600/20 dark:shadow-none bg-[#F27124] dark:bg-[#c05615] rounded-[32px] overflow-hidden relative group transition-colors duration-300">
      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
        <Clock className="w-48 h-48 text-white" />
      </div>
      <CardHeader className="relative z-10 px-8 pt-8">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
          <TrendingUp className="h-6 w-6" /> Broadcast Center
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-8 p-8 pt-4">
        <div className="p-7 bg-white/15 backdrop-blur-md rounded-[28px] border border-white/20 shadow-inner">
          <p className="text-base text-orange-50 leading-relaxed font-bold mb-8">
            Nhìn thấy danh sách báo động đỏ? Nhắc nhở lớp học ngay bây giờ qua thông báo đẩy!
          </p>
          <div className="w-full transition-transform hover:-translate-y-1">
            <SendClassNotification classId={classId} className={className} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 bg-black/10 dark:bg-black/20 py-3 rounded-2xl border border-white/5">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
          <span className="text-[10px] font-semibold text-orange-50 uppercase tracking-[0.2em]">
            FCM System Online
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
