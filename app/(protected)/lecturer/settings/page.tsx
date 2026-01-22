"use client";

import { useState } from "react";
import {
  Save,
  RefreshCw,
  AlertTriangle,
  Scale,
  ShieldAlert,
  GraduationCap,
  History,
  Palette,
  Bell,
  Layout,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import các component cũ của homie (Giả định đường dẫn đúng)
import { AppearanceSettings } from "@/components/features/settings/appearance-card";
import { NotificationSettings } from "@/components/features/settings/notification-card";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  // --- STATE CẤU HÌNH LỚP ---
  const [weights, setWeights] = useState({
    process: 40, // Jira
    product: 40, // GitHub
    softSkill: 20, // Peer Review
  });

  const totalWeight = weights.process + weights.product + weights.softSkill;
  const isWeightValid = totalWeight === 100;

  const handleSave = () => {
    if (!isWeightValid) {
      toast.error(`Tổng trọng số phải là 100% (Hiện tại: ${totalWeight}%)`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã cập nhật cấu hình lớp học thành công!");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl space-y-8 animate-in fade-in-50">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Cài đặt & Cấu hình
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Quản lý tham số vận hành cho lớp{" "}
            <span className="font-semibold text-[#F27124]">SE1783</span> và tùy
            chỉnh hệ thống.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
          >
            <History className="mr-2 h-4 w-4 text-gray-500" /> Lịch sử log
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white min-w-[140px]"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <Separator />

      {/* 2. MAIN TABS */}
      <Tabs defaultValue="class-config" className="space-y-8">
        <TabsList className="bg-gray-100/50 p-1 rounded-xl border border-gray-200 inline-flex h-auto w-full md:w-auto">
          <TabsTrigger
            value="class-config"
            className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm font-medium transition-all"
          >
            <BookOpen className="h-4 w-4" /> Cấu hình Lớp học (Scoring)
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium transition-all"
          >
            <Layout className="h-4 w-4" /> Giao diện & Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: CLASS CONFIGURATION (NEW CODE) --- */}
        <TabsContent value="class-config" className="space-y-8">
          {/* SCORING MODEL */}
          <Card className="border border-blue-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-blue-50/30 border-b border-blue-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">
                      Mô hình Trọng số (Scoring Weights)
                    </CardTitle>
                    <CardDescription>
                      Quyết định cách hệ thống tính điểm Project (Auto-score)
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={isWeightValid ? "default" : "destructive"}
                  className={
                    isWeightValid
                      ? "bg-green-600 hover:bg-green-700 h-7 px-3 text-sm"
                      : "h-7 px-3 text-sm"
                  }
                >
                  Tổng: {totalWeight}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Slider 1 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold text-gray-800">
                      1. Tiến độ & Quy trình (Jira)
                    </Label>
                    <p className="text-sm text-gray-500">
                      Dựa trên: Task completion, Burndown rate, Story Points.
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-blue-600 w-20 text-right">
                    {weights.process}%
                  </span>
                </div>
                <Slider
                  value={[weights.process]}
                  max={100}
                  step={5}
                  onValueChange={(v) =>
                    setWeights({ ...weights, process: v[0] })
                  }
                  className="py-2"
                />
              </div>
              <Separator className="bg-gray-100" />
              {/* Slider 2 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold text-gray-800">
                      2. Chất lượng Sản phẩm (GitHub)
                    </Label>
                    <p className="text-sm text-gray-500">
                      Dựa trên: Commit volume, Lines of Code, PR Merged.
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-[#F27124] w-20 text-right">
                    {weights.product}%
                  </span>
                </div>
                <Slider
                  value={[weights.product]}
                  max={100}
                  step={5}
                  onValueChange={(v) =>
                    setWeights({ ...weights, product: v[0] })
                  }
                  className="py-2"
                />
              </div>
              <Separator className="bg-gray-100" />
              {/* Slider 3 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold text-gray-800">
                      3. Kỹ năng mềm & Đánh giá chéo
                    </Label>
                    <p className="text-sm text-gray-500">
                      Dựa trên: Peer Review score, Điểm danh, Thái độ.
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-green-600 w-20 text-right">
                    {weights.softSkill}%
                  </span>
                </div>
                <Slider
                  value={[weights.softSkill]}
                  max={100}
                  step={5}
                  onValueChange={(v) =>
                    setWeights({ ...weights, softSkill: v[0] })
                  }
                  className="py-2"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* RISK SETTINGS */}
            <Card className="border border-gray-200 shadow-sm h-full bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">
                    Ngưỡng Cảnh báo
                  </CardTitle>
                </div>
                <CardDescription>
                  Điều kiện để hệ thống gắn cờ "Risk"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">
                      Không hoạt động (Inactive)
                    </Label>
                    <p className="text-xs text-gray-500">
                      Không có commit trong X ngày.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                    <Input
                      type="number"
                      className="w-12 h-7 p-1 text-center border-none shadow-none focus-visible:ring-0"
                      defaultValue={3}
                    />
                    <span className="text-xs font-medium text-gray-500 pr-1">
                      ngày
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">
                      Spam Commits
                    </Label>
                    <p className="text-xs text-gray-500">
                      Phát hiện commit rác.
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    className="data-[state=checked]:bg-[#F27124]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* RULES SETTINGS */}
            <Card className="border border-gray-200 shadow-sm h-full bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">
                    Quy chế Học thuật
                  </CardTitle>
                </div>
                <CardDescription>Các quy tắc chung cho lớp học</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">
                      Max Cap Điểm Project
                    </Label>
                    <p className="text-xs text-gray-500">
                      Điểm tối đa có thể đạt được.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                    <ShieldAlert className="h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      className="w-12 h-7 p-1 text-center border-none shadow-none focus-visible:ring-0"
                      defaultValue={10}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">
                      Yêu cầu Peer Review
                    </Label>
                    <p className="text-xs text-gray-500">
                      Bắt buộc đánh giá chéo.
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB 2: SYSTEM SETTINGS (OLD CODE) --- */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Giả sử homie đã có các component này, chỉ cần import và dùng */}
            <AppearanceSettings />
            <NotificationSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
