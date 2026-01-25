"use client";

import { GraduationCap } from "lucide-react";
import { StudentImport } from "./student-import";
import { AddStudentDialog } from "./add-student-dialog";

interface ClassHeaderProps {
  className: string;
  subjectName: string;
  subjectCode: string;
  semesterName: string;
  classId: string;
  isConnected: boolean;
  onRefresh: () => void;
}

export function ClassHeader({
  className,
  subjectName,
  subjectCode,
  semesterName,
  classId,
  isConnected,
  onRefresh,
}: ClassHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#F27124] mb-1">
          <GraduationCap className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-widest">
            {semesterName}
          </span>
          {isConnected && (
            <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase tracking-widest animate-pulse">
              Live Sync
            </div>
          )}
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
          Lớp {className}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {subjectName} ({subjectCode})
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <StudentImport classId={classId} onSuccess={onRefresh} />
        <AddStudentDialog classId={classId} onSuccess={onRefresh} />
      </div>
    </div>
  );
}
