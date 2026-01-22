import type { Sprint, Task } from "./types";

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


