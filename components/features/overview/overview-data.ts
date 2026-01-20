import { CheckCircle2, GitCommit, AlertTriangle, Activity } from "lucide-react";

export const statsData = [
  {
    title: "Nhiệm vụ hoàn thành",
    value: "128",
    subtext: "+12% tuần này",
    icon: CheckCircle2,
    trend: "up", // up, down, neutral
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Tổng Commits",
    value: "2,350",
    subtext: "+24% tuần này",
    icon: GitCommit,
    trend: "up",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Cảnh báo rủi ro",
    value: "3",
    subtext: "+1 vấn đề mới",
    icon: AlertTriangle,
    trend: "down",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Tiến độ Sprint",
    value: "65%",
    subtext: "Còn 4 ngày",
    icon: Activity,
    trend: "neutral",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export const chartData = [
  { name: "T2", task: 12, commit: 45 },
  { name: "T3", task: 18, commit: 52 },
  { name: "T4", task: 5, commit: 28 },
  { name: "T5", task: 22, commit: 70 },
  { name: "T6", task: 15, commit: 48 },
  { name: "T7", task: 8, commit: 30 },
  { name: "CN", task: 2, commit: 10 },
];

export const activityData = [
  {
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://github.com/shadcn.png",
      fallback: "NA",
    },
    action: "đã commit code",
    target: "feat: update login UI",
    project: "Front-end",
    time: "2 phút trước",
    type: "commit",
  },
  {
    user: { name: "Trần Thị B", avatar: "", fallback: "TB" },
    action: "hoàn thành task",
    target: "DB Schema v2",
    project: "Back-end",
    time: "1 giờ trước",
    type: "task",
  },
  {
    user: { name: "Lê Hoàng C", avatar: "", fallback: "LC" },
    action: "gặp vấn đề",
    target: "API Timeout",
    project: "System",
    time: "3 giờ trước",
    type: "alert",
  },
  {
    user: { name: "Phạm D", avatar: "", fallback: "PD" },
    action: "tạo pull request",
    target: "fix: mobile responsive",
    project: "Front-end",
    time: "5 giờ trước",
    type: "commit",
  },
];
