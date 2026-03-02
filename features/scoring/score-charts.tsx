"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dữ liệu giả lập: Điểm các kỹ năng
const radarData = [
  { subject: "Jira Task", A: 120, fullMark: 150 }, // A là điểm sinh viên
  { subject: "GitHub Commit", A: 98, fullMark: 150 },
  { subject: "Lines of Code", A: 86, fullMark: 150 },
  { subject: "Peer Review", A: 99, fullMark: 150 },
  { subject: "Attendance", A: 85, fullMark: 150 },
]

// Dữ liệu giả lập: Tiến độ qua các Sprint
const sprintData = [
  { name: "Sprint 1", score: 6.5 },
  { name: "Sprint 2", score: 7.2 },
  { name: "Sprint 3", score: 8.5 },
  { name: "Sprint 4", score: 8.1 }, // Có thể bị tụt
]

export function ScoreRadarChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Biểu đồ năng lực</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#6b7280" }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <Radar
              name="My Score"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function ScoreHistoryChart() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Lịch sử điểm số qua các Sprint</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sprintData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}