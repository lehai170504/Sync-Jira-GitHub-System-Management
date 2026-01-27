export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export type Member = {
  id: string;
  name: string;
  initials: string;
};

export type Course = {
  id: string;
  name: string;
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
  assigneeId: string;
  status: TaskStatus;
  storyPoints: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  type: string;
  courseId: string;
  printId: string; // sprint id (legacy naming kept for compatibility)
  deadline: string; // yyyy-MM-dd
};

export type StatusColumn = {
  id: TaskStatus;
  title: string;
  description: string;
  color: string;
};


