"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ContributionItem } from "./types";

type Props = {
  data: ContributionItem[];
  colors: string[];
};

export function ContributionSummary({ data, colors }: Props) {
  const total = data.reduce((sum, m) => sum + m.value, 0);

  return (
    <Card className="md:col-span-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Chi tiết tỷ lệ đóng góp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((m, index) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border bg-background">
                <AvatarFallback
                  className="text-[10px] font-semibold text-white"
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-[11px] text-muted-foreground">Đóng góp tổng hợp</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{m.value}%</p>
              <p className="text-[11px] text-muted-foreground">
                {((m.value / total) * 100).toFixed(1)}% trên tổng nhóm
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


