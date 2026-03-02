"use client";

import { ScoreBreakdown } from "./score-breakdown";

// 1. Định nghĩa Props
interface MyStatisticsTabProps {
  classId?: string;
}

export function MyStatisticsTab({ classId }: MyStatisticsTabProps) {
  return (
    <div className="space-y-6">
      <ScoreBreakdown classId={classId} />
    </div>
  );
}
