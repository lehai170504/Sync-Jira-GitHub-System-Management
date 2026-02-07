import * as z from "zod";

export const createClassSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên lớp học"),
  subject_id: z.string().min(1, "Vui lòng chọn môn học"),
  semester_id: z.string().min(1, "Vui lòng chọn học kỳ"),
  lecturer_id: z.string().min(1, "Vui lòng chọn giảng viên phụ trách"),
  subjectName: z.string().default(""),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;
 