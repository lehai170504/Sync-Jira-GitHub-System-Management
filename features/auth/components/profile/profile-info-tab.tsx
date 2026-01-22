"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  MapPin,
  Phone,
  Save,
  Loader2,
  User as UserIcon,
  Badge,
} from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/features/auth/hooks/use-profile";

export function ProfileInfoTab() {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const { data: profileData, isLoading } = useProfile();
  const user = profileData?.user;

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
    address: "FPT HCM (Khu CNC)",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.full_name || "",
        phone: "", // Mock data
        bio: "", // Mock data
        address: "FPT HCM (Khu CNC)",
      });
    }
  }, [user]);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    // TODO: Gọi API update profile
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingProfile(false);
    toast.success("Cập nhật hồ sơ thành công!");
  };

  if (isLoading)
    return <div className="h-64 bg-slate-50 rounded-xl animate-pulse" />;

  return (
    <Card className="border-slate-200 shadow-sm animate-in fade-in-50 slide-in-from-left-2 duration-300">
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>
          Thông tin này sẽ được hiển thị công khai cho thành viên trong dự án.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <div className="relative">
              <Input
                id="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
                className="pl-10 h-10"
              />
              <UserIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mã số ({user?.role === "LECTURER" ? "GV" : "SV"})</Label>
            <div className="relative">
              <Input
                value={(user as any)?.student_code || "Chưa cập nhật"}
                disabled
                className="pl-10 bg-slate-50 h-10 text-slate-500 cursor-not-allowed font-medium"
              />
              <Badge className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="space-y-2">
            <Label>Chuyên ngành</Label>
            <Input
              value={(user as any)?.major || "Chưa cập nhật"}
              disabled
              className="bg-slate-50 h-10 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <div className="flex shadow-sm rounded-md">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-50 text-muted-foreground">
                <Phone className="h-4 w-4" />
              </span>
              <Input
                id="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="09xx..."
                className="rounded-l-none h-10 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Cơ sở (Campus)</Label>
            <div className="flex shadow-sm rounded-md">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-50 text-muted-foreground">
                <MapPin className="h-4 w-4" />
              </span>
              <Input
                id="address"
                value={profileForm.address}
                onChange={handleProfileChange}
                className="rounded-l-none h-10 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Giới thiệu bản thân</Label>
          <Textarea
            id="bio"
            value={profileForm.bio}
            onChange={handleProfileChange}
            placeholder="Viết đôi dòng về kinh nghiệm của bạn..."
            className="min-h-[120px] resize-none focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
          />
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end rounded-b-xl">
        <Button
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20 rounded-xl px-6 min-w-[140px]"
        >
          {isSavingProfile ? (
            <>
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...{" "}
            </>
          ) : (
            <>
              {" "}
              <Save className="mr-2 h-4 w-4" /> Lưu thay đổi{" "}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
