"use server";

import { reviewSchema } from "@/lib/validations/review.schema";
import { revalidatePath } from "next/cache";

export async function submitReview(data: any) {
  // 1. Validate dữ liệu tại server
  const validated = reviewSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const { revieweeId, rating, comment } = validated.data;

    // 2. GIẢ LẬP: Lưu vào Database
    // await db.peerReview.create({ ... })

    // Giả lập delay mạng
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Logic kiểm tra: Không cho tự đánh giá chính mình (nếu FE bypass)
    // if (revieweeId === currentUser.id) return { error: "Không thể tự đánh giá!" }

    revalidatePath("/student/peer-review");
    return { success: true, message: "Đã gửi đánh giá thành công!" };
  } catch (error) {
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
