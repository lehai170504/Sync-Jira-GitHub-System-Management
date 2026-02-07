"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RegisterFormData } from "@/features/auth/types";
import { useRequestOtp, useRegister } from "@/features/auth/hooks/use-register";
import { RegisterStep1 } from "./register-step1";
import { RegisterStep2 } from "./register-step2";

interface Props {
  onSwitchToLogin: () => void;
}

export function RegisterFormContainer({ onSwitchToLogin }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
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

  const { mutate: requestOtp, isPending: isOtpLoading } = useRequestOtp(() =>
    setStep(2),
  );
  const { mutate: register, isPending: isRegisterLoading } = useRegister();

  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.warning("Vui lòng nhập email");
      return;
    }
    requestOtp({ email: formData.email });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
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
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">
          {step === 1 ? "Tạo tài khoản" : "Xác thực"}
        </h1>
        <p className="text-slate-500 text-sm">
          {step === 1
            ? "Bắt đầu hành trình học tập cùng SyncSystem."
            : "Nhập mã OTP đã được gửi đến email."}
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
    </div>
  );
}
