"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Github,
  Trello, // Icon đại diện cho Jira
  ShieldCheck,
  Sparkles,
  BookOpen, // Thay LayoutDashboard bằng BookOpen cho hợp ngữ cảnh môn học
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-mono selection:bg-orange-100 overflow-hidden">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-200/40 blur-[100px] mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-blue-200/40 blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      {/* --- 1. NAVBAR --- */}
      <header className="px-6 h-20 flex items-center justify-between fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 transition-all">
        <div className="flex items-center gap-6">
          {/* Logo Hệ thống */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F27124] to-[#d65d1b] shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">
                S
              </span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Sync<span className="text-[#F27124]">System</span>
            </span>
          </Link>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Logo FPT University */}
          <div className="hidden sm:block opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/images/Logo_Trường_Đại_học_FPT.svg.png" // Đảm bảo bạn có file ảnh này
              alt="FPT University Logo"
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/subjects"
            className="text-sm font-medium text-slate-600 hover:text-[#F27124] transition-colors hidden md:block"
          >
            Các môn hỗ trợ
          </Link>
          <Link href="/login">
            <Button className="bg-[#0F172A] hover:bg-[#1e293b] text-white px-6 rounded-full shadow-md transition-all hover:shadow-lg">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </header>

      {/* --- 2. HERO SECTION --- */}
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge thông báo */}
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50/80 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-[#F27124] shadow-sm">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Nền tảng đào tạo Project-based Learning
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Quản lý Môn học <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27124] to-orange-600">
                & Dự án Thực hành.
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Giải pháp tối ưu cho các môn chuyên ngành (SWP, PRN, SWR...).
              Giảng viên theo dõi tiến độ Labs/Assignments tự động qua kết nối{" "}
              <strong>Jira</strong> và <strong>GitHub</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full h-14 px-10 text-lg font-bold bg-[#F27124] hover:bg-[#d65d1b] shadow-xl shadow-orange-500/30 rounded-full transition-transform hover:-translate-y-1"
                >
                  Vào Lớp học <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/subjects" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 px-10 text-lg font-medium border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full"
                >
                  <BookOpen className="mr-2 h-5 w-5 text-slate-500" />
                  Danh sách môn
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-400 font-medium pt-4">
              Hệ thống LMS tích hợp dành riêng cho sinh viên FPT.
            </p>
          </div>

          {/* Right Column: Abstract Visual Visualization */}
          <div className="hidden lg:flex justify-center items-center relative h-[500px]">
            {/* Vòng tròn trung tâm */}
            <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl shadow-orange-500/10 border border-slate-100 flex flex-col items-center gap-4 animate-float-slow">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F27124] to-[#d65d1b] shadow-inner">
                <span className="text-white font-black text-3xl">S</span>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-slate-900">
                  Subject Core
                </h3>
                <p className="text-sm text-slate-500">Dữ liệu Môn học</p>
              </div>
              {/* Các đường nối */}
              <div className="absolute top-1/2 left-full w-24 h-px bg-gradient-to-r from-orange-300 to-transparent"></div>
              <div className="absolute top-1/2 right-full w-24 h-px bg-gradient-to-l from-orange-300 to-transparent"></div>
            </div>

            {/* Jira Node */}
            <div className="absolute top-[20%] left-[5%] bg-[#0052CC]/10 p-4 rounded-2xl backdrop-blur-md border border-[#0052CC]/20 shadow-lg animate-float-medium">
              <div className="flex items-center gap-3">
                <Trello className="h-10 w-10 text-[#0052CC]" />
                <div>
                  <h4 className="font-bold text-[#0052CC]">Jira Sync</h4>
                  <p className="text-xs text-[#0052CC]/80">
                    Labs & Assignments
                  </p>
                </div>
              </div>
            </div>

            {/* GitHub Node */}
            <div className="absolute bottom-[25%] right-[5%] bg-[#181717]/10 p-4 rounded-2xl backdrop-blur-md border border-[#181717]/20 shadow-lg animate-float-fast">
              <div className="flex items-center gap-3">
                <Github className="h-10 w-10 text-[#181717]" />
                <div>
                  <h4 className="font-bold text-[#181717]">GitHub Repo</h4>
                  <p className="text-xs text-[#181717]/80">
                    Source Code Môn học
                  </p>
                </div>
              </div>
            </div>

            {/* Background Connections */}
            <svg
              className="absolute inset-0 pointer-events-none -z-10"
              width="100%"
              height="100%"
            >
              <path
                d="M 100 150 Q 300 250 500 150"
                stroke="#0052CC"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
                className="opacity-30 animate-pulse-slow"
              />
              <path
                d="M 150 350 Q 350 250 550 350"
                stroke="#181717"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
                className="opacity-30 animate-pulse-slow delay-700"
              />
            </svg>
          </div>
        </div>

        {/* --- 3. FEATURE GRID --- */}
        <div id="features" className="mt-32 container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Mô hình lớp học hiện đại
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Không còn việc nộp bài thủ công. Mọi đóng góp của sinh viên được
              ghi nhận tự động từ công cụ thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Jira */}
            <FeatureCard
              icon={<Trello className="h-8 w-8 text-white" />}
              iconBg="bg-[#0052CC]"
              title="Quản lý Task Môn học"
              desc="Sinh viên tạo và cập nhật trạng thái bài tập, bài Lab trên Jira. Hệ thống tự động đồng bộ về lớp học."
            />
            {/* Feature 2: GitHub */}
            <FeatureCard
              icon={<Github className="h-8 w-8 text-white" />}
              iconBg="bg-[#181717]"
              title="Nộp bài qua Code"
              desc="Giảng viên Review code trực tiếp qua Pull Request. Tính điểm dựa trên chất lượng commit vào Repository môn học."
            />
            {/* Feature 3: Grading */}
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-white" />}
              iconBg="bg-green-600"
              title="Tổng hợp Điểm số"
              desc="Bảng điểm thời gian thực được tính toán dựa trên dữ liệu hoàn thành từ Jira và GitHub của từng sinh viên."
            />
          </div>
        </div>
      </main>

      {/* --- 4. FOOTER --- */}
      <footer className="border-t border-slate-100 py-10 bg-white relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-[#F27124] font-bold">S</span>
            </div>
            <p>© 2026 SyncSystem. Hỗ trợ đào tạo FPT University.</p>
          </div>

          <div className="flex gap-8 font-medium">
            <Link
              href="/support"
              className="hover:text-[#F27124] transition-colors"
            >
              Sổ tay Sinh viên
            </Link>
            <Link
              href="/support"
              className="hover:text-[#F27124] transition-colors"
            >
              Liên hệ IT
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component phụ cho Card tính năng
function FeatureCard({
  icon,
  iconBg,
  title,
  desc,
}: {
  icon: any;
  iconBg: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-orange-100 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div
        className={`h-16 w-16 rounded-2xl ${iconBg} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-2xl text-slate-900 mb-3 relative z-10">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed relative z-10">{desc}</p>
    </div>
  );
}
