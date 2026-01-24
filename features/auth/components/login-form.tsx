"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Import Hooks từ file use-auth hoặc use-login tùy cách đặt tên
import { useLogin } from "@/features/auth/hooks/use-login";
import { useGoogleLogin } from "@/features/auth/hooks/use-auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: loginGoogle, isPending: isGooglePending } = useGoogleLogin();

  const isPending = isLoginPending || isGooglePending;

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }
    login({ email, password });
  };

  return (
    <div className="max-w-[480px] w-full mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Đăng nhập hệ thống
        </h1>
        <p className="text-slate-500 text-base">
          Nhập email và mật khẩu để truy cập vào không gian quản lý môn học.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              ref={emailInputRef}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              required
            />
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Mật khẩu
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#F27124] hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              required
            />
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              disabled={isPending}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 text-base font-bold bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
        >
          {isLoginPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Đăng nhập"
          )}
          {!isLoginPending && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </form>

      {/* --- GOOGLE LOGIN SECTION --- */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 font-medium">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => loginGoogle()}
          disabled={isPending}
          className="w-full h-12 text-base font-medium border-slate-200 text-slate-700 hover:bg-slate-50 relative"
        >
          {isGooglePending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
          )}
          Google
        </Button>
      </div>

      <div className="text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-bold text-[#F27124] hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
