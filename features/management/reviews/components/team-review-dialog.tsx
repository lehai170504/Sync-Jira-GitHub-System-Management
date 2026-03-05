"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTeamReviews } from "@/features/management/reviews/hooks/use-team-reviews";
import { Star, Loader2, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string | null;
  teamName?: string;
}

export function TeamReviewDialog({
  open,
  onOpenChange,
  teamId,
  teamName,
}: TeamReviewDialogProps) {
  const { data, isLoading } = useTeamReviews(teamId, open);

  const hasData =
    data && data.evaluation_summary && data.evaluation_summary.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-[28px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-sans"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur relative">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                Đánh giá chéo trong nhóm
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Tổng hợp điểm và nhận xét giữa các thành viên trong nhóm
                {teamName ? (
                  <>
                    {" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {teamName}
                    </span>
                    .
                  </>
                ) : (
                  "."
                )}
              </DialogDescription>
            </div>
            {data && (
              <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800 text-[10px] font-black uppercase tracking-widest px-2 py-1 h-auto shrink-0">
                {data.total_reviews_submitted} lượt đánh giá
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-9 w-9 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            onClick={() => onOpenChange(false)}
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 space-y-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-xs font-medium">
                  Đang tải dữ liệu đánh giá nhóm...
                </p>
              </div>
            )}

            {!isLoading && !hasData && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-slate-500">
                <Users className="w-8 h-8 mb-1" />
                <p className="text-sm font-medium">
                  Chưa có đánh giá chéo nào cho nhóm này.
                </p>
              </div>
            )}

            {!isLoading &&
              hasData &&
              data!.evaluation_summary.map((item) => {
                const avg = item.average_rating ?? 0;
                const fullStars = Math.floor(avg);
                const hasHalf = avg - fullStars >= 0.5;
                const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

                return (
                  <div
                    key={item.student._id}
                    className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 md:p-5 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                          <AvatarImage src={item.student.avatar_url} />
                          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold">
                            {item.student.full_name?.[0] ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.student.full_name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {item.student.student_code} · {item.student.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(fullStars)].map((_, i) => (
                            <Star
                              key={`full-${i}`}
                              className="w-4 h-4 text-amber-400 fill-amber-400"
                            />
                          ))}
                          {hasHalf && (
                            <Star className="w-4 h-4 text-amber-400 fill-amber-200" />
                          )}
                          {[...Array(emptyStars)].map((_, i) => (
                            <Star
                              key={`empty-${i}`}
                              className="w-4 h-4 text-slate-300 dark:text-slate-700"
                            />
                          ))}
                        </div>
                        <div className="text-right text-xs">
                          <p className="font-black text-slate-900 dark:text-slate-100">
                            {avg.toFixed(1)}/5
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {item.review_count} lượt đánh giá
                          </p>
                        </div>
                      </div>
                    </div>

                    {item.feedbacks_received.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                          Nhận xét từ các thành viên
                        </p>
                        <div className="space-y-2">
                          {item.feedbacks_received.map((fb, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "p-3 rounded-2xl border text-xs flex gap-3",
                                fb.rating <= 2
                                  ? "border-red-100 dark:border-red-900/40 bg-red-50/60 dark:bg-red-900/10"
                                  : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950",
                              )}
                            >
                              <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-700 shrink-0">
                                <AvatarImage src={fb.evaluator.avatar_url} />
                                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                                  {fb.evaluator.full_name?.[0] ?? "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                      {fb.evaluator.full_name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                      {fb.evaluator.student_code}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-[11px] font-bold">
                                      {fb.rating.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed">
                                  {fb.comment || (
                                    <span className="italic text-slate-400 dark:text-slate-500">
                                      Không có nhận xét.
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

