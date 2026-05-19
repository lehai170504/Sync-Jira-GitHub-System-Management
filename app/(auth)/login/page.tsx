"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, UserPlus } from "lucide-react";
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

import { useAuthTour } from "@/features/auth/hooks/use-auth-tour";

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const toggleMode = () => setIsRegisterMode((prev) => !prev);

  const { startTour } = useAuthTour(isRegisterMode);

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-slate-50 p-4 transition-colors duration-500 dark:bg-zinc-950 md:p-6 lg:p-8">
      {/* Background */}
      <BackgroundBeams />

      {/* Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Help Button */}
      <div className="absolute right-4 top-4 z-50 md:right-6 md:top-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="auth-help-button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-2xl border border-white/40 bg-white/75 text-[#F27124] shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-[#F27124] hover:text-white active:scale-95 dark:border-white/10 dark:bg-zinc-900/70 md:h-12 md:w-12"
                onClick={startTour}
              >
                <HelpCircle className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side="left"
              className="rounded-xl border-none bg-zinc-900 px-4 py-3 font-bold text-white shadow-2xl dark:bg-white dark:text-zinc-900"
            >
              <p className="text-xs uppercase tracking-widest">
                Hướng dẫn hệ thống
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.08,
        }}
        className="relative z-10 flex h-[min(680px,calc(100dvh-32px))] w-full max-w-[1080px] flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_32px_100px_-24px_rgba(15,23,42,0.28)] backdrop-blur-3xl dark:border-white/10 dark:bg-zinc-900/65 dark:shadow-[0_32px_100px_-24px_rgba(242,113,36,0.12)] lg:flex-row lg:rounded-[40px]"
      >
        {/* Left Panel */}
        <div
          id="auth-info-panel"
          className="relative hidden flex-col overflow-hidden bg-zinc-950 p-8 text-white md:flex lg:w-[42%] lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(242,113,36,0.2),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.13),transparent_62%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

          <div className="relative z-20 flex h-full flex-col">
            <div className="mb-8 shrink-0 lg:mb-10">
              <AuthHeader />
            </div>

            <div className="flex flex-1 flex-col justify-center space-y-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isRegisterMode ? "reg-info" : "log-info"}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                      {isRegisterMode ? "Tạo tài khoản" : "Đăng nhập an toàn"}
                    </span>
                  </div>

                  <h2 className="text-4xl font-black leading-[0.95] tracking-tighter lg:text-5xl">
                    {isRegisterMode ? (
                      <>
                        Bắt đầu với <br />
                        <span className="text-orange-500">GraphGrade.</span>
                      </>
                    ) : (
                      <>
                        Chào mừng <br />
                        <span className="text-orange-500">trở lại.</span>
                      </>
                    )}
                  </h2>

                  <p className="max-w-sm text-sm font-medium leading-relaxed text-zinc-400">
                    {isRegisterMode
                      ? "Tạo tài khoản để theo dõi quá trình học tập, điểm số và hoạt động cá nhân trên hệ thống."
                      : "Đăng nhập để truy cập dashboard cá nhân, xem tiến độ học tập và các phân tích điểm số của bạn."}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Insight
                  </p>
                  <p className="text-xs font-bold text-orange-400">
                    Theo dõi điểm số
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Progress
                  </p>
                  <p className="text-xs font-bold text-blue-400">
                    Phân tích hoạt động
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 pt-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-zinc-500">
                © 2026 GraphGrade Platform
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div
          id="auth-form-container"
          className="relative flex flex-1 flex-col bg-white dark:bg-zinc-950/40"
        >
          <div className="flex flex-1 flex-col justify-center overflow-y-auto p-5 sm:p-6 md:p-8 lg:p-12">
            <div className="mb-6 block md:hidden">
              <AuthHeader />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isRegisterMode ? "register" : "login"}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="mx-auto w-full max-w-md"
              >
                <div className="mb-7">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange-500">
                    {isRegisterMode ? "Create account" : "Welcome back"}
                  </p>

                  <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white md:text-4xl">
                    {isRegisterMode ? "Tạo tài khoản" : "Đăng nhập"}
                  </h1>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {isRegisterMode
                      ? "Điền thông tin bên dưới để bắt đầu sử dụng GraphGrade."
                      : "Nhập thông tin tài khoản để tiếp tục vào hệ thống."}
                  </p>
                </div>

                {!isRegisterMode ? (
                  <div className="space-y-7">
                    <LoginForm />

                    <div className="space-y-4 pt-1 text-center">
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Chưa có tài khoản?
                      </p>

                      <Button
                        variant="outline"
                        onClick={toggleMode}
                        className="h-14 w-full rounded-2xl border-orange-100 text-[11px] font-bold uppercase tracking-widest text-orange-600 transition-all hover:bg-orange-50 dark:border-white/10 dark:text-orange-400 dark:hover:bg-white/5"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Tạo tài khoản mới
                        </span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-7">
                    <RegisterFormContainer onSwitchToLogin={toggleMode} />

                    <div className="space-y-4 pt-1 text-center">
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Đã có tài khoản?
                      </p>

                      <Button
                        variant="outline"
                        onClick={toggleMode}
                        className="h-14 w-full rounded-2xl border-orange-100 text-[11px] font-bold uppercase tracking-widest text-orange-600 transition-all hover:bg-orange-50 dark:border-white/10 dark:text-orange-400 dark:hover:bg-white/5"
                      >
                        Quay lại đăng nhập
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
