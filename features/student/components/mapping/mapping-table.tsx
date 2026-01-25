"use client";

import {
  Github,
  Trello,
  Link as LinkIcon,
  CheckCircle2,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TeamMember } from "@/features/student/types/member-types";

interface MappingTableProps {
  members: TeamMember[];
  isLoading: boolean;
  currentStudentId?: string;
  isLeader: boolean;
  onEdit: (member: TeamMember) => void;
}

export function MappingTable({
  members,
  isLoading,
  currentStudentId,
  isLeader,
  onEdit,
}: MappingTableProps) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden ring-1 ring-gray-950/5">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6 py-4 font-semibold text-slate-600">
              Thành viên
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Vai trò
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Trạng thái Jira
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Trạng thái GitHub
            </TableHead>
            <TableHead className="text-right pr-6 font-semibold text-slate-600">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? // Skeleton Loading Rows
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                        <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell colSpan={4} />
                </TableRow>
              ))
            : members.map((member) => {
                const isCurrentUser = member.student._id === currentStudentId;
                const canEdit = isLeader || isCurrentUser;

                return (
                  <TableRow
                    key={member._id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    {/* 1. Thông tin sinh viên */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                          <AvatarImage src={member.student.avatar_url} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                            {member.student.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-gray-900 flex items-center gap-2">
                            {member.student.full_name}
                            {isCurrentUser && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 border-indigo-200 text-indigo-600 bg-indigo-50"
                              >
                                Bạn
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            {member.student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Vai trò */}
                    <TableCell>
                      {member.role_in_team === "Leader" ? (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 shadow-none gap-1 pl-1 pr-2">
                          <ShieldCheck className="w-3 h-3" /> Leader
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-500 gap-1 pl-1 pr-2"
                        >
                          <User className="w-3 h-3" /> Member
                        </Badge>
                      )}
                    </TableCell>

                    {/* 3. Jira Status */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${member.mapping_status.jira ? "bg-blue-50" : "bg-slate-50"}`}
                        >
                          <Trello
                            className={`w-4 h-4 ${member.mapping_status.jira ? "text-blue-600" : "text-slate-300"}`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-medium ${member.jira_account_id ? "text-gray-900" : "text-gray-400 italic"}`}
                          >
                            {member.jira_account_id || "Chưa kết nối"}
                          </span>
                          {member.jira_account_id && (
                            <span className="text-[10px] text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Đã map
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* 4. Github Status */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${member.mapping_status.github ? "bg-gray-100" : "bg-slate-50"}`}
                        >
                          <Github
                            className={`w-4 h-4 ${member.mapping_status.github ? "text-black" : "text-slate-300"}`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-medium ${member.github_username ? "text-gray-900" : "text-gray-400 italic"}`}
                          >
                            {member.github_username || "Chưa kết nối"}
                          </span>
                          {member.github_username && (
                            <span className="text-[10px] text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Đã map
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* 5. Actions */}
                    <TableCell className="text-right pr-6">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!canEdit}
                                className={`
                                h-9 px-4 rounded-xl border-slate-200 transition-all
                                ${
                                  canEdit
                                    ? "hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600"
                                    : "opacity-40 cursor-not-allowed bg-slate-50"
                                }
                              `}
                                onClick={() => canEdit && onEdit(member)}
                              >
                                <LinkIcon className="w-3.5 h-3.5 mr-2" />
                                Ánh xạ
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!canEdit && (
                            <TooltipContent>
                              <p>
                                Bạn không có quyền sửa thông tin của thành viên
                                này.
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
