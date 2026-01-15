"use server";

import { JiraService } from "@/server/services/jira.service";
import { GithubService } from "@/server/services/github.service";
import { revalidatePath } from "next/cache";

export async function triggerFullSync() {
  try {
    // 1. Lấy cấu hình từ DB (Giả lập)
    const projectId = "TEST-PROJECT";
    const repoUrl = "github.com/test/repo";

    // 2. Chạy song song (Parallel Execution) để tối ưu tốc độ
    // Thay vì chờ Jira xong mới làm Github, ta làm cả 2 cùng lúc
    const [jiraRes, githubRes] = await Promise.all([
      JiraService.syncIssues(projectId),
      GithubService.syncCommits(repoUrl),
    ]);

    // 3. Revalidate để UI cập nhật dữ liệu mới nhất
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/sync");

    return {
      success: true,
      details: {
        jira: jiraRes,
        github: githubRes,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Sync Error:", error);
    return {
      success: false,
      error: "Lỗi hệ thống: Không thể kết nối tới máy chủ dữ liệu.",
    };
  }
}
