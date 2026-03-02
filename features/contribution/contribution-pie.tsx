"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ContributionItem } from "./types";

type Props = {
  data: ContributionItem[];
  colors: string[];
};

export function ContributionPie({ data, colors }: Props) {
  return (
    <Card className="md:col-span-3 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Biểu đồ tỷ lệ đóng góp (%) theo thành viên</CardTitle>
      </CardHeader>
      <CardContent className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="initials"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={entry.id} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name, props: any) => {
                const member = data.find((m) => m.initials === props?.payload?.name);
                return [`${value}%`, member?.name ?? props.name];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: 12,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


