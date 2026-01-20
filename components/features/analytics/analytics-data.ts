import { BurndownPoint, IssueTypeStat } from "./analytics-types";

export const mockBurnDownData: BurndownPoint[] = [
  { day: "Day 1", planned: 100, actual: 100 },
  { day: "Day 2", planned: 90, actual: 95 },
  { day: "Day 3", planned: 80, actual: 85 },
  { day: "Day 4", planned: 70, actual: 60 }, // Làm nhanh hơn tiến độ
  { day: "Day 5", planned: 60, actual: 55 },
  { day: "Day 6", planned: 50, actual: 40 },
  { day: "Day 7", planned: 40, actual: 35 },
];

export const mockIssueTypeData: IssueTypeStat[] = [
  { name: "Feature", value: 45, color: "#10B981" }, // Green
  { name: "Bug", value: 25, color: "#EF4444" }, // Red
  { name: "Chore", value: 20, color: "#F59E0B" }, // Amber
  { name: "Epic", value: 10, color: "#6366F1" }, // Indigo
];
