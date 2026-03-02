import type { CommitValidation } from "./types";
import { mockValidation } from "./mock-data";

export function getValidation(commit: { id: string; is_counted?: boolean; rejection_reason?: string | null }): CommitValidation {
  // Ưu tiên data thật từ BE (teams/:teamId/commits)
  if (commit.rejection_reason) {
    return {
      status: "rejected",
      label: "Bị loại",
      reason: commit.rejection_reason,
    };
  }
  if (commit.is_counted === false) {
    return {
      status: "rejected",
      label: "Bị loại",
      reason: "Commit không được tính điểm.",
    };
  }
  if (commit.is_counted === true) {
    return {
      status: "valid",
      label: "Hợp lệ",
      reason: "Commit được tính điểm.",
    };
  }

  // Fallback: mock validation theo id (dữ liệu demo)
  return (
    mockValidation[commit.id] ?? {
      status: "valid",
      label: "Hợp lệ",
      reason: "Không có quy tắc loại trừ.",
    }
  );
}

