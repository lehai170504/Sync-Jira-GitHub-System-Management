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

  // Sử dụng Hook hướng dẫn
  const { startTour } = useAuthTour(isRegisterMode);

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden flex items-center justify-center p-0 lg:p-0 relative">
      {/* Nút Help (Floating) */}
      <div className="absolute top-6 right-6 z-50 animate-in fade-in zoom-in duration-500 delay-300">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-orange-100 text-[#F27124] hover:bg-[#F27124] hover:text-white transition-all duration-300 hover:scale-110"
                onClick={startTour}
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="bg-slate-800 text-white border-none"
            >
              <p>Hướng dẫn người mới</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative w-full h-full min-h-screen lg:min-h-screen max-w-[1920px] bg-white shadow-2xl overflow-hidden flex rounded-none">
        {/* --- KHỐI FORM --- */}
        <motion.div
          initial={false}
          animate={{ x: isRegisterMode ? "100%" : "0%", opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-white z-20 flex flex-col"
        >
          {/* Header với ID cho Driver */}
          <div id="auth-logo-area" className="px-8 pt-8">
            <AuthHeader />
          </div>

          {/* Form Area với ID cho Driver */}
          <div
            id="auth-form-area"
            className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 overflow-y-auto scrollbar-hide py-10 relative"
          >
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
                  <div className="mb-8 text-center lg:text-left space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                      Đăng nhập
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                      Chào mừng trở lại! Nhập thông tin để tiếp tục.
                    </p>
                  </div>
                  <LoginForm />

                  <div className="lg:hidden mt-8 text-center text-sm border-t border-slate-100 pt-6">
                    Chưa có tài khoản?{" "}
                    <button
                      onClick={toggleMode}
                      className="text-[#F27124] font-black uppercase tracking-wider ml-1 hover:underline"
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

                  <div className="lg:hidden mt-8 text-center text-sm border-t border-slate-100 pt-6">
                    Đã có tài khoản?{" "}
                    <button
                      onClick={toggleMode}
                      className="text-[#F27124] font-black uppercase tracking-wider ml-1 hover:underline"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-8 py-6 text-center sm:text-left bg-white">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              &copy; 2026 SyncSystem. All rights reserved.
            </p>
          </div>
        </motion.div>

        {/* --- KHỐI BANNER --- */}
        <motion.div
          id="auth-banner-section" // ID cho Driver highlight banner
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
