"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- CẤU HÌNH ROLE (DEMO DATA) ---
export const DEMO_ROLES = {
  MEMBER: {
    id: "MEMBER",
    name: "Lê Văn An",
    email: "anlv@fpt.edu.vn",
    label: "Sinh viên",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    redirect: "/dashboard",
  },
  LEADER: {
    id: "LEADER",
    name: "Trần Thị Bình",
    email: "binhtt@fpt.edu.vn",
    label: "Nhóm trưởng (Project)",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    redirect: "/dashboard",
  },
  LECTURER: {
    id: "LECTURER",
    name: "Thầy Nguyễn Văn H",
    email: "hiennv@fpt.edu.vn",
    label: "Giảng viên",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grandma",
    redirect: "/lecturer/courses",
  },
  ADMIN: {
    id: "ADMIN",
    name: "Quản trị viên",
    email: "admin@fpt.edu.vn",
    label: "Admin hệ thống",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    redirect: "/dashboard",
  },
};

export type RoleKey = keyof typeof DEMO_ROLES;

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<RoleKey>("MEMBER");

  const currentRoleData = DEMO_ROLES[selectedRole];

  async function handleLogin() {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Delay giả lập

      // Lưu Cookie
      Cookies.set("user_role", selectedRole, { expires: 1 });
      Cookies.set("user_email", currentRoleData.email, { expires: 1 });
      Cookies.set("user_name", currentRoleData.name, { expires: 1 });
      Cookies.set("user_avatar", currentRoleData.avatar, { expires: 1 });

      toast.success(`Xin chào, ${currentRoleData.name}!`, {
        description: `Đăng nhập thành công vào hệ thống quản lý môn học.`,
      });

      router.push(currentRoleData.redirect);
      router.refresh();
    });
  }

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-white">
      {/* --- CỘT TRÁI: FORM ĐĂNG NHẬP --- */}
      <div className="flex flex-col h-full relative overflow-y-auto">
        {/* 1. Header Logo */}
        <div className="px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            {/* Logo System */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#F27124] to-[#d65d1b] shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="font-bold text-lg text-slate-900 hidden sm:block">
                SyncSystem
              </span>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200"></div>

            {/* Logo FPT */}
            <div className="opacity-90 grayscale group-hover:grayscale-0 transition-all duration-300">
              <Image
                src="/images/Logo_Trường_Đại_học_FPT.svg.png"
                alt="FPT University"
                width={100}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* 2. Form Content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24">
          <div className="max-w-[480px] w-full mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Cổng đăng nhập
              </h1>
              <p className="text-slate-500 text-base">
                Hệ thống quản lý môn học tập trung. Vui lòng chọn vai trò để
                trải nghiệm.
              </p>
            </div>

            {/* Role Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.values(DEMO_ROLES) as any[]).map((role) => (
                <div
                  key={role.id}
                  onClick={() => !isPending && setSelectedRole(role.id)}
                  className={`group relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedRole === role.id
                      ? "border-[#F27124] bg-orange-50/40 shadow-sm"
                      : "border-slate-100 hover:border-orange-100 hover:bg-slate-50"
                  }`}
                >
                  <Avatar className="h-10 w-10 border border-slate-200 bg-white group-hover:scale-105 transition-transform">
                    <AvatarImage src={role.avatar} />
                    <AvatarFallback>{role.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {role.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate font-medium">
                      {role.label}
                    </p>
                  </div>
                  {selectedRole === role.id && (
                    <div className="absolute top-[-8px] right-[-8px] bg-white rounded-full p-0.5 shadow-sm border border-orange-100">
                      <CheckCircle2 className="h-5 w-5 text-[#F27124] fill-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-5 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                    Thông tin tài khoản
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Email FPT (Tự động điền)
                  </Label>
                  <div className="relative">
                    <Input
                      value={currentRoleData.email}
                      readOnly
                      className="bg-slate-50 border-slate-200 text-slate-600 focus-visible:ring-0 pl-10 font-medium h-11"
                    />
                    <div className="absolute left-3 top-3 text-slate-400">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isPending}
                  className="w-full h-12 text-base font-bold bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Truy cập hệ thống"
                  )}
                  {!isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Footer */}
        <div className="px-8 py-6 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            &copy; 2026 SyncSystem. Subject Management Module.
          </p>
        </div>
      </div>

      {/* --- CỘT PHẢI: BANNER VISUAL (Nội dung thay đổi ở đây) --- */}
      <div className="hidden lg:block relative bg-[#0F172A]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="Students collaborating"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-16 text-white z-10">
          <div className="max-w-xl mb-10 animate-fade-in-up">
            <div className="h-16 w-16 bg-[#F27124] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/20">
              <span className="font-black text-4xl">S</span>
            </div>

            {/* --- UPDATED HEADLINE --- */}
            <h2 className="text-5xl font-bold mb-6 leading-[1.15]">
              Quản lý Môn học <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27124] to-orange-400">
                Tích hợp Jira & GitHub.
              </span>
            </h2>

            {/* --- UPDATED DESCRIPTION --- */}
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              "Tự động đồng bộ tiến độ bài Lab, Assignment và chấm điểm Code.
              Giảm tải áp lực quản lý cho Giảng viên và tăng tính chủ động cho
              Sinh viên."
            </p>

            {/* Testimonial */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 w-fit">
              <Avatar className="h-12 w-12 border-2 border-[#F27124]">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Grandma" />
                <AvatarFallback>GV</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-white">Cô Lê Thị Lan</p>
                <p className="text-sm text-slate-400">
                  Trưởng bộ môn SE - FPTU
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
