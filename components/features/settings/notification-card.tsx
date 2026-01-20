"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, BellRing, Mail } from "lucide-react";

export function NotificationSettings() {
  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BellRing className="h-5 w-5 text-[#F27124]" /> Cấu hình Thông báo
        </CardTitle>
        <CardDescription>
          Quản lý cách hệ thống gửi tin nhắn cho sinh viên.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* EMAIL DIGEST */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Mail className="h-4 w-4 text-slate-500" /> Email Digest
            </Label>
            <p className="text-sm text-muted-foreground">
              Gửi email tổng hợp tiến độ vào 8:00 sáng mỗi ngày.
            </p>
          </div>
          <Switch
            defaultChecked
            className="data-[state=checked]:bg-[#F27124]"
          />
        </div>

        <Separator />

        {/* RISK ALERTS */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label className="flex items-center gap-2 text-base font-medium">
              <AlertTriangle className="h-4 w-4 text-slate-500" /> Cảnh báo Rủi
              ro
            </Label>
            <p className="text-sm text-muted-foreground">
              Tự động báo tin ngay lập tức khi sinh viên trễ deadline.
            </p>
          </div>
          <Switch
            defaultChecked
            className="data-[state=checked]:bg-[#F27124]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
