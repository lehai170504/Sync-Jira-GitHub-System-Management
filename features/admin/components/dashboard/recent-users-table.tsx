"use client";

import { useMemo } from "react";
import { MoreHorizontal, Loader2, Lock, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUsers } from "@/features/management/users/hooks/use-users";
import { User } from "@/features/management/users/types";

export function RecentUsersTable() {
  const router = useRouter();

  // 1. Gọi API:
  // Vì BE không sort được, ta nên lấy số lượng lớn (ví dụ 50 hoặc 100)
  // để đảm bảo các user mới nhất nằm trong danh sách trả về.
  const { data, isLoading } = useUsers({
    page: 1,
    limit: 100, // Lấy nhiều một chút để sort ở FE
    role: "all",
  });

  // 2. XỬ LÝ Ở CLIENT (FE): Sort & Slice
  const recentUsers = useMemo(() => {
    const users = data?.users || [];

    // Tạo bản sao mảng để tránh mutate data gốc của React Query
    return [...users]
      .sort((a, b) => {
        // So sánh ngày tạo: Mới nhất lên đầu
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5); // Chỉ lấy 5 người đầu tiên
  }, [data]);

  return (
    <Card
      id="recent-users"
      className="rounded-[24px] border-slate-100 shadow-sm h-full flex flex-col"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black text-slate-900">
            Người dùng mới
          </CardTitle>
          <CardDescription>
            Danh sách 5 thành viên vừa tham gia hệ thống.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          className="rounded-xl font-bold text-xs h-9"
          onClick={() => router.push("/admin/users")}
        >
          Xem tất cả
        </Button>
      </CardHeader>

      <CardContent className="flex-1">
        {isLoading ? (
          <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
            <p className="text-xs font-bold uppercase tracking-widest">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Chưa có người dùng nào.
          </div>
        ) : (
          <div className="space-y-6">
            {recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between group"
              >
                {/* 1. INFO: Avatar + Tên + Email */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback
                      className={`font-black text-xs ${
                        user.role === "LECTURER"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-orange-50 text-[#F27124]"
                      }`}
                    >
                      {user.full_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-[#F27124] transition-colors truncate max-w-[150px]">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* 2. META: Role + Status + Action */}
                <div className="flex items-center gap-3">
                  {/* Badge Role */}
                  <Badge
                    variant="outline"
                    className={`hidden sm:inline-flex border-0 font-medium px-2.5 py-0.5 h-6 text-[10px] uppercase tracking-wide ${
                      user.role === "LECTURER"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10"
                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-700/10"
                    }`}
                  >
                    {user.role === "LECTURER" ? "Giảng viên" : "Sinh viên"}
                  </Badge>

                  {/* Status Indicator */}
                  {(user.status || "Active") === "Active" ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">
                        Active
                      </span>
                    </div>
                  ) : user.status === "Reserved" ? (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 text-amber-700 border-amber-200 gap-1 h-6"
                    >
                      <Lock className="h-3 w-3" /> Reserved
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-50 text-red-700 border-red-200 shadow-none gap-1 h-6"
                    >
                      <UserX className="h-3 w-3" /> Dropped
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
