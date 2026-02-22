"use client";

import { useRef } from "react";
import { ArrowLeft, Loader2, User, Hash, Lock } from "lucide-react";
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
import { RegisterFormData } from "../types";

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

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const currentOtp = formData.otp || "";
    const otpArray = currentOtp.padEnd(6, " ").split("");
    otpArray[index] = value.substring(value.length - 1);
    const newOtp = otpArray.join("").trim();
    onUpdate("otp", newOtp);
    if (value && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const isStudent = formData.role === "STUDENT";

  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-fade-up font-mono">
      {/* Role & Student Code Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className={!isStudent ? "col-span-2" : ""}>
          <Select
            value={formData.role}
            onValueChange={(val) => onUpdate("role", val)}
          >
            <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-[10px] uppercase tracking-wider focus:ring-[#F27124]/20">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent className="font-mono uppercase text-[10px] font-black dark:bg-slate-900 dark:border-slate-800">
              <SelectItem value="STUDENT" className="dark:text-slate-200">
                Sinh viên
              </SelectItem>
              <SelectItem value="LECTURER" className="dark:text-slate-200">
                Giảng viên
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isStudent && (
          <div className="relative group">
            <Input
              placeholder=" "
              value={formData.studentCode}
              onChange={(e) => onUpdate("studentCode", e.target.value)}
              className="peer pl-9 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all font-bold text-xs pt-4 uppercase text-slate-900 dark:text-slate-100"
              required
            />
            <Label className="absolute left-9 top-3.5 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest pointer-events-none transition-all peer-focus:-translate-y-2.5 peer-focus:text-[#F27124] dark:peer-focus:text-orange-400 peer-[:not(:placeholder-shown)]:-translate-y-2.5">
              MSSV
            </Label>
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 dark:text-slate-500 group-focus-within:text-[#F27124] dark:group-focus-within:text-orange-400 transition-colors" />
          </div>
        )}
      </div>

      {/* Full Name */}
      <div className="relative group">
        <Input
          placeholder=" "
          value={formData.fullName}
          onChange={(e) => onUpdate("fullName", e.target.value)}
          className="peer pl-9 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all font-bold text-xs pt-4 text-slate-900 dark:text-slate-100"
          required
        />
        <Label className="absolute left-9 top-3.5 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest pointer-events-none transition-all peer-focus:-translate-y-2.5 peer-focus:text-[#F27124] dark:peer-focus:text-orange-400 peer-[:not(:placeholder-shown)]:-translate-y-2.5">
          Họ và tên
        </Label>
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 dark:text-slate-500 group-focus-within:text-[#F27124] dark:group-focus-within:text-orange-400 transition-colors" />
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative group">
          <Input
            type="password"
            placeholder=" "
            value={formData.password}
            onChange={(e) => onUpdate("password", e.target.value)}
            className="peer pl-9 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all font-bold text-xs pt-4 text-slate-900 dark:text-slate-100"
            required
          />
          <Label className="absolute left-9 top-3.5 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest pointer-events-none transition-all peer-focus:-translate-y-2.5 peer-focus:text-[#F27124] dark:peer-focus:text-orange-400 peer-[:not(:placeholder-shown)]:-translate-y-2.5">
            Mật khẩu
          </Label>
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 dark:text-slate-500 group-focus-within:text-[#F27124] dark:group-focus-within:text-orange-400 transition-colors" />
        </div>
        <div className="relative group">
          <Input
            type="password"
            placeholder=" "
            value={formData.confirmPassword}
            onChange={(e) => onUpdate("confirmPassword", e.target.value)}
            className="peer pl-3 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all font-bold text-xs pt-4 text-slate-900 dark:text-slate-100"
            required
          />
          <Label className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest pointer-events-none transition-all peer-focus:-translate-y-2.5 peer-focus:text-[#F27124] dark:peer-focus:text-orange-400 peer-[:not(:placeholder-shown)]:-translate-y-2.5">
            Nhập lại
          </Label>
        </div>
      </div>

      {/* OTP Section */}
      <div className="space-y-3 pt-2">
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
              className="w-9 h-11 text-center text-lg font-black border border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#F27124] dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none transition-all bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-none"
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-12 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition-all bg-white dark:bg-slate-900"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest bg-slate-900 dark:bg-[#F27124] hover:bg-[#F27124] dark:hover:bg-[#d65d1b] text-white rounded-2xl shadow-lg dark:shadow-none active:scale-95 transition-all"
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
