"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { useRequestOtp, useRegister } from "@/features/auth/hooks/use-register";
import { RegisterFormData } from "@/features/auth/types";

// Import Components đã tách
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthBanner } from "@/features/auth/components/auth-banner";
import { RegisterStep1 } from "@/features/auth/components/register-step1";
import { RegisterStep2 } from "@/features/auth/components/register-step2";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);

  // Gom nhóm state vào 1 object duy nhất cho gọn
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    otp: "",
    fullName: "",
    studentCode: "",
    avatarUrl: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  // Hooks
  const { mutate: requestOtp, isPending: isOtpLoading } = useRequestOtp(() =>
    setStep(2),
  );
  const { mutate: register, isPending: isRegisterLoading } = useRegister();

  // Helper cập nhật state
  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Logic Submit Bước 1
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.warning("Vui lòng nhập email");
      return;
    }
    requestOtp({ email: formData.email });
  };

  // Logic Submit Bước 2
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (!formData.studentCode.trim()) {
      toast.error("Vui lòng nhập Mã số Sinh viên hoặc Giảng viên.");
      return;
    }

    // Logic ảnh mặc định nếu không nhập
    const finalAvatar = formData.avatarUrl.trim()
      ? formData.avatarUrl.trim()
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.fullName}`;

    register({
      email: formData.email,
      otp_code: formData.otp,
      full_name: formData.fullName,
      student_code: formData.studentCode.toUpperCase(),
      password: formData.password,
      role: formData.role,
      avatar_url: finalAvatar,
    });
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-white">
      {/* CỘT TRÁI: FORM */}
      <div className="flex flex-col h-full relative overflow-y-auto">
        <AuthHeader />

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24">
          <div className="max-w-[480px] w-full mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {step === 1 ? "Tạo tài khoản mới" : "Xác thực & Hoàn tất"}
              </h1>
              <p className="text-slate-500 text-base">
                {step === 1
                  ? "Bắt đầu hành trình học tập và quản lý đồ án hiệu quả cùng SyncSystem."
                  : `Nhập mã OTP đã được gửi đến ${formData.email}`}
              </p>
            </div>

            {step === 1 ? (
              <RegisterStep1
                email={formData.email}
                isLoading={isOtpLoading}
                onEmailChange={(val) => updateFormData("email", val)}
                onSubmit={handleStep1Submit}
              />
            ) : (
              <RegisterStep2
                formData={formData}
                isLoading={isRegisterLoading}
                onUpdate={updateFormData}
                onSubmit={handleStep2Submit}
                onBack={() => setStep(1)}
              />
            )}

            <div className="text-center text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-bold text-[#F27124] hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            &copy; 2026 SyncSystem. Subject Management Module.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: BANNER */}
      <AuthBanner />
    </div>
  );
}
