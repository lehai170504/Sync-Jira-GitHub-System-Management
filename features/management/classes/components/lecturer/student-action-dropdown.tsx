"use client";

import { MoreHorizontal, Mail, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassStudent } from "@/features/management/classes/types/class-types";

interface StudentActionDropdownProps {
  student: ClassStudent;
  onAction: (
    action: "edit" | "delete" | "notify",
    student: ClassStudent,
  ) => void;
}

export function StudentActionDropdown({
  student,
  onAction,
}: StudentActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-[24px] p-3 shadow-2xl border-none font-sans"
      >
        <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">
          Quản trị sinh viên
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50 mx-2" />
        <DropdownMenuItem
          onClick={() => onAction("notify", student)}
          className="rounded-xl py-3 font-bold text-sm focus:bg-orange-50 focus:text-[#F27124] cursor-pointer"
        >
          <Mail className="mr-3 h-4 w-4" /> Gửi thông báo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction("edit", student)}
          className="rounded-xl py-3 font-bold text-sm cursor-pointer"
        >
          <Pencil className="mr-3 h-4 w-4" /> Chỉnh sửa thông tin
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-50 mx-2" />
        <DropdownMenuItem
          onClick={() => onAction("delete", student)}
          className="rounded-xl py-3 font-bold text-sm text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
        >
          <Trash2 className="mr-3 h-4 w-4" /> Gỡ khỏi lớp học
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
