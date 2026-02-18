"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, School, UserCheck, Users } from "lucide-react";
import { User } from "@/features/management/users/types";

interface UserStatsProps {
  users: User[];
  totalUsers: number;
}

export function UserStats({ users, totalUsers }: UserStatsProps) {
  const lecturers = users.filter((u) => u.role === "LECTURER").length;
  const students = users.filter((u) => u.role === "STUDENT").length;
  const active = users.filter(
    (u) => (u.status || "Active") === "Active",
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm border-l-4 border-l-[#F27124] dark:bg-slate-900 dark:border-t-0 dark:border-r-0 dark:border-b-0 transition-colors">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">
              Tổng người dùng
            </p>
            <h3 className="text-2xl font-bold dark:text-slate-100">
              {totalUsers}
            </h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center text-[#F27124]">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-blue-500 dark:bg-slate-900 dark:border-t-0 dark:border-r-0 dark:border-b-0 transition-colors">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">
              Giảng viên (Trang này)
            </p>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {lecturers}
            </h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <School className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-purple-500 dark:bg-slate-900 dark:border-t-0 dark:border-r-0 dark:border-b-0 transition-colors">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">
              Sinh viên (Trang này)
            </p>
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {students}
            </h3>
          </div>
          <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
            <GraduationCap className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-green-500 dark:bg-slate-900 dark:border-t-0 dark:border-r-0 dark:border-b-0 transition-colors">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">
              Đang hoạt động
            </p>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {active}
            </h3>
          </div>
          <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
