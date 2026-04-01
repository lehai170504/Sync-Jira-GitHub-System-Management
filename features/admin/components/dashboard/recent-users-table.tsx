"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
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

import { useUsers } from "@/features/management/users/hooks/use-users";

export function RecentUsersTable() {
  const router = useRouter();

  const { data, isLoading } = useUsers({
    page: 1,
    limit: 100,
    role: "all",
  });

  const recentUsers = useMemo(() => {
    const users = data?.users || [];
    return (
      [...users]
        // Lọc bỏ acc Admin ra khỏi danh sách
        .filter(
          (user) => user.role !== "ADMIN" && user.email !== "admin@gmail.com"
        )
        .sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5)
    );
  }, [data]);

  return (
    <Card
      id="recent-users"
      // Cập nhật nền dark:bg-slate-900 và viền dark:border-slate-800
      className="rounded-[24px] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm h-full flex flex-col transition-colors"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-50">
            Người dùng mới
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Danh sách 5 thành viên vừa tham gia hệ thống.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          className="rounded-xl font-bold text-xs h-9 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
          onClick={() => router.push("/admin/users")}
        >
          Xem tất cả
        </Button>
      </CardHeader>

      <CardContent className="flex-1">
        {isLoading ? (
          <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
            <p className="text-xs font-bold uppercase tracking-widest">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm">
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
                  <Avatar className="h-10 w-10 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback
                      // Avatar Fallback: Dùng opacity cho nền tối để không bị chói
                      className={`font-black text-xs ${
                        user.role === "LECTURER"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-orange-50 dark:bg-orange-900/30 text-[#F27124] dark:text-orange-400"
                      }`}
                    >
                      {user.full_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none group-hover:text-[#F27124] transition-colors truncate max-w-[150px]">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* 2. META: Role + Status */}
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    // Role Badge: Style tương tự UserTable
                    className={`hidden sm:inline-flex border-0 font-medium px-2.5 py-0.5 h-6 text-[10px] uppercase tracking-wide ${
                      user.role === "LECTURER"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-700/10 dark:ring-blue-400/20"
                        : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 ring-1 ring-orange-700/10 dark:ring-orange-400/20"
                    }`}
                  >
                    {user.role === "LECTURER" ? "Giảng viên" : "Sinh viên"}
                  </Badge>

                  {/* Status Indicator */}
                  {(user.status || "Active") === "Active" ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                        Active
                      </span>
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 gap-1 h-6"
                    >
                      Reserved
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
