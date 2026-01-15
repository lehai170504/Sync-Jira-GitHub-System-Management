"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BellRing,
  Moon,
  Sun,
  Monitor,
  Globe,
  Mail,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div>
        <h3 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h3>
        <p className="text-muted-foreground">
          Cấu hình giao diện, thông báo và các tham số vận hành của SyncSystem.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* GROUP 1: APPEARANCE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" /> Giao diện & Hiển thị
            </CardTitle>
            <CardDescription>
              Tùy chỉnh trải nghiệm nhìn của ứng dụng.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chế độ tối (Dark Mode)</Label>
                <p className="text-sm text-muted-foreground">
                  Chuyển đổi giữa nền sáng và tối.
                </p>
              </div>
              <div className="flex items-center gap-2 border p-1 rounded-md bg-muted">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-sm"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-sm bg-white shadow-sm"
                >
                  <Moon className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-sm"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Ngôn ngữ hệ thống</Label>
              <Select defaultValue="vi">
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt (Vietnamese)</SelectItem>
                  <SelectItem value="en">English (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* GROUP 2: NOTIFICATIONS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" /> Cấu hình Thông báo
            </CardTitle>
            <CardDescription>
              Quản lý cách hệ thống gửi tin nhắn cho sinh viên.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Digest
                </Label>
                <p className="text-sm text-muted-foreground">
                  Gửi email tổng hợp tiến độ vào mỗi sáng.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Cảnh báo Rủi ro
                </Label>
                <p className="text-sm text-muted-foreground">
                  Tự động báo tin khi sinh viên trễ deadline.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* GROUP 3: OPERATIONAL PARAMS */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Tham số Vận hành
              (Operational)
            </CardTitle>
            <CardDescription>
              Cấu hình các quy tắc nghiệp vụ cho đồ án.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Thời gian Sprint mặc định (Tuần)</Label>
              <Input type="number" defaultValue={2} />
              <p className="text-[10px] text-muted-foreground">
                Chu kỳ lặp lại để tính điểm.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Hạn chót nộp bài (Giờ)</Label>
              <Input type="time" defaultValue="23:59" />
              <p className="text-[10px] text-muted-foreground">
                Hệ thống sẽ khóa submit sau giờ này.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Trọng số điểm Code (GitHub)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue={40} className="w-24" />
                <span className="text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trọng số điểm Task (Jira)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue={40} className="w-24" />
                <span className="text-sm">%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t px-6 py-4 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Lần cập nhật cuối: 15/01/2026 bởi Admin
            </span>
            <Button>Lưu cấu hình</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
