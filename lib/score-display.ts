/**
 * BE trả git_score / jira_score (và các điểm tương tự) dạng tỷ lệ 0..1.
 * UI thang /10: nhân 10 (0.85 → 8.5).
 * Legacy: giá trị > 1 coi là đã là thang 0..10, giữ nguyên (clamp).
 */
export function scoreRatioToDisplay10(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n >= 0 && n <= 1) return n * 10;
  return Math.min(10, Math.max(0, n));
}

/**
 * Cho các chỉ số hiển thị dạng % (vd. project_health.total_git_ai_score).
 * 0..1 → 0..100%; legacy > 1 coi là đã là %.
 */
export function ratioToPercentDisplay(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n >= 0 && n <= 1) return Math.round(n * 100);
  return Math.min(100, Math.max(0, Math.round(n)));
}
