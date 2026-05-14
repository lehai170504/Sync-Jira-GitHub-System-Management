"use client";

import { GitGraph, Activity, LineChart, BellRing, ShieldCheck, FileCheck, Sparkles, ArrowRight } from "lucide-react";

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
              Hệ thống đánh giá liên tục PBL
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.9] uppercase">
            Đánh giá <br />
            <span className="text-slate-400 dark:text-slate-500">dựa trên dữ liệu thật.</span>
          </h2>
        </div>
        <p className="max-w-md text-slate-500 dark:text-slate-400 text-lg font-medium animate-fade-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
          SAG-CA mang đến giải pháp đánh giá liên tục công bằng, minh bạch dựa trên đồ thị hoạt động,
          giúp giảng viên theo dõi sát sao từng sinh viên trong suốt học kỳ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <FeatureCard
          icon={<GitGraph className="h-7 w-7" />}
          iconBg="bg-emerald-600"
          title="Activity Graph"
          desc="Mô hình hóa toàn bộ hoạt động sinh viên thành đồ thị trực quan. Theo dõi mối quan hệ Student-Task-Sprint-Project dễ dàng."
          index={1}
        />
        <FeatureCard
          icon={<Activity className="h-7 w-7" />}
          iconBg="bg-slate-950"
          title="Continuous Assessment"
          desc="Tính điểm liên tục dựa trên Activity Score, Task Completion, Collaboration và Consistency. Công bằng và minh bạch."
          index={2}
        />
        <FeatureCard
          icon={<LineChart className="h-7 w-7" />}
          iconBg="bg-orange-500"
          title="Smart Dashboard"
          desc="Dashboard trực quan cho giảng viên & sinh viên. Biểu đồ hoạt động, cảnh báo sớm sinh viên ít tương tác, báo cáo chi tiết."
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
