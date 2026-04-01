"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RegisterFormData } from "@/features/auth/types";
import { useRequestOtp, useRegister } from "@/features/auth/hooks/use-register";
import { RegisterStep1 } from "./register-step1";
import { RegisterStep2 } from "./register-step2";
import {
  registerStep1Schema,
  registerStep2Schema,
} from "@/features/auth/schemas/auth-form-schemas";

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
  const { mutate: register, isPending: isRegisterLoading } = useRegister(() => {
    setStep(1);
    onSwitchToLogin();
  });

  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerStep1Schema.safeParse({ email: formData.email });
    if (!parsed.success) {
      toast.warning(parsed.error.issues[0]?.message || "Email không hợp lệ");
      return;
    }
    requestOtp({ email: parsed.data.email });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerStep2Schema.safeParse(formData);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ");
      return;
    }
    const payload = parsed.data;
    const finalAvatar = payload.avatarUrl
      ? payload.avatarUrl
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.fullName}`;

    register({
      email: formData.email,
      otp_code: payload.otp,
      full_name: payload.fullName,
      student_code: payload.studentCode.toUpperCase(),
      password: payload.password,
      role: payload.role,
      avatar_url: finalAvatar,
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 transition-colors">
          {step === 1 ? "Tạo tài khoản" : "Xác thực"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
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
