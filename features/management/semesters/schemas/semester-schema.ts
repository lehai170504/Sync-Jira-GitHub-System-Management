import * as z from "zod";

// Định nghĩa Schema
export const createSemesterSchema = z
  .object({
    name: z.string().min(1, "Vui lòng nhập tên học kỳ"),
    code: z
      .string()
      .min(1, "Vui lòng nhập mã")
      .regex(/^[A-Z0-9]+$/, "Mã chỉ chứa chữ hoa và số (VD: SP24)"),
    start_date: z.string().min(1, "Chọn ngày bắt đầu"),
    end_date: z.string().min(1, "Chọn ngày kết thúc"),
  })
  .refine(
    (data) => {
      // Logic: Ngày kết thúc phải sau ngày bắt đầu
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.end_date) > new Date(data.start_date);
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["end_date"], // Gán lỗi vào field 'end_date'
    },
  );

// Xuất kiểu dữ liệu TypeScript từ Schema (để dùng trong Form)
export type CreateSemesterFormValues = z.infer<typeof createSemesterSchema>;
