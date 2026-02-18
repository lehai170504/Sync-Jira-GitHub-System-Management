"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ShieldAlert, UserX, Loader2 } from "lucide-react";
import { User } from "../types";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string) => void;
  onClearFilters: () => void;
}

export function UserTable({
  users,
  isLoading,
  total,
  page,
  onPageChange,
  onClearFilters,
}: UserTableProps) {
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const filteredUsers = users;

  // --- TRẠNG THÁI LOADING ---
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-gray-100 dark:ring-slate-800 rounded-xl min-h-[400px] flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Đang tải danh sách...
          </p>
        </div>
      </Card>
    );
  }

  // --- TRẠNG THÁI TRỐNG ---
  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-gray-100 dark:ring-slate-800 rounded-xl overflow-hidden min-h-[300px] bg-white dark:bg-slate-900">
        <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 pt-20">
          <div className="h-16 w-16 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-gray-300 dark:text-slate-600" />
          </div>
          <p className="font-medium text-lg text-gray-900 dark:text-slate-100">
            Không tìm thấy kết quả
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
          </p>
          <Button
            variant="link"
            className="mt-2 text-[#F27124] font-bold"
            onClick={onClearFilters}
          >
            Xóa bộ lọc
          </Button>
        </CardContent>
      </Card>
    );
  }

  // --- HIỂN THỊ DỮ LIỆU ---
  return (
    <Card className="border-none shadow-lg bg-white dark:bg-slate-900 ring-1 ring-gray-100 dark:ring-slate-800 rounded-xl overflow-hidden h-fit transition-all duration-300">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-slate-950/50">
            <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
              <TableHead className="w-[40%] pl-6 py-4 font-semibold text-gray-600 dark:text-slate-400">
                Thông tin User
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-gray-600 dark:text-slate-400 hidden sm:table-cell">
                Mã số
              </TableHead>
              <TableHead className="w-[20%] font-semibold text-gray-600 dark:text-slate-400">
                Vai trò
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-gray-600 dark:text-slate-400">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors group border-gray-100 dark:border-slate-800"
              >
                {/* Cột 1: Thông tin User */}
                <TableCell className="pl-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100 dark:border-slate-700 shadow-sm">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback
                        className={`text-sm font-bold ${
                          user.role === "LECTURER"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {user.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-gray-900 dark:text-slate-100 group-hover:text-[#F27124] transition-colors">
                        {user.full_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Cột 2: Mã số */}
                <TableCell className="hidden sm:table-cell">
                  {user.role === "LECTURER" ? (
                    <span className="text-gray-300 dark:text-slate-600 text-xs select-none">
                      —
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-gray-600 dark:text-slate-400 font-medium">
                      {user.student_code || "Chưa cấp"}
                    </span>
                  )}
                </TableCell>

                {/* Cột 3: Vai trò */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`border-0 font-medium px-2.5 py-0.5 ${
                      user.role === "LECTURER"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-700/10 dark:ring-blue-400/20"
                        : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 ring-1 ring-orange-700/10 dark:ring-orange-400/20"
                    }`}
                  >
                    {user.role === "LECTURER" ? "Giảng viên" : "Sinh viên"}
                  </Badge>
                </TableCell>

                {/* Cột 4: Trạng thái */}
                <TableCell>
                  {(user.status || "Active") === "Active" ? (
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Active
                      </span>
                    </div>
                  ) : user.status === "Reserved" ? (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 gap-1"
                    >
                      <Lock className="h-3 w-3" /> Reserved
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 shadow-none"
                    >
                      <UserX className="h-3 w-3 mr-1" /> Dropped
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 px-6 py-4 bg-gray-50/30 dark:bg-slate-950/30">
          <p className="text-sm text-muted-foreground">
            Hiển thị <b>{filteredUsers.length}</b> kết quả
          </p>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Trước
            </Button>
            <span className="text-sm font-medium px-2 dark:text-slate-300">
              Trang {page} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Tiếp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
