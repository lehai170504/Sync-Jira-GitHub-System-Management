"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Save,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div>
        <h3 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h3>
        <p className="text-muted-foreground">
          Quản lý thông tin định danh và hiển thị công khai của bạn.
        </p>
      </div>
      <Separator className="my-6" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR INFO (Avatar & Quick Actions) */}
        <aside className="md:w-1/4 space-y-6">
          <Card className="text-center overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <div className="relative -mt-12 flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-1/3 rounded-full h-8 w-8 shadow-sm"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="pt-4">
              <h2 className="text-xl font-bold">Nguyễn Văn Admin</h2>
              <p className="text-sm text-muted-foreground">Admin Hệ thống</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Administrator</Badge>
                <Badge
                  variant="outline"
                  className="border-orange-200 text-orange-600 bg-orange-50"
                >
                  FPT Staff
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Liên kết xã hội</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Github className="h-4 w-4 text-slate-700" />
                <span className="text-muted-foreground">@admin_dev</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Linkedin className="h-4 w-4 text-blue-700" />
                <span className="text-muted-foreground">
                  linkedin.com/in/admin
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* MAIN CONTENT FORM */}
        <div className="flex-1">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="security">Bảo mật & Tài khoản</TabsTrigger>
            </TabsList>

            {/* TAB 1: GENERAL INFO */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Thông tin này sẽ được hiển thị cho các thành viên khác trong
                    dự án.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input id="fullName" defaultValue="Nguyễn Văn Admin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mssv">Mã số (MSSV/CB)</Label>
                      <Input
                        id="mssv"
                        defaultValue="ADMIN_001"
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email FPT</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        id="email"
                        defaultValue="admin@fpt.edu.vn"
                        className="rounded-l-none"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          <Phone className="h-4 w-4" />
                        </span>
                        <Input
                          id="phone"
                          defaultValue="0987654321"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Cơ sở (Campus)</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <Input
                          id="location"
                          defaultValue="FPT HCM (Khu CNC)"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu bản thân</Label>
                    <Textarea
                      id="bio"
                      placeholder="Viết đôi dòng về kinh nghiệm của bạn..."
                      className="min-h-[100px]"
                      defaultValue="Quản trị viên hệ thống SyncSystem. Hỗ trợ kỹ thuật và vận hành quy trình đồ án."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* TAB 2: SECURITY */}
            <TabsContent value="security" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                  <CardDescription>
                    Để bảo mật, vui lòng không chia sẻ mật khẩu cho người khác.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Mật khẩu hiện tại</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new">Mật khẩu mới</Label>
                      <Input id="new" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Nhập lại mật khẩu mới</Label>
                      <Input id="confirm" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                  <Button variant="outline" className="mr-2">
                    Hủy
                  </Button>
                  <Button>Cập nhật mật khẩu</Button>
                </CardFooter>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Vùng nguy hiểm
                  </CardTitle>
                  <CardDescription>
                    Các hành động dưới đây không thể hoàn tác.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium text-red-900">Xóa tài khoản</p>
                      <p className="text-sm text-red-700">
                        Xóa vĩnh viễn tài khoản và dữ liệu liên quan.
                      </p>
                    </div>
                    <Button variant="destructive">Xóa tài khoản</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
