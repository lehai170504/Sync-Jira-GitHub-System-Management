"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  LayoutGrid,
  MoreHorizontal,
  Crown,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

// Import Types & Components
import { ClassStudent } from "@/features/management/classes/types/class-types";
import { EditStudentDialog } from "./edit-student-dialog";
import { DeleteStudentAlert } from "./delete-student-alert";
import { SendStudentNotification } from "@/features/notifications/components/SendStudentNotification";

interface StudentListProps {
  classId?: string;
  students: ClassStudent[];
  filterTerm: string;
  onRefresh?: () => void;
  lastUpdatedId?: string | null;
}

export function StudentList({
  classId = "",
  students,
  filterTerm,
  onRefresh,
  lastUpdatedId,
}: StudentListProps) {
  const router = useRouter();

  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  // 1. Filter & Grouping Logic
  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      s.student_code?.toLowerCase().includes(filterTerm.toLowerCase()),
  );

  const grouped = filtered.reduce(
    (acc, student) => {
      const key = student.team || "Chưa có nhóm";
      if (!acc[key]) acc[key] = [];
      acc[key].push(student);
      return acc;
    },
    {} as Record<string, ClassStudent[]>,
  );

  const groupKeys = Object.keys(grouped).sort((a, b) => {
    if (a === "Chưa có nhóm") return 1;
    if (b === "Chưa có nhóm") return -1;
    return a.localeCompare(b);
  });

  if (students.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
        <Users className="mx-auto h-12 w-12 text-slate-200 mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
          Lớp chưa có sinh viên nào
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 font-sans">
        {groupKeys.map((group) => {
          const members = grouped[group];
          const leaders = members.filter((s) => s.role === "Leader");
          const leaderName =
            leaders.length > 0
              ? leaders.map((l) => l.full_name).join(", ")
              : "Chưa có";

          return (
            <Accordion
              type="single"
              collapsible
              key={group}
              defaultValue={group}
              className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <AccordionItem value={group} className="border-0" key={group}>
                <div className="flex items-center justify-between px-8 py-5 bg-slate-50/30">
                  <AccordionTrigger className="hover:no-underline py-0 flex-1">
                    <div className="flex items-center gap-5">
                      <div
                        className={`p-4 rounded-[20px] shadow-sm ${group === "Chưa có nhóm" ? "bg-slate-200 text-slate-500" : "bg-orange-100 text-[#F27124]"}`}
                      >
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-slate-900 text-xl tracking-tighter">
                            {group}
                          </p>
                          {group !== "Chưa có nhóm" && (
                            <Badge
                              className={`rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-wider shadow-none border ${leaders.length > 1 ? "bg-red-50 text-red-600 border-red-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}
                            >
                              Leader: {leaderName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                          {members.length} Thành viên
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                </div>

                <AccordionContent className="px-0 pb-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50 border-y border-slate-100">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-10 font-black text-[10px] uppercase tracking-widest text-slate-400">
                          MSSV
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                          Họ và tên
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                          Email
                        </TableHead>
                        <TableHead className="text-center font-black text-[10px] uppercase tracking-widest text-slate-400">
                          Trạng thái
                        </TableHead>
                        <TableHead className="text-center font-black text-[10px] uppercase tracking-widest text-slate-400">
                          Vai trò
                        </TableHead>
                        <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-widest text-slate-400">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((s) => (
                        <TableRow
                          key={s._id}
                          className={`group transition-all duration-700 border-slate-50 ${lastUpdatedId === s._id ? "animate-flash bg-orange-50/50" : "hover:bg-slate-50/50"}`}
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
                                className={`text-sm tracking-tight ${s.role === "Leader" ? "font-black text-slate-900" : "font-bold text-slate-600"}`}
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
                              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 shadow-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3 mr-1.5" /> Đã
                                tham gia
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-400 border-slate-200 shadow-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-widest">
                                <Clock className="w-3 h-3 mr-1.5" /> Chờ đăng ký
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {s.role === "Leader" ? (
                              <Badge className="bg-yellow-400 text-yellow-900 shadow-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-widest">
                                <Crown className="w-3 h-3 mr-1.5 fill-yellow-900" />{" "}
                                Leader
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                Member
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-2xl transition-all"
                                >
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-64 rounded-[24px] p-3 shadow-2xl border-none"
                              >
                                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">
                                  Quản trị sinh viên
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-50 mx-2" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedStudent(s);
                                    setIsNotifyOpen(true);
                                  }}
                                  className="rounded-xl py-3 font-bold text-sm cursor-pointer focus:bg-orange-50 focus:text-[#F27124]"
                                >
                                  <Mail className="mr-3 h-4 w-4" /> Gửi thông
                                  báo riêng
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedStudent(s);
                                    setIsEditOpen(true);
                                  }}
                                  className="rounded-xl py-3 font-bold text-sm cursor-pointer"
                                >
                                  <Pencil className="mr-3 h-4 w-4" /> Chỉnh sửa
                                  thông tin
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-50 mx-2" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedStudent(s);
                                    setIsDeleteOpen(true);
                                  }}
                                  className="rounded-xl py-3 font-bold text-sm text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="mr-3 h-4 w-4" /> Gỡ khỏi
                                  lớp học
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      {/* --- DIALOGS --- */}
      {selectedStudent && (
        <>
          <SendStudentNotification
            student={selectedStudent}
            open={isNotifyOpen}
            onOpenChange={setIsNotifyOpen}
          />
          <EditStudentDialog
            classId={classId}
            student={selectedStudent}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSuccess={onRefresh}
          />
          <DeleteStudentAlert
            classId={classId}
            students={[selectedStudent]}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onSuccess={() => {
              onRefresh?.();
              setSelectedStudent(null);
            }}
          />
        </>
      )}
    </>
  );
}
