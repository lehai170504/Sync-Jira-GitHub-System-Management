"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  LayoutGrid,
  ArrowRight,
  MoreHorizontal,
  Crown,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
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
import { ClassStudent } from "@/features/management/classes/types";
import { EditStudentDialog } from "./edit-student-dialog";
import { DeleteStudentAlert } from "./delete-student-alert";

interface StudentListProps {
  classId?: string;
  students: ClassStudent[];
  filterTerm: string;
  onRefresh?: () => void;
}

export function StudentList({
  classId = "",
  students,
  filterTerm,
  onRefresh,
}: StudentListProps) {
  const router = useRouter();

  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 1. Filter Logic
  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      s.student_code?.toLowerCase().includes(filterTerm.toLowerCase()),
  );

  // 2. Group by Team
  const grouped = filtered.reduce(
    (acc, student) => {
      const key = student.team || "Chưa có nhóm";
      if (!acc[key]) acc[key] = [];
      acc[key].push(student);
      return acc;
    },
    {} as Record<string, ClassStudent[]>,
  );

  const groupKeys = Object.keys(grouped).sort();

  const navigateToTeamDetail = (groupName: string) => {
    const teamId = groupName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/lecturer/teams/${teamId}`);
  };

  // Handlers
  const handleEditClick = (student: ClassStudent) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (student: ClassStudent) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  if (students.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Lớp chưa có sinh viên nào.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {groupKeys.map((group) => {
          const leaders = grouped[group].filter((s) => s.role === "Leader");
          const leaderName =
            leaders.length > 0
              ? leaders.map((l) => l.full_name).join(", ")
              : "Chưa có";

          return (
            <Accordion
              type="single"
              collapsible
              key={group}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              defaultValue={group}
            >
              <AccordionItem value={group} className="border-0">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                  <AccordionTrigger className="hover:no-underline py-0 flex-1">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-full ${
                          group === "Chưa có nhóm"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-base">
                            {group}
                          </p>
                          {group !== "Chưa có nhóm" && (
                            <Badge
                              variant="secondary"
                              className={`text-[10px] font-normal h-5 px-1.5 border ${
                                leaders.length > 1
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }`}
                            >
                              Leader: {leaderName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          {grouped[group].length} thành viên
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {group !== "Chưa có nhóm" && (
                    <Button
                      size="sm"
                      className="ml-4 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToTeamDetail(group);
                      }}
                    >
                      <LayoutGrid className="mr-2 h-3.5 w-3.5" /> Chi tiết{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>

                <AccordionContent className="px-0 pb-0">
                  <Table>
                    <TableHeader className="bg-gray-50 border-y border-gray-100">
                      <TableRow>
                        <TableHead className="pl-6 w-[120px]">MSSV</TableHead>
                        <TableHead>Họ và tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">
                          Trạng thái
                        </TableHead>
                        <TableHead className="text-center w-[100px]">
                          Vai trò
                        </TableHead>
                        <TableHead className="text-right pr-6">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grouped[group].map((s, index) => (
                        <TableRow
                          // Dùng _id chuẩn từ API
                          key={`${s._id}-${index}`}
                          className="hover:bg-orange-50/10 transition-colors"
                        >
                          <TableCell className="font-medium pl-6 text-gray-700">
                            {s.student_code}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 border border-gray-100">
                                <AvatarImage src={s.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-tr from-orange-400 to-pink-500 text-white text-[10px] font-bold">
                                  {s.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={
                                  s.role === "Leader"
                                    ? "font-bold text-gray-900"
                                    : "text-gray-700"
                                }
                              >
                                {s.full_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">
                            {s.email}
                          </TableCell>
                          <TableCell className="text-center">
                            {s.status === "Enrolled" ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 gap-1 pr-2 shadow-none font-normal"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span className="hidden sm:inline">
                                  Đã tham gia
                                </span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-50 text-gray-600 border-gray-200 gap-1 pr-2 shadow-none font-normal"
                              >
                                <Clock className="w-3 h-3" />
                                <span className="hidden sm:inline">
                                  Chờ đăng ký
                                </span>
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {s.role === "Leader" ? (
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 shadow-none gap-1">
                                <Crown className="w-3 h-3 fill-yellow-500 text-yellow-600" />
                                Leader
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Member
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(s)}
                                >
                                  <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(s)}
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Xóa sinh
                                  viên
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

      {/* DIALOGS */}
      {selectedStudent && (
        <>
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
