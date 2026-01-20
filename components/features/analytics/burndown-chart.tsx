"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BurndownPoint } from "./analytics-types";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Kế hoạch:{" "}
            <span className="font-mono font-bold text-slate-600">
              {payload[0].value}
            </span>
          </p>
          <p className="text-xs text-[#F27124] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F27124]"></span>
            Thực tế:{" "}
            <span className="font-mono font-bold text-[#F27124]">
              {payload[1].value}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function BurndownChart({ data }: { data: BurndownPoint[] }) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F1F5F9"
            vertical={false}
          />
          <XAxis
            dataKey="day"
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
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Line
            type="monotone"
            dataKey="planned"
            name="Kế hoạch (Story Points)"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: "#94a3b8", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Thực tế (Story Points)"
            stroke="#F27124"
            strokeWidth={3}
            dot={{ r: 4, fill: "#F27124", strokeWidth: 0 }}
            activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
