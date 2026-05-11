"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Làm thế nào để bắt đầu đồng bộ hóa?",
    answer: "Rất đơn giản! Bạn chỉ cần vào mục 'Thông tin dự án', nhập ID dự án Jira và cung cấp quyền truy cập. Hệ thống sẽ tự động quét và lấy toàn bộ dữ liệu về Dashboard của nhóm.",
  },
  {
    question: "Điểm số được tính toán dựa trên những yếu tố nào?",
    answer: "Thuật toán của chúng tôi kết hợp 3 yếu tố: Trạng thái hoàn thành task trên Jira (Story Points), số lượng Commit/PR trên GitHub, và mức độ đóng góp tương quan so với các thành viên khác trong nhóm.",
  },
  {
    question: "Tôi có thể xem lịch sử commit từ GitHub không?",
    answer: "Có, hệ thống cung cấp một view chi tiết về hoạt động GitHub, cho phép bạn xem dòng thời gian các commit và pull request của từng thành viên gắn liền với task tương ứng trên Jira.",
  },
  {
    question: "Dữ liệu có được bảo mật không?",
    answer: "Chúng tôi cam kết bảo mật tuyệt đối. Hệ thống chỉ đọc các thông tin cần thiết từ Jira và GitHub API để phục vụ mục đích đánh giá học tập, không can thiệp hay lưu trữ mã nguồn của bạn.",
  },
];

export function FAQSection() {
  return (
    <section className="py-40 bg-white dark:bg-zinc-950 transition-colors duration-500 relative z-10">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">
        <div className="sticky top-40">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-500 mb-6">
            Hỏi đáp nhanh
          </h4>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.9] uppercase mb-8">
            Những thắc mắc <br />
            <span className="text-slate-400 dark:text-slate-500">thường gặp.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md">
            Tìm câu trả lời cho các câu hỏi phổ biến nhất về cách hệ thống hoạt động và cách tối ưu hóa điểm số của bạn.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/40 p-8 md:p-12 rounded-[48px] border border-slate-100 dark:border-white/5">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/10 rounded-3xl px-6 md:px-8 overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="text-left py-6 hover:no-underline hover:text-orange-500 transition-colors font-bold text-slate-800 dark:text-white text-lg md:text-xl tracking-tight">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 dark:text-slate-400 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
