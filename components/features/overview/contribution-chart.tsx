"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { chartData } from "./overview-data";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl text-sm">
        <p className="font-semibold text-gray-700 mb-2">Thứ {label}</p>
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#F27124]" />
            Tasks: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
            Commits: <span className="font-bold">{payload[1].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ContributionChart() {
  return (
    <Card className="col-span-4 shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Biểu đồ đóng góp</CardTitle>
        <CardDescription>
          Tương quan giữa Task và Commit trong tuần.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
              <Bar
                dataKey="task"
                name="Jira Tasks"
                fill="#F27124"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="commit"
                name="GitHub Commits"
                fill="#1e293b"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
