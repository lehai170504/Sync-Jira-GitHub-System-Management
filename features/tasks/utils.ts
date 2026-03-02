import type { Sprint, Task, TaskStatus } from "./types";

/** Map API status_category (Jira) -> internal TaskStatus */
export function mapStatusCategoryToStatus(statusCategory?: string): TaskStatus {
  const s = (statusCategory || "").toLowerCase().trim();
  if (s === "to do" || s === "todo") return "todo";
  if (s === "in progress" || s === "in-progress") return "in-progress";
  if (s === "in review" || s === "review") return "review";
  if (s === "done") return "done";
  return "todo";
}

/** Map API status_name (Jira raw status) -> internal TaskStatus */
function mapStatusNameToStatus(statusName?: string): TaskStatus {
  const s = (statusName || "").toLowerCase().trim();
  // To Do / Open
  if (
    s === "to do" ||
    s === "todo" ||
    s === "open" ||
    s === "backlog" ||
    s === "new"
  )
    return "todo";
  // In Progress
  if (
    s === "in progress" ||
    s === "in-progress" ||
    s === "in development" ||
    s === "development" ||
    s === "in development"
  )
    return "in-progress";
  // In Review / Code Review
  if (
    s === "in review" ||
    s === "review" ||
    s === "code review" ||
    s === "ready for review" ||
    s === "in testing" ||
    s === "testing"
  )
    return "review";
  // Done
  if (s === "done" || s === "closed" || s === "resolved") return "done";
  return "todo";
}

/**
 * Map API task (status_category + status_name) -> internal TaskStatus.
 * Ưu tiên status_category, fallback status_name khi category không map được.
 */
export function mapApiTaskToStatus(
  statusCategory?: string,
  statusName?: string
): TaskStatus {
  const fromCategory = mapStatusCategoryToStatus(statusCategory);
  const fromName = mapStatusNameToStatus(statusName);
  // Nếu status_category map ra todo nhưng status_name map ra giá trị khác -> dùng status_name
  if (fromCategory === "todo" && fromName !== "todo") return fromName;
  return fromCategory;
}

/** Thứ tự status để sort tasks (todo < in-progress < review < done) */
export const STATUS_ORDER: Record<TaskStatus, number> = {
  todo: 0,
  "in-progress": 1,
  review: 2,
  done: 3,
};

/** Map internal TaskStatus -> API status_category (Jira format) */
export function mapStatusToStatusCategory(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "in-progress":
      return "In Progress";
    case "review":
      return "In Review";
    case "done":
      return "Done";
    default:
      return "To Do";
  }
}

export function isDateOverdue(dateStr: string | undefined | null) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ddl = new Date(dateStr);
  if (Number.isNaN(ddl.getTime())) return false;
  ddl.setHours(0, 0, 0, 0);
  return ddl < today;
}

export function isTaskOverdue(task: Task) {
  if (!task.deadline || task.status === "done") return false;
  return isDateOverdue(task.deadline);
}

export function nextTaskNumber(list: Task[]) {
  const max = list.reduce((acc, t) => {
    const n = Number(t.id.replace("T-", ""));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 100);
  return max + 1;
}

export function nextSprintId(list: Sprint[]) {
  const max = list.reduce((acc, s) => {
    const n = Number(s.id.replace("print-", ""));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 1);
  return `print-${max + 1}`;
}


