"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sub-components
import { StudentTableRow } from "./student-table-row";
import { EditStudentDialog } from "./edit-student-dialog";
import { DeleteStudentAlert } from "./delete-student-alert";
import { SendStudentNotification } from "@/features/notifications/components/SendStudentNotification";
import { ClassStudent } from "@/features/management/classes/types/class-types";

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
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(
    null,
  );
  const [dialogs, setDialogs] = useState({
    edit: false,
    delete: false,
    notify: false,
  });

  const { grouped, groupKeys } = useMemo(() => {
    const filtered = students.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(filterTerm.toLowerCase()) ||
        s.student_code?.toLowerCase().includes(filterTerm.toLowerCase()),
    );

    const groupedData = filtered.reduce(
      (acc, s) => {
        const key = s.team || "Chưa có nhóm";
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
      },
      {} as Record<string, ClassStudent[]>,
    );

    const keys = Object.keys(groupedData).sort((a, b) => {
      if (a === "Chưa có nhóm") return 1;
      if (b === "Chưa có nhóm") return -1;
      return a.localeCompare(b);
    });

    return { grouped: groupedData, groupKeys: keys };
  }, [students, filterTerm]);

  const handleAction = (
    action: "edit" | "delete" | "notify",
    student: ClassStudent,
  ) => {
    setSelectedStudent(student);
    setDialogs((prev) => ({ ...prev, [action]: true }));
  };

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
    <div className="space-y-6 font-sans">
      {groupKeys.map((group) => {
        const members = grouped[group];
        const leaders = members.filter((s) => s.role === "Leader");

        return (
          <Accordion
            type="single"
            collapsible
            key={`group-${group}`}
            defaultValue={group}
            className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden transition-all hover:shadow-md"
          >
            <AccordionItem value={group} className="border-0">
              <div className="flex items-center justify-between px-8 py-5 bg-slate-50/30">
                <AccordionTrigger className="hover:no-underline py-0 flex-1">
                  <div className="flex items-center gap-5">
                    <div
                      className={
                        group === "Chưa có nhóm"
                          ? "p-4 rounded-[20px] bg-slate-200 text-slate-500"
                          : "p-4 rounded-[20px] bg-orange-100 text-[#F27124]"
                      }
                    >
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-left space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-black text-slate-900 text-xl tracking-tighter">
                          {group}
                        </p>
                        {group !== "Chưa có nhóm" && (
                          <Badge className="rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-wider bg-yellow-50 text-yellow-700 border-yellow-100 border shadow-none">
                            Leader:{" "}
                            {leaders.map((l) => l.full_name).join(", ") ||
                              "Chưa có"}
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
              <AccordionContent className="px-0 pb-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 border-y border-slate-100">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-10 font-black text-[10px] uppercase text-slate-400 tracking-widest">
                        MSSV
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-widest">
                        Họ và tên
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-widest">
                        Email
                      </TableHead>
                      <TableHead className="text-center font-black text-[10px] uppercase text-slate-400 tracking-widest">
                        Trạng thái
                      </TableHead>
                      <TableHead className="text-center font-black text-[10px] uppercase text-slate-400 tracking-widest">
                        Vai trò
                      </TableHead>
                      <TableHead className="text-right pr-10 font-black text-[10px] uppercase text-slate-400 tracking-widest">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((s, index) => (
                      <StudentTableRow
                        key={s._id || `student-${index}`}
                        student={s}
                        lastUpdatedId={lastUpdatedId}
                        onAction={handleAction}
                      />
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}

      {selectedStudent && (
        <>
          <SendStudentNotification
            student={selectedStudent}
            open={dialogs.notify}
            onOpenChange={(val) => setDialogs((d) => ({ ...d, notify: val }))}
          />
          <EditStudentDialog
            classId={classId}
            student={selectedStudent}
            open={dialogs.edit}
            onOpenChange={(val) => setDialogs((d) => ({ ...d, edit: val }))}
            onSuccess={onRefresh}
          />
          <DeleteStudentAlert
            classId={classId}
            students={[selectedStudent]}
            open={dialogs.delete}
            onOpenChange={(val) => setDialogs((d) => ({ ...d, delete: val }))}
            onSuccess={() => {
              onRefresh?.();
              setSelectedStudent(null);
            }}
          />
        </>
      )}
    </div>
  );
}
