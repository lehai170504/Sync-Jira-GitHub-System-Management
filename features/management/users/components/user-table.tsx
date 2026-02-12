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
  onToggleStatus,
  onClearFilters,
}: UserTableProps) {
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // 1. LỌC DATA: Chỉ lấy LECTURER và STUDENT
  const filteredUsers = users;

  // --- TRẠNG THÁI LOADING ---
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-xl min-h-[400px] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
          <p className="text-sm text-gray-500">Đang tải danh sách...</p>
        </div>
      </Card>
    );
  }

  // --- TRẠNG THÁI TRỐNG ---
  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-xl overflow-hidden min-h-[300px]">
        <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 pt-20">
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

  // --- HIỂN THỊ DỮ LIỆU ---
  return (
    // 👇 THÊM class `h-fit` để Card co dãn theo nội dung bên trong
    <Card className="border-none shadow-lg bg-white ring-1 ring-gray-100 rounded-xl overflow-hidden h-fit transition-all duration-300">
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
              <TableHead className="w-[20%] font-semibold text-gray-600">
                Vai trò
              </TableHead>
              <TableHead className="w-[15%] font-semibold text-gray-600">
                Trạng thái
              </TableHead>
              {/* <TableHead className="w-[15%] font-semibold text-gray-600 text-right pr-6">
                Thao tác
              </TableHead> */}
              {/* Lưu ý: Bạn đã xóa UserRowActions ở yêu cầu trước, nếu cần hãy uncomment */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-orange-50/30 transition-colors group border-gray-100"
              >
                {/* Cột 1: Thông tin User */}
                <TableCell className="pl-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback
                        className={`text-sm font-bold ${
                          user.role === "LECTURER"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {user.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-gray-900 group-hover:text-[#F27124] transition-colors">
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
                    <span className="text-gray-300 text-xs select-none">—</span>
                  ) : (
                    <span className="font-mono text-sm text-gray-600 font-medium">
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
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10"
                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-700/10"
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
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Footer - Luôn nằm sát dưới cùng của bảng */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/30">
          <p className="text-sm text-muted-foreground">
            Hiển thị <b>{filteredUsers.length}</b> kết quả
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
