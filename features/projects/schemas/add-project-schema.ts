import * as z from "zod";

export const addProjectSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên dự án"),
  githubRepoUrl: z.string().min(1, "Vui lòng chọn Github Repository"),
  jiraProjectKey: z.string().min(1, "Vui lòng chọn Jira Project Key"),
  members: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thành viên"),
});

export type AddProjectFormValues = z.infer<typeof addProjectSchema>;
