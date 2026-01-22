"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import {
  useRequestResetOtp,
  useResetPassword,
} from "@/features/auth/hooks/use-forgot-password";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  // --- STATE ---
  const [step, setStep] = useState<1 | 2>(1); // 1: Email/Role, 2: OTP/NewPass

  // Form Data
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"STUDENT" | "LECTURER">("STUDENT");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- HOOKS ---
  const { mutate: requestOtp, isPending: isOtpLoading } = useRequestResetOtp(
    () => setStep(2),
  );
  const { mutate: resetPass, isPending: isResetLoading } = useResetPassword();

  // --- HANDLERS ---

  // Xử lý Bước 1: Gửi yêu cầu OTP
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Vui lòng nhập email.");
      return;
    }
    requestOtp({ email, role });
  };

  // Xử lý Bước 2: Đổi mật khẩu
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Mã OTP phải có 6 ký tự.");
      return;
    }

    resetPass({
      email,
      otp_code: otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-white">
      {/* --- CỘT TRÁI: FORM --- */}
      <div className="flex flex-col h-full relative overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#F27124] to-[#d65d1b] shadow-md">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="font-bold text-lg text-slate-900 hidden sm:block">
                SyncSystem
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24">
          <div className="max-w-[480px] w-full mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
              </h1>
              <p className="text-slate-500 text-base">
                {step === 1
                  ? "Đừng lo, chúng tôi sẽ gửi mã xác thực đến email của bạn."
                  : `Nhập mã OTP đã được gửi đến ${email} để tạo mật khẩu mới.`}
              </p>
            </div>

            {/* --- STEP 1: NHẬP EMAIL & ROLE --- */}
            {step === 1 && (
              <form
                onSubmit={handleStep1Submit}
                className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300"
              >
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>Bạn là?</Label>
                  <Select
                    value={role}
                    onValueChange={(val: "STUDENT" | "LECTURER") =>
                      setRole(val)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">
                        Sinh viên (Student)
                      </SelectItem>
                      <SelectItem value="LECTURER">
                        Giảng viên (Lecturer)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    *Tính năng này không hỗ trợ tài khoản Admin.
                  </p>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email tài khoản</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isOtpLoading}
                      className="pl-10 h-11"
                      required
                    />
                    <div className="absolute left-3 top-3 text-slate-400">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link href="/login" className="flex-none">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 w-12 p-0 rounded-xl"
                    >
                      <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isOtpLoading}
                    className="flex-1 h-12 text-base font-bold bg-[#F27124] hover:bg-[#d65d1b]"
                  >
                    {isOtpLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      "Gửi mã xác thực"
                    )}
                    {!isOtpLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </div>
              </form>
            )}

            {/* --- STEP 2: NHẬP OTP & NEW PASSWORD --- */}
            {step === 2 && (
              <form
                onSubmit={handleStep2Submit}
                className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300"
              >
                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="otp">Mã OTP (6 số)</Label>
                  <div className="relative">
                    <Input
                      id="otp"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-10 h-11 tracking-widest font-bold text-center text-lg"
                      maxLength={6}
                      required
                    />
                    <div className="absolute left-3 top-3 text-slate-400">
                      <KeyRound className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* New Password Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 h-11"
                        required
                      />
                      <div className="absolute left-3 top-3 text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Nhập lại mật khẩu mới</Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-none h-12 w-12 p-0 rounded-xl"
                  >
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={isResetLoading}
                    className="flex-1 h-12 text-base font-bold bg-[#F27124] hover:bg-[#d65d1b]"
                  >
                    {isResetLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      "Đặt lại mật khẩu"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Back to Login Link */}
            {step === 1 && (
              <div className="text-center text-sm text-slate-500">
                Nhớ mật khẩu rồi?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#F27124] hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            &copy; 2026 SyncSystem. Subject Management Module.
          </p>
        </div>
      </div>

      {/* --- CỘT PHẢI: BANNER --- */}
      <div className="hidden lg:block relative bg-[#0F172A]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop"
            alt="Security background"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
        </div>

        <div className="relative h-full flex flex-col justify-end p-16 text-white z-10">
          <div className="max-w-xl mb-10 animate-fade-in-up">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-[1.15]">
              Khôi phục quyền <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                truy cập tài khoản.
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              "Bảo mật tài khoản là ưu tiên hàng đầu. Chúng tôi hỗ trợ bạn lấy
              lại mật khẩu nhanh chóng để không gián đoạn việc học tập và giảng
              dạy."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
