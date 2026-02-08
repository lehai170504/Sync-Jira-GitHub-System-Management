import * as z from "zod";

export const addStudentSchema = z.object({
  code: z
    .string()
    .min(1, "Vui lòng nhập Mã số sinh viên (MSSV)")
    .regex(/^[a-zA-Z0-9]+$/, "MSSV không được chứa ký tự đặc biệt"),
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z
    .string()
    .min(1, "Vui lòng nhập Email")
    .email("Định dạng Email không hợp lệ"),
  group: z.string(),
  isLeader: z.boolean(),
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;

export const editStudentSchema = z.object({
  group: z.string(),
  isLeader: z.boolean(),
});

export type EditStudentFormValues = z.infer<typeof editStudentSchema>;
