"use client";

import { useState, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundBeams } from "@/features/home/components/background-beams";
import { AuthHeader } from "@/features/auth/components/auth-header";

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
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Vui lòng nhập email.");
      return;
    }
    requestOtp({ email, role });
  };

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
    <div className="min-h-[100dvh] w-full bg-white dark:bg-zinc-950 overflow-hidden flex items-center justify-center p-4 md:p-6 lg:p-8 relative transition-colors duration-500">
      {/* 1. NỀN ĐỘNG PREMIUM */}
      <BackgroundBeams />

      {/* Tech Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* 2. TRUNG TÂM ĐIỀU KHIỂN (MAIN CARD) */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2
        }}
        className="relative z-10 w-full max-w-[1100px] min-h-[700px] bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[48px] border border-white/40 dark:border-white/10 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_120px_-20px_rgba(242,113,36,0.1)] flex flex-col lg:flex-row overflow-hidden [perspective:1000px]"
      >
        {/* --- PHẦN TRÁI: SECURITY INFO --- */}
        <div className="lg:w-[42%] bg-zinc-950 relative overflow-hidden flex flex-col p-12 text-white">
          {/* Decorative Glows */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.15),transparent_70%)]" />

          <div className="relative z-20 flex flex-col h-full">
            <div className="shrink-0 mb-16">
              <AuthHeader />
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key="security-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <ShieldCheck className="h-3 w-3 text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                      Security Protocol
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter uppercase">
                    Khôi phục <br /><span className="text-blue-500">Truy cập.</span>
                  </h2>

                  <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-xs">
                    Hệ thống bảo mật đa lớp giúp bảo vệ tài khoản của bạn. Vui lòng xác thực danh tính để tiếp tục.
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Security Status */}
              <div className="space-y-3 pt-8">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Encryption</p>
                    <p className="text-[11px] font-bold text-white">AES-256 ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-12 border-t border-white/5 opacity-40">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em]">
                &copy; 2026 Security Core Sync
              </p>
            </div>
          </div>
        </div>

        {/* --- PHẦN PHẢI: FORM CÔNG TÁC --- */}
        <div className="flex-1 bg-white dark:bg-transparent relative flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-20 justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                {/* --- STEP 1: NHẬP EMAIL & ROLE --- */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-1 mb-8 text-center sm:text-left">
                      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tighter">
                        Quên mật khẩu?
                      </h1>
                      <div className="h-0.5 w-10 bg-blue-500 mx-auto sm:mx-0 rounded-full mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest opacity-70">
                        Nhập email để nhận mã xác thực danh tính
                      </p>
                    </div>

                    <form onSubmit={handleStep1Submit} className="space-y-5">
                      <div className="space-y-4">
                        {/* Role Selection */}
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bạn là?</Label>
                          <Select value={role} onValueChange={(val: "STUDENT" | "LECTURER") => setRole(val)}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-white/5 focus:ring-blue-500/20 font-bold text-xs uppercase transition-all">
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-zinc-950 border-white/10">
                              <SelectItem value="STUDENT">Sinh viên (Student)</SelectItem>
                              <SelectItem value="LECTURER">Giảng viên (Lecturer)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email tài khoản</Label>
                          <div className="relative group">
                            <Input
                              id="email"
                              type="email"
                              placeholder="name@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={isOtpLoading}
                              className="pl-11 h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-white/5 focus:ring-blue-500/20 font-bold text-xs transition-all"
                              required
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Link href="/login" className="flex-none">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-12 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                          >
                            <ArrowLeft className="h-5 w-5 text-slate-400" />
                          </Button>
                        </Link>
                        <Button
                          type="submit"
                          disabled={isOtpLoading}
                          className="flex-1 h-12 rounded-xl bg-zinc-950 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
                        >
                          {isOtpLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Tiếp tục xác thực"}
                        </Button>
                      </div>
                    </form>

                    <div className="text-center pt-4">
                      <Link href="/login" className="text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors">
                        Quay lại Đăng nhập
                      </Link>
                    </div>
                  </div>
                )}

                {/* --- STEP 2: NHẬP OTP & NEW PASSWORD --- */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-1 mb-8 text-center sm:text-left">
                      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tighter">
                        Đặt lại mật khẩu
                      </h1>
                      <div className="h-0.5 w-10 bg-blue-500 mx-auto sm:mx-0 rounded-full mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest opacity-70">
                        Nhập mã OTP và mật khẩu mới cho tài khoản
                      </p>
                    </div>

                    <form onSubmit={handleStep2Submit} className="space-y-5">
                      {/* OTP Input */}
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mã OTP (6 số)</Label>
                        <div className="relative group">
                          <Input
                            id="otp"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="pl-11 h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-white/5 focus:ring-blue-500/20 font-bold text-center tracking-[0.5em] text-lg transition-all"
                            maxLength={6}
                            required
                          />
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                      </div>

                      {/* Password Fields */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mật khẩu mới</Label>
                          <div className="relative group">
                            <Input
                              id="new-password"
                              type="password"
                              placeholder="••••••••"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-11 h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-white/5 focus:ring-blue-500/20 font-bold text-xs transition-all"
                              required
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Xác nhận mật khẩu</Label>
                          <Input
                            id="confirm"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-white/5 focus:ring-blue-500/20 font-bold text-xs transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="h-12 w-12 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                        >
                          <ArrowLeft className="h-5 w-5 text-slate-400" />
                        </Button>
                        <Button
                          type="submit"
                          disabled={isResetLoading}
                          className="flex-1 h-12 rounded-xl bg-zinc-950 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
                        >
                          {isResetLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Xác nhận đổi mật khẩu"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div >
  );
}
