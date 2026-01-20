"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, School, UserCheck, Users } from "lucide-react";
import { User } from "./user-types";

export function UserStats({ users }: { users: User[] }) {
  const total = users.length;
  const lecturers = users.filter((u) => u.role === "LECTURER").length;
  const students = users.filter((u) => u.role === "MEMBER").length;
  const active = users.filter((u) => u.status === "Active").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm border-l-4 border-l-[#F27124]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng người dùng
            </p>
            <h3 className="text-2xl font-bold">{total}</h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F27124]">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Giảng viên
            </p>
            <h3 className="text-2xl font-bold text-blue-600">{lecturers}</h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <School className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-purple-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Sinh viên
            </p>
            <h3 className="text-2xl font-bold text-purple-600">{students}</h3>
          </div>
          <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
            <GraduationCap className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang hoạt động
            </p>
            <h3 className="text-2xl font-bold text-green-600">{active}</h3>
          </div>
          <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <UserCheck className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
