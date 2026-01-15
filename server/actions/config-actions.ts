"use server";

import {
  jiraConfigSchema,
  githubConfigSchema,
} from "@/lib/validations/config.schema";
import { revalidatePath } from "next/cache";

// --- XỬ LÝ JIRA ---
export async function updateJiraConfig(data: any) {
  // 1. Validate dữ liệu tại Server
  const validated = jiraConfigSchema.safeParse(data);
  if (!validated.success) {
    return {
      error: "Dữ liệu nhập vào không hợp lệ",
      details: validated.error.flatten(),
    };
  }

  try {
    // 2. GIẢ LẬP: Gọi API Jira để kiểm tra Token có sống không
    // const res = await fetch(`${data.domainUrl}/rest/api/3/myself`, {
    //   headers: { Authorization: `Basic ${btoa(data.email + ":" + data.apiToken)}` }
    // })

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay 2s

    // 3. GIẢ LẬP: Lưu vào Database
    // await db.config.update({ where: { type: 'JIRA' }, data: validated.data })

    revalidatePath("/admin/config");
    return { success: true, message: "Kết nối Jira thành công!" };
  } catch (error) {
    return {
      error: "Không thể kết nối tới Jira Server. Vui lòng kiểm tra lại Token.",
    };
  }
}

// --- XỬ LÝ GITHUB ---
export async function updateGithubConfig(data: any) {
  const validated = githubConfigSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Dữ liệu GitHub không hợp lệ" };
  }

  try {
    // Giả lập verify GitHub Token
    await new Promise((resolve) => setTimeout(resolve, 1500));

    revalidatePath("/admin/config");
    return { success: true, message: "Đã liên kết Repository thành công!" };
  } catch (error) {
    return { error: "Token GitHub hết hạn hoặc không đủ quyền." };
  }
}
