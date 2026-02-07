import * as z from "zod";

export const createSubjectSchema = z.object({
  code: z
    .string()
    .min(1, "Vui lòng nhập mã môn")
    .regex(
      /^[A-Z0-9]{3,10}$/,
      "Mã môn phải là chữ in hoa/số (VD: SWR302), độ dài 3-10 ký tự",
    ),
  name: z.string().min(1, "Vui lòng nhập tên môn học"),
  credits: z.coerce
    .number()
    .min(1, "Số tín chỉ phải lớn hơn 0")
    .max(10, "Số tín chỉ tối đa là 10"),
  description: z.string().optional(),
});

export type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>;
