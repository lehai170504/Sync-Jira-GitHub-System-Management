"use client";

import Link from "next/link"; // Thêm Link nếu muốn nút bấm chuyển trang
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react"; // Import ArrowRight
import { SiGithub, SiJira } from "react-icons/si";

export function HeroSection() {
  return (
    <section className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center pt-52 pb-32 relative z-10">
      <div className="space-y-10">
        <div className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 shadow-2xl animate-fade-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          <Sparkles className="h-3 w-3 mr-2 text-orange-400 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
            Version 4.0 - Active
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] animate-fade-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          CODE.
          <br />
          SYNC.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27124] to-orange-600">
            GRADED.
          </span>
        </h1>

        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg border-l-4 border-orange-100 pl-6 animate-fade-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
          Đưa quy trình làm việc chuyên nghiệp (Agile/DevOps) vào môi trường học
          tập. Tự động hóa việc đánh giá qua dữ liệu thực tế.
        </p>

        {/* --- KHÔI PHỤC NÚT BẤM CHUẨN --- */}
        <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
          <Link href="/login">
            <Button
              size="lg"
              className="h-16 px-10 bg-[#F27124] hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-[#F27124]/40 active:scale-95 group"
            >
              Vào lớp học{" "}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="h-16 px-10 border-2 border-slate-200 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
          >
            Tài liệu hướng dẫn
          </Button>
        </div>
      </div>

      {/* 3D Visual BENTO (Giữ nguyên) */}
      <div className="hidden lg:flex justify-center items-center relative h-[600px] [perspective:2000px] animate-reveal opacity-0 [animation-delay:1s] [animation-fill-mode:forwards]">
        <div className="relative w-96 h-96 animate-tilt-3d [transform-style:preserve-3d]">
          {/* CORE BENTO */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[60px] border border-white/50 shadow-2xl flex items-center justify-center [transform:translateZ(40px)] group/main hover:[transform:translateZ(60px)] transition-transform duration-500">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-[40px] bg-slate-900 shadow-3xl overflow-hidden p-6">
              <Image
                src="/images/logo-sync.png"
                alt="Core Logo"
                width={120}
                height={120}
                priority
                className="w-full h-full object-contain animate-pulse-slow"
              />
            </div>
          </div>

          {/* JIRA CARD */}
          <div className="absolute -top-10 -left-16 w-56 bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl border border-white [transform:translateZ(150px)_rotateY(-20deg)] hover:[transform:translateZ(250px)_rotateY(-10deg)] transition-all duration-700 cursor-pointer group/jira">
            <div className="flex items-center gap-3 mb-4">
              <SiJira className="w-5 h-5 text-[#0052CC] group-hover/jira:rotate-[360ms] transition-transform duration-1000" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0052CC]">
                Jira Sync
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[75%] bg-[#0052CC] animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>

          {/* GITHUB CARD */}
          <div className="absolute -bottom-8 -right-16 w-60 bg-slate-900/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-2xl border border-white/10 [transform:translateZ(100px)_rotateY(15deg)] text-white hover:[transform:translateZ(180px)_rotateY(5deg)] transition-all duration-700 cursor-pointer group/git">
            <div className="flex items-center gap-3 mb-4">
              <SiGithub className="w-5 h-5 text-orange-400 group-hover/git:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                Git Hub
              </span>
            </div>
            <p className="text-[10px] font-mono text-emerald-400">
              verified_commit: "feat/core"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
