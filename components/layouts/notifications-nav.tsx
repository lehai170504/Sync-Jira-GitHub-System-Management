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
  {
    id: 1,
    title: "Task sắp hết hạn",
    desc: "Nhiệm vụ 'Thiết kế DB' còn 2 giờ nữa là đến hạn.",
    detailContent:
      "Bạn còn 2 giờ để hoàn thành nhiệm vụ Thiết kế DB trên Jira. Vui lòng kiểm tra và cập nhật tiến độ sớm nhất.",
    time: "1 giờ trước",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
    read: false,
    type: "task",
  },
  // ... (Dữ liệu mẫu khác của bạn)
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
            className="relative rounded-2xl h-11 w-11 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent dark:hover:border-slate-800 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-slate-950"></span>
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 sm:w-95 rounded-[24px] shadow-2xl bg-white/95 dark:bg-slate-950/95 border-slate-100 dark:border-slate-800 backdrop-blur-xl animate-in zoom-in-95 duration-200"
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
          <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

          <ScrollArea className="h-87.5">
            <DropdownMenuGroup className="p-2">
              {notifications.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className="cursor-pointer flex items-start gap-3 p-3 focus:bg-slate-50 dark:focus:bg-slate-800/60 mb-1 rounded-xl transition-colors group"
                >
                  <div
                    className={`mt-0.5 p-2.5 rounded-full shrink-0 ${item.bgColor}`}
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
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-600 pt-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                      {item.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>

          <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
          <DropdownMenuItem
            asChild
            className="cursor-pointer justify-center py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 focus:bg-slate-50 dark:focus:bg-slate-800/60 transition-colors m-2 rounded-xl"
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
        <DialogContent className="sm:max-w-106.25 bg-white dark:bg-slate-950 border-none sm:rounded-[32px] shadow-2xl transition-colors">
          {selectedNotif && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2.5 rounded-full w-fit ${selectedNotif.bgColor}`}
                  >
                    <selectedNotif.icon
                      className={`h-5 w-5 ${selectedNotif.color}`}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="font-bold text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                  >
                    {selectedNotif.type}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedNotif.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 text-xs font-medium pt-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5" /> {selectedNotif.time}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 mt-2 font-medium">
                {selectedNotif.detailContent}
              </div>

              <DialogFooter className="gap-2 sm:gap-0 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-xl font-bold text-slate-600 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  Đóng
                </Button>
                {selectedNotif.type === "task" && (
                  <Button className="bg-[#F27124] hover:bg-[#d65d1b] rounded-xl font-bold text-white shadow-lg dark:shadow-none">
                    Xem Task <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {selectedNotif.type === "review" && (
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-lg dark:shadow-none">
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
