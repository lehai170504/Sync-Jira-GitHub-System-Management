"use client";

import { Activity } from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-32 container mx-auto px-6 relative z-10"
    >
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
