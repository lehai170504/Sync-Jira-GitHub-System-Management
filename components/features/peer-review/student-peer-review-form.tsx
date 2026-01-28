"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitReview } from "@/server/actions/review-actions";
import { useTeamMembers } from "@/features/student/hooks/use-team-members";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";

type ReviewData = {
  revieweeId: string;
  rating: number;
  comment: string;
};

export function PeerReviewForm() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [teamId, setTeamId] = useState<string | undefined>(undefined);

  const classId = Cookies.get("student_class_id");
  const { data: myClasses } = useMyClasses();
  const { data: teamsData } = useClassTeams(classId);
  const { data: membersData, isLoading: isMembersLoading } =
    useTeamMembers(teamId);

  // Lấy teamId từ class hiện tại
  useEffect(() => {
    if (classId && myClasses?.classes) {
      const currentClass = myClasses.classes.find(
        (cls) => cls.class._id === classId,
      );
      if (currentClass?.team_id) {
        setTeamId(currentClass.team_id);
      }
    } else if (teamsData?.teams && teamsData.teams.length > 0) {
      const myTeamName = Cookies.get("student_team_name");
      const myTeam = teamsData.teams.find(
        (t: any) => t.project_name === myTeamName,
      );
      if (myTeam?._id) {
        setTeamId(myTeam._id);
      } else if (teamsData.teams[0]?._id) {
        setTeamId(teamsData.teams[0]._id);
      }
    }
  }, [classId, myClasses, teamsData]);

  // Lấy currentUserId từ members data
  useEffect(() => {
    const studentId = Cookies.get("student_id");
    // FIX 1: Sử dụng Optional Chaining để kiểm tra student_id tồn tại
    if (membersData?.members && studentId) {
      const currentMember = membersData.members.find(
        (m) => m?.student?._id === studentId,
      );
      if (currentMember?._id) {
        setCurrentUserId(currentMember._id);
      }
    }
  }, [membersData]);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  // Map API members data sang format của component
  const allTeamMembers = useMemo(() => {
    // FIX 2: Lọc bỏ những member bị lỗi student null trước khi map
    if (!membersData?.members) return [];

    return membersData.members
      .filter((m) => m && m.student) // Đảm bảo member và student không null
      .map((member) => {
        const name = member.student.full_name || "Thành viên chưa rõ";
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(-2);

        return {
          id: member._id,
          name: name,
          initials: initials,
          role:
            member.role_in_team === "Leader"
              ? ("LEADER" as const)
              : ("MEMBER" as const),
          avatarUrl: member.student.avatar_url || "",
        };
      });
  }, [membersData]);

  // Lọc ra danh sách thành viên để đánh giá (trừ bản thân)
  const membersToReview = useMemo(() => {
    return allTeamMembers.filter((m) => m.id !== currentUserId);
  }, [allTeamMembers, currentUserId]);

  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [submittedReviews, setSubmittedReviews] = useState<Set<string>>(
    new Set(),
  );
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

    if (review.rating < 2) {
      if (!review.comment || review.comment.trim().length < 10) {
        toast.error(
          "Điểm thấp (< 2 sao) cần nhập lý do chi tiết (tối thiểu 10 ký tự).",
        );
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

  if (isMembersLoading || !teamId) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (membersToReview.length === 0) {
    return (
      <div className="p-6 space-y-6">
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
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Chưa có thành viên nào để đánh giá.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 font-mono">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Users className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            Peer Review
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Chấm điểm thành viên trong nhóm
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membersToReview.map((member) => {
          const review = reviews[member.id];
          const rating = review?.rating || 0;
          const comment = review?.comment || "";
          const isSubmitted = submittedReviews.has(member.id);
          const isSubmitting = submittingId === member.id;

          if (isSubmitted) {
            return (
              <Card
                key={member.id}
                className="bg-green-50 border-green-200 flex flex-col items-center justify-center py-10 h-full transition-all duration-500"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-green-800 font-semibold text-lg uppercase">
                  Đã đánh giá
                </h3>
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
                    <Star
                      key={i}
                      className="w-5 h-5 fill-green-500 text-green-500"
                    />
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>
              </Card>
            );
          }

          return (
            <Card
              key={member.id}
              className="hover:shadow-md transition-shadow duration-300 h-full flex flex-col border-slate-200"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 border">
                  {member.avatarUrl ? (
                    <AvatarImage src={member.avatarUrl} />
                  ) : null}
                  <AvatarFallback
                    className={cn(
                      member.role === "LEADER"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-700",
                    )}
                  >
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-sm tracking-tight">
                    {member.name}
                  </h3>
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1 inline-block tracking-widest",
                      member.role === "LEADER"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {member.role}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 flex-1 flex flex-col pt-4">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(member.id, star)}
                        disabled={isSubmitting}
                        className="group focus:outline-none transition-transform active:scale-95 disabled:opacity-50"
                      >
                        <Star
                          className={cn(
                            "w-8 h-8 transition-colors duration-200",
                            star <= rating
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "text-gray-300 group-hover:text-amber-200",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] mt-2 font-black uppercase tracking-widest text-amber-600">
                    {rating === 0 ? "Chạm để đánh giá" : `${rating}/5 SAO`}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">
                    Nhận xét{" "}
                    {rating > 0 && rating < 2 && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Textarea
                    value={comment}
                    onChange={(e) =>
                      handleCommentChange(member.id, e.target.value)
                    }
                    placeholder={
                      rating < 2
                        ? "Lý do điểm thấp..."
                        : "Nhận xét (tuỳ chọn)..."
                    }
                    disabled={isSubmitting}
                    className="resize-none min-h-[100px] rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-400"
                  />
                </div>

                <Button
                  onClick={() => handleSubmit(member.id, member.name)}
                  disabled={
                    isSubmitting ||
                    rating === 0 ||
                    (rating < 2 && (!comment || comment.trim().length < 10))
                  }
                  className="w-full mt-auto bg-slate-900 hover:bg-[#F27124] text-white rounded-xl font-black uppercase tracking-widest text-xs h-12"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
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
