"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "SAG-CA hoạt động như thế nào?",
    answer: "SAG-CA ghi nhận hoạt động của sinh viên trong suốt quá trình học PBL (tạo task, cập nhật tiến độ, commit code, review, nộp báo cáo...), sau đó mô hình hóa thành đồ thị hoạt động và tính điểm đánh giá liên tục dựa trên các chỉ số như Activity Score, Task Completion, Collaboration và Consistency.",
  },
  {
    question: "Điểm đánh giá liên tục được tính ra sao?",
    answer: "Hệ thống sử dụng công thức: CA Score = Activity Score × 20% + Task Completion × 25% + Collaboration × 20% + Contribution Quality × 20% + Consistency × 15%. Đây là điểm đề xuất, giảng viên có quyền điều chỉnh và thêm nhận xét.",
  },
  {
    question: "Đồ thị hoạt động sinh viên là gì?",
    answer: "Là mô hình trực quan hóa mối quan hệ giữa sinh viên, task, sprint, project và các hoạt động. Các node (đỉnh) đại diện cho Student, Task, Sprint, Commit, Issue... Các edge (cạnh) thể hiện mối quan hệ như 'sinh viên hoàn thành task', 'task thuộc sprint', 'sinh viên tạo commit'...",
  },
  {
    question: "Dữ liệu hoạt động được thu thập từ đâu?",
    answer: "Dữ liệu có thể đến từ nhiều nguồn: nhập thủ công trên hệ thống, tích hợp GitHub (commits, PRs, issues), tích hợp Jira (tasks, sprints), báo cáo sprint của sinh viên, peer assessment và feedback từ giảng viên.",
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
            Giải đáp <br />
            <span className="text-slate-400 dark:text-slate-500">về SAG-CA.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md">
            Tìm câu trả lời về cách hệ thống đánh giá liên tục hoạt động, đồ thị hoạt động sinh viên và cách tính điểm.
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
