import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

export const jiraConfigSchema = z.object({
  domainUrl: z.string().url({ message: "URL phải bắt đầu bằng https://" }),
  email: z.string().email({ message: "Email không đúng định dạng" }),
  apiToken: z.string().min(10, { message: "Token quá ngắn" }),
});

export const reviewSchema = z
  .object({
    revieweeId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.rating < 3 && (!data.comment || data.comment.length < 10)) {
        return false;
      }
      return true;
    },
    {
      message:
        "Điểm dưới 3 sao bắt buộc phải giải thích lý do (tối thiểu 10 ký tự)",
      path: ["comment"],
    }
  );
