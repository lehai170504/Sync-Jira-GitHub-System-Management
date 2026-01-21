"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3, GitBranch, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data cho Score Breakdown
const scoreBreakdownData = [
  { 
    name: "Jira", 
    value: 35, 
    color: "#3B82F6",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    icon: CheckCircle2,
    description: "Tasks hoàn thành"
  },
  { 
    name: "Git", 
    value: 40, 
    color: "#10B981",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    icon: GitBranch,
    description: "Code commits"
  },
  { 
    name: "Peer", 
    value: 25, 
    color: "#F59E0B",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
    icon: Users,
    description: "Đánh giá chéo"
  },
];

const COLORS = scoreBreakdownData.map((item) => item.color);
const TOTAL_SCORE = scoreBreakdownData.reduce((sum, item) => sum + item.value, 0);

export function ScoreBreakdown() {
  return (
    <div className="space-y-6">
      {/* Main Chart Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#F27124]" />
                Phân bổ điểm (Score Breakdown)
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1.5">
                Tỷ lệ điểm từ các nguồn: Jira, Git, và Peer Review
              </p>
            </div>
            <div className="px-4 py-2 bg-gradient-to-br from-[#F27124] to-orange-600 rounded-xl shadow-md">
              <div className="text-2xl font-bold text-white">{TOTAL_SCORE}</div>
              <div className="text-xs text-white/90">Tổng điểm</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[420px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => {
                    const item = scoreBreakdownData.find((d) => d.name === name);
                    return `${name}\n${value} điểm (${(percent * 100).toFixed(0)}%)`;
                  }}
                  outerRadius={140}
                  innerRadius={70}
                  paddingAngle={3}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreBreakdownData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const item = scoreBreakdownData.find((d) => d.name === name);
                    return [`${value} điểm (${item?.description})`, name];
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    fontSize: 13,
                    padding: "12px 16px",
                    backgroundColor: "white",
                    fontWeight: 500,
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={50}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "24px" }}
                  formatter={(value) => {
                    const item = scoreBreakdownData.find((d) => d.name === value);
                    return (
                      <span 
                        style={{ 
                          color: item?.color, 
                          fontWeight: 600,
                          fontSize: "13px"
                        }}
                      >
                        {value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scoreBreakdownData.map((item) => {
          const Icon = item.icon;
          const percentage = ((item.value / TOTAL_SCORE) * 100).toFixed(1);
          
          return (
            <Card
              key={item.name}
              className={cn(
                "group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                "bg-gradient-to-br from-white to-gray-50/30"
              )}
            >
              {/* Gradient Background Effect */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                  item.gradientFrom,
                  item.gradientTo
                )}
              />
              
              {/* Decorative Circle */}
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: item.color }}
              />

              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-xl shadow-sm"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-muted-foreground">
                      {percentage}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    điểm {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:shadow-sm"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

