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
          className="h-10 w-10 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-[24px] p-3 shadow-2xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-sans"
      >
        <DropdownMenuLabel className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 py-2">
          Quản trị sinh viên
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800 mx-2" />
        <DropdownMenuItem
          onClick={() => onAction("notify", student)}
          className="rounded-xl py-3 font-bold text-sm text-slate-700 dark:text-slate-300 focus:bg-orange-50 dark:focus:bg-orange-900/20 focus:text-[#F27124] dark:focus:text-orange-400 cursor-pointer"
        >
          <Mail className="mr-3 h-4 w-4" /> Gửi thông báo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction("edit", student)}
          className="rounded-xl py-3 font-bold text-sm text-slate-700 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 cursor-pointer"
        >
          <Pencil className="mr-3 h-4 w-4" /> Chỉnh sửa thông tin
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800 mx-2" />
        <DropdownMenuItem
          onClick={() => onAction("delete", student)}
          className="rounded-xl py-3 font-bold text-sm text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
        >
          <Trash2 className="mr-3 h-4 w-4" /> Gỡ khỏi lớp học
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
