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
import { User } from "@/features/management/users/types";
import { UserRowActions } from "./user-row-actions";

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
  onToggleStatus,
  onClearFilters,
}: UserTableProps) {
  // Tính tổng số trang (giả sử limit mỗi trang là 10)
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // 1. Loading State
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-xl h-96 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
          <p className="text-sm text-gray-500">Đang tải danh sách...</p>
        </div>
      </Card>
    );
  }

  // 2. Empty State
  if (!users || users.length === 0) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-xl overflow-hidden">
        <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6">
          <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-gray-300" />
          </div>
          <p className="font-medium text-lg text-gray-900">
            Không tìm thấy kết quả
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
          </p>
          <Button
            variant="link"
            className="mt-2 text-[#F27124]"
            onClick={onClearFilters}
          >
            Xóa bộ lọc
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-white ring-1 ring-gray-100 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="w-[40%] pl-6 py-4 font-semibold text-gray-600">
                Thông tin User
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-gray-600 hidden sm:table-cell">
                Mã số
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-gray-600">
                Vai trò
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-gray-600">
                Trạng thái
              </TableHead>
              <TableHead className="w-[15%] text-right pr-6 font-semibold text-gray-600">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id} // Dùng _id làm key
                className="hover:bg-orange-50/30 transition-colors group border-gray-100"
              >
                {/* User Info */}
                <TableCell className="pl-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                      <AvatarImage src={user.avatar_url} />{" "}
                      {/* Dùng avatar_url */}
                      <AvatarFallback
                        className={`text-sm font-bold ${
                          user.role === "LECTURER"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {user.full_name?.charAt(0) || "U"}{" "}
                        {/* Dùng full_name */}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-gray-900 group-hover:text-[#F27124] transition-colors">
                        {user.full_name} {/* Dùng full_name */}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Code */}
                <TableCell className="hidden sm:table-cell">
                  <span className="font-mono text-sm text-gray-600">
                    {user.student_code || "---"} {/* Dùng student_code */}
                  </span>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`border-0 font-medium px-2.5 py-0.5 ${
                      user.role === "LECTURER"
                        ? "bg-blue-50 text-blue-700"
                        : user.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role === "MEMBER"
                      ? "Sinh viên"
                      : user.role === "LECTURER"
                        ? "Giảng viên"
                        : "Admin"}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {(user.status || "Active") === "Active" ? (
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-green-700">
                        Active
                      </span>
                    </div>
                  ) : user.status === "Reserved" ? (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 text-amber-700 border-amber-200 gap-1"
                    >
                      <Lock className="h-3 w-3" /> Reserved
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-50 text-red-700 border-red-200 shadow-none"
                    >
                      <UserX className="h-3 w-3 mr-1" /> Dropped
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-6">
                  <UserRowActions user={user} onToggleStatus={onToggleStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/30">
          <p className="text-sm text-muted-foreground">
            Hiển thị {users.length} trên tổng {total} kết quả
          </p>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Trước
            </Button>
            <span className="text-sm font-medium px-2">
              Trang {page} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Tiếp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
