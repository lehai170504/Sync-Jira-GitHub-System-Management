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

  // --- RIVE ANIMATION SETUP ---
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
    if (isHandsUpInput) {
      isHandsUpInput.value = isPasswordFocused && !showPassword;
    }
  }, [isPasswordFocused, showPassword, isHandsUpInput]);

  useEffect(() => {
    if (numLookInput) {
      numLookInput.value = email.length * 2;
    }
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
    <div className="max-w-[400px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 font-mono flex flex-col items-stretch">
      {/* 1. LINH VẬT TEDDY - Tự co giãn theo chiều cao màn hình (max h-40) */}
      <div className="h-[20vh] max-h-[160px] min-h-[120px] w-full relative mb-1 drop-shadow-xl">
        <RiveComponent className="w-full h-full scale-100 md:scale-110" />
      </div>

      {/* 2. TIÊU ĐỀ - Thu nhỏ margin */}
      <div className="text-center mb-4 space-y-1">
        <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
          Hệ thống đồng bộ
        </h1>
        <div className="h-0.5 w-10 bg-[#F27124] mx-auto rounded-full" />
      </div>

      {/* 3. THÂN FORM - Giảm padding từ p-8 xuống p-6 */}
      <div className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-2xl shadow-orange-500/10 space-y-4 transition-all">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- EMAIL INPUT --- */}
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
              className="peer pl-10 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#F27124]/20 transition-all font-bold text-[11px] pt-3"
            />
            <Label
              htmlFor="email"
              className="absolute left-10 top-3.5 text-slate-400 text-[11px] font-bold pointer-events-none transition-all duration-300
                         peer-focus:-translate-y-2.5 peer-focus:text-[9px] peer-focus:text-[#F27124]
                         peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[9px]"
            >
              Địa chỉ Email
            </Label>
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#F27124] transition-colors" />
          </div>

          {/* --- PASSWORD INPUT --- */}
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
              className="peer pl-10 pr-10 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#F27124]/20 transition-all font-bold text-[11px] pt-3"
            />
            <Label
              htmlFor="password"
              className="absolute left-10 top-3.5 text-slate-400 text-[11px] font-bold pointer-events-none transition-all duration-300
                         peer-focus:-translate-y-2.5 peer-focus:text-[9px] peer-focus:text-[#F27124]
                         peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[9px]"
            >
              Mật khẩu
            </Label>
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#F27124] transition-colors" />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors z-10"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-[#F27124]" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-slate-900 hover:bg-[#F27124] text-white rounded-xl font-black text-[10px] tracking-widest shadow-lg active:scale-95 transition-all uppercase"
          >
            {isLoginPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-3 text-[8px] font-black uppercase text-slate-300 tracking-widest">
            Hoặc
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => loginGoogle()}
          disabled={isPending}
          className="w-full h-11 rounded-xl border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#F27124]/30 font-bold transition-all text-[10px] tracking-widest uppercase flex gap-2 active:scale-95 shadow-sm"
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
          Google
        </Button>
      </div>

      {/* 4. FOOTER - Thu gọn khoảng cách */}
      <div className="text-center mt-4 space-y-1">
        <Link
          href="/forgot-password"
          className="text-[9px] font-bold text-slate-400 hover:text-[#F27124] block uppercase tracking-tighter transition-colors"
        >
          Quên thông tin bảo mật?
        </Link>
        <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-[#F27124] hover:underline underline-offset-4 decoration-2"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
