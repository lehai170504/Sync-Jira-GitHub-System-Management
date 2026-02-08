import * as z from "zod";

// Mapping thời gian bắt đầu của từng Slot
const slotStartTimes: Record<string, string> = {
  "1": "07:30",
  "2": "09:10",
  "3": "10:50",
  "4": "12:50",
  "5": "14:30",
  "6": "16:10",
};

export const eventSchema = z
  .object({
    date: z.string().min(1, "Vui lòng chọn ngày dạy"),
    slot: z.string().min(1, "Vui lòng chọn ca học"),
    room: z.string().min(1, "Vui lòng nhập phòng học"),
    topic: z.string().min(1, "Vui lòng nhập chủ đề"),
    content: z.string().optional(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.date || !data.slot) return;

    const selectedDate = new Date(data.date);
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(selectedDate);
    checkDate.setHours(0, 0, 0, 0);

    // CASE 1: Kiểm tra ngày quá khứ
    if (checkDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày dạy không được ở quá khứ",
        path: ["date"], // Hiển thị lỗi ở field date
      });
      return;
    }

    if (checkDate.getTime() === today.getTime()) {
      const startTime = slotStartTimes[data.slot];
      if (startTime) {
        const [hours, minutes] = startTime.split(":").map(Number);

        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        if (now > slotTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ca học này đã qua, vui lòng chọn ca khác",
            path: ["slot"],
          });
        }
      }
    }
  });

export type EventFormValues = z.infer<typeof eventSchema>;
