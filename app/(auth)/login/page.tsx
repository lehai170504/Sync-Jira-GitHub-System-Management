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

import { AuthBanner } from "@/features/auth/components/auth-banner";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterFormContainer } from "@/features/auth/components/register-form-container";

// Import Hook
import { useAuthTour } from "@/features/auth/hooks/use-auth-tour";

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const toggleMode = () => setIsRegisterMode((prev) => !prev);

  const { startTour } = useAuthTour(isRegisterMode);

  return (
    // Dùng min-h-[100dvh] thay vì min-h-screen để xử lý tốt hơn trên thanh trình duyệt mobile
    <div className="min-h-[100dvh] w-full bg-white dark:bg-slate-950 overflow-x-hidden flex items-center justify-center p-0 lg:p-0 relative transition-colors duration-300">
      {/* Nút Help (Floating) */}
      <div className="absolute top-6 right-6 z-50 animate-in fade-in zoom-in duration-500 delay-300">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-orange-100 dark:border-orange-900/30 text-[#F27124] dark:text-orange-400 hover:bg-[#F27124] hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all duration-300 hover:scale-110"
                onClick={startTour}
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border-none font-bold"
            >
              <p>Hướng dẫn người mới</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative w-full h-full min-h-[100dvh] max-w-[1920px] bg-white dark:bg-slate-950 shadow-2xl overflow-x-hidden flex rounded-none">
        {/* --- KHỐI FORM LỆNH TRÁI --- */}
        <motion.div
          initial={false}
          animate={{ x: isRegisterMode ? "100%" : "0%", opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-white dark:bg-slate-950 z-20 flex flex-col transition-colors duration-300 overflow-visible"
        >
          {/* Header - Thêm shrink-0 để không bị bóp */}
          <div id="auth-logo-area" className="px-8 pt-6 lg:pt-8 shrink-0">
            <AuthHeader />
          </div>

          {/* Form Area - Đã bỏ justify-center để sửa lỗi cắt chữ, tinh chỉnh padding */}
          <div
            id="auth-form-area"
            className="flex-1 flex flex-col px-6 sm:px-12 md:px-20 lg:px-24 xl:px-32 overflow-y-auto overflow-x-visible scrollbar-hide py-4 relative z-30"
          >
            {/* Thẻ bọc my-auto giúp content ở giữa màn to, nhưng tự bung ra ở màn nhỏ */}
            <div className="my-auto w-full pb-6">
              <AnimatePresence mode="wait">
                {!isRegisterMode ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <LoginForm />

                    <div className="lg:hidden mt-8 text-center text-sm border-t border-slate-100 dark:border-slate-800 pt-6 text-slate-600 dark:text-slate-400">
                      Chưa có tài khoản?{" "}
                      <button
                        onClick={toggleMode}
                        className="text-[#F27124] dark:text-orange-400 font-black uppercase tracking-wider ml-1 hover:underline"
                      >
                        Đăng ký ngay
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <RegisterFormContainer onSwitchToLogin={toggleMode} />

                    <div className="lg:hidden mt-8 text-center text-sm border-t border-slate-100 dark:border-slate-800 pt-6 text-slate-600 dark:text-slate-400">
                      Đã có tài khoản?{" "}
                      <button
                        onClick={toggleMode}
                        className="text-[#F27124] dark:text-orange-400 font-black uppercase tracking-wider ml-1 hover:underline"
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer - Thêm shrink-0 */}
          <div className="px-8 py-4 shrink-0 text-center sm:text-left bg-white dark:bg-slate-950 transition-colors duration-300">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              &copy; 2026 SyncSystem. All rights reserved.
            </p>
          </div>
        </motion.div>

        {/* --- KHỐI BANNER BÊN PHẢI --- */}
        <motion.div
          id="auth-banner-section"
          initial={false}
          animate={{ x: isRegisterMode ? "-100%" : "0%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-0 right-0 w-1/2 h-full bg-[#0F172A] z-10 hidden lg:block"
        >
          <AuthBanner isRegisterMode={isRegisterMode} onToggle={toggleMode} />
        </motion.div>
      </div>
    </div>
  );
}
