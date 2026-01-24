import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function AuthBanner() {
  return (
    <div className="hidden lg:block relative bg-[#0F172A] h-full">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"
          alt="Registration background"
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
      </div>
      <div className="relative h-full flex flex-col justify-end p-16 text-white z-10">
        <div className="max-w-xl mb-10 animate-fade-in-up">
          <div className="h-16 w-16 bg-green-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-[1.15]">
            Tham gia cộng đồng <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              SyncSystem ngay hôm nay.
            </span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            "Tạo tài khoản chỉ trong vài phút. Đồng bộ hóa quy trình học tập,
            quản lý đồ án và kết nối với giảng viên một cách dễ dàng nhất."
          </p>
        </div>
      </div>
    </div>
  );
}
