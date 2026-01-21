import * as z from "zod";

export const reviewSchema = z
  .object({
    revieweeId: z.string(), // ID người được đánh giá
    rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
    comment: z.string().optional(),
  })
  .refine(
    (data) => {
      // Logic: Nếu điểm < 2 sao thì comment phải có ít nhất 10 ký tự
      if (data.rating < 2) {
        return data.comment && data.comment.trim().length >= 10;
      }
      return true;
    },
    {
      message:
        "Với mức điểm thấp (< 2 sao), bạn bắt buộc phải nhập lý do (tối thiểu 10 ký tự).",
      path: ["comment"], // Gắn lỗi vào trường comment
    }
  );

export type ReviewFormValues = z.infer<typeof reviewSchema>;
