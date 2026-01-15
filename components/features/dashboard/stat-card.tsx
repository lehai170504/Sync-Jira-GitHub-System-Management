"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: any;
  trend: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-muted/50">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {trend === "up" ? (
            <span className="text-green-600 flex items-center font-medium mr-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {subtext}
            </span>
          ) : trend === "down" ? (
            <span className="text-red-500 flex items-center font-medium mr-1">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              {subtext}
            </span>
          ) : (
            <span className="text-muted-foreground mr-1">{subtext}</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
