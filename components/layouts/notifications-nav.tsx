"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Bell,
  AlertTriangle,
  MessageSquare,
  ShieldIcon,
  ArrowRight,
  Loader2,
  Calendar,
  Trash2,
  CheckCheck,
  X,
} from "lucide-react";
import {
  useNotifications,
  useNotificationMutations,
} from "@/features/notifications/hooks/use-notifications";
import { NotificationItem } from "@/features/notifications/types/notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// Helper map icon theo type
const getIconConfig = (type: string) => {
  switch (type) {
    case "task":
      return {
        icon: AlertTriangle,
        color: "text-amber-600",
        bg: "bg-amber-100 dark:bg-amber-900/20",
      };
    case "review":
      return {
        icon: MessageSquare,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/20",
      };
    default:
      return {
        icon: ShieldIcon,
        color: "text-slate-600",
        bg: "bg-slate-100 dark:bg-slate-900/20",
      };
  }
};

export function NotificationsNav() {
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Gọi Hooks
  const { data, isLoading } = useNotifications();
  const {
    markReadMutation,
    markAllReadMutation,
    deleteMutation,
    clearReadMutation,
  } = useNotificationMutations();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unread || notifications.filter((n) => !n.is_read).length;
  const hasReadNotifications = notifications.some((n) => n.is_read);

  // Mở Dialog chi tiết và đánh dấu đã đọc
  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markReadMutation.mutate(item._id);
    }
    setSelectedNotif(item);
    setIsDialogOpen(true);
  };

  // Xóa 1 thông báo
  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Ngăn không cho nổi bọt click lên thẻ cha (mở dialog)
    deleteMutation.mutate(id);
  };

  // Xóa tất cả thông báo đã đọc
  const handleClearRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearReadMutation.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-11 w-11 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />

            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 sm:w-96 rounded-[24px] shadow-2xl bg-white/95 dark:bg-slate-950/95 border-slate-200 dark:border-slate-800 backdrop-blur-xl p-0 font-sans"
          align="end"
        >
          {/* HEADER DROPDOWN */}
          <DropdownMenuLabel className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Thông báo
              </p>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold h-5 px-2 text-[10px] uppercase tracking-wider shadow-none border-none">
                  {unreadCount} mới
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center mt-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Bạn có {unreadCount} mục chưa đọc.
              </p>

              {/* CỤM NÚT ACTION TỔNG */}
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <span
                    onClick={() => markAllReadMutation.mutate()}
                    className="text-[10px] text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" /> Đọc tất cả
                  </span>
                )}
                {hasReadNotifications && (
                  <span
                    onClick={handleClearRead}
                    className="text-[10px] text-red-500 dark:text-red-400 cursor-pointer hover:text-red-600 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa đã đọc
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 m-0" />

          {/* DANH SÁCH THÔNG BÁO */}
          <ScrollArea className="h-100">
            {isLoading ? (
              <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full">
                  <Bell className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Không có thông báo nào.
                </p>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1">
                {notifications.map((item) => {
                  const config = getIconConfig(item.type);
                  return (
                    // Dùng div thay vì DropdownMenuItem để handle click event độc lập (mở & xóa)
                    <div
                      key={item._id}
                      className={cn(
                        "relative group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden",
                        item.is_read
                          ? "hover:bg-slate-50 dark:hover:bg-slate-900"
                          : "bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                      )}
                      onClick={() => handleNotificationClick(item)}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "mt-0.5 p-2.5 rounded-full shrink-0 transition-colors",
                          config.bg,
                        )}
                      >
                        <config.icon className={cn("h-4 w-4", config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1 pr-6">
                        <div className="flex justify-between items-start gap-2">
                          <p
                            className={cn(
                              "text-sm leading-tight transition-colors line-clamp-1",
                              !item.is_read
                                ? "text-slate-900 dark:text-slate-100 font-bold"
                                : "text-slate-600 dark:text-slate-300 font-medium",
                            )}
                          >
                            {item.title}
                          </p>
                          {!item.is_read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 pt-1 uppercase tracking-wider">
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </p>
                      </div>

                      {/* Nút Xóa hiện lên khi Hover */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteItem(e, item._id)}
                        disabled={deleteMutation.isPending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {deleteMutation.isPending &&
                        deleteMutation.variables === item._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- DETAIL DIALOG (MODAL) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* FIX: Set w-[90vw] cho mobile và max-w-[400px] cho desktop để modal luôn nhỏ gọn */}
        <DialogContent className="w-[90vw] max-w-100 sm:max-w-105 rounded-[24px] p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-sans shadow-2xl transition-colors">
          {selectedNotif && (
            <>
              {/* Nút Close góc phải trên cùng (nhỏ gọn) */}
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 pb-5">
                <DialogHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2.5 rounded-xl shadow-sm",
                        getIconConfig(selectedNotif.type).bg,
                      )}
                    >
                      {(() => {
                        const Icon = getIconConfig(selectedNotif.type).icon;
                        return (
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              getIconConfig(selectedNotif.type).color,
                            )}
                          />
                        );
                      })()}
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className="uppercase text-[9px] font-black tracking-widest border-slate-200 dark:border-slate-700 text-slate-500"
                      >
                        {selectedNotif.type}
                      </Badge>
                      <p className="flex items-center gap-1.5 pt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        {new Date(selectedNotif.created_at).toLocaleString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </div>

                  {/* FIX: Thêm pr-6 để chữ không bị đè lên nút X */}
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug pr-6">
                    {selectedNotif.title}
                  </DialogTitle>
                </DialogHeader>

                {/* FIX: Thêm break-words và whitespace-pre-wrap để chống tràn khung nếu có text quá dài */}
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 wrap-break-word whitespace-pre-wrap max-h-75 overflow-y-auto custom-scrollbar">
                  {selectedNotif.message}
                </div>
              </div>

              <DialogFooter className="p-6 pt-0 sm:justify-start">
                {selectedNotif.type === "task" && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl h-11 font-bold text-white shadow-md transition-all active:scale-[0.98]">
                    Xem công việc <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {selectedNotif.type === "review" && (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 font-bold text-white shadow-md transition-all active:scale-[0.98]">
                    Xem đánh giá <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {selectedNotif.type === "system" && (
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full rounded-xl h-11 font-bold dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Đã hiểu
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
