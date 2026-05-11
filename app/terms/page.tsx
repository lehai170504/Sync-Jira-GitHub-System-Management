"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { BackgroundBeams } from "@/features/home/components/background-beams";

export default function TermsPage() {
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
            <ShieldCheck className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Điều khoản dịch vụ
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-24 max-w-4xl relative z-10">
        <div className="space-y-12 animate-fade-up">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 uppercase">
              Điều khoản <br />
              <span className="text-slate-400">Dịch vụ.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Cập nhật lần cuối: Tháng 5, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-10 text-slate-600 font-medium leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">1. Chấp nhận điều khoản</h2>
              <p>
                Bằng việc truy cập và sử dụng hệ thống SyncSystem, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">2. Quyền và Trách nhiệm của Người dùng</h2>
              <p>
                Người dùng cam kết cung cấp thông tin chính xác khi đăng ký và sử dụng hệ thống. Bạn có trách nhiệm bảo mật tài khoản và mật khẩu của mình, cũng như chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản đó.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">3. Sử dụng Dữ liệu Jira & GitHub</h2>
              <p>
                Hệ thống yêu cầu quyền truy cập vào dữ liệu Jira và GitHub của bạn để thực hiện chức năng đồng bộ hóa và đánh giá. Chúng tôi cam kết chỉ sử dụng dữ liệu này cho mục đích giáo dục và đánh giá học tập theo quy định của nhà trường.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">4. Thay đổi Điều khoản</h2>
              <p>
                Chúng tôi có quyền thay đổi hoặc cập nhật các điều khoản này bất kỳ lúc nào mà không cần thông báo trước. Việc bạn tiếp tục sử dụng hệ thống sau khi các thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
