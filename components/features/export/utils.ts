/**
 * Format timestamp to Vietnamese locale string
 */
export function formatExportTimestamp(timestamp: string | null): string {
  if (!timestamp) return "Chưa có";
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "Không xác định";
  return d.toLocaleString("vi-VN");
}

