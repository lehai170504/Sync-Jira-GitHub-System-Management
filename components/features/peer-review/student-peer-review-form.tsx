"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitReview } from "@/server/actions/review-actions";

// Mock data cho tất cả thành viên trong team (bao gồm cả LEADER)
const allTeamMembers = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN", role: "LEADER" as const, avatarUrl: "" },
  { id: "m2", name: "Trần Thị Bình", initials: "BT", role: "MEMBER" as const, avatarUrl: "" },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC", role: "MEMBER" as const, avatarUrl: "" },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM", role: "MEMBER" as const, avatarUrl: "" },
];

type ReviewData = {
  revieweeId: string;
  rating: number;
  comment: string;
};

export function PeerReviewForm() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [currentUserId, setCurrentUserId] = useState<string>("m2");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) {
      setRole(savedRole);
      // Giả sử: LEADER = m1, MEMBER = m2 (có thể lấy từ cookie hoặc API)
      if (savedRole === "LEADER") {
        setCurrentUserId("m1");
      } else if (savedRole === "MEMBER") {
        setCurrentUserId("m2");
      }
    }
  }, []);

  // Lọc ra danh sách thành viên để đánh giá (trừ bản thân)
  const membersToReview = allTeamMembers.filter((m) => m.id !== currentUserId);
  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [submittedReviews, setSubmittedReviews] = useState<Set<string>>(new Set());
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleRatingChange = (memberId: string, rating: number) => {
    setReviews((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        revieweeId: memberId,
        rating,
        comment: prev[memberId]?.comment || "",
      },
    }));
  };

  const handleCommentChange = (memberId: string, comment: string) => {
    setReviews((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        revieweeId: memberId,
        rating: prev[memberId]?.rating || 0,
        comment,
      },
    }));
  };

  const handleSubmit = async (memberId: string, memberName: string) => {
    const review = reviews[memberId];

    if (!review || review.rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.");
      return;
    }

    // Chỉ bắt buộc nhận xét khi điểm < 2 sao
    if (review.rating < 2) {
      if (!review.comment || review.comment.trim().length < 10) {
        toast.error("Điểm thấp (< 2 sao) cần nhập lý do chi tiết (tối thiểu 10 ký tự).");
        return;
      }
    }

    setSubmittingId(memberId);
    const res = await submitReview({
      revieweeId: review.revieweeId,
      rating: review.rating,
      comment: review.comment,
    });
    setSubmittingId(null);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Đã đánh giá ${memberName} thành công!`);
      setSubmittedReviews((prev) => new Set(prev).add(memberId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Users className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Đánh giá chéo (Peer Review)</h1>
          <p className="text-sm text-muted-foreground">
            Chấm điểm thành viên trong nhóm bằng star rating
          </p>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membersToReview.map((member) => {
          const review = reviews[member.id];
          const rating = review?.rating || 0;
          const comment = review?.comment || "";
          const isSubmitted = submittedReviews.has(member.id);
          const isSubmitting = submittingId === member.id;

          // Giao diện khi đã đánh giá xong
          if (isSubmitted) {
            return (
              <Card
                key={member.id}
                className="bg-green-50 border-green-200 flex flex-col items-center justify-center py-10 h-full transition-all duration-500"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-green-800 font-semibold text-lg">Đã đánh giá</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-8 w-8 border border-green-300">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-green-600 font-medium">{member.name}</p>
                </div>
                <div className="flex mt-3 gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>
                <p className="text-xs text-green-600 mt-2">{rating}/5 sao</p>
              </Card>
            );
          }

          // Giao diện Form đánh giá
          return (
            <Card key={member.id} className="hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 border">
                  {member.avatarUrl ? (
                    <AvatarImage src={member.avatarUrl} />
                  ) : null}
                  <AvatarFallback className={cn(
                    member.role === "LEADER" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
                  )}>
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-none">{member.name}</h3>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full mt-1 inline-block",
                    member.role === "LEADER"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {member.role === "LEADER" ? "LEADER" : "MEMBER"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 flex-1 flex flex-col">
                {/* Star Rating Area */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(member.id, star)}
                        disabled={isSubmitting}
                        className="group focus:outline-none transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Star
                          className={cn(
                            "w-8 h-8 transition-colors duration-200",
                            star <= rating
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "text-gray-300 group-hover:text-amber-200"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 font-medium transition-colors",
                      rating === 0 ? "text-muted-foreground" : "text-amber-600"
                    )}
                  >
                    {rating === 0
                      ? "Chạm để đánh giá"
                      : rating === 5
                      ? "Xuất sắc (5/5)"
                      : rating === 1
                      ? "Cần cải thiện (1/5)"
                      : `Đánh giá ${rating}/5 sao`}
                  </span>
                </div>

                {/* Comment Area */}
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between">
                    <Label
                      htmlFor={`comment-${member.id}`}
                      className="text-xs uppercase text-gray-500 font-bold tracking-wider"
                    >
                      Nhận xét {rating > 0 && rating < 2 && <span className="text-red-500">*</span>}
                    </Label>
                  </div>
                  <Textarea
                    id={`comment-${member.id}`}
                    value={comment}
                    onChange={(e) => handleCommentChange(member.id, e.target.value)}
                    placeholder={
                      rating < 2
                        ? "Điểm thấp cần nhập lý do chi tiết (tối thiểu 10 ký tự)..."
                        : "Lời khen hoặc góp ý (tuỳ chọn)..."
                    }
                    disabled={isSubmitting}
                    className={cn(
                      "resize-none min-h-[100px] focus-visible:ring-offset-0",
                      rating > 0 &&
                        rating < 2 &&
                        comment.trim().length > 0 &&
                        comment.trim().length < 10 &&
                        "border-red-200 focus-visible:ring-red-400 bg-red-50/30"
                    )}
                  />
                  {rating > 0 &&
                    rating < 2 &&
                    comment.trim().length > 0 &&
                    comment.trim().length < 10 && (
                      <p className="text-[10px] text-red-500 font-medium animate-pulse">
                        * Điểm thấp (dưới 2 sao) bắt buộc nhập tối thiểu 10 ký tự.
                      </p>
                    )}
                </div>

                <Button
                  onClick={() => handleSubmit(member.id, member.name)}
                  disabled={
                    isSubmitting ||
                    rating === 0 ||
                    (rating < 2 && (!comment || comment.trim().length < 10))
                  }
                  className="w-full mt-auto bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...
                    </>
                  ) : (
                    "Gửi đánh giá"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

