"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Class } from "@/features/management/classes/types/class-types";

export function ClassStats({ data }: { data: Class[] }) {
  // TODO: Nếu API trả về số lượng sinh viên, tính tổng ở đây
  const totalStudents = 0;
  const activeClasses = data.length; // Giả định status Active

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm border-l-4 border-l-[#F27124]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng lớp học
            </p>
            <h3 className="text-2xl font-bold">{data.length}</h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F27124]">
            <BookOpen className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang hoạt động
            </p>
            <h3 className="text-2xl font-bold text-blue-600">
              {activeClasses}
            </h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng sinh viên
            </p>
            <h3 className="text-2xl font-bold text-green-600">
              {totalStudents}
            </h3>
          </div>
          <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <GraduationCap className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
