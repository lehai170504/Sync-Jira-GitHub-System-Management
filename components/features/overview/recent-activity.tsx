"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  MoreHorizontal,
} from "lucide-react";
import { activityData } from "./overview-data";

export function RecentActivity() {
  const getIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-3.5 w-3.5 text-blue-600" />;
      case "task":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
      case "alert":
        return <AlertTriangle className="h-3.5 w-3.5 text-red-600" />;
      default:
        return <GitCommit className="h-3.5 w-3.5" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "commit":
        return "bg-blue-100";
      case "task":
        return "bg-green-100";
      case "alert":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <Card className="col-span-3 shadow-sm border-gray-200 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
          <CardDescription>Nhật ký hệ thống real-time.</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-900"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pr-2">
        <div className="space-y-6">
          {activityData.map((item, i) => (
            <div className="flex gap-4 group" key={i}>
              {/* Avatar */}
              <Avatar className="h-9 w-9 border border-gray-100 flex-shrink-0">
                <AvatarImage src={item.user.avatar} />
                <AvatarFallback className="bg-orange-50 text-[#F27124] font-bold text-[10px]">
                  {item.user.fallback}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {item.user.name}
                  </span>{" "}
                  {item.action}
                </p>
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#F27124] transition-colors cursor-pointer">
                  {item.target}
                </p>

                <div className="flex items-center gap-2 mt-1.5">
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 px-1.5 font-normal bg-gray-100 text-gray-500"
                  >
                    {item.project}
                  </Badge>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>

              {/* Status Icon */}
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${getBgColor(item.type)}`}
              >
                {getIcon(item.type)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
