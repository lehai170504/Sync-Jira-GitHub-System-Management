"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const burnDownData = [
  { day: "Day 1", planned: 100, actual: 100 },
  { day: "Day 2", planned: 90, actual: 95 },
  { day: "Day 3", planned: 80, actual: 85 },
  { day: "Day 4", planned: 70, actual: 60 }, // Làm nhanh hơn
  { day: "Day 5", planned: 60, actual: 55 },
  { day: "Day 6", planned: 50, actual: 40 },
  { day: "Day 7", planned: 40, actual: 35 },
];

const issueTypeData = [
  { name: "Feature", value: 45, color: "#10B981" }, // Green
  { name: "Bug", value: 25, color: "#EF4444" }, // Red
  { name: "Chore", value: 20, color: "#F59E0B" }, // Amber
  { name: "Epic", value: 10, color: "#6366F1" }, // Indigo
];

export function AnalyticsTab() {
  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-lg">
        <span className="text-sm font-medium ml-2">Lọc dữ liệu:</span>
        <Select defaultValue="sprint4">
          <SelectTrigger className="w-[180px] h-9 bg-white">
            <SelectValue placeholder="Chọn Sprint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sprint4">Sprint 4 (Current)</SelectItem>
            <SelectItem value="sprint3">Sprint 3</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] h-9 bg-white">
            <SelectValue placeholder="Thành viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thành viên</SelectItem>
            <SelectItem value="fe">Front-end Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* VELOCITY CHART */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ Burndown (Tiến độ)</CardTitle>
            <CardDescription>
              So sánh khối lượng công việc dự kiến và thực tế.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnDownData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    name="Kế hoạch"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Thực tế"
                    stroke="#F27124"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ISSUE DISTRIBUTION */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Phân loại Issues</CardTitle>
            <CardDescription>
              Tỷ lệ các loại task trong Sprint này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {issueTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
