"use server";

import { bulkMappingSchema } from "@/lib/validations/mapping.schema";
import { revalidatePath } from "next/cache";

export async function saveUserMappings(data: any) {
  // 1. Validate dữ liệu
  const validated = bulkMappingSchema.safeParse(data);

  if (!validated.success) {
    // Trả về lỗi đầu tiên tìm thấy
    return {
      error: validated.error.issues[0].message || "Dữ liệu không hợp lệ",
    };
  }

  try {
    const mappings = validated.data.mappings;

    // 2. GIẢ LẬP: Lưu vào Database (Prisma)
    // await db.$transaction(
    //   mappings.map(m => db.user.update({
    //     where: { id: m.studentId },
    //     data: { jiraAccountId: m.jiraAccountId, githubUsername: m.githubUsername }
    //   }))
    // )

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 1500));

    revalidatePath("/admin/mapping");
    return {
      success: true,
      message: `Đã cập nhật thành công ${mappings.length} sinh viên!`,
    };
  } catch (error) {
    return { error: "Lỗi hệ thống khi lưu dữ liệu." };
  }
}
