"use client";

import Image from "next/image";
import { CheckCircle2, Zap, ShieldCheck, Sparkles } from "lucide-react";

export function AuthBanner() {
  return (
    <div className="hidden lg:block relative bg-[#0F172A] h-full overflow-hidden font-mono">
      {/* --- LỚP NỀN (BACKGROUND) --- */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
          alt="Registration background"
          fill
          className="object-cover opacity-20 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B]/90 to-[#0F172A]"></div>

        {/* Các khối màu trang trí lơ lửng */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="relative h-full flex flex-col justify-center p-20 text-white z-10">
        {/* KHU VỰC HIỂN THỊ 3D */}
        <div className="mb-16 flex justify-center [perspective:2000px]">
          <div className="relative w-72 h-72 animate-tilt-3d [transform-style:preserve-3d]">
            {/* Thẻ lõi 3D */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl flex items-center justify-center [transform:translateZ(50px)]">
              <div className="relative h-24 w-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.3)] group">
                <CheckCircle2 className="h-12 w-12 text-white animate-bounce" />

                {/* Vòng quay vệ tinh */}
                <div className="absolute -inset-6 border border-emerald-500/30 rounded-[45px] animate-orbit-slow">
                  <div className="absolute -top-1 left-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_15px_#10b981]"></div>
                </div>
              </div>
            </div>

            {/* Các thẻ Bento lơ lửng xung quanh */}
            <div className="absolute -top-10 -right-10 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 [transform:translateZ(100px)] flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Đồng bộ tức thời
              </span>
            </div>

            <div className="absolute -bottom-5 -left-12 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 [transform:translateZ(150px)rotateX(10deg)] flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Bảo mật tuyệt đối
              </span>
            </div>
          </div>
        </div>

        {/* PHẦN VĂN BẢN */}
        <div className="max-w-xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Giáo dục thế hệ mới
            </span>
          </div>

          <h2 className="text-5xl font-black mb-8 leading-[0.95] tracking-tighter uppercase italic">
            Mở khóa <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
              Tiềm năng Sync.
            </span>
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4 group cursor-default">
              <div className="h-px w-8 bg-emerald-500/50 mt-3 group-hover:w-12 transition-all duration-500"></div>
              <p className="text-sm text-slate-400 font-bold leading-relaxed tracking-tight group-hover:text-slate-200 transition-colors uppercase">
                Tối ưu hóa quy trình học tập chuyên nghiệp theo tiêu chuẩn công
                nghiệp.
              </p>
            </div>

            <div className="flex gap-4 group cursor-default">
              <div className="h-px w-8 bg-slate-700 mt-3 group-hover:w-12 group-hover:bg-emerald-500/50 transition-all duration-500"></div>
              <p className="text-sm text-slate-400 font-bold leading-relaxed tracking-tight group-hover:text-slate-200 transition-colors uppercase">
                Quản lý đồ án tập trung, đánh giá công bằng dựa trên dữ liệu
                thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
