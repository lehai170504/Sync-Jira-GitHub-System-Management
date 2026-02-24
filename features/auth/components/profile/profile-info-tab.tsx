"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, GraduationCap, Hash, Loader2, Save } from "lucide-react";
import { useUpdateProfile } from "@/features/auth/hooks/use-profile";

interface ProfileInfoTabProps {
  user: any;
  onSuccess?: () => void;
}

export function ProfileInfoTab({ user, onSuccess }: ProfileInfoTabProps) {
  const isStudent = user?.role === "STUDENT";
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  const [formData, setFormData] = useState({
    full_name: "",
    major: "",
    ent: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        major: user.major || "",
        ent: user.ent || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile(
      {
        full_name: formData.full_name,
        ...(isStudent && {
          major: formData.major,
          ent: formData.ent,
        }),
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">
      {/* Khối Thông tin */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Họ và tên hiển thị
          </Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            className="h-12 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus-visible:ring-[#F27124]/20"
          />
        </div>

        {isStudent && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Chuyên ngành
              </Label>
              <div className="relative">
                <Input
                  id="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="pl-10 h-12 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold uppercase focus-visible:ring-[#F27124]/20"
                />
                <BookOpen className="h-4 w-4 absolute left-3.5 top-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Khóa / Kỳ nhập học
              </Label>
              <div className="relative">
                <Input
                  id="ent"
                  value={formData.ent}
                  onChange={handleInputChange}
                  className="pl-10 h-12 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold uppercase focus-visible:ring-[#F27124]/20"
                />
                <GraduationCap className="h-4 w-4 absolute left-3.5 top-4 text-slate-400" />
              </div>
            </div>

            <div className="col-span-2 space-y-2 mt-2">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Mã số sinh viên (Không thể sửa)
              </Label>
              <div className="relative">
                <Input
                  value={user?.student_code || "N/A"}
                  disabled
                  className="pl-10 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 border-none font-bold tracking-widest cursor-not-allowed"
                />
                <Hash className="h-4 w-4 absolute left-3.5 top-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hành động */}
      <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="h-12 bg-slate-900 dark:bg-[#F27124] hover:bg-[#F27124] dark:hover:bg-[#d65d1b] text-white rounded-xl px-8 transition-all font-bold"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
