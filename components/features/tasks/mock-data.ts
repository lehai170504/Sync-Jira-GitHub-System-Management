import type { Course, Member, Sprint, StatusColumn, Task } from "./types";

export const members: Member[] = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN" },
  { id: "m2", name: "Trần Thị Bình", initials: "BT" },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC" },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM" },
];

export const courses: Course[] = [
  { id: "course-1", name: "CT449 - SE Project" },
  { id: "course-2", name: "CT300 - Web nâng cao" },
  { id: "course-3", name: "CT350 - Phân tích thiết kế HTTT" },
];

export const initialSprints: Sprint[] = [
  { id: "print-1", name: "Sprint 4", deadline: "2026-01-28" },
  { id: "print-2", name: "Sprint 5", deadline: "2026-02-10" },
  { id: "print-3", name: "Sprint 6", deadline: "2026-02-24" },
];

export const initialTasks: Task[] = [
  {
    id: "T-101",
    title: "Thiết kế trang Dashboard",
    assigneeId: "m1",
    status: "todo",
    storyPoints: 5,
    priority: "High",
    type: "Frontend",
    courseId: "course-1",
    printId: "print-1",
    deadline: "2026-01-25",
  },
  {
    id: "T-102",
    title: "Implement API Authentication",
    assigneeId: "m2",
    status: "in-progress",
    storyPoints: 8,
    priority: "Critical",
    type: "Backend",
    courseId: "course-1",
    printId: "print-1",
    deadline: "2026-01-22",
  },
  {
    id: "T-103",
    title: "Viết unit test cho Auth Service",
    assigneeId: "m3",
    status: "review",
    storyPoints: 3,
    priority: "Medium",
    type: "Testing",
    courseId: "course-1",
    printId: "print-1",
    deadline: "2026-01-20",
  },
  {
    id: "T-104",
    title: "Tối ưu truy vấn database",
    assigneeId: "m4",
    status: "done",
    storyPoints: 5,
    priority: "High",
    type: "Backend",
    courseId: "course-2",
    printId: "print-2",
    deadline: "2026-01-18",
  },
  {
    id: "T-105",
    title: "Config CI/CD cho project",
    assigneeId: "m1",
    status: "in-progress",
    storyPoints: 8,
    priority: "High",
    type: "DevOps",
    courseId: "course-2",
    printId: "print-2",
    deadline: "2026-01-24",
  },
  {
    id: "T-106",
    title: "Thiết kế database schema",
    assigneeId: "m2",
    status: "todo",
    storyPoints: 13,
    priority: "High",
    type: "Architecture",
    courseId: "course-3",
    printId: "print-3",
    deadline: "2026-01-28",
  },
];

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
    id: "review",
    title: "In Review",
    description: "Chờ review / kiểm thử",
    color: "border-amber-300",
  },
  {
    id: "done",
    title: "Done",
    description: "Đã hoàn thành & merged",
    color: "border-emerald-300",
  },
];


