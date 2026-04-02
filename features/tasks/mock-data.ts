import type { StatusColumn } from "./types";

export const statusColumns: StatusColumn[] = [
  {
    id: "todo",
    title: "To Do",
    description: "Task đã được tạo nhưng chưa bắt đầu",
    color: "border-slate-200",
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Task đang được thực hiện",
    color: "border-blue-300",
  },
  {
    id: "done",
    title: "Done",
    description: "Đã hoàn thành & merged",
    color: "border-emerald-300",
  },
];


