"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, FileSpreadsheet } from "lucide-react";
import { ScoreBoardDialog } from "./score-board-dialog"; // ✅ Import component vừa tách

// Types
interface Student {
  id: number;
  name: string;
  roll: string;
  email: string;
  team: string;
}

interface ClassDetail {
  id: string;
  code: string;
  subject: string;
  lecturer: string;
  students: number;
  status: string;
  semester: string;
}

interface ClassDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: ClassDetail | null;
  students: Student[];
}

export function ClassDetailDrawer({
  isOpen,
  onOpenChange,
  selectedClass,
  students,
}: ClassDetailDrawerProps) {
  const [isScoreBoardOpen, setIsScoreBoardOpen] = useState(false);

  if (!selectedClass) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto p-0 rounded-l-2xl border-l shadow-2xl">
          {/* HEADER SECTION */}
          <div className="bg-gray-50 p-6 border-b sticky top-0 z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-500 mb-2"
                >
                  {selectedClass.subject} • {selectedClass.semester}
                </Badge>
                <SheetTitle className="text-3xl font-bold text-gray-900">
                  Lớp {selectedClass.code}
                </SheetTitle>
                <SheetDescription className="mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />{" "}
                    {selectedClass.lecturer}
                  </span>
                </SheetDescription>
              </div>
              <Badge
                className={`text-sm px-3 py-1 ${
                  selectedClass.status === "Active"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-500"
                }`}
              >
                {selectedClass.status}
              </Badge>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  Sĩ số
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedClass.students}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  Nhóm
                </p>
                <p className="text-xl font-bold text-gray-900">5</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  Tiến độ
                </p>
                <p className="text-xl font-bold text-[#F27124]">68%</p>
              </div>
            </div>
          </div>

          {/* STUDENT LIST CONTENT */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                Danh sách Sinh viên
              </h3>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                Total: {students.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {students.map((std) => (
                <div
                  key={std.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarFallback className="bg-orange-50 text-[#F27124] font-bold">
                        {std.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-[#F27124] transition-colors">
                        {std.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {std.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 border-gray-200 font-mono"
                    >
                      {std.team}
                    </Badge>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">
                      {std.roll}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t sticky bottom-0 bg-white pb-6">
              <Button
                className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F27124] hover:border-orange-200 transition-all shadow-sm h-12 text-base font-medium"
                onClick={() => setIsScoreBoardOpen(true)}
              >
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Xem bảng điểm chi tiết
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ✅ CALL SCORE BOARD DIALOG */}
      <ScoreBoardDialog
        isOpen={isScoreBoardOpen}
        onOpenChange={setIsScoreBoardOpen}
        classCode={selectedClass.code}
        students={students}
      />
    </>
  );
}
