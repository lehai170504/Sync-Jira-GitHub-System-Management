import * as z from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên bài tập"),

  type: z.enum(["ASSIGNMENT", "LAB"]),

  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Vui lòng chọn thời gian hợp lệ",
  }),
  description: z.string().optional(),
  resources: z.string().optional(),
});

export type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;
