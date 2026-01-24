"use client";

import { Users, Crown, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// 👇 Import Type ClassStudent
import { ClassStudent } from "@/features/management/classes/types";

export function StudentClassList({
  students,
  filterTerm,
}: {
  students: ClassStudent[];
  filterTerm: string;
}) {
  // 1. Filter Logic
  const filtered = students.filter(
    (s: ClassStudent) =>
      s.full_name?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      s.student_code?.toLowerCase().includes(filterTerm.toLowerCase()),
  );

  // 2. Group by Team
  const grouped = filtered.reduce(
    (acc, student: ClassStudent) => {
      const key = student.team || "Chưa có nhóm";
      if (!acc[key]) acc[key] = [];
      acc[key].push(student);
      return acc;
    },
    {} as Record<string, ClassStudent[]>,
  );

  const groupKeys = Object.keys(grouped).sort();

  if (students.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20 animate-in fade-in duration-500">
        Lớp chưa có dữ liệu sinh viên.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupKeys.map((group) => {
        const leaders = grouped[group].filter(
          (s: ClassStudent) => s.role === "Leader",
        );
        const leaderName =
          leaders.length > 0 ? leaders[0].full_name : "Chưa có";

        return (
          <Accordion
            type="single"
            collapsible
            key={group}
            className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden transition-all hover:shadow-md"
            defaultValue={group}
          >
            <AccordionItem value={group} className="border-0">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
                <AccordionTrigger className="hover:no-underline py-0 flex-1">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-2xl transition-colors",
                        group === "Chưa có nhóm"
                          ? "bg-slate-200 text-slate-500"
                          : "bg-orange-100 text-[#F27124]",
                      )}
                    >
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-lg tracking-tight">
                        {group}
                      </p>
                      {group !== "Chưa có nhóm" && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Trưởng nhóm:
                          </span>
                          <span className="text-xs font-bold text-[#F27124]">
                            {leaderName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
              </div>

              <AccordionContent className="px-0 pb-0">
                <Table>
                  <TableHeader className="bg-gray-50/80 border-y border-gray-100">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        MSSV
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Thành viên
                      </TableHead>
                      <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Vai trò
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grouped[group].map((s: ClassStudent, index: number) => (
                      <TableRow
                        key={`${s.student_code}-${index}`}
                        className="group/row hover:bg-orange-50/30 transition-colors border-gray-50"
                      >
                        <TableCell className="pl-8 font-semibold text-gray-500 text-sm">
                          {s.student_code}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 py-1">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform group-hover/row:scale-105">
                              <AvatarImage src={s.avatar_url} />
                              <AvatarFallback className="bg-slate-100 text-xs font-bold text-gray-400 uppercase">
                                {s.full_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "text-sm font-medium transition-colors",
                                s.role === "Leader"
                                  ? "font-bold text-gray-900"
                                  : "text-gray-600 group-hover/row:text-gray-900",
                              )}
                            >
                              {s.full_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm font-medium hidden md:table-cell">
                          {s.email}
                        </TableCell>
                        <TableCell className="text-center">
                          {s.role === "Leader" ? (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-none gap-1 py-0.5 px-2.5 text-[10px] font-bold uppercase ring-1 ring-amber-400/20">
                              <Crown className="w-3 h-3 fill-amber-500" />{" "}
                              Leader
                            </Badge>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                              Member
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
