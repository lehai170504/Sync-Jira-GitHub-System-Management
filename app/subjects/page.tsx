"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight,
  Filter,
  Code2,
  Terminal,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";

const subjects = [
  {
    id: "SWP391",
    name: "Software Development Project",
    description:
      "Dự án phát triển phần mềm theo mô hình Agile/Scrum. Yêu cầu làm việc nhóm 4-5 người.",
    term: "Kỳ 5",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
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
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    icon: BookOpen,
    jira: true,
    github: false,
  },
  {
    id: "PRN211",
    name: "Basic Cross-Platform App",
    description:
      "Lập trình đa nền tảng cơ bản (C#/.NET). Quản lý source code qua GitHub.",
    term: "Kỳ 5",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
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
    color: "bg-pink-500/10 text-pink-600 border-pink-200",
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
    color: "bg-orange-500/10 text-[#F27124] border-orange-200",
    icon: Sparkles,
    jira: true,
    github: true,
  },
];

const filters = ["Tất cả", "Kỳ 4", "Kỳ 5", "Kỳ 6", "Kỳ 9"];

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "Tất cả" || sub.term === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 font-mono selection:bg-orange-100 relative transition-colors duration-300">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/20 blur-[120px]"></div>
      </div>

      {/* --- HEADER TỐI GIẢN --- */}
      <header className="bg-white/60 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/40 dark:border-slate-800/60 px-8 h-20 flex items-center sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-[#F27124] transition-all duration-300 group shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              Quay về trang chủ
            </span>
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container mx-auto px-6 py-20 max-w-7xl relative text-slate-900 dark:text-slate-100">
        {/* HERO TITLE */}
        <div className="text-center mb-20 space-y-4 animate-fade-up">
          <Badge className="bg-[#F27124]/10 text-[#F27124] border-0 px-4 py-1 font-bold tracking-widest text-[10px]">
            Khám phá lộ trình
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 leading-none">
            Danh mục
            <br />
            môn học.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-sm leading-relaxed pt-4">
            Hệ thống hóa quy trình DevOps cho các môn học chuyên ngành tại FPT
            University.
          </p>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-16 bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/60 animate-reveal">
          <div className="relative w-full lg:w-[400px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#F27124] transition-colors" />
            <input
              placeholder="Tìm mã môn học..."
              className="w-full pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F27124]/20 focus:bg-white dark:focus:bg-slate-950 transition-all text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all border ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900/60 hover:text-[#F27124]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSubjects.map((sub, index) => (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href="/login">
                  <Card className="h-full border-slate-100 dark:border-slate-800 rounded-[40px] p-2 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:shadow-orange-900/40 transition-all duration-500 group overflow-hidden hover:scale-[1.02]">
                    <CardHeader className="p-8 pb-4 space-y-6">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`border-0 px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest ${sub.color}`}
                        >
                          {sub.term}
                        </Badge>
                        <div className="flex gap-2">
                          {sub.jira && (
                            <SiJira className="h-4 w-4 text-[#0052CC]" />
                          )}
                          {sub.github && (
                            <SiGithub className="h-4 w-4 text-slate-900 dark:text-slate-100" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 group">
                          <div className="absolute -inset-1 border border-dashed border-orange-500/0 rounded-2xl group-hover:border-orange-500/50 group-hover:animate-orbit-slow transition-all"></div>
                          <div className="relative h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500 z-10">
                            <sub.icon className="h-6 w-6" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 italic">
                          {sub.id}
                        </h3>
                      </div>
                    </CardHeader>

                    <CardContent className="px-8 py-4">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 line-clamp-1 italic tracking-tight">
                        {sub.name}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                        {sub.description}
                      </p>
                    </CardContent>

                    <CardFooter className="px-8 pb-8 pt-4">
                      <div className="w-full h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-[#F27124] rounded-2xl transition-all duration-500 overflow-hidden relative">
                        <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors">
                          Vào lớp học
                        </span>
                        <ArrowRight className="absolute right-6 h-4 w-4 text-white translate-x-10 group-hover:translate-x-0 transition-transform duration-500" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* EMPTY STATE */}
        {filteredSubjects.length === 0 && (
          <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[60px] border-2 border-dashed border-slate-100 dark:border-slate-800 animate-fade-up">
            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tighter mb-2">
              Không tìm thấy môn học
            </h3>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest">
              Thử tìm kiếm lại với từ khóa khác bạn nhé
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
