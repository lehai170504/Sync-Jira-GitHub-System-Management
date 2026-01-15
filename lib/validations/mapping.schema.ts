import * as z from "zod";

// Schema cho 1 dòng mapping
export const mappingItemSchema = z.object({
  studentId: z.string(),
  jiraAccountId: z.string().optional(), // Có thể để trống nếu chưa tìm thấy
  githubUsername: z.string().optional(),
});

// Schema cho hành động Submit (gửi cả mảng lên server)
export const bulkMappingSchema = z.object({
  mappings: z
    .array(mappingItemSchema)
    .refine(
      (items) => {
        // Custom Logic: Kiểm tra trùng lặp Jira Account
        const jiraIds = items.map((i) => i.jiraAccountId).filter(Boolean);
        return new Set(jiraIds).size === jiraIds.length;
      },
      {
        message:
          "Có tài khoản Jira đang được gán cho nhiều sinh viên cùng lúc!",
      }
    )
    .refine(
      (items) => {
        // Custom Logic: Kiểm tra trùng lặp Github Username
        const ghUsers = items.map((i) => i.githubUsername).filter(Boolean);
        return new Set(ghUsers).size === ghUsers.length;
      },
      {
        message:
          "Có tài khoản GitHub đang được gán cho nhiều sinh viên cùng lúc!",
      }
    ),
});

export type MappingItem = z.infer<typeof mappingItemSchema>;
