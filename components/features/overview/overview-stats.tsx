"use client";

import { Card, CardContent } from "@/components/ui/card";
import { statsData } from "./overview-data";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export function OverviewStats() {
  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUp className="h-3 w-3 text-green-600" />;
    if (trend === "down") return <ArrowDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="shadow-sm border-gray-100 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs">
              {getTrendIcon(stat.trend)}
              <span className="text-muted-foreground font-medium">
                {stat.subtext}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
