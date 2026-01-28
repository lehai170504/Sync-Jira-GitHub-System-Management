"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Save,
  Loader2,
  User as UserIcon,
  BookOpen,
  GraduationCap,
  Link as LinkIcon,
  ShieldCheck,
  Hash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfile } from "@/features/auth/hooks/use-profile";

interface ProfileInfoTabProps {
  user:
    | {
        _id: string;
        full_name: string;
        email: string;
        avatar_url: string;
        student_code: string;
        role: string;
        major?: string;
        ent?: string;
        is_verified: boolean;
      }
    | undefined;
}

export function ProfileInfoTab({ user }: ProfileInfoTabProps) {
  const isStudent = user?.role === "STUDENT";
  const isLecturer = user?.role === "LECTURER";

  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  const [formData, setFormData] = useState({
    full_name: "",
    major: "",
    ent: "",
    avatar_url: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = () => {
    // FIX TẠI ĐÂY: Gửi object phẳng theo interface mới
    updateProfile({
      full_name: formData.full_name,
      avatar_url: formData.avatar_url,
      ...(isStudent && {
        major: formData.major,
        ent: formData.ent,
      }),
    });
  };

  return (
    <div className="space-y-10 font-mono animate-in fade-in slide-in-from-top-4 duration-700">
      {/* --- PHẦN 1: QUẢN LÝ AVATAR --- */}
      <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col gap-2 mb-8 border-b border-slate-50 pb-4">
          <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">
            01: QUẢN LÝ ẢNH ĐẠI DIỆN
          </h4>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-[6px] border-white shadow-2xl rounded-[32px]">
              <AvatarImage src={formData.avatar_url} className="object-cover" />
              <AvatarFallback className="bg-orange-50 text-[#F27124] text-3xl font-black">
                {user?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-2xl shadow-xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <Label
              htmlFor="avatar_url"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
            >
              Link Avatar Source
            </Label>
            <div className="relative">
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                className="pl-12 h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold text-xs"
                placeholder="Dán link ảnh tại đây..."
              />
              <LinkIcon className="h-5 w-5 absolute left-4 top-4.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: THÔNG TIN CHI TIẾT --- */}
      <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col gap-2 mb-10 border-b border-slate-50 pb-6">
          <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">
            02: DỮ LIỆU ĐỊNH DANH
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div className={isLecturer ? "md:col-span-2 space-y-3" : "space-y-3"}>
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Họ Và Tên Đầy Đủ
            </Label>
            <div className="relative">
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="pl-12 h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold"
              />
              <UserIcon className="h-5 w-5 absolute left-4 top-4.5 text-slate-400" />
            </div>
          </div>

          {isStudent && (
            <>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Mã Số Sinh Viên
                </Label>
                <div className="relative">
                  <Input
                    value={user?.student_code || "N/A"}
                    disabled
                    className="pl-12 h-14 rounded-2xl bg-slate-100 text-slate-400 border-none font-black tracking-widest cursor-not-allowed"
                  />
                  <Hash className="h-5 w-5 absolute left-4 top-4.5 text-slate-300" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Email Fpt Academic
                </Label>
                <div className="relative">
                  <Input
                    value={user?.email}
                    disabled
                    className="pl-12 h-14 rounded-2xl bg-slate-100 text-slate-400 border-none font-bold cursor-not-allowed"
                  />
                  <Mail className="h-5 w-5 absolute left-4 top-4.5 text-slate-300" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Chuyên Ngành
                </Label>
                <div className="relative">
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="pl-12 h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold uppercase"
                  />
                  <BookOpen className="h-5 w-5 absolute left-4 top-4.5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Niên Khóa Kỳ Nhập Học
                </Label>
                <div className="relative">
                  <Input
                    id="ent"
                    value={formData.ent}
                    onChange={handleInputChange}
                    className="pl-12 h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold uppercase"
                  />
                  <GraduationCap className="h-5 w-5 absolute left-4 top-4.5 text-slate-400" />
                </div>
              </div>
            </>
          )}

          {isLecturer && (
            <div className="md:col-span-2 space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Fpt Academic
              </Label>
              <div className="relative">
                <Input
                  value={user?.email}
                  disabled
                  className="pl-12 h-14 rounded-2xl bg-slate-100 text-slate-400 border-none font-bold cursor-not-allowed"
                />
                <Mail className="h-5 w-5 absolute left-4 top-4.5 text-slate-300" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-lg">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Dữ liệu sẵn sàng đồng bộ
          </span>
        </div>

        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="h-16 bg-slate-900 hover:bg-[#F27124] text-white rounded-[20px] px-12 transition-all active:scale-95 shadow-2xl hover:shadow-[#F27124]/30 min-w-[240px]"
        >
          {isSaving ? (
            <Loader2 className="h-6 w-6 animate-spin mr-3" />
          ) : (
            <Save className="h-5 w-5 mr-3" />
          )}
          <span className="font-black uppercase tracking-[0.25em] text-xs">
            {isSaving ? "ĐANG LƯU..." : "LƯU CẬP NHẬT"}
          </span>
        </Button>
      </div>
    </div>
  );
}
