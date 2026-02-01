"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Mail } from "lucide-react";

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
    <form onSubmit={onSubmit} className="space-y-6 animate-fade-up font-mono">
      <div className="relative group">
        <Input
          id="email"
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isLoading}
          className="peer pl-11 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#F27124]/20 transition-all font-bold text-xs pt-4"
          required
        />
        <Label
          htmlFor="email"
          className="absolute left-11 top-4 text-slate-400 text-[10px] font-black uppercase tracking-widest pointer-events-none transition-all duration-300
                     peer-focus:-translate-y-3 peer-focus:text-[9px] peer-focus:text-[#F27124]
                     peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[9px]"
        >
          Email đăng ký
        </Label>
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#F27124] transition-colors" />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-[#F27124] text-white rounded-2xl shadow-lg active:scale-95 transition-all"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            Gửi mã xác thực <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
