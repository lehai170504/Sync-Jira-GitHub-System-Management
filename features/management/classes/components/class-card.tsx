"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, Users } from "lucide-react";
import { Class } from "@/features/management/classes/types";

interface ClassCardProps {
  cls: Class;
  onClick: () => void;
  onEdit: (cls: Class) => void;
}

export function ClassCard({ cls, onClick, onEdit }: ClassCardProps) {
  // Hàm helper lấy màu status (giả định có status, nếu không thì mặc định)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700 border-green-200";
      case "Finished": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <Card
      className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-gray-200 rounded-2xl overflow-hidden cursor-pointer bg-white"
      onClick={onClick}
    >
      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start">
          {/* Badge Môn học / Code */}
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-200 font-mono text-xs px-2 py-0.5 rounded-md"
          >
            {cls.semester?.code || "N/A"}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cls);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                className="text-red-600"
              >
                Xóa lớp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2">
          {/* Tên lớp */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#F27124] transition-colors line-clamp-1" title={cls.name}>
            {cls.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{cls.semester?.code || "Unknown Semester"}</span>
            <span className="text-gray-300">•</span>
            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 h-5 border ${getStatusColor("Active")}`}
            >
              Active
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {/* Giảng viên */}
        <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-orange-50/30 group-hover:border-orange-100 transition-colors">
          <Avatar className="h-9 w-9 border border-white shadow-sm">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
              {cls.lecturer?.full_name?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Giảng viên
            </p>
            <p className="text-sm font-semibold text-gray-700 truncate">
              {cls.lecturer?.full_name || "Chưa phân công"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span className="font-medium">0</span> Sinh viên
        </div>
        <div className="text-xs text-[#F27124] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Xem chi tiết →
        </div>
      </CardFooter>
    </Card>
  );
}