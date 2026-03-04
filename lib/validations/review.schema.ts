import * as z from "zod";

const reviewItemSchema = z
  .object({
    evaluated_id: z.string().min(1, "Thiếu evaluated_id"),
    rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
    comment: z.string().optional(),
  })
  .refine(
    (data) => {
      // Logic: Nếu điểm <= 2 sao thì comment phải có ít nhất 10 ký tự
      if (data.rating <= 2) {
        return data.comment && data.comment.trim().length >= 10;
      }
      return true;
    },
    {
      message:
        "Với mức điểm thấp (<= 2 sao), bạn bắt buộc phải nhập lý do (tối thiểu 10 ký tự).",
      path: ["comment"],
    },
  );

export const reviewSchema = z.object({
  teamId: z.string().min(1, "Thiếu teamId"),
  reviews: z
    .array(reviewItemSchema)
    .min(1, "Cần ít nhất một đánh giá"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
