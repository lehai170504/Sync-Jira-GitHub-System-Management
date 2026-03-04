"use server";

import { reviewSchema } from "@/lib/validations/review.schema";
import { revalidatePath } from "next/cache";
import { submitReviewsApi } from "@/features/management/reviews/api/review-api";

export async function submitReview(data: any) {
  const validated = reviewSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const { teamId, reviews } = validated.data;

    const apiRes = await submitReviewsApi({
      teamId,
      reviews: reviews.map((r) => ({
        evaluated_id: r.evaluated_id,
        rating: r.rating,
        comment: r.comment ?? "",
      })),
    });

    revalidatePath("/peer-review");
    const message =
      (apiRes as { message?: string })?.message ?? "Đã gửi đánh giá thành công!";
    return { success: true, message };
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Lỗi hệ thống. Vui lòng thử lại sau.";
    const statusCode = error?.response?.status;
    return { error: msg, ...(statusCode && { statusCode }) };
  }
}
