"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

export function DashboardCharts({ breakdown }: { breakdown?: any }) {
  // Ráp data từ BE
  const chartData = [
    { name: "Sinh viên", value: breakdown?.students || 0, color: "#3b82f6" }, // Xanh dương
    { name: "Giảng viên", value: breakdown?.lecturers || 0, color: "#f27124" }, // Cam WDP
    { name: "Admins", value: breakdown?.admins || 0, color: "#8b5cf6" }, // Tím
  ].filter((d) => d.value > 0);

  const total =
    (breakdown?.students || 0) +
    (breakdown?.lecturers || 0) +
    (breakdown?.admins || 0);

  return (
    <Card className="rounded-[24px] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm h-full flex flex-col transition-colors">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          Quy mô Hệ thống
        </CardTitle>
        <p className="text-sm text-slate-500 font-medium">
          Tỉ lệ phân bổ người dùng theo Role
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
        {chartData.length === 0 ? (
          <p className="text-slate-400 italic">Chưa có người dùng nào</p>
        ) : (
          <>
            <div className="relative w-56 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    strokeWidth={0}
                    cornerRadius={8}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="outline-none"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                  {total}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-black">
                  Tài khoản
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-6 gap-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
