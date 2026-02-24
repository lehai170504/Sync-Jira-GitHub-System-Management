"use client";

import { GraduationCap } from "lucide-react";
import { StudentImport } from "./lecturer/student-import";
import { AddStudentDialog } from "./lecturer/add-student-dialog";

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" />
            {semesterName}
          </div>
          {isConnected && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-emerald-100 dark:border-emerald-800/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              Live Sync
            </div>
          )}
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          Lớp {className}
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
          {subjectName} <span className="opacity-60">({subjectCode})</span>
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <StudentImport classId={classId} onSuccess={onRefresh} />
        <AddStudentDialog classId={classId} onSuccess={onRefresh} />
      </div>
    </div>
  );
}
