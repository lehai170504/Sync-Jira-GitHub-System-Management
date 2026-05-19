"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLogin } from "@/features/auth/hooks/use-login";
import { useGoogleLogin } from "@/features/auth/hooks/use-auth";
import { loginSchema } from "@/features/auth/schemas/auth-form-schemas";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: loginGoogle, isPending: isGooglePending } = useGoogleLogin();

  const isPending = isLoginPending || isGooglePending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      toast.warning(
        parsed.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ.",
      );
      return;
    }

    login(parsed.data);
  };

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative group">
            <Input
              id="login-email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="peer h-12 rounded-2xl border-slate-100 bg-slate-50 pl-10 pt-4 text-sm font-semibold text-zinc-950 transition-all focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:bg-white/[0.06]"
            />

            <Label
              htmlFor="login-email"
              className="pointer-events-none absolute left-10 top-3.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all duration-300 peer-focus:-translate-y-2.5 peer-focus:text-[9px] peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[9px] dark:text-zinc-500 dark:peer-focus:text-orange-400"
            >
              Địa chỉ email
            </Label>

            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300 transition-colors group-focus-within:text-orange-500 dark:text-zinc-500 dark:group-focus-within:text-orange-400" />
          </div>

          {/* Password */}
          <div className="relative group">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="peer h-12 rounded-2xl border-slate-100 bg-slate-50 pl-10 pr-10 pt-4 text-sm font-semibold text-zinc-950 transition-all focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:bg-white/[0.06]"
            />

            <Label
              htmlFor="login-password"
              className="pointer-events-none absolute left-10 top-3.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all duration-300 peer-focus:-translate-y-2.5 peer-focus:text-[9px] peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[9px] dark:text-zinc-500 dark:peer-focus:text-orange-400"
            >
              Mật khẩu
            </Label>

            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300 transition-colors group-focus-within:text-orange-500 dark:text-zinc-500 dark:group-focus-within:text-orange-400" />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isPending}
              className="absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-zinc-300 transition-colors hover:text-zinc-600 disabled:opacity-60 dark:text-zinc-500 dark:hover:text-zinc-300"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition-colors hover:text-orange-500 dark:text-zinc-500 dark:hover:text-orange-400"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-2xl bg-zinc-950 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg transition-all hover:bg-orange-500 active:scale-95 disabled:opacity-70 dark:bg-orange-500 dark:hover:bg-orange-600 dark:shadow-none"
          >
            {isLoginPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </span>
            )}
          </Button>
        </form>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-100 dark:border-white/10" />

          <span className="mx-3 flex-shrink text-[9px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">
            Hoặc
          </span>

          <div className="flex-grow border-t border-slate-100 dark:border-white/10" />
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => loginGoogle()}
          disabled={isPending}
          className="flex h-12 w-full gap-2 rounded-2xl border-slate-100 bg-white text-[11px] font-black uppercase tracking-[0.16em] text-zinc-700 shadow-sm transition-all hover:border-orange-500/30 hover:bg-orange-50 active:scale-95 disabled:opacity-70 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:shadow-none dark:hover:bg-white/[0.08]"
        >
          {isGooglePending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-4 w-4"
              alt="Google"
            />
          )}
          Đăng nhập với Google
        </Button>
      </div>
    </div>
  );
}
