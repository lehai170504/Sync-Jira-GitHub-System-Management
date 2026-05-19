"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Mail } from "lucide-react";

interface RegisterStep1Props {
  email: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterStep1({
  email,
  isLoading,
  onEmailChange,
  onSubmit,
}: RegisterStep1Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-5 animate-fade-up">
      <div className="relative group">
        <Input
          id="register-email"
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isLoading}
          className="peer h-13 rounded-2xl border-slate-100 bg-slate-50 pl-11 pt-4 text-sm font-semibold text-zinc-950 transition-all focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:bg-white/[0.06]"
          required
        />

        <Label
          htmlFor="register-email"
          className="pointer-events-none absolute left-11 top-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400 transition-all duration-300 peer-focus:-translate-y-3 peer-focus:text-[9px] peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[9px] dark:text-zinc-500 dark:peer-focus:text-orange-400"
        >
          Email đăng ký
        </Label>

        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300 transition-colors group-focus-within:text-orange-500 dark:text-zinc-500 dark:group-focus-within:text-orange-400" />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-2xl bg-zinc-950 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg transition-all hover:bg-orange-500 active:scale-95 disabled:opacity-70 dark:bg-orange-500 dark:hover:bg-orange-600 dark:shadow-none"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            Gửi mã xác thực
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
