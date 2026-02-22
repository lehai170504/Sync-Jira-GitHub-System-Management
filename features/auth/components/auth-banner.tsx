"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AuthBannerProps {
  isRegisterMode: boolean;
  onToggle: () => void;
}

export function AuthBanner({ isRegisterMode, onToggle }: AuthBannerProps) {
  return (
    <div className="relative h-full w-full overflow-hidden font-mono bg-[#0F172A] text-white">
      {/* --- LỚP NỀN (BACKGROUND) --- */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover opacity-20 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B]/90 to-[#0F172A]"></div>

        {/* Animated Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      {/* --- NỘI DUNG CHÍNH (LAYER TRÊN CÙNG) --- */}
      <div className="relative h-full flex flex-col justify-center items-center p-12 text-center z-10">
        {/* 3D Visual - Giữ nguyên hiệu ứng cũ */}
        <div className="mb-12 flex justify-center [perspective:2000px]">
          <div className="relative w-64 h-64 animate-tilt-3d [transform-style:preserve-3d]">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl flex items-center justify-center [transform:translateZ(50px)]">
              <div className="relative h-20 w-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="h-10 w-10 text-white animate-bounce" />
                <div className="absolute -inset-6 border border-emerald-500/30 rounded-[45px] animate-orbit-slow">
                  <div className="absolute -top-1 left-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_15px_#10b981]"></div>
                </div>
              </div>
            </div>

            {/* Float Items */}
            <div className="absolute -top-8 -right-8 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 [transform:translateZ(80px)] flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                ĐỒNG BỘ
              </span>
            </div>
            <div className="absolute -bottom-4 -left-10 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 [transform:translateZ(120px)] flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                BẢO MẬT
              </span>
            </div>
          </div>
        </div>

        {/* --- TEXT CHUYỂN ĐỔI MƯỢT MÀ --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isRegisterMode ? "register" : "login"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-md space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2 mx-auto">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400">
                {isRegisterMode ? "ĐÃ CÓ TÀI KHOẢN?" : "THÀNH VIÊN MỚI?"}
              </span>
            </div>

            <h2 className="text-4xl font-black leading-[0.95] tracking-tighter uppercase italic">
              {isRegisterMode ? (
                <>
                  Trở lại với <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                    Hành trình.
                  </span>
                </>
              ) : (
                <>
                  Mở khóa <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                    Tiềm năng Sync.
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm text-slate-400 font-medium leading-relaxed px-4">
              {isRegisterMode
                ? "Để tiếp tục theo dõi tiến độ và quản lý đồ án, vui lòng đăng nhập bằng tài khoản cá nhân của bạn."
                : "Tối ưu hóa quy trình học tập chuyên nghiệp theo tiêu chuẩn công nghiệp. Đăng ký ngay để trải nghiệm."}
            </p>

            <Button
              onClick={onToggle}
              variant="outline"
              className="mt-4 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
            >
              {isRegisterMode ? "ĐĂNG NHẬP NGAY" : "ĐĂNG KÝ TÀI KHOẢN"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
