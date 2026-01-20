"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MapPin, Phone, Save, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfileTabs() {
  const [isLoading, setIsLoading] = useState(false);

  // Giả lập hàm lưu
  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay 1.5s
    setIsLoading(false);
    toast.success("Cập nhật hồ sơ thành công!");
  };

  // Style cho Tab "Viên thuốc"
  const tabTriggerStyle =
    "rounded-full border border-transparent px-6 py-2.5 font-medium text-muted-foreground transition-all hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-[#F27124] data-[state=active]:text-white data-[state=active]:shadow-sm text-sm";

  return (
    <div className="flex-1">
      <Tabs defaultValue="general" className="w-full">
        {/* TAB NAVIGATION */}
        <div className="mb-6 overflow-x-auto scrollbar-none pb-1">
          <TabsList className="bg-transparent p-0 h-auto w-full justify-start space-x-2 min-w-max">
            <TabsTrigger value="general" className={tabTriggerStyle}>
              Thông tin chung
            </TabsTrigger>
            <TabsTrigger value="security" className={tabTriggerStyle}>
              Bảo mật & Tài khoản
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: GENERAL INFO */}
        <TabsContent
          value="general"
          className="space-y-6 mt-0 focus-visible:outline-none animate-in fade-in-50 slide-in-from-left-2 duration-300"
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Thông tin này sẽ được hiển thị công khai cho thành viên trong dự
                án.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Row 1: Name & MSSV */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    defaultValue="Nguyễn Văn Admin"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mssv">Mã số (MSSV/CB)</Label>
                  <Input
                    id="mssv"
                    defaultValue="ADMIN_001"
                    disabled
                    className="bg-slate-50 h-10 text-slate-500"
                  />
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email FPT</Label>
                <div className="flex shadow-sm rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-50 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    defaultValue="admin@fpt.edu.vn"
                    className="rounded-l-none focus-visible:ring-0 focus-visible:border-[#F27124] h-10"
                    disabled
                  />
                </div>
              </div>

              {/* Row 3: Phone & Campus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex shadow-sm rounded-md">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-50 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input
                      id="phone"
                      defaultValue="0987654321"
                      className="rounded-l-none h-10 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Cơ sở (Campus)</Label>
                  <div className="flex shadow-sm rounded-md">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-50 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <Input
                      id="location"
                      defaultValue="FPT HCM (Khu CNC)"
                      className="rounded-l-none h-10 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                <Textarea
                  id="bio"
                  placeholder="Viết đôi dòng về kinh nghiệm của bạn..."
                  className="min-h-[120px] resize-none focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
                  defaultValue="Quản trị viên hệ thống SyncSystem. Hỗ trợ kỹ thuật và vận hành quy trình đồ án."
                />
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end rounded-b-xl">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20 rounded-xl px-6 min-w-[140px] transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lưu thay
                    đổi
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 2: SECURITY */}
        <TabsContent
          value="security"
          className="space-y-6 mt-0 focus-visible:outline-none animate-in fade-in-50 slide-in-from-left-2 duration-300"
        >
          {/* Change Password */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Để bảo mật, vui lòng đặt mật khẩu mạnh và không chia sẻ cho
                người khác.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Mật khẩu hiện tại</Label>
                <Input
                  id="current"
                  type="password"
                  className="h-10 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new">Mật khẩu mới</Label>
                  <Input
                    id="new"
                    type="password"
                    className="h-10 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Nhập lại mật khẩu mới</Label>
                  <Input
                    id="confirm"
                    type="password"
                    className="h-10 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" className="rounded-xl hover:bg-slate-100">
                Hủy bỏ
              </Button>
              <Button className="bg-[#F27124] hover:bg-[#d65d1b] rounded-xl px-6 shadow-md shadow-orange-500/10">
                Cập nhật mật khẩu
              </Button>
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-red-50/50 pb-4">
              <CardTitle className="text-red-600 flex items-center gap-2 text-base">
                <Shield className="h-5 w-5" /> Vùng nguy hiểm
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-red-100 rounded-lg bg-red-50/30">
                <div>
                  <p className="font-semibold text-red-900">Xóa tài khoản</p>
                  <p className="text-sm text-red-600/80 mt-1">
                    Hành động này sẽ xóa vĩnh viễn tài khoản và dữ liệu của bạn
                    khỏi hệ thống.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="rounded-xl shadow-sm whitespace-nowrap"
                >
                  Xóa tài khoản này
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
