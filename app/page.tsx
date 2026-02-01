"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
  Zap,
  ChevronDown,
} from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] font-mono selection:bg-orange-100 overflow-x-hidden">
      {/* 1. NAVBAR - Hiện mờ dần khi load */}
      <header className="px-8 h-20 flex items-center justify-between fixed w-full top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-slate-200/40 animate-fade-in">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-10 w-auto transition-all duration-500 group-hover:scale-110 active:scale-95 group-hover:rotate-[-5deg]">
              <Image
                src="/images/logo-sync.png"
                alt="SyncSystem Logo"
                width={160}
                height={40}
                priority
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <Image
            src="/images/Logo_Trường_Đại_học_FPT.svg.png"
            alt="FPT"
            width={100}
            height={30}
            className="h-7 w-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
          />
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="#features"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all hover:translate-y-[-2px]"
            >
              Tính năng
            </Link>
            <Link
              href="/subjects"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#F27124] transition-all hover:translate-y-[-2px]"
            >
              Môn học hỗ trợ
            </Link>
          </nav>
          <Link href="/login">
            <Button className="bg-slate-900 hover:bg-[#F27124] text-white h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 hover:shadow-orange-500/20">
              Bắt đầu ngay
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. HERO SECTION - Hiệu ứng load từng phần */}
        <section className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center pt-52 pb-32">
          <div className="space-y-10">
            {/* Badge - Delay 0.2s */}
            <div className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 shadow-2xl animate-fade-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
              <Sparkles className="h-3 w-3 mr-2 text-orange-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
                Version 4.0 - Active
              </span>
            </div>

            {/* H1 - Delay 0.4s */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] animate-fade-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
              CODE.
              <br />
              SYNC.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27124] to-orange-600">
                GRADED.
              </span>
            </h1>

            {/* Paragraph - Delay 0.6s */}
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg border-l-4 border-orange-100 pl-6 animate-fade-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
              Đưa quy trình làm việc chuyên nghiệp (Agile/DevOps) vào môi trường
              học tập. Tự động hóa việc đánh giá qua dữ liệu thực tế.
            </p>

            {/* Buttons - Delay 0.8s */}
            <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
              <Button
                size="lg"
                className="h-16 px-10 bg-[#F27124] hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-[#F27124]/40 active:scale-95 group"
              >
                Vào lớp học{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 border-2 border-slate-200 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Tài liệu hướng dẫn
              </Button>
            </div>
          </div>

          {/* 3D VISUAL - Delay 1s + Chuyển động lơ lửng */}
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
                  <div className="absolute -inset-4 border-2 border-orange-500/20 rounded-[50px] animate-orbit-slow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#F27124] rounded-full shadow-[0_0_15px_#F27124]"></div>
                  </div>
                </div>
              </div>

              {/* JIRA CARD 3D */}
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

              {/* GITHUB CARD 3D */}
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

        {/* 3. METRICS SECTION - Hiện ra khi cuộn xuống */}
        <section className="py-24 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricBox
              icon={Users}
              label="Sinh viên"
              value="1,200+"
              delay="100ms"
            />
            <MetricBox
              icon={Activity}
              label="Lớp học"
              value="45"
              delay="200ms"
            />
            <MetricBox icon={Zap} label="Đồng bộ" value="250k" delay="300ms" />
            <MetricBox
              icon={ShieldCheck}
              label="Bảo vệ"
              value="180+"
              delay="400ms"
            />
          </div>
        </section>

        {/* 4. FEATURE SECTION - Staggered Slide In */}
        <section id="features" className="py-32 container mx-auto px-6">
          <div className="max-w-2xl mb-20 animate-fade-up opacity-0 [animation-fill-mode:forwards]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F27124] mb-4">
              Mô hình đào tạo
            </h4>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none uppercase">
              Tự động hóa
              <br />
              quy trình học tập.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<SiJira className="h-6 w-6" />}
              iconBg="bg-[#0052CC]"
              title="Jira Management"
              desc="Quản lý backlog, sprint và task như một team dev chuyên nghiệp."
              index={1}
            />
            <FeatureCard
              icon={<SiGithub className="h-6 w-6" />}
              iconBg="bg-slate-900"
              title="GitHub DevOps"
              desc="Hệ thống tự động quét Commit để phân tích mức độ đóng góp."
              index={2}
            />
            <FeatureCard
              icon={<Activity className="h-6 w-6" />}
              iconBg="bg-emerald-500"
              title="Real-time Tracking"
              desc="Báo cáo tiến độ trực quan theo biểu đồ Burndown chuẩn quốc tế."
              index={3}
            />
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-tighter">
              <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">
                S
              </div>
              SyncSystem
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Build for FPT University
            </p>
          </div>
          <div className="flex gap-10">
            <FooterLink label="Hỗ trợ" href="/support" />
            <FooterLink label="Quy định" href="/support" />
            <FooterLink label="Liên hệ" href="/support" />
          </div>
        </div>
      </footer>
    </div>
  );
}

/* COMPONENT PHỤ VỚI ANIMATION */

function MetricBox({ icon: Icon, label, value, delay }: any) {
  return (
    <div
      className="text-center space-y-2 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-center hover:scale-125 transition-transform duration-500">
        <Icon className="h-5 w-5 text-[#F27124]" />
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
        {value}
      </p>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, desc, index }: any) {
  return (
    <div
      className="group p-10 rounded-[40px] bg-white border border-slate-200/60 shadow-xl hover:shadow-[#F27124]/10 hover:border-[#F27124]/30 transition-all duration-700 hover:-translate-y-4 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div
        className={`h-14 w-14 rounded-2xl ${iconBg} text-white flex items-center justify-center mb-8 shadow-2xl group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500`}
      >
        {icon}
      </div>
      <h3 className="font-black text-2xl text-slate-900 mb-4 uppercase tracking-tighter italic group-hover:text-[#F27124] transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function FooterLink({ label, href }: any) {
  return (
    <Link
      href={href}
      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all hover:pl-2"
    >
      {label}
    </Link>
  );
}
