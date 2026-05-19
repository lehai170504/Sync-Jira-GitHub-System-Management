"use client";

import { GitGraph, Activity, LineChart, BarChart3, GitPullRequest, GitBranch, Code2, Users, Sparkles, ArrowRight } from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 container mx-auto px-6 relative z-10"
    >
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
          <Sparkles className="h-3 w-3 text-orange-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F27124]">
            Hệ thống đánh giá liên tục PBL
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
          Mọi thứ bạn <br />
          <span className="text-orange-500">cần để quản lý PBL</span>
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg">
          Từ tạo đề tài, quản lý nhóm, chấm điểm liên tục đến dashboard thông minh — tất cả trong một nền tảng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<GitGraph className="h-6 w-6" />}
          iconBg="bg-emerald-600"
          title="Activity Graph"
          desc="Mô hình hóa toàn bộ hoạt động sinh viên thành đồ thị trực quan. Theo dõi mối quan hệ Student-Task-Sprint-Project dễ dàng."
        />
        <FeatureCard
          icon={<Activity className="h-6 w-6" />}
          iconBg="bg-slate-950"
          title="Continuous Assessment"
          desc="Tính điểm liên tục dựa trên Activity Score, Task Completion, Collaboration và Consistency. Công bằng và minh bạch."
        />
        <FeatureCard
          icon={<LineChart className="h-6 w-6" />}
          iconBg="bg-orange-500"
          title="Smart Dashboard"
          desc="Dashboard trực quan cho giảng viên & sinh viên. Biểu đồ hoạt động, cảnh báo sớm, báo cáo chi tiết."
        />
        <FeatureCard
          icon={<GitBranch className="h-6 w-6" />}
          iconBg="bg-blue-600"
          title="GitHub Integration"
          desc="Đồng bộ tự động commits, pull requests, branches từ GitHub vào hệ thống Activity Graph."
        />
        <FeatureCard
          icon={<BarChart3 className="h-6 w-6" />}
          iconBg="bg-violet-600"
          title="Real-time Analytics"
          desc="Phân tích real-time về tiến độ, hiệu suất nhóm và cảnh báo sớm sinh viên đang gặp khó khăn."
        />
        <FeatureCard
          icon={<Users className="h-6 w-6" />}
          iconBg="bg-rose-600"
          title="Team Management"
          desc="Quản lý nhóm, phân chia task, Sprint và milestone, đảm bảo mọi sinh viên đều có đóng góp."
        />
      </div>
    </section>
  );
}

function FeatureCard({ icon, iconBg, title, desc }: any) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(242,113,36,0.12)] hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2">
      <div className={`h-12 w-12 rounded-2xl ${iconBg} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 group-hover:text-[#F27124] transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
