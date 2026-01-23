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
import {
  useProfile,
  useUpdateProfile,
} from "@/features/auth/hooks/use-profile";

export function ProfileInfoTab() {
  // 1. Lấy dữ liệu
  const { data: profileData, isLoading } = useProfile();
  const user = profileData?.user;

  // 2. Hook Update
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  // 3. State Form (Thêm avatar_url)
  const [formData, setFormData] = useState({
    full_name: "",
    major: "",
    ent: "",
    avatar_url: "",
  });

  // Sync dữ liệu từ API vào Form
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        major: user.major || "",
        ent: user.ent || "",
        avatar_url: user.avatar_url || "", // Load link avatar hiện tại
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile({
      full_name: formData.full_name,
      major: formData.major,
      ent: formData.ent,
      avatar_url: formData.avatar_url, // Gửi link avatar lên API
    });
  };

  if (isLoading)
    return <div className="h-96 bg-slate-50 rounded-xl animate-pulse" />;

  return (
    <Card className="border-slate-200 shadow-sm animate-in fade-in-50 slide-in-from-left-2 duration-300">
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>
          Thông tin này sẽ được hiển thị công khai cho thành viên trong dự án.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* --- HÀNG 1: ẢNH ĐẠI DIỆN (NEW) --- */}
        <div className="space-y-2">
          <Label htmlFor="avatar_url">Ảnh đại diện (Link URL)</Label>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                placeholder="https://example.com/my-avatar.jpg"
                className="pl-10 h-10"
              />
              <LinkIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
            {/* Preview Avatar */}
            <Avatar className="h-10 w-10 border border-slate-200 bg-slate-100">
              <AvatarImage
                src={formData.avatar_url}
                alt="Preview"
                className="object-cover"
              />
              <AvatarFallback>
                <ImageIcon className="h-4 w-4 text-slate-400" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-[11px] text-muted-foreground">
            *Dán đường dẫn ảnh từ Google Photos, Imgur, hoặc các nguồn công khai
            khác.
          </p>
        </div>

        {/* --- HÀNG 2: HỌ TÊN & MÃ SỐ --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên</Label>
            <div className="relative">
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="pl-10 h-10"
                placeholder="Nhập họ tên..."
              />
              <UserIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Mã số ({user?.role === "LECTURER" ? "Giảng viên" : "Sinh viên"})
            </Label>
            <div className="relative">
              <Input
                value={user?.student_code || "Chưa cập nhật"}
                disabled
                className="pl-10 bg-slate-50 h-10 text-slate-500 cursor-not-allowed font-medium"
              />
              <Badge className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            </div>
          </div>
        </div>

        {/* --- HÀNG 3: EMAIL (Read-only) --- */}
        <div className="space-y-2">
          <Label>Email FPT</Label>
          <div className="flex shadow-sm rounded-md">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-50 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </span>
            <Input
              value={user?.email}
              disabled
              className="rounded-l-none h-10 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* --- HÀNG 4: CHUYÊN NGÀNH & KHÓA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="major">Chuyên ngành</Label>
            <div className="relative">
              <Input
                id="major"
                value={formData.major}
                onChange={handleInputChange}
                placeholder="VD: Kỹ thuật phần mềm"
                className="pl-10 h-10"
              />
              <BookOpen className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
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
                className="pl-10 h-10"
              />
              <GraduationCap className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end rounded-b-xl">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20 rounded-xl px-6 min-w-[140px]"
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
