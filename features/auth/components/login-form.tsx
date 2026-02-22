"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

import { useLogin } from "@/features/auth/hooks/use-login";
import { useGoogleLogin } from "@/features/auth/hooks/use-auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // --- RIVE SETUP ---
  const { rive, RiveComponent } = useRive({
    src: "/login_bear_v2.riv",
    stateMachines: "Login Machine",
    autoplay: true,
  });

  const isCheckingInput = useStateMachineInput(
    rive,
    "Login Machine",
    "isChecking",
  );
  const numLookInput = useStateMachineInput(rive, "Login Machine", "numLook");
  const isHandsUpInput = useStateMachineInput(
    rive,
    "Login Machine",
    "isHandsUp",
  );
  const trigSuccess = useStateMachineInput(
    rive,
    "Login Machine",
    "trigSuccess",
  );
  const trigFail = useStateMachineInput(rive, "Login Machine", "trigFail");

  useEffect(() => {
    if (isHandsUpInput)
      isHandsUpInput.value = isPasswordFocused && !showPassword;
  }, [isPasswordFocused, showPassword, isHandsUpInput]);

  useEffect(() => {
    if (numLookInput) numLookInput.value = email.length * 2;
  }, [email, numLookInput]);

  // --- LOGIC ---
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: loginGoogle, isPending: isGooglePending } = useGoogleLogin();
  const isPending = isLoginPending || isGooglePending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Vui lòng nhập đầy đủ thông tin.");
      trigFail && trigFail.fire();
      return;
    }
    login(
      { email, password },
      {
        onSuccess: () => trigSuccess && trigSuccess.fire(),
        onError: () => trigFail && trigFail.fire(),
      },
    );
  };

  return (
    <div className="w-full max-w-[400px] mx-auto font-mono flex flex-col items-center">
      {/* 1. LINH VẬT TEDDY */}
      <div className="h-[180px] w-[180px] relative mb-4 drop-shadow-xl flex-shrink-0">
        <RiveComponent className="w-full h-full object-contain" />
      </div>

      {/* 2. TIÊU ĐỀ */}
      <div className="text-center mb-8 space-y-1 w-full relative z-10">
        <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase italic transition-colors">
          Đăng nhập hệ thống
        </h1>
        <div className="h-0.5 w-10 bg-[#F27124] mx-auto rounded-full" />
      </div>

      {/* 3. FORM */}
      <div className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div className="relative group">
            <Input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => isCheckingInput && (isCheckingInput.value = true)}
              onBlur={() => isCheckingInput && (isCheckingInput.value = false)}
              disabled={isPending}
              className="peer pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-[#F27124]/20 transition-all font-bold text-[11px] pt-3 text-slate-900 dark:text-slate-100"
            />
            <Label
              htmlFor="email"
              className="absolute left-10 top-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-bold pointer-events-none transition-all duration-300 peer-focus:-translate-y-2.5 peer-focus:text-[9px] peer-focus:text-[#F27124] dark:peer-focus:text-orange-400 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[9px]"
            >
              Địa chỉ Email
            </Label>
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-500 group-focus-within:text-[#F27124] dark:group-focus-within:text-orange-400 transition-colors" />
          </div>

          {/* PASSWORD */}
          <div className="relative group">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              disabled={isPending}
              className="peer pl-10 pr-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-[#F27124]/20 transition-all font-bold text-[11px] pt-3 text-slate-900 dark:text-slate-100"
            />
            <Label
              htmlFor="password"
              className="absolute left-10 top-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-bold pointer-events-none transition-all duration-300 peer-focus:-translate-y-2.5 peer-focus:text-[9px] peer-focus:text-[#F27124] dark:peer-focus:text-orange-400 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[9px]"
            >
              Mật khẩu
            </Label>
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-500 group-focus-within:text-[#F27124] dark:group-focus-within:text-orange-400 transition-colors" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-10"
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
              className="text-[9px] font-bold text-slate-400 dark:text-slate-500 hover:text-[#F27124] dark:hover:text-orange-400 transition-colors uppercase tracking-tight"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-slate-900 dark:bg-[#F27124] hover:bg-[#F27124] dark:hover:bg-[#d65d1b] text-white rounded-xl font-black text-[10px] tracking-widest shadow-lg dark:shadow-none active:scale-95 transition-all uppercase"
          >
            {isLoginPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[8px] font-black uppercase text-slate-300 dark:text-slate-600 tracking-widest">
            Hoặc đăng nhập với
          </span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => loginGoogle()}
          disabled={isPending}
          className="w-full h-11 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:border-[#F27124]/30 dark:hover:border-orange-500/30 text-slate-700 dark:text-slate-300 font-bold transition-all text-[10px] tracking-widest uppercase flex gap-2 active:scale-95 shadow-sm dark:shadow-none"
        >
          {isGooglePending ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4"
              alt="Google"
            />
          )}
          Google Workspace
        </Button>
      </div>
    </div>
  );
}
