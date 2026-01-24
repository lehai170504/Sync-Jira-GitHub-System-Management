"use client";

import { Card, CardContent } from "@/components/ui/card";

interface KPICardsProps {
  submitted: number;
  total: number;
  graded: number;
  deadline: string;
}

export function KPICards({
  submitted,
  total,
  graded,
  deadline,
}: KPICardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="border-none shadow-sm bg-blue-50/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">
            Đã nộp
          </span>
          <span className="text-2xl font-bold text-blue-900">
            {submitted}/{total}
          </span>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm bg-green-50/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wider">
            Đã chấm
          </span>
          <span className="text-2xl font-bold text-green-900">
            {graded}/{submitted}
          </span>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm bg-orange-50/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-orange-600 font-semibold mb-1 uppercase tracking-wider">
            Deadline
          </span>
          <span className="text-lg font-bold text-orange-900">{deadline}</span>
        </CardContent>
      </Card>
    </div>
  );
}
