"use client";

import { Crown, CheckCircle2, Clock } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClassStudent } from "@/features/management/classes/types/class-types";
import { StudentActionDropdown } from "./student-action-dropdown";
import { cn } from "@/lib/utils";

interface StudentTableRowProps {
  student: ClassStudent;
  lastUpdatedId?: string | null;
  onAction: (
    action: "edit" | "delete" | "notify",
    student: ClassStudent,
  ) => void;
}

export function StudentTableRow({
  student: s,
  lastUpdatedId,
  onAction,
}: StudentTableRowProps) {
  return (
    <TableRow
      className={cn(
        "group transition-all duration-500 border-slate-50",
        lastUpdatedId === s._id
          ? "animate-pulse bg-orange-50/50"
          : "hover:bg-slate-50/50",
      )}
    >
      <TableCell className="font-black pl-10 text-slate-900 text-sm tracking-tight">
        {s.student_code}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
            <AvatarImage src={s.avatar_url} />
            <AvatarFallback className="bg-orange-100 text-[#F27124] text-xs font-black">
              {s.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span
            className={
              s.role === "Leader"
                ? "font-black text-slate-900"
                : "font-bold text-slate-600"
            }
          >
            {s.full_name}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-slate-400 text-xs font-bold">
        {s.email}
      </TableCell>
      <TableCell className="text-center">
        {s.status === "Enrolled" ? (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] px-3 py-1 rounded-full uppercase">
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Đã tham gia
          </Badge>
        ) : (
          <Badge className="bg-slate-100 text-slate-400 border-slate-200 font-black text-[9px] px-3 py-1 rounded-full uppercase">
            <Clock className="w-3 h-3 mr-1.5" /> Chờ đăng ký
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-center">
        {s.role === "Leader" ? (
          <Badge className="bg-yellow-400 text-yellow-900 font-black text-[9px] px-3 py-1 rounded-full uppercase">
            <Crown className="w-3 h-3 mr-1.5 fill-yellow-900" /> Leader
          </Badge>
        ) : (
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Member
          </span>
        )}
      </TableCell>
      <TableCell className="text-right pr-10">
        <StudentActionDropdown student={s} onAction={onAction} />
      </TableCell>
    </TableRow>
  );
}
