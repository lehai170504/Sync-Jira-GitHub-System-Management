"use client";

import { ArrowRight, Users, Filter, Search, Crown } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // 👇 Import Badge

// Định nghĩa lại Type cho chuẩn xác hơn
export interface CourseItem {
  id: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  color: string;
  semester?: string;
  // Dành cho Giảng viên
  students?: number;
  // Dành cho Sinh viên
  role?: "Leader" | "Member";
  teamName?: string;
  isLeader?: boolean;
}

interface CourseGridProps {
  classes: CourseItem[]; // Sử dụng Type CourseItem thay vì any[]
  onSelectClass: (cls: CourseItem) => void;
  onClearFilter: () => void;
}

export function CourseGrid({
  classes,
  onSelectClass,
  onClearFilter,
}: CourseGridProps) {
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Không tìm thấy lớp học nào
        </h3>
        <p className="text-gray-500 text-sm max-w-md mt-1">
          Thử thay đổi bộ lọc học kỳ hoặc từ khóa tìm kiếm của bạn.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-dashed"
          onClick={onClearFilter}
        >
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
      {classes.map((cls) => (
        <Card
          key={cls.id}
          className="group overflow-hidden border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full bg-white ring-1 ring-gray-200 hover:ring-[#F27124]/50"
          onClick={() => onSelectClass(cls)}
        >
          {/* Card Header Color */}
          <div
            className={`h-32 ${cls.color} relative p-6 flex flex-col justify-between`}
          >
            <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
              <ArrowRight className="text-white w-4 h-4" />
            </div>

            <span className="bg-black/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-fit backdrop-blur-md uppercase tracking-wide border border-white/10">
              {cls.semester || "N/A"}
            </span>

            <div>
              <h3 className="text-2xl font-bold text-white mb-0.5 tracking-tight group-hover:underline decoration-2 underline-offset-4 decoration-white/50">
                {cls.className}
              </h3>
              <p className="text-white/90 text-xs font-bold uppercase tracking-wider opacity-80">
                {cls.subjectCode}
              </p>
            </div>
          </div>

          {/* Card Body */}
          <CardContent className="flex-1 p-5 flex flex-col">
            <h4 className="font-bold text-gray-800 line-clamp-2 h-10 text-base mb-4 group-hover:text-[#F27124] transition-colors">
              {cls.subjectName}
            </h4>

            <div className="mt-auto space-y-2.5 pt-3 border-t border-dashed border-gray-100">
              {/* 👇 LOGIC HIỂN THỊ ĐA DẠNG */}
              {cls.role ? (
                // --- GIAO DIỆN CHO SINH VIÊN (Hiển thị Role & Team) ---
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`gap-1 pr-2.5 shadow-none border ${
                        cls.isLeader
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {cls.isLeader && (
                        <Crown className="w-3 h-3 fill-yellow-500 text-yellow-600" />
                      )}
                      {cls.role}
                    </Badge>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {cls.teamName || "Chưa có nhóm"}
                  </span>
                </div>
              ) : (
                // --- GIAO DIỆN CHO GIẢNG VIÊN (Hiển thị số lượng SV) ---
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-6 flex justify-center mr-2">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-900 mr-1">
                    {cls.students || 0}
                  </span>
                  <span className="text-gray-500 text-xs">sinh viên</span>
                </div>
              )}
            </div>
          </CardContent>

          {/* Card Footer */}
          <CardFooter className="px-5 py-3 bg-gray-50 border-t flex justify-between items-center group-hover:bg-[#FFF8F3] transition-colors">
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#F27124] uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Dashboard
            </span>
            <div className="h-6 w-6 rounded-full bg-white border flex items-center justify-center group-hover:border-[#F27124] transition-colors shadow-sm">
              <ArrowRight className="h-3 w-3 text-[#F27124]" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
