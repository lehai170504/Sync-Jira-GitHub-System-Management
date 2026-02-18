"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Class } from "@/features/management/classes/types/class-types";

export function ClassStats({ data }: { data: Class[] }) {
  const totalStudents = 0;
  const activeClasses = data.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm border-l-4 border-l-[#F27124] dark:bg-slate-900 dark:border-t-0 dark:border-r-0 dark:border-b-0">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng lớp học
            </p>
            <h3 className="text-2xl font-bold dark:text-slate-50">
              {data.length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center text-[#F27124]">
            <BookOpen className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-blue-500 dark:bg-slate-900 dark:border-t-0 dark:border-r-0 dark:border-b-0">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang hoạt động
            </p>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activeClasses}
            </h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-green-500 dark:bg-slate-900 dark:border-t-0 dark:border-r-0 dark:border-b-0">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng sinh viên
            </p>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalStudents}
            </h3>
          </div>
          <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
            <GraduationCap className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
