"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { Topic } from "./topic-data";

export function TopicStats({ topics }: { topics: Topic[] }) {
  const total = topics.length;
  const pending = topics.filter((t) => t.status === "Pending").length;
  const approved = topics.filter((t) => t.status === "Approved").length;
  const rejected = topics.filter((t) => t.status === "Rejected").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng đề tài
            </p>
            <h3 className="text-2xl font-bold">{total}</h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-[#F27124]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Chờ duyệt
            </p>
            <h3 className="text-2xl font-bold text-[#F27124]">{pending}</h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F27124]">
            <Clock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Đã duyệt
            </p>
            <h3 className="text-2xl font-bold text-green-600">{approved}</h3>
          </div>
          <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-red-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Từ chối</p>
            <h3 className="text-2xl font-bold text-red-600">{rejected}</h3>
          </div>
          <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <XCircle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
