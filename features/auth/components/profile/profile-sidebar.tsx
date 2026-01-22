"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  Github,
  Linkedin,
  Mail,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { useProfile } from "@/features/auth/hooks/use-profile";

export function ProfileSidebar() {
  // Sử dụng Hook lấy dữ liệu từ API
  const { data, isLoading, isError } = useProfile();

  // Lấy user từ data trả về
  const user = data?.user;

  // Hàm helper hiển thị Role
  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "LECTURER":
        return "Giảng viên";
      case "STUDENT":
        return "Sinh viên";
      default:
        return "Người dùng";
    }
  };

  // Hàm helper lấy initials
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  // 1. Trạng thái Loading
  if (isLoading) {
    return (
      <aside className="w-full md:w-1/4 space-y-6">
        <Card className="h-80 flex items-center justify-center border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </Card>
      </aside>
    );
  }

  // 2. Trạng thái Lỗi hoặc không có user
  if (isError || !user) {
    return (
      <aside className="w-full md:w-1/4 space-y-6">
        <Card className="p-6 text-center text-muted-foreground border-slate-200">
          Không thể tải thông tin người dùng.
        </Card>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-1/4 space-y-6">
      {/* CARD 1: USER INFO */}
      <Card className="text-center overflow-hidden border-slate-200 shadow-sm">
        {/* Cover Background */}
        <div className="h-24 bg-gradient-to-r from-orange-400 to-red-500"></div>

        {/* Avatar Section */}
        <div className="relative -mt-12 flex justify-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md bg-white">
              <AvatarImage src={user.avatar_url} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold bg-slate-100 text-slate-500">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-sm border border-white hover:bg-slate-100"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <CardContent className="pt-4 pb-6">
          <h2
            className="text-xl font-bold text-gray-900 truncate px-2"
            title={user.full_name}
          >
            {user.full_name}
          </h2>

          {/* Hiển thị MSSV nếu là sinh viên, hoặc Email */}
          <p className="text-sm text-muted-foreground font-medium truncate px-4 mt-1">
            {(user as any).student_code || user.email}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge
              variant="secondary"
              className="font-normal bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {getRoleDisplayName(user.role)}
            </Badge>

            {/* Hiển thị Verify Status */}
            {user.is_verified && (
              <Badge
                variant="outline"
                className="border-green-200 text-green-700 bg-green-50 font-normal"
              >
                Đã xác thực
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: CONTACT & SOCIAL */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 text-sm group cursor-pointer overflow-hidden">
            <div className="p-2 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors flex-shrink-0">
              <Mail className="h-4 w-4 text-orange-600" />
            </div>
            <span
              className="text-muted-foreground group-hover:text-gray-900 transition-colors truncate"
              title={user.email}
            >
              {user.email}
            </span>
          </div>

          {/* Major (Nếu có) */}
          {(user as any).major && (
            <div className="flex items-center gap-3 text-sm group cursor-pointer">
              <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors flex-shrink-0">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-muted-foreground group-hover:text-gray-900 transition-colors">
                {(user as any).major}
              </span>
            </div>
          )}

          {/* Github & LinkedIn (Static Mock - Vì API chưa trả về) */}
          <div className="flex items-center gap-3 text-sm group cursor-pointer">
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors flex-shrink-0">
              <Github className="h-4 w-4 text-slate-700" />
            </div>
            <span className="text-muted-foreground group-hover:text-gray-900 transition-colors">
              Chưa liên kết
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm group cursor-pointer">
            <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors flex-shrink-0">
              <Linkedin className="h-4 w-4 text-blue-700" />
            </div>
            <span className="text-muted-foreground group-hover:text-gray-900 transition-colors">
              Chưa liên kết
            </span>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
