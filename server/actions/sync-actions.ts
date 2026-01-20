"use server";

import { JiraService } from "@/server/services/jira.service";
import { GithubService } from "@/server/services/github.service";
import { revalidatePath } from "next/cache";

// --- ADMIN: FULL SYNC (JIRA + GITHUB) ---
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

// --- LEADER: CHỈ SYNC JIRA ---
export async function triggerJiraSync() {
  try {
    // 1. Lấy cấu hình project hiện tại (Giả lập)
    const projectId = "LEADER-PROJECT";

    // 2. Gọi JiraService để lấy issues
    const jiraRes = await JiraService.syncIssues(projectId);

    // 3. Revalidate trang sync của Leader
    revalidatePath("/leader/sync");

    return {
      success: true,
      jira: jiraRes,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Jira Sync Error:", error);
    return {
      success: false,
      error: "Không thể đồng bộ dữ liệu từ Jira. Vui lòng kiểm tra lại cấu hình.",
    };
  }
}

// --- LEADER: CHỈ SYNC GITHUB ---
export async function triggerGithubSync() {
  try {
    // 1. Lấy repo hiện tại từ cấu hình (Giả lập)
    const repoUrl = "github.com/test/repo";

    // 2. Gọi GithubService để lấy commits
    const githubRes = await GithubService.syncCommits(repoUrl);

    // 3. Revalidate trang sync GitHub của Leader
    revalidatePath("/leader/sync/github");

    return {
      success: true,
      github: githubRes,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Github Sync Error:", error);
    return {
      success: false,
      error: "Không thể đồng bộ dữ liệu từ GitHub. Vui lòng kiểm tra lại cấu hình.",
    };
  }
}
