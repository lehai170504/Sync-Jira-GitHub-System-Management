"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  GraduationCap,
  CalendarDays,
  Settings2,
  Clock,
  BookOpen,
  Hash,
  GitCommit,
  Trello,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Import Type chuẩn từ file types
import { Class } from "@/features/management/classes/types/class-types";

export interface Student {
  id: number;
  name: string;
  roll: string;
  email: string;
  team: string;
}

interface ClassDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: Class | null;
  students: Student[];
}

export function ClassDetailDrawer({
  isOpen,
  onOpenChange,
  selectedClass,
  students,
}: ClassDetailDrawerProps) {
  if (!selectedClass) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* Tăng độ rộng max-width lên chút để thoáng hơn */}
      <SheetContent className="w-full sm:max-w-[700px] p-0 bg-white flex flex-col h-full border-l shadow-2xl">
        {/* --- 1. HEADER (STICKY & MODERN) --- */}
        <div className="px-6 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <SheetHeader className="space-y-4">
            {/* Breadcrumb & Status Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {selectedClass.semester_id?.code}
                </span>
                <span className="text-slate-300">/</span>
                <span className="truncate max-w-[200px]">
                  {selectedClass.subjectName}
                </span>
              </div>

              <Badge
                className={`px-3 py-1 rounded-full font-semibold border ${
                  selectedClass.status === "Active"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
                variant="outline"
              >
                {selectedClass.status === "Active" && (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                {selectedClass.status || "Unknown"}
              </Badge>
            </div>

            {/* Main Title Area */}
            <div className="space-y-1">
              <SheetTitle className="text-3xl font-bold text-slate-900 tracking-tight">
                {selectedClass.name}
              </SheetTitle>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span className="font-mono text-slate-700">
                    {selectedClass.class_code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Tạo ngày {formatDate(selectedClass.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Lecturer Card - Compact */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-[#F27124] to-orange-600 text-white font-bold">
                    {selectedClass.lecturer_id?.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    Giảng viên
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedClass.lecturer_id?.full_name}
                  </p>
                </div>
              </div>
              <div className="text-right px-2">
                <p className="text-xs font-medium text-slate-500">
                  {selectedClass.lecturer_id?.email}
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* --- 2. SCROLLABLE BODY --- */}
        <ScrollArea className="flex-1 bg-white">
          <div className="p-6 space-y-8">
            {/* SECTION: KPI / WEIGHTS */}
            <section>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Settings2 className="h-5 w-5 text-[#F27124]" />
                Cấu hình đánh giá
              </h3>

              {selectedClass.contributionConfig ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* JIRA CARD */}
                  <div className="group p-4 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-md transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.08] group-hover:opacity-15 transition-opacity">
                      <Trello className="h-16 w-16 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        Jira Tracking
                      </span>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">
                        {selectedClass.contributionConfig.jiraWeight * 100}
                        <span className="text-lg text-slate-400 font-medium">
                          %
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* GIT CARD */}
                  <div className="group p-4 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_-3px_rgba(147,51,234,0.1)] hover:shadow-md transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.08] group-hover:opacity-15 transition-opacity">
                      <GitCommit className="h-16 w-16 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                        Git Commits
                      </span>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">
                        {selectedClass.contributionConfig.gitWeight * 100}
                        <span className="text-lg text-slate-400 font-medium">
                          %
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* REVIEW CARD */}
                  <div className="group p-4 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_-3px_rgba(249,115,22,0.1)] hover:shadow-md transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.08] group-hover:opacity-15 transition-opacity">
                      <MessageSquare className="h-16 w-16 text-orange-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                        Code Review
                      </span>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">
                        {selectedClass.contributionConfig.reviewWeight * 100}
                        <span className="text-lg text-slate-400 font-medium">
                          %
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Extra Config */}
                  <div className="sm:col-span-3 mt-1 flex items-center justify-between px-1">
                    <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Điểm thưởng vượt trần (Over Ceiling)
                    </span>
                    <Badge
                      variant={
                        selectedClass.contributionConfig.allowOverCeiling
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full px-4"
                    >
                      {selectedClass.contributionConfig.allowOverCeiling
                        ? "Cho phép"
                        : "Không cho phép"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                  <Settings2 className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-sm font-medium">
                    Chưa thiết lập cấu hình trọng số
                  </p>
                </div>
              )}
            </section>

            <Separator className="bg-slate-100" />

            {/* SECTION: STUDENTS LIST */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#F27124]" />
                  Danh sách Sinh viên
                </h3>
                <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-xs font-bold">
                  {students.length} thành viên
                </span>
              </div>

              <div className="space-y-3">
                {students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                    <Users className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm">
                      Chưa có sinh viên nào trong lớp này.
                    </p>
                  </div>
                ) : (
                  students.map((std) => (
                    <div
                      key={std.id}
                      className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-100 bg-slate-50">
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-sm group-hover:bg-[#F27124] group-hover:text-white transition-colors">
                            {std.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-[#F27124] transition-colors">
                            {std.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {std.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold font-mono mb-1">
                          {std.roll}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {std.team}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* --- 3. FOOTER INFO --- */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-mono flex justify-between items-center">
          <span>ID: {selectedClass._id}</span>
          <span>Last Updated: {formatDate(selectedClass.updatedAt)}</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
