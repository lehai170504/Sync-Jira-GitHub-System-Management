"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AuthHeader } from "@/features/auth/components/auth-header";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterFormContainer } from "@/features/auth/components/register-form-container";
import { BackgroundBeams } from "@/features/home/components/background-beams";

// Import Hook
import { useAuthTour } from "@/features/auth/hooks/use-auth-tour";

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const toggleMode = () => setIsRegisterMode((prev) => !prev);

  const { startTour } = useAuthTour(isRegisterMode);

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

      {/* 2. NÚT TRỢ GIÚP (FLOATING) */}
      <div className="absolute top-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="auth-help-button"
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/5 text-[#F27124] hover:bg-[#F27124] hover:text-white transition-all duration-500 hover:scale-110 active:scale-95"
                onClick={startTour}
              >
                <HelpCircle className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-none font-bold py-3 px-4 rounded-xl shadow-2xl"
            >
              <p className="text-xs uppercase tracking-widest">Hướng dẫn hệ thống</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 3. TRUNG TÂM ĐIỀU KHIỂN (MAIN CARD) */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
          delay: 0.2
        }}
        className="relative z-10 w-full max-w-[1100px] min-h-[700px] bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[48px] border border-white/40 dark:border-white/10 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_120px_-20px_rgba(242,113,36,0.1)] flex flex-col lg:flex-row overflow-hidden [perspective:1000px]"
      >
        {/* --- PHẦN TRÁI: DYNAMIX INFO (BANNER TÍCH HỢP) --- */}
        <div id="auth-info-panel" className="lg:w-[42%] bg-zinc-950 relative overflow-hidden flex flex-col p-12 text-white">
          {/* Decorative Glows */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(242,113,36,0.15),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.1),transparent_70%)]" />

          <div className="relative z-20 flex flex-col h-full">
            <div className="shrink-0 mb-16">
              <AuthHeader />
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isRegisterMode ? "reg-info" : "log-info"}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                      {isRegisterMode ? "Registration Phase" : "Authentication Core"}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter uppercase">
                    {isRegisterMode ? (
                      <>Khởi tạo <br /><span className="text-orange-500">Danh tính.</span></>
                    ) : (
                      <>Tiếp tục <br /><span className="text-orange-500">Hành trình.</span></>
                    )}
                  </h2>

                  <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-xs">
                    {isRegisterMode
                      ? "Tạo tài khoản mới để bắt đầu hành trình của bạn."
                      : "Đăng nhập để truy cập dashboard cá nhân, theo dõi hoạt động và điểm số real-time dựa trên đồ thị hoạt động sinh viên."}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Tech Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-bold text-emerald-400">SYSTEM ONLINE</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Sync</p>
                  <p className="text-xs font-bold text-blue-400">ACTIVE 100%</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-12 border-t border-white/5 opacity-40">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em]">
                &copy; 2026 GraphGrade Platform
              </p>
            </div>
          </div>
        </div>

        {/* --- PHẦN PHẢI: FORM CÔNG TÁC --- */}
        <div id="auth-form-container" className="flex-1 bg-white dark:bg-transparent relative flex flex-col">
          <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-20 justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegisterMode ? "register" : "login"}
                initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                {!isRegisterMode ? (
                  <div className="space-y-8">
                    <LoginForm />
                    <div className="text-center space-y-4 pt-4">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Chưa có tài khoản tham gia?
                      </p>
                      <Button
                        variant="outline"
                        onClick={toggleMode}
                        className="w-full h-14 rounded-2xl border-orange-100 dark:border-white/5 hover:bg-orange-50 dark:hover:bg-white/5 text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest text-[11px] transition-all"
                      >
                        Tạo tài khoản mới
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <RegisterFormContainer onSwitchToLogin={toggleMode} />
                    <div className="text-center space-y-4 pt-4">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Đã có tài khoản hệ thống?
                      </p>
                      <Button
                        variant="outline"
                        onClick={toggleMode}
                        className="w-full h-14 rounded-2xl border-orange-100 dark:border-white/5 hover:bg-orange-50 dark:hover:bg-white/5 text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest text-[11px] transition-all"
                      >
                        Quay lại Đăng nhập
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
