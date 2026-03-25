"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitReview } from "@/features/management/reviews/components/review-actions";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useTeamMembers } from "@/features/student/hooks/use-team-members";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";

type ReviewData = {
  revieweeId: string;
  rating: number;
  comment: string;
};

export function PeerReviewForm() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [teamId, setTeamId] = useState<string | undefined>(undefined);

  const classId = Cookies.get("student_class_id");
  const { data: profile } = useProfile();
  const { data: myClasses } = useMyClasses();
  const { data: teamsData } = useClassTeams(classId);
  const { data: classDetails, isLoading: isClassDetailsLoading } = useClassDetails(classId);
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
      } else {
        setTeamId(teamsData.teams[0]._id);
      }
    }
  }, [classId, myClasses, teamsData]);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  // Lấy _id của user hiện tại từ profile (để loại trừ bản thân, không dùng cookie student_id)
  const currentUserId = profile?.user?._id ?? "";

  // Map API members data sang format của component
  const allTeamMembers = useMemo(() => {
    if (!membersData?.members) return [];

    return membersData.members
      .filter((m) => m && m.student)
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
          studentId: member.student._id ?? "",
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

  // Chỉ đánh giá thành viên trong team, ngoại trừ bản thân (so khớp student._id với user._id)
  const membersToReview = useMemo(() => {
    if (!currentUserId) return allTeamMembers;
    return allTeamMembers.filter((m) => m.studentId !== currentUserId);
  }, [allTeamMembers, currentUserId]);

  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [submittedReviews, setSubmittedReviews] = useState<Set<string>>(
    new Set(),
  );
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);

  const reviewWindow = useMemo(() => {
    const endDateRaw = classDetails?.class?.semester_id?.end_date;
    if (!endDateRaw) {
      return {
        canSubmit: true,
        reason: "",
        openDateLabel: "",
        endDateLabel: "",
      };
    }

    const endDate = new Date(endDateRaw);
    if (Number.isNaN(endDate.getTime())) {
      return {
        canSubmit: true,
        reason: "",
        openDateLabel: "",
        endDateLabel: "",
      };
    }

    const endDay = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23,
      59,
      59,
      999,
    );
    const openDay = new Date(endDay);
    openDay.setDate(openDay.getDate() - 14);
    openDay.setHours(0, 0, 0, 0);

    const now = new Date();
    const inWindow = now >= openDay && now <= endDay;
    const format = (d: Date) =>
      new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(d);

    return {
      canSubmit: inWindow,
      reason: inWindow
        ? ""
        : now < openDay
          ? "Đánh giá chéo chỉ mở trong 14 ngày cuối của học kỳ."
          : "Đã quá hạn nộp đánh giá chéo của học kỳ này.",
      openDateLabel: format(openDay),
      endDateLabel: format(endDay),
    };
  }, [classDetails?.class?.semester_id?.end_date]);

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

  const canSubmitAll = useMemo(() => {
    if (!membersToReview || membersToReview.length === 0) return false;
    for (const member of membersToReview) {
      const review = reviews[member.id];
      if (!review || review.rating === 0) return false;
      if (
        review.rating <= 2 &&
        (!review.comment || review.comment.trim().length < 10)
      ) {
        return false;
      }
    }
    return true;
  }, [membersToReview, reviews]);

  const handleSubmitAll = async () => {
    if (!teamId) {
      toast.error("Không tìm thấy team để gửi đánh giá.");
      return;
    }

    if (!canSubmitAll) {
      toast.error(
        "Bạn phải đánh giá đầy đủ tất cả thành viên (và nhập lý do với điểm <= 2 sao) trước khi gửi.",
      );
      return;
    }

    const payload = {
      teamId,
      reviews: membersToReview.map((member) => {
        const review = reviews[member.id]!;
        return {
          evaluated_id: member.studentId,
          rating: review.rating,
          comment: review.comment ?? "",
        };
      }),
    };

    console.log(
      "[Peer Review] Submit all payload:",
      JSON.stringify(payload, null, 2),
    );

    setIsSubmittingAll(true);
    const res = await submitReview(payload);
    setIsSubmittingAll(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message ?? "Đã gửi đánh giá thành công!");
      setSubmittedReviews(new Set(membersToReview.map((m) => m.id)));
    }
  };

  if (isMembersLoading || isClassDetailsLoading || !teamId) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!reviewWindow.canSubmit) {
    return (
      <div className="p-6 space-y-6 font-mono text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Đánh giá chéo (Peer Review)</h1>
            <p className="text-sm text-muted-foreground">
              Chỉ mở trong 14 ngày cuối trước khi kết thúc học kỳ.
            </p>
          </div>
        </div>
        <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30">
          <CardContent className="pt-6 space-y-2">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              {reviewWindow.reason}
            </p>
            <p className="text-xs text-amber-800/90 dark:text-amber-200/90">
              Thời gian mở: {reviewWindow.openDateLabel} - {reviewWindow.endDateLabel}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (membersToReview.length === 0) {
    return (
      <div className="p-6 space-y-6 font-mono text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Đánh giá chéo (Peer Review)</h1>
            <p className="text-sm text-muted-foreground">
              Chấm điểm thành viên trong nhóm bằng star rating
            </p>
          </div>
        </div>
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
    <div className="p-6 space-y-6 font-mono text-slate-900 dark:text-slate-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            Peer Review
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
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

          if (isSubmitted) {
            return (
              <Card
                key={member.id}
                className="bg-green-50 dark:bg-emerald-900/20 border-green-200 dark:border-emerald-800 flex flex-col items-center justify-center py-10 h-full w-100 transition-all duration-500"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-emerald-300 mb-4" />
                <h3 className="text-green-800 dark:text-emerald-100 font-semibold text-lg uppercase">
                  Đã đánh giá
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-8 w-8 border border-green-300 dark:border-emerald-700">
                    <AvatarFallback className="bg-green-100 dark:bg-emerald-900/40 text-green-700 dark:text-emerald-300">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-green-600 dark:text-emerald-200 font-medium">
                    {member.name}
                  </p>
                </div>
                <div className="flex mt-3 gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-green-500 text-green-500 dark:fill-emerald-400 dark:text-emerald-400"
                    />
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-gray-300 dark:text-slate-700"
                    />
                  ))}
                </div>
              </Card>
            );
          }

          return (
            <Card
              key={member.id}
              className="hover:shadow-md transition-shadow duration-300 h-full w-100 flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700">
                  {member.avatarUrl ? (
                    <AvatarImage src={member.avatarUrl} />
                  ) : null}
                  <AvatarFallback
                    className={cn(
                      member.role === "LEADER"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
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
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                    )}
                  >
                    {member.role}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 flex-1 flex flex-col pt-4">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(member.id, star)}
                        disabled={isSubmittingAll || isSubmitted}
                        className="group focus:outline-none transition-transform active:scale-95 disabled:opacity-50"
                      >
                        <Star
                          className={cn(
                            "w-8 h-8 transition-colors duration-200",
                            star <= rating
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "text-gray-300 dark:text-slate-700 group-hover:text-amber-200",
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
                    {rating > 0 && rating <= 2 && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Textarea
                    value={comment}
                    onChange={(e) =>
                      handleCommentChange(member.id, e.target.value)
                    }
                    placeholder={
                      rating <= 2
                        ? "Nhận xét cho thành viên..."
                        : "Nhận xét (tuỳ chọn)..."
                    }
                    disabled={isSubmittingAll || isSubmitted}
                    className="resize-none min-h-[100px] rounded-2xl bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-0 focus-visible:border-slate-400 dark:focus-visible:border-slate-500"
                  />
                </div>

                <div className="mt-auto h-12 flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
                  {isSubmitted
                    ? "Đã gửi đánh giá cho thành viên này."
                    : rating === 0
                      ? "Chọn số sao để đánh giá."
                      : rating <= 2 && (!comment || comment.trim().length < 10)
                        ? "Điểm <= 2 sao cần nhập lý do (tối thiểu 10 ký tự)."
                        : "Đã đủ điều kiện, có thể gửi tất cả đánh giá."}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {membersToReview.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmitAll}
            disabled={!canSubmitAll || isSubmittingAll}
            className="h-12 px-10 rounded-xl font-black uppercase tracking-widest text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-[#F27124] dark:hover:bg-[#d651d1b] shadow-lg dark:shadow-orange-500/25"
          >
            {isSubmittingAll ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Gửi tất cả đánh giá
          </Button>
        </div>
      )}
    </div>
  );
}
