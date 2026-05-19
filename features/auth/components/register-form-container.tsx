"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RegisterFormData } from "@/features/auth/types/auth-types";
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

    const parsed = registerStep1Schema.safeParse({
      email: formData.email,
    });

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
      toast.error(
        parsed.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ",
      );
      return;
    }

    const payload = parsed.data;

    const finalAvatar =
      payload.avatarUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        payload.fullName,
      )}`;

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
    <div className="w-full space-y-5">
      {/* Step Indicator */}
      <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">
              {step === 1 ? "Bước 1 / 2" : "Bước 2 / 2"}
            </p>

            <h2 className="mt-1 text-base font-black tracking-tight text-zinc-950 dark:text-white">
              {step === 1 ? "Xác nhận email" : "Hoàn tất thông tin"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-8 rounded-full transition-all ${
                step >= 1 ? "bg-orange-500" : "bg-slate-200 dark:bg-white/10"
              }`}
            />
            <div
              className={`h-2.5 w-8 rounded-full transition-all ${
                step >= 2 ? "bg-orange-500" : "bg-slate-200 dark:bg-white/10"
              }`}
            />
          </div>
        </div>

        <p className="text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
          {step === 1
            ? "Nhập email để nhận mã OTP xác thực tài khoản GraphGrade."
            : "Nhập mã OTP và hoàn thiện thông tin cá nhân của bạn."}
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
