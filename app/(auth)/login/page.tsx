"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthBanner } from "@/features/auth/components/auth-banner";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterFormContainer } from "@/features/auth/components/register-form-container";

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const toggleMode = () => setIsRegisterMode((prev) => !prev);

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden flex items-center justify-center p-0 lg:p-0">
      <div className="relative w-full h-full min-h-screen lg:min-h-screen max-w-[1920px] bg-white shadow-2xl overflow-hidden flex rounded-none">
        {/* --- KHỐI FORM (Di chuyển Trái <-> Phải) --- */}
        <motion.div
          initial={false}
          animate={{
            x: isRegisterMode ? "100%" : "0%", 
            opacity: 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-white z-20 flex flex-col"
        >
          {/* Header */}
          <div className="px-8 pt-6">
            <AuthHeader />
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24 overflow-y-auto scrollbar-hide py-10 relative">
            <AnimatePresence mode="wait">
              {!isRegisterMode ? (
                /* LOGIN FORM */
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="mb-8 text-center lg:text-left">
                    <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                      Đăng nhập
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                      Chào mừng trở lại! Vui lòng nhập thông tin.
                    </p>
                  </div>
                  <LoginForm />

                  {/* Mobile Switcher (Chỉ hiện trên màn nhỏ khi Banner bị ẩn) */}
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
                /* REGISTER FORM */
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {/* Wrapper chứa logic Step 1, Step 2 của Register */}
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
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              &copy; 2026 SyncSystem. Subject Management Module.
            </p>
          </div>
        </motion.div>

        {/* --- KHỐI BANNER (Di chuyển Phải <-> Trái) --- */}
        <motion.div
          initial={false}
          animate={{
            x: isRegisterMode ? "-100%" : "0%", // Desktop: Trượt sang trái
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-0 right-0 w-1/2 h-full bg-[#0F172A] z-10 hidden lg:block"
        >
          <AuthBanner isRegisterMode={isRegisterMode} onToggle={toggleMode} />
        </motion.div>
      </div>
    </div>
  );
}
