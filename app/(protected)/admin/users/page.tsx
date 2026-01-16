"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  MoreVertical,
  Lock,
  Unlock,
  RotateCcw,
  RefreshCw,
  UserCheck,
  Filter,
  ShieldAlert,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const initialUsers = [
  {
    id: 1,
    name: "Trần Văn Hiến",
    email: "hientv@fpt.edu.vn",
    role: "LECTURER",
    status: "Active",
    code: "HienTV",
    avatar: "",
  },
  {
    id: 2,
    name: "Nguyễn Văn An",
    email: "annv@fpt.edu.vn",
    role: "MEMBER",
    status: "Active",
    code: "SE160001",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    name: "Lê Bảo Lưu",
    email: "luulb@fpt.edu.vn",
    role: "MEMBER",
    status: "Reserved",
    code: "SE160002",
    avatar: "",
  },
  {
    id: 5,
    name: "Hoàng Văn Drop",
    email: "hoangvd@fpt.edu.vn",
    role: "MEMBER",
    status: "Dropped",
    code: "SE160099",
    avatar: "",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleStatus = (id: number) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "Active" ? "Reserved" : "Active";
          const actionText =
            newStatus === "Active" ? "Mở khóa" : "Khóa (Bảo lưu)";
          toast.success(`Đã ${actionText} tài khoản ${u.email}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Người dùng
          </h2>
          <p className="text-muted-foreground mt-1">
            Kiểm soát trạng thái tài khoản, phân quyền và hỗ trợ kỹ thuật.
          </p>
        </div>
        <Button
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F27124] hover:border-orange-200 shadow-sm transition-all"
          onClick={() =>
            toast.success("Đang đồng bộ dữ liệu từ hệ thống đào tạo...")
          }
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Đồng bộ từ AP/FAP
        </Button>
      </div>

      {/* CONTENT CARD */}
      <Card className="border-none shadow-lg bg-white ring-1 ring-gray-100 rounded-xl overflow-hidden">
        {/* FILTERS HEADER */}
        <CardHeader className="border-b bg-gray-50/40 px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
              <Input
                placeholder="Tìm kiếm theo Tên, Email, MSSV..."
                className="pl-10 bg-white border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-lg transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="text-gray-700">
                      <SelectValue placeholder="Vai trò" />
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Vai trò</SelectItem>
                  <SelectItem value="LECTURER">Giảng viên</SelectItem>
                  <SelectItem value="MEMBER">Sinh viên</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span className="text-gray-700">
                      <SelectValue placeholder="Trạng thái" />
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Trạng thái</SelectItem>
                  <SelectItem value="Active">Đang hoạt động</SelectItem>
                  <SelectItem value="Reserved">Bảo lưu</SelectItem>
                  <SelectItem value="Dropped">Thôi học</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    <TableCell className="pl-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback
                            className={`text-sm font-bold ${
                              user.role === "LECTURER"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-900 group-hover:text-[#F27124] transition-colors">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="font-mono text-sm text-gray-600">
                        {user.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-0 font-medium px-2.5 py-0.5 ${
                          user.role === "LECTURER"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role === "MEMBER" ? "Sinh viên" : "Giảng viên"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.status === "Active" ? (
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
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl shadow-lg border-gray-100"
                        >
                          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider px-3 pt-2">
                            Quản trị
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="gap-2 cursor-pointer py-2"
                            onClick={() =>
                              toast.info(
                                `Đã gửi mail reset password tới ${user.email}`
                              )
                            }
                          >
                            <RotateCcw className="h-4 w-4 text-blue-500" />
                            <span>Reset Mật khẩu</span>
                          </DropdownMenuItem>

                          {user.status === "Active" ? (
                            <DropdownMenuItem
                              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2"
                              onClick={() => toggleStatus(user.id)}
                            >
                              <Lock className="h-4 w-4" />
                              <span>Set Bảo lưu (Lock)</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="gap-2 text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer py-2"
                              onClick={() => toggleStatus(user.id)}
                            >
                              <Unlock className="h-4 w-4" />
                              <span>Mở khóa (Active)</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                        <ShieldAlert className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="font-medium text-lg text-gray-900">
                        Không tìm thấy kết quả
                      </p>
                      <Button
                        variant="link"
                        className="mt-2 text-[#F27124]"
                        onClick={() => {
                          setSearchTerm("");
                          setRoleFilter("all");
                          setStatusFilter("all");
                        }}
                      >
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
