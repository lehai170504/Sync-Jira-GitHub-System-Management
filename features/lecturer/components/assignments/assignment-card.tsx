"use client";

import { useRouter } from "next/navigation";
import {
  CalendarClock, // Icon cho Deadline
  CalendarPlus, // Icon cho Ngày tạo
  ArrowRight,
  MoreHorizontal,
  Users,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Assignment } from "@/features/lecturer/types/assignment-types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const router = useRouter();

  // Mock data tiến độ
  const submitted = assignment.submittedCount || 0;
  const total = assignment.totalStudent || 30;
  const progress = (submitted / total) * 100;

  // Tính trạng thái
  const isExpired = new Date(assignment.deadline) < new Date();
  const status = isExpired ? "Closed" : "Open";

  return (
    <Card
      onClick={() => router.push(`/lecturer/assignments/${assignment._id}`)}
      className="group flex flex-col justify-between border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-orange-200 transition-all duration-300 rounded-[20px] cursor-pointer overflow-hidden h-full"
    >
      <CardContent className="p-5 flex flex-col h-full">
        {/* --- HEADER: Badges & Action --- */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            {/* Loại bài tập */}
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg"
            >
              {assignment.type}
            </Badge>

            {/* Trạng thái (Open/Closed) */}
            <Badge
              variant="outline"
              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border
                ${
                  status === "Open"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
            >
              {status === "Open" ? "Đang mở" : "Đã đóng"}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-300 hover:text-slate-600 -mr-2"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn click vào card
              // Xử lý menu ở đây
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* --- BODY: Title & Desc --- */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-slate-800 leading-snug mb-1.5 line-clamp-2 group-hover:text-[#F27124] transition-colors">
            {assignment.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 h-10 font-medium">
            {assignment.description ||
              "Không có mô tả chi tiết cho bài tập này."}
          </p>
        </div>

        {/* --- META INFO: Dates --- */}
        <div className="mt-auto space-y-3">
          {/* Grid hiển thị Ngày tạo & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ngày tạo */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <CalendarPlus className="h-3 w-3" /> Ngày tạo
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {format(
                  new Date(assignment.created_at || Date.now()),
                  "dd/MM/yyyy",
                  { locale: vi },
                )}
              </span>
            </div>

            {/* Deadline */}
            <div
              className={`flex flex-col gap-1 p-2.5 rounded-xl border
              ${status === "Open" ? "bg-orange-50/50 border-orange-100" : "bg-slate-50/80 border-slate-100"}`}
            >
              <span
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide
                ${status === "Open" ? "text-orange-500" : "text-slate-400"}`}
              >
                <CalendarClock className="h-3 w-3" /> Hạn nộp
              </span>
              <span
                className={`text-xs font-semibold ${status === "Open" ? "text-orange-700" : "text-slate-700"}`}
              >
                {format(new Date(assignment.deadline), "HH:mm dd/MM", {
                  locale: vi,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* --- FOOTER: Progress & Arrow --- */}
      <CardFooter className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
        {/* Progress Bar Info */}
        <div className="w-full flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            {/* Icon minh họa hình thức (Cá nhân/Nhóm) nếu có field mode, tạm dùng User */}
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>Đã nộp</span>
          </div>
          <span
            className={`font-bold ${progress === 100 ? "text-green-600" : "text-slate-700"}`}
          >
            {submitted}/{total}
          </span>
        </div>

        <div className="w-full flex items-center gap-3">
          <Progress
            value={progress}
            className="h-1.5 bg-slate-200 flex-1 rounded-full"
            indicatorColor={progress === 100 ? "bg-green-500" : "bg-[#F27124]"}
          />

          {/* Animated Arrow */}
          <div className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:bg-[#F27124] group-hover:text-white group-hover:border-[#F27124] transition-all duration-300 shadow-sm">
            <ArrowRight className="h-3.5 w-3.5 group-hover:-rotate-45 transition-transform duration-300" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
