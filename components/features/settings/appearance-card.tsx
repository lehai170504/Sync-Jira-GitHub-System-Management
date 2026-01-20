"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Moon, Sun } from "lucide-react";

export function AppearanceSettings() {
  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-[#F27124]" /> Giao diện & Hiển thị
        </CardTitle>
        <CardDescription>
          Tùy chỉnh trải nghiệm nhìn của ứng dụng.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* THEME SELECTION */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Chế độ hiển thị</Label>
            <p className="text-sm text-muted-foreground">
              Chọn giao diện Sáng, Tối hoặc theo Hệ thống.
            </p>
          </div>
          <div className="flex items-center gap-1 border p-1 rounded-lg bg-slate-100/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-muted-foreground hover:bg-white hover:shadow-sm"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md bg-white text-[#F27124] shadow-sm"
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-muted-foreground hover:bg-white hover:shadow-sm"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* LANGUAGE SELECTION */}
        <div className="space-y-2">
          <Label>Ngôn ngữ hệ thống</Label>
          <Select defaultValue="vi">
            <SelectTrigger className="focus:ring-[#F27124]/20 focus:border-[#F27124]">
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
  );
}
