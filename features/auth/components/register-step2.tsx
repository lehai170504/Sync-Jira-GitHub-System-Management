"use client";

import { useRef } from "react";
import { ArrowLeft, Hash, Loader2, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterFormData } from "../types/auth-types";

interface RegisterStep2Props {
  formData: RegisterFormData;
  isLoading: boolean;
  onUpdate: (field: keyof RegisterFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function RegisterStep2({
  formData,
  isLoading,
  onUpdate,
  onSubmit,
  onBack,
}: RegisterStep2Props) {
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const isStudent = formData.role === "STUDENT";

  const handleOtpChange = (index: number, value: string) => {
    if (Number.isNaN(Number(value))) return;

    const currentOtp = formData.otp || "";
    const otpArray = currentOtp.padEnd(6, " ").split("");

    otpArray[index] = value.substring(value.length - 1);

    const newOtp = otpArray.join("").trim();
    onUpdate("otp", newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-fade-up">
      {/* Role + Student Code */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className={!isStudent ? "sm:col-span-2" : ""}>
          <Select
            value={formData.role}
            onValueChange={(val) => onUpdate("role", val)}
            disabled={isLoading}
          >
            <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-zinc-900 transition-all focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl border-slate-100 bg-white text-xs font-semibold dark:border-white/10 dark:bg-zinc-900">
              <SelectItem value="STUDENT">Sinh viên</SelectItem>
              <SelectItem value="LECTURER">Giảng viên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isStudent && (
          <FloatingInput
            label="MSSV"
            icon={<Hash className="h-3.5 w-3.5" />}
            value={formData.studentCode}
            onChange={(value) => onUpdate("studentCode", value)}
            disabled={isLoading}
            required
            uppercase
          />
        )}
      </div>

      {/* Full Name */}
      <FloatingInput
        label="Họ và tên"
        icon={<User className="h-3.5 w-3.5" />}
        value={formData.fullName}
        onChange={(value) => onUpdate("fullName", value)}
        disabled={isLoading}
        required
      />

      {/* Passwords */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FloatingInput
          type="password"
          label="Mật khẩu"
          icon={<Lock className="h-3.5 w-3.5" />}
          value={formData.password}
          onChange={(value) => onUpdate("password", value)}
          disabled={isLoading}
          required
        />

        <FloatingInput
          type="password"
          label="Nhập lại"
          value={formData.confirmPassword}
          onChange={(value) => onUpdate("confirmPassword", value)}
          disabled={isLoading}
          required
          compact
        />
      </div>

      {/* OTP */}
      <div className="space-y-3 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Mã xác thực OTP
          </p>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Nhập 6 chữ số đã được gửi đến email của bạn.
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                otpInputs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={formData.otp[index] || ""}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className="h-11 w-10 rounded-2xl border border-slate-100 bg-white text-center text-base font-black text-zinc-950 shadow-sm outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-950/70 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-400/10"
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="h-12 w-12 rounded-2xl border-slate-100 bg-white transition-all hover:bg-slate-50 active:scale-95 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
        >
          <ArrowLeft className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 flex-1 rounded-2xl bg-zinc-950 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg transition-all hover:bg-orange-500 active:scale-95 disabled:opacity-70 dark:bg-orange-500 dark:hover:bg-orange-600 dark:shadow-none"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Hoàn tất đăng ký"
          )}
        </Button>
      </div>
    </form>
  );
}

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  uppercase?: boolean;
  compact?: boolean;
}

function FloatingInput({
  label,
  value,
  onChange,
  icon,
  type = "text",
  disabled,
  required,
  uppercase,
  compact,
}: FloatingInputProps) {
  return (
    <div className="relative group">
      <Input
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) =>
          onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)
        }
        disabled={disabled}
        required={required}
        className={`peer h-12 rounded-2xl border-slate-100 bg-slate-50 pt-4 text-xs font-semibold text-zinc-950 transition-all focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:bg-white/[0.06] ${
          icon ? "pl-9" : "pl-3"
        } ${uppercase ? "uppercase" : ""}`}
      />

      <Label
        className={`pointer-events-none absolute top-3.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 transition-all duration-300 peer-focus:-translate-y-2.5 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-translate-y-2.5 dark:text-zinc-500 dark:peer-focus:text-orange-400 ${
          icon ? "left-9" : "left-3"
        } ${compact ? "tracking-[0.14em]" : ""}`}
      >
        {label}
      </Label>

      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 transition-colors group-focus-within:text-orange-500 dark:text-zinc-500 dark:group-focus-within:text-orange-400">
          {icon}
        </div>
      )}
    </div>
  );
}
