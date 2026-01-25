/**
 * Lấy Jira Project Key sạch từ giá trị ô nhập (dropdown/input).
 * BE cần chỉ key (vd. "SCRUM", "SWP2025"), không phải "[SCRUM] My Software Team".
 *
 * - "SCRUM" → "SCRUM"
 * - "[SCRUM] My Software Team" → "SCRUM"
 */
export function extractJiraProjectKey(raw: string | undefined | null): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^\[(.*?)\]/);
  return match ? match[1].trim() : trimmed;
}
