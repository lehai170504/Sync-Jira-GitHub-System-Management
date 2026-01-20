"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lock, MoreVertical, RotateCcw, Unlock } from "lucide-react";
import { toast } from "sonner";
import { User } from "./user-types";

interface UserRowActionsProps {
  user: User;
  onToggleStatus: (id: number) => void;
}

export function UserRowActions({ user, onToggleStatus }: UserRowActionsProps) {
  return (
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
            toast.info(`Đã gửi mail reset password tới ${user.email}`)
          }
        >
          <RotateCcw className="h-4 w-4 text-blue-500" />
          <span>Reset Mật khẩu</span>
        </DropdownMenuItem>

        {user.status === "Active" ? (
          <DropdownMenuItem
            className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2"
            onClick={() => onToggleStatus(user.id)}
          >
            <Lock className="h-4 w-4" />
            <span>Set Bảo lưu (Lock)</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="gap-2 text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer py-2"
            onClick={() => onToggleStatus(user.id)}
          >
            <Unlock className="h-4 w-4" />
            <span>Mở khóa (Active)</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
