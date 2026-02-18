"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Notification = {
  id: number;
  title: string;
  desc: string;
  detailContent: string;
  time: string;
  icon: any;
  color: string;
  bgColor: string;
  read: boolean;
  type: "task" | "review" | "system";
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  // ... (Dữ liệu mẫu giữ nguyên)
  {
    id: 1,
    title: "Task sắp hết hạn",
    desc: "Nhiệm vụ 'Thiết kế DB' còn 2 giờ nữa là đến hạn.",
    detailContent: "...",
    time: "1 giờ trước",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
    read: false,
    type: "task",
  },
  // ...
];

export function NotificationsNav() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      const updatedList = notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n,
      );
      setNotifications(updatedList);
    }
    setSelectedNotif(notification);
    setIsDialogOpen(true);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      {/* --- DROPDOWN MENU --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white dark:border-slate-900"></span>
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 sm:w-96 dark:bg-slate-900 dark:border-slate-800"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">
                  Thông báo
                </p>
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 px-1.5 text-[10px]"
                  >
                    {unreadCount} mới
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs leading-none text-muted-foreground dark:text-slate-400">
                  Bạn có {unreadCount} thông báo chưa đọc.
                </p>
                {unreadCount > 0 && (
                  <span
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium"
                  >
                    Đọc tất cả
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:bg-slate-800" />

          <ScrollArea className="h-[350px]">
            <DropdownMenuGroup className="p-1">
              {notifications.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className="cursor-pointer flex items-start gap-3 p-3 focus:bg-slate-50 dark:focus:bg-slate-800 mb-1 rounded-lg transition-colors group"
                >
                  <div
                    className={`mt-0.5 p-2 rounded-full shrink-0 ${item.bgColor}`}
                  >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p
                        className={`text-sm leading-tight ${!item.read ? "text-slate-900 dark:text-slate-100 font-bold" : "text-slate-600 dark:text-slate-400 font-medium"}`}
                      >
                        {item.title}
                      </p>
                      {!item.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground dark:text-slate-500 line-clamp-2 leading-snug">
                      {item.desc}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-600 pt-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {item.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>

          <DropdownMenuSeparator className="dark:bg-slate-800" />
          <DropdownMenuItem
            asChild
            className="cursor-pointer justify-center py-3 text-xs text-muted-foreground dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Link
              href="/dashboard/notifications"
              className="w-full text-center block"
            >
              Xem tất cả thông báo
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- DETAIL DIALOG (MODAL) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-none">
          {selectedNotif && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-full w-fit ${selectedNotif.bgColor}`}
                  >
                    <selectedNotif.icon
                      className={`h-5 w-5 ${selectedNotif.color}`}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="font-normal text-slate-500 dark:text-slate-400 dark:border-slate-700"
                  >
                    {selectedNotif.type.toUpperCase()}
                  </Badge>
                </div>
                <DialogTitle className="text-xl text-slate-900 dark:text-slate-100">
                  {selectedNotif.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1 text-xs pt-1 dark:text-slate-400">
                  <Calendar className="h-3 w-3" /> {selectedNotif.time}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                {selectedNotif.detailContent}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Đóng
                </Button>
                {selectedNotif.type === "task" && (
                  <Button className="bg-[#F27124] hover:bg-[#d65d1b]">
                    Xem Task <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {selectedNotif.type === "review" && (
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Xem Đánh giá
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
