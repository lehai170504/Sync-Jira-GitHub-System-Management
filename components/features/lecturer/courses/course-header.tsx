"use client";

import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLogout } from "@/features/auth/hooks/use-logout"; // Import Hook

export function CourseHeader() {
  // Tích hợp Hook Logout
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-[#F27124] rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-200">
          S
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none tracking-tight">
            SyncSystem
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Lecturer Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-800">Nguyễn Văn A</p>
          <p className="text-xs text-gray-500">Giảng viên FPT</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-white shadow-sm hover:ring-2 hover:ring-[#F27124] transition-all">
              <AvatarFallback className="bg-[#F27124] text-white font-bold">
                GV
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => logout()}
              className="text-red-600 cursor-pointer focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
