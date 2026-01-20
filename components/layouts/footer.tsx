"use client";

import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 px-8 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          {/* Logo FPT - Đảm bảo bạn đã có ảnh trong public/images/ */}
          <Image
            src="/images/Logo_Trường_Đại_học_FPT.svg.png"
            alt="FPT University"
            width={80}
            height={28}
            className="h-7 w-auto object-contain grayscale hover:grayscale-0 transition-all"
          />
          <div className="h-4 w-px bg-gray-300"></div>
          <span className="text-sm font-semibold text-gray-700">
            SyncSystem
          </span>
        </div>

        {/* Right: Copyright & Links */}
        <div className="flex flex-col md:items-end gap-1">
          <p className="text-xs text-gray-500">
            © 2026 FPT University. Capstone Project SE.
          </p>
          <div className="flex gap-4 text-[10px] text-gray-400 font-medium">
            <span className="hover:text-[#F27124] cursor-pointer">
              Điều khoản
            </span>
            <span className="hover:text-[#F27124] cursor-pointer">Bảo mật</span>
            <span className="hover:text-[#F27124] cursor-pointer">Hỗ trợ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
