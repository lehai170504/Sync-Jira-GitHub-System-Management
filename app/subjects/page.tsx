"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Search,
  Github,
  Trello,
  BookOpen,
  ArrowRight,
  Filter,
  Code2,
  Terminal,
  Layers,
} from "lucide-react";

// --- MOCK DATA ---
const subjects = [
  {
    id: "SWP391",
    name: "Software Development Project",
    description:
      "Dự án phát triển phần mềm theo mô hình Agile/Scrum. Yêu cầu làm việc nhóm 4-5 người.",
    term: "Kỳ 5",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Layers,
    jira: true,
    github: true,
  },
  {
    id: "SWR302",
    name: "Software Requirements",
    description:
      "Kỹ nghệ yêu cầu phần mềm. Tập trung vào việc viết SRS và quản lý backlog trên Jira.",
    term: "Kỳ 4",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: FileTextIcon,
    jira: true,
    github: false,
  },
  {
    id: "PRN211",
    name: "Basic Cross-Platform App",
    description:
      "Lập trình đa nền tảng cơ bản (C#/.NET). Quản lý source code qua GitHub.",
    term: "Kỳ 5",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Terminal,
    jira: false,
    github: true,
  },
  {
    id: "PRM392",
    name: "Mobile Programming",
    description:
      "Lập trình ứng dụng di động (Android/iOS). Yêu cầu nộp bài qua Repo Github.",
    term: "Kỳ 6",
    color: "bg-pink-50 text-pink-700 border-pink-200",
    icon: Code2,
    jira: true,
    github: true,
  },
  {
    id: "SEP490",
    name: "Capstone Project (Đồ án)",
    description:
      "Đồ án tốt nghiệp. Quy trình chuyên nghiệp, bảo vệ trước hội đồng doanh nghiệp.",
    term: "Kỳ 9",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: BookOpen,
    jira: true,
    github: true,
  },
];

// Icon phụ cho Mock Data
function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

// Danh sách các bộ lọc
const filters = ["Tất cả", "Kỳ 4", "Kỳ 5", "Kỳ 6", "Kỳ 9"];

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  // Logic lọc dữ liệu
  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "Tất cả" || sub.term === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      {/* 1. HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-slate-500 hover:text-[#F27124] transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Trang chủ</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#F27124] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-semibold text-slate-800">
              Danh sách Môn học
            </span>
          </div>
          {/* Placeholder để căn giữa */}
          <div className="w-20 hidden sm:block"></div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Title */}
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Khám phá các môn học
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Hệ thống SyncSystem hỗ trợ đồng bộ dữ liệu cho các môn đồ án và
            chuyên ngành hẹp.
          </p>
        </div>

        {/* 3. TOOLBAR (Search & Filter) */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
          {/* Search Input */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F27124] transition-colors" />
            <Input
              placeholder="Tìm kiếm môn (VD: SWP391)..."
              className="pl-12 h-12 rounded-full border-slate-200 bg-white shadow-sm focus-visible:ring-[#F27124] focus-visible:ring-offset-0 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#F27124] hover:text-[#F27124]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 4. SUBJECTS GRID */}
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((sub) => (
              <Link href="/login" key={sub.id} className="block h-full">
                <Card className="h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-slate-200 overflow-hidden cursor-pointer">
                  <CardHeader className="pb-4 space-y-4">
                    <div className="flex justify-between items-start">
                      {/* Term Badge */}
                      <Badge
                        variant="outline"
                        className={`border-0 px-3 py-1 ${sub.color}`}
                      >
                        {sub.term}
                      </Badge>

                      {/* Tools Icons */}
                      <div className="flex gap-2">
                        {sub.jira && (
                          <div
                            className="p-1.5 bg-blue-50 rounded-md text-blue-600 tooltip"
                            title="Hỗ trợ Jira"
                          >
                            <Trello className="h-4 w-4" />
                          </div>
                        )}
                        {sub.github && (
                          <div
                            className="p-1.5 bg-slate-100 rounded-md text-slate-800 tooltip"
                            title="Hỗ trợ GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-orange-200 transition-colors">
                        <sub.icon className="h-5 w-5 text-slate-600 group-hover:text-[#F27124]" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#F27124] transition-colors">
                        {sub.id}
                      </h3>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2 line-clamp-1">
                      {sub.name}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {sub.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-slate-50 bg-slate-50/50 group-hover:bg-orange-50/30 transition-colors">
                    <div className="w-full flex justify-between items-center text-sm font-medium text-slate-600 group-hover:text-[#F27124]">
                      <span>Truy cập lớp học</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* 5. EMPTY STATE */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Không tìm thấy kết quả
            </h3>
            <p className="text-slate-500 mb-6">
              Không có môn học nào khớp với từ khóa "{searchTerm}" hoặc bộ lọc.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("Tất cả");
              }}
              className="border-slate-200 text-slate-600 hover:text-[#F27124] hover:border-[#F27124]"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
