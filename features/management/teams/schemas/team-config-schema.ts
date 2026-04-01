import { z } from "zod";

export const teamConfigSchema = z.object({
  jira_url: z.url("Jira URL không hợp lệ"),
  jira_project_key: z
    .string()
    .trim()
    .min(2, "Project Key quá ngắn")
    .max(20, "Project Key quá dài")
    .regex(/^[A-Z][A-Z0-9_]*$/, "Project Key chỉ gồm chữ in hoa, số, _"),
  jira_board_id: z.int().positive("Board ID phải là số nguyên dương"),
  api_token_jira: z.string().trim().min(10, "API token Jira không hợp lệ"),
  github_repo_url: z
    .url("Repository URL không hợp lệ")
    .regex(
      /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/i,
      "Repository URL phải có dạng github.com/user/repo",
    ),
  api_token_github: z.string().trim().min(10, "API token GitHub không hợp lệ"),
});

export type TeamConfigFormSchema = z.infer<typeof teamConfigSchema>;
