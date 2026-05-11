"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";

export function HeroSection() {
  return (
    <section className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center pt-52 pb-32 relative z-10">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="space-y-10">
        <div className="inline-flex items-center rounded-full bg-slate-950/90 backdrop-blur-xl border border-white/10 px-4 py-1.5 shadow-2xl animate-fade-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          <Sparkles className="h-3.5 w-3.5 mr-2 text-orange-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
            Next Generation Learning OS
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.85] animate-fade-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          CODE.<br />
          SYNC.<br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27124] to-orange-600">
              GRADED.
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500/20 rounded-full blur-sm" />
          </span>
        </h1>

        <div className="space-y-4 max-w-lg animate-fade-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
          <div className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-orange-500 pl-6">
            Đưa quy trình làm việc Agile/DevOps chuyên nghiệp vào môi trường học tập.
            <span className="text-slate-400 dark:text-slate-500 block mt-2 font-normal text-lg">
              Tự động hóa đánh giá, tối ưu đóng góp, nâng tầm sự nghiệp sinh viên.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 animate-fade-up [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
          <Link href="/login">
            <Button
              size="lg"
              className="h-16 px-12 bg-[#F27124] hover:bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-orange-500/20 hover:shadow-slate-900/40 active:scale-95 group"
            >
              Vào lớp học ngay
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>

          <Button
            size="lg"
            variant="ghost"
            className="h-16 px-10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all active:scale-95 border-2 border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            Tìm hiểu thêm
          </Button>
        </div>
      </div>

      {/* 3D Visual BENTO */}
      <div className="hidden lg:flex justify-center items-center relative h-[600px] [perspective:2000px] animate-reveal opacity-0 [animation-delay:1s] [animation-fill-mode:forwards]">
        <div className="relative w-96 h-96 animate-tilt-3d [transform-style:preserve-3d]">
          {/* CORE BENTO */}
          <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[60px] border border-white/60 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center [transform:translateZ(40px)] group/main hover:[transform:translateZ(60px)] transition-transform duration-500">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-[48px] bg-slate-950 shadow-2xl overflow-hidden p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-50" />
              <Image
                src="/images/logo-sync.png"
                alt="Core Logo"
                width={140}
                height={140}
                priority
                className="w-full h-full object-contain animate-pulse-slow relative z-10"
              />
            </div>
          </div>

          {/* JIRA CARD */}
          <div className="absolute -top-12 -left-20 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-7 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white dark:border-white/10 [transform:translateZ(180px)_rotateY(-25deg)] hover:[transform:translateZ(280px)_rotateY(-10deg)] transition-all duration-700 cursor-pointer group/jira">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="p-2 rounded-xl bg-[#0052CC]/10">
                <SiJira className="w-5 h-5 text-[#0052CC]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0052CC]/80">
                Jira Enterprise
              </span>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-[#0052CC] to-blue-400 animate-shimmer bg-[length:200%_100%]"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Backlog Sync</span>
                <span className="text-[#0052CC]">Active</span>
              </div>
            </div>
          </div>

          {/* GITHUB CARD */}
          <div className="absolute -bottom-12 -right-20 w-64 bg-slate-950/95 backdrop-blur-2xl p-7 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/10 [transform:translateZ(120px)_rotateY(20deg)] text-white hover:[transform:translateZ(220px)_rotateY(5deg)] transition-all duration-700 cursor-pointer group/git">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="p-2 rounded-xl bg-orange-500/20">
                <SiGithub className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
                GitHub DevOps
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-mono text-emerald-400/90 leading-tight">
                $ git log --oneline<br />
                <span className="text-white/60">f27124f</span> feat: analytics_core
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Verified Commit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
