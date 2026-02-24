"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { FileText, ShieldCheck, LifeBuoy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 py-6 px-8 mt-auto transition-colors font-sans z-10">
      <div className="max-w-400 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding */}
        <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
          {/* Logo FPT */}
          <div className="relative h-6 w-auto">
            <Image
              src="/images/Logo_Trường_Đại_học_FPT.svg.png"
              alt="FPT University"
              width={80}
              height={24}
              className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all dark:brightness-0 dark:invert opacity-70 dark:opacity-100"
            />
          </div>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <span className="text-xs font-black tracking-tight text-slate-700 dark:text-slate-300 uppercase">
            SyncSystem
          </span>
        </div>

        {/* Right: Copyright & Links */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
            © 2026 FPT University. Capstone Project SE.
          </p>

          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {/* Modal Điều khoản */}
            <FooterModal
              triggerText="Điều khoản"
              icon={<FileText className="w-5 h-5 text-blue-500" />}
              title="Điều khoản sử dụng"
              description="Các quy định và điều khoản khi sử dụng nền tảng SyncSystem."
            >
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                <p>
                  <strong>1. Chấp nhận điều khoản:</strong> Khi truy cập và sử
                  dụng hệ thống SyncSystem, bạn đồng ý tuân thủ các quy định của
                  Đại học FPT về liêm chính học thuật và bảo mật thông tin.
                </p>
                <p>
                  <strong>2. Quyền và trách nhiệm:</strong> Người dùng chịu
                  trách nhiệm về mọi hoạt động trên tài khoản của mình. Sinh
                  viên cần đảm bảo mã nguồn và task trên Jira phản ánh đúng năng
                  lực và công sức thực tế.
                </p>
                <p>
                  <strong>3. Giới hạn hệ thống:</strong> SyncSystem là công cụ
                  hỗ trợ quản lý đồ án. Hệ thống không chịu trách nhiệm về việc
                  mất mát dữ liệu do lỗi từ các nền tảng bên thứ 3 (GitHub,
                  Jira).
                </p>
              </div>
            </FooterModal>

            {/* Modal Bảo mật */}
            <FooterModal
              triggerText="Bảo mật"
              icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
              title="Chính sách bảo mật"
              description="Cách chúng tôi thu thập và bảo vệ dữ liệu của bạn."
            >
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                <p>
                  <strong>1. Thu thập dữ liệu:</strong> Chúng tôi chỉ thu thập
                  các thông tin cần thiết từ tài khoản FPT (Email, MSSV) và các
                  thông số từ GitHub/Jira (Commits, Tasks) để phục vụ việc đánh
                  giá đồ án.
                </p>
                <p>
                  <strong>2. Lưu trữ an toàn:</strong> Tokens (Personal Access
                  Token, API Key) được mã hóa một chiều. Chúng tôi cam kết không
                  chia sẻ dữ liệu này cho bất kỳ bên thứ 3 nào ngoài mục đích
                  đồng bộ.
                </p>
                <p>
                  <strong>3. Quyền riêng tư:</strong> Giảng viên chỉ có quyền
                  xem dữ liệu của sinh viên thuộc lớp mình quản lý. Bạn có quyền
                  yêu cầu xóa kết nối bất kỳ lúc nào thông qua cài đặt nhóm.
                </p>
              </div>
            </FooterModal>

            {/* Modal Hỗ trợ */}
            <FooterModal
              triggerText="Hỗ trợ"
              icon={<LifeBuoy className="w-5 h-5 text-orange-500" />}
              title="Trung tâm hỗ trợ"
              description="Liên hệ với đội ngũ phát triển và phòng đào tạo."
            >
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Hỗ trợ Kỹ thuật (Technical)
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:support.syncsystem@fpt.edu.vn"
                      className="text-blue-500 hover:underline"
                    >
                      support.syncsystem@fpt.edu.vn
                    </a>
                  </p>
                  <p>Thời gian làm việc: 08:00 - 17:00 (Thứ 2 - Thứ 6)</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Phòng Khảo thí & Đào tạo
                  </p>
                  <p>Hotline: 028 7300 5588</p>
                  <p>Văn phòng: Tòa nhà Alpha, Campus FPTU HCM.</p>
                </div>
              </div>
            </FooterModal>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- SUB-COMPONENT: Tái sử dụng Modal cho các link ở Footer ---
interface FooterModalProps {
  triggerText: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

function FooterModal({
  triggerText,
  icon,
  title,
  description,
  children,
}: FooterModalProps) {
  return (
    <Dialog>
      <DialogTrigger className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer outline-none">
        {triggerText}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl font-sans transition-colors">
        <DialogHeader className="p-6 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
              {icon}
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-6 custom-scrollbar">
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
