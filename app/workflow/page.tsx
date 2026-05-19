"use client";

import Link from "next/link";
import { ArrowLeft, GitBranch } from "lucide-react";
import { BackgroundBeams } from "@/features/home/components/background-beams";
import { WorkflowSection } from "@/features/home/components/workflow-section";

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-500/10 overflow-x-hidden relative">
      <BackgroundBeams />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/40 px-8 h-24 flex items-center sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-950 text-white hover:bg-orange-500 transition-all duration-300 group active:scale-95 shadow-xl shadow-slate-950/20"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Quay lại trang chủ
            </span>
          </Link>
          <div className="flex items-center gap-3 text-orange-500">
            <GitBranch className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Quy trình vận hành
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <div className="container mx-auto px-6 pt-24 max-w-4xl text-center space-y-6">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-slate-900 uppercase">
            Chi tiết <br />
            <span className="text-slate-400">Quy trình.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Tìm hiểu sâu hơn về cách dữ liệu được luân chuyển và xử lý trong hệ thống SAG-CA.
          </p>
        </div>

        {/* Reuse the WorkflowSection but maybe with more info later */}
        <WorkflowSection />

        <section className="container mx-auto px-6 pb-32 max-w-4xl prose prose-slate text-slate-600 font-medium leading-relaxed space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">Cơ chế đồng bộ hóa</h2>
            <p>
              Hệ thống sử dụng Webhooks và API đồng bộ để đảm bảo dữ liệu hoạt động của sinh viên luôn được cập nhật real-time. Khi sinh viên thực hiện commit, tạo pull request hoặc cập nhật task, SAG-CA sẽ ngay lập tức ghi nhận và cập nhật vào Activity Graph.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">Thuật toán đánh giá điểm số</h2>
            <p>
              Điểm số không chỉ dựa trên số lượng. Chúng tôi sử dụng các tiêu chí sau:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li><span className="font-bold text-slate-900">Jira Velocity:</span> Tốc độ hoàn thành các Story Points đã cam kết trong Sprint.</li>
              <li><span className="font-bold text-slate-900">Code Quality:</span> Mức độ phức tạp của các thay đổi và tần suất Review.</li>
              <li><span className="font-bold text-slate-900">Consistency:</span> Sự đều đặn trong việc đóng góp suốt quá trình thực hiện đồ án.</li>
              <li><span className="font-bold text-slate-900">Collaboration:</span> Tương tác thông qua Pull Requests và comments.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
