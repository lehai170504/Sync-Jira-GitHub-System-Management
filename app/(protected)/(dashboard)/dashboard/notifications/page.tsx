"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Clock,
  Check,
  Trash2,
  Filter,
} from "lucide-react";

// Mock Data (Nên tách ra file constants hoặc lấy từ API)
const ALL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Task sắp hết hạn",
    desc: "Nhiệm vụ 'Thiết kế DB' còn 2 giờ nữa là đến hạn.",
    time: "1 giờ trước",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    read: false,
    type: "Task",
  },
  {
    id: 2,
    title: "Đánh giá mới",
    desc: "Bạn nhận được 1 đánh giá 5 sao từ Leader.",
    time: "2 giờ trước",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100",
    read: false,
    type: "Review",
  },
  {
    id: 3,
    title: "Tin nhắn hệ thống",
    desc: "Hệ thống đã đồng bộ xong dữ liệu Jira.",
    time: "1 ngày trước",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    read: true,
    type: "System",
  },
  {
    id: 4,
    title: "Pull Request Merged",
    desc: "PR #55 'Update Login UI' đã được merge vào main.",
    time: "2 ngày trước",
    icon: CheckCircle2,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    read: true,
    type: "GitHub",
  },
  {
    id: 5,
    title: "Cảnh báo bảo mật",
    desc: "Phát hiện đăng nhập lạ từ IP 192.168.1.1",
    time: "3 ngày trước",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    read: true,
    type: "Security",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Xóa thông báo
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Component hiển thị từng dòng thông báo
  const NotificationItem = ({ item }: { item: any }) => (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${item.read ? "bg-white border-slate-100" : "bg-blue-50/50 border-blue-100"}`}
    >
      {/* Icon */}
      <div className={`mt-1 p-2.5 rounded-full shrink-0 ${item.bgColor}`}>
        <item.icon className={`h-5 w-5 ${item.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <h4
            className={`text-sm ${!item.read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}
          >
            {item.title}
          </h4>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {item.time}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
        <div className="flex items-center gap-2 pt-2">
          <Badge
            variant="outline"
            className="text-[10px] h-5 font-normal text-slate-500"
          >
            {item.type}
          </Badge>
          {!item.read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] text-blue-600 hover:text-blue-700 hover:bg-blue-100 px-2"
              onClick={() => {
                const newNotifs = [...notifications];
                const index = newNotifs.findIndex((n) => n.id === item.id);
                newNotifs[index].read = true;
                setNotifications(newNotifs);
              }}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
        onClick={() => deleteNotification(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Trung tâm thông báo
          </h1>
          <p className="text-slate-500">
            Quản lý và theo dõi mọi hoạt động của bạn trên hệ thống.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" /> Đọc tất cả
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Chưa đọc
            {notifications.some((n) => !n.read) && (
              <span className="ml-2 flex h-2 w-2 rounded-full bg-red-500" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB: TẤT CẢ */}
        <TabsContent value="all" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" /> Danh sách toàn bộ
              </CardTitle>
              <CardDescription>
                Hiển thị {notifications.length} thông báo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <NotificationItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-10 text-slate-500">
                  Không có thông báo nào.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: CHƯA ĐỌC */}
        <TabsContent value="unread" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-blue-600">
                Thông báo chưa đọc
              </CardTitle>
              <CardDescription>Cần chú ý xử lý sớm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.filter((n) => !n.read).length > 0 ? (
                notifications
                  .filter((n) => !n.read)
                  .map((item) => <NotificationItem key={item.id} item={item} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-3 opacity-20" />
                  <p>Tuyệt vời! Bạn đã đọc hết các thông báo.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
