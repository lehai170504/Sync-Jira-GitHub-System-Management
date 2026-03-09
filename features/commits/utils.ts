import type { CommitValidation } from "./types";

export function getValidation(commit: {
  id: string;
  is_counted?: boolean;
  rejection_reason?: string | null;
}): CommitValidation {
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
  return {
    status: "valid",
    label: "Hợp lệ",
    reason: "Chưa có thông tin xác minh từ hệ thống.",
  };
}

