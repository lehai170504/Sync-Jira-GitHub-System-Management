import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ").trim().toLowerCase(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const registerStep1Schema = z.object({
  email: z.email("Email không hợp lệ").trim().toLowerCase(),
});

export const registerStep2Schema = z
  .object({
    otp: z.string().regex(/^\d{6}$/, "OTP phải gồm đúng 6 chữ số"),
    fullName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
    role: z.enum(["STUDENT", "LECTURER"]),
    studentCode: z.string().trim(),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .regex(/[A-Za-z]/, "Mật khẩu phải có chữ")
      .regex(/\d/, "Mật khẩu phải có số"),
    confirmPassword: z.string(),
    avatarUrl: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Mật khẩu xác nhận không khớp",
      });
    }
    if (val.role === "STUDENT" && !val.studentCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["studentCode"],
        message: "Vui lòng nhập MSSV",
      });
    }
    if (val.avatarUrl && !/^https?:\/\/.+/i.test(val.avatarUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["avatarUrl"],
        message: "Avatar URL không hợp lệ",
      });
    }
  });

