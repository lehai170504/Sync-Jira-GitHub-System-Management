import type { CommitValidation } from "./types";
import { mockValidation } from "./mock-data";

export function getValidation(commitId: string): CommitValidation {
  return (
    mockValidation[commitId] ?? {
      status: "valid",
      label: "Hợp lệ",
      reason: "Không có quy tắc loại trừ.",
    }
  );
}

