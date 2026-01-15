"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area"; // Cần cài scroll-area: npx shadcn@latest add scroll-area
import { Bell, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NotificationsNav() {
  // Mock data thông báo
  const notifications = [
    {
      id: 1,
      title: "Task sắp hết hạn",
      desc: "Nhiệm vụ 'Thiết kế DB' còn 2 giờ nữa là đến hạn.",
      time: "1 giờ trước",
      icon: AlertTriangle,
      color: "text-amber-500",
      read: false,
    },
    {
      id: 2,
      title: "Đánh giá mới",
      desc: "Bạn nhận được 1 đánh giá 5 sao từ Leader.",
      time: "2 giờ trước",
      icon: CheckCircle2,
      color: "text-green-500",
      read: false,
    },
    {
      id: 3,
      title: "Tin nhắn hệ thống",
      desc: "Hệ thống đã đồng bộ xong dữ liệu Jira.",
      time: "1 ngày trước",
      icon: MessageSquare,
      color: "text-blue-500",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-muted"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none">Thông báo</p>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                  {unreadCount} mới
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              Bạn có {unreadCount} thông báo chưa đọc.
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Vùng danh sách thông báo có thanh cuộn */}
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup className="p-1">
            {notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="cursor-pointer flex items-start gap-3 p-3 focus:bg-muted/50 mb-1"
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-full bg-slate-100 ${item.color
                    .replace("text-", "bg-")
                    .replace("500", "100")}`}
                >
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p
                    className={`text-sm font-medium leading-none ${
                      !item.read
                        ? "text-foreground font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.desc}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.time}</p>
                </div>
                {!item.read && (
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-xs text-muted-foreground font-medium">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
