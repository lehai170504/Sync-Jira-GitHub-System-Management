import * as z from "zod";

export const jiraConfigSchema = z.object({
  domainUrl: z
    .string()
    .url({ message: "URL không hợp lệ. Phải bắt đầu bằng https://" })
    .includes("atlassian.net", {
      message: "URL phải chứa domain atlassian.net",
    }),
  email: z
    .string()
    .email({ message: "Email không đúng định dạng" })
    .min(5, { message: "Email quá ngắn" }),
  apiToken: z
    .string()
    .min(20, {
      message: "API Token Jira thường rất dài, vui lòng kiểm tra lại",
    }),
});

export const githubConfigSchema = z.object({
  repoUrl: z
    .string()
    .url({ message: "URL Repository không hợp lệ" })
    .includes("github.com", { message: "Đây không phải là link GitHub" }),
  accessToken: z
    .string()
    .min(30, {
      message: "Personal Access Token (Classic) phải có ít nhất 30 ký tự",
    })
    .startsWith("gh", {
      message: "Token Github thường bắt đầu bằng 'ghp_' hoặc 'github_pat_'",
    }),
});

// Type inference để dùng ở Client
export type JiraConfigValues = z.infer<typeof jiraConfigSchema>;
export type GithubConfigValues = z.infer<typeof githubConfigSchema>;
