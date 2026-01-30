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


