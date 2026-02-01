export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export type Member = {
  id: string;
  name: string;
  initials: string;
};

export type Sprint = {
  id: string;
  name: string;
  deadline: string; // yyyy-MM-dd (legacy, for backward compatibility)
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  storyPoints: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  type: string;
  courseId: string;
  printId: string; // sprint id (legacy naming kept for compatibility)
  deadline: string; // yyyy-MM-dd (due_date)
  startDate?: string; // yyyy-MM-dd (start_date)
};

export type StatusColumn = {
  id: TaskStatus;
  title: string;
  description: string;
  color: string;
};


