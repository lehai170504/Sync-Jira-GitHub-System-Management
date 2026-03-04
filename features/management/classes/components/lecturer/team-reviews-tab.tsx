"use client";

import { Loader2, Star, MessageSquareQuote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTeamReviews } from "@/features/student/hooks/use-team-reviews";

interface TeamReviewsTabProps {
  teamId: string;
}

export function TeamReviewsTab({ teamId }: TeamReviewsTabProps) {
  const { data, isLoading, isError } = useTeamReviews(teamId);

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="text-xs text-slate-500 font-medium">
          Đang tải kết quả đánh giá...
        </span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-12 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-900/30">
        Không thể tải dữ liệu đánh giá
      </div>
    );
  }

  // 👇 LẤY CHUẨN XÁC DATA THEO API MỚI CỦA BACKEND
  const reviews = data?.evaluation_summary || [];

  // Mảng rỗng
  if (reviews.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
        <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          {data.message || "Nhóm chưa có dữ liệu đánh giá chéo."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {reviews.map((summary: any, idx: number) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
        >
          {/* Header: Thông tin sinh viên & Điểm trung bình */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-white dark:border-slate-700 shadow-sm">
                <AvatarImage src={summary.student?.avatar_url || ""} />
                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xs">
                  {summary.student?.full_name?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                  {summary.student?.full_name || "Unknown Student"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">
                  {summary.student?.student_code || "N/A"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-amber-500 mb-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-black text-lg leading-none">
                  {summary.averageRating
                    ? summary.averageRating.toFixed(1)
                    : "0.0"}
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {summary.totalReviews || 0} Lượt đánh giá
              </p>
            </div>
          </div>

          {/* Body: Danh sách nhận xét */}
          <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
            {!summary.reviews || summary.reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">
                Chưa có lời nhận xét nào.
              </p>
            ) : (
              summary.reviews.map((rev: any, i: number) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {rev.reviewer?.full_name || "Anonymous"}
                      </span>
                      <span className="text-[9px] text-slate-400 bg-white dark:bg-slate-800 px-1.5 rounded font-mono">
                        {rev.reviewer?.student_code || ""}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={cn(
                            "w-3 h-3",
                            starIdx < (rev.rating || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 dark:text-slate-700",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 items-start mt-1.5">
                    <MessageSquareQuote className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                      "{rev.comment || "Không có bình luận"}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
