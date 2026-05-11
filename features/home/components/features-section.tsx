"use client";

import { Activity, Shield, Zap, Code2, Globe, Sparkles } from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-40 container mx-auto px-6 relative z-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-24">
        <div className="max-w-2xl animate-fade-up opacity-0 [animation-fill-mode:forwards]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="h-3 w-3 text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F27124]">
              Mô hình đào tạo chuẩn quốc tế
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.9] uppercase">
            Tự động hóa<br />
            <span className="text-slate-400 dark:text-slate-500">quy trình học tập.</span>
          </h2>
        </div>
        <p className="max-w-md text-slate-500 dark:text-slate-400 text-lg font-medium animate-fade-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
          Chúng tôi mang đến giải pháp kết nối thực tiễn doanh nghiệp vào giảng đường,
          giúp sinh viên làm quen với các công cụ hàng đầu thế giới ngay từ khi còn đi học.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <FeatureCard
          icon={<SiJira className="h-7 w-7" />}
          iconBg="bg-[#0052CC]"
          title="Jira Management"
          desc="Quản lý backlog, sprint và task chuyên nghiệp. Đồng bộ thời gian thực từ hệ thống Jira Enterprise."
          index={1}
        />
        <FeatureCard
          icon={<SiGithub className="h-7 w-7" />}
          iconBg="bg-slate-950"
          title="GitHub DevOps"
          desc="Tự động phân tích commit, pull request để đánh giá kỹ năng code và mức độ đóng góp thực tế."
          index={2}
        />
        <FeatureCard
          icon={<Activity className="h-7 w-7" />}
          iconBg="bg-orange-500"
          title="Analytics 4.0"
          desc="Hệ thống báo cáo thông minh, biểu đồ Burndown và phân tích hiệu suất dựa trên dữ liệu thật."
          index={3}
        />
      </div>
    </section>
  );
}

function FeatureCard({ icon, iconBg, title, desc, index }: any) {
  return (
    <div
      className="group relative p-12 rounded-[48px] bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(242,113,36,0.15)] hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-700 hover:-translate-y-4 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
        <div className="scale-[4] rotate-12">{icon}</div>
      </div>

      <div
        className={`h-16 w-16 rounded-[22px] ${iconBg} text-white flex items-center justify-center mb-10 shadow-2xl group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500 relative z-10`}
      >
        {icon}
      </div>

      <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-5 uppercase tracking-tight group-hover:text-[#F27124] transition-colors relative z-10">
        {title}
      </h3>

      <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed relative z-10">
        {desc}
      </p>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-orange-500 transition-colors">
        <span>Khám phá ngay</span>
        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
