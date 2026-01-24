"use client";

// Import các component đã tách
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthBanner } from "@/features/auth/components/auth-banner";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-white">
      {/* CỘT TRÁI: HEADER + FORM */}
      <div className="flex flex-col h-full relative overflow-y-auto">
        <AuthHeader />

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24">
          <LoginForm />
        </div>

        <div className="px-8 py-6 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            &copy; 2026 SyncSystem. Subject Management Module.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: BANNER (Tái sử dụng) */}
      <AuthBanner />
    </div>
  );
}
