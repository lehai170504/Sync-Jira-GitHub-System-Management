"use client";

import { ArrowRight, Users, Calendar, Filter, Search } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseGridProps {
  classes: any[];
  onSelectClass: (cls: any) => void;
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
              {cls.semester}
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
          <CardContent className="flex-1 p-5">
            <h4 className="font-bold text-gray-800 line-clamp-2 h-10 text-base mb-4 group-hover:text-[#F27124] transition-colors">
              {cls.subjectName}
            </h4>
            <div className="space-y-2.5 pt-3 border-t border-dashed border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-6 flex justify-center mr-2">
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <span className="font-medium text-gray-900 mr-1">
                  {cls.students}
                </span>
                <span className="text-gray-500 text-xs">sinh viên</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-6 flex justify-center mr-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-gray-700 font-medium text-xs">
                  {cls.schedule}
                </span>
              </div>
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
