"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Save,
  Loader2,
  User as UserIcon,
  Badge,
  BookOpen,
  GraduationCap,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import Hook đã chuẩn hóa
import {
  useProfile,
  useUpdateProfile,
} from "@/features/auth/hooks/use-profile";

export function ProfileInfoTab() {

  const { data: profileData, isLoading } = useProfile();
  const user = profileData?.user;

  // 2. Hook cập nhật
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  // 3. State Form
  const [formData, setFormData] = useState({
    full_name: "",
    major: "",
    ent: "",
    avatar_url: "",
  });

  // 4. Sync dữ liệu từ API vào Form khi load xong
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        major: user.major || "",
        ent: user.ent || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Submit
  const handleSaveProfile = () => {
    updateProfile({
      user: {
        full_name: formData.full_name,
        major: formData.major,
        ent: formData.ent,
        avatar_url: formData.avatar_url,
      },
    });
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="h-6 w-48 bg-slate-100 animate-pulse rounded" />
          <div className="h-4 w-72 bg-slate-100 animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-full bg-slate-100 animate-pulse rounded"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm animate-in fade-in-50 slide-in-from-left-2 duration-300">
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>
          Thông tin này sẽ được hiển thị công khai cho thành viên trong dự án.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* --- SECTION 1: ẢNH ĐẠI DIỆN --- */}
        <div className="space-y-3">
          <Label
            htmlFor="avatar_url"
            className="text-sm font-medium text-slate-700"
          >
            Ảnh đại diện
          </Label>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Avatar Preview */}
            <Avatar className="h-16 w-16 border-2 border-slate-100 shadow-sm">
              <AvatarImage
                src={formData.avatar_url}
                alt="Preview"
                className="object-cover"
              />
              <AvatarFallback className="bg-slate-100">
                <UserIcon className="h-8 w-8 text-slate-300" />
              </AvatarFallback>
            </Avatar>

            {/* Input Link */}
            <div className="flex-1 w-full space-y-1">
              <div className="relative">
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="pl-9 h-10"
                />
                <LinkIcon className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              </div>
              <p className="text-[11px] text-muted-foreground pl-1">
                *Dán đường dẫn ảnh trực tiếp (VD: Imgur, Google Photos).
              </p>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: THÔNG TIN CÁ NHÂN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên</Label>
            <div className="relative">
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="pl-9"
                placeholder="Nhập họ tên..."
              />
              <UserIcon className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          {/* Mã số (Read-only) */}
          <div className="space-y-2">
            <Label>
              Mã số ({user?.role === "LECTURER" ? "Giảng viên" : "Sinh viên"})
            </Label>
            <div className="relative">
              <Input
                value={user?.student_code || "Chưa cập nhật"}
                disabled
                className="pl-9 bg-slate-50 text-slate-500 font-mono"
              />
              <Badge className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: EMAIL (Read-only) --- */}
        <div className="space-y-2">
          <Label>Email FPT</Label>
          <div className="relative">
            <Input
              value={user?.email}
              disabled
              className="pl-9 bg-slate-50 text-slate-500"
            />
            <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          </div>
        </div>

        {/* --- SECTION 4: HỌC VẤN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="major">Chuyên ngành</Label>
            <div className="relative">
              <Input
                id="major"
                value={formData.major}
                onChange={handleInputChange}
                placeholder="VD: Kỹ thuật phần mềm"
                className="pl-9"
              />
              <BookOpen className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ent">Khóa / Niên khóa (Ent)</Label>
            <div className="relative">
              <Input
                id="ent"
                value={formData.ent}
                onChange={handleInputChange}
                placeholder="VD: K18"
                className="pl-9"
              />
              <GraduationCap className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end rounded-b-xl">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md transition-all active:scale-95 min-w-[140px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
