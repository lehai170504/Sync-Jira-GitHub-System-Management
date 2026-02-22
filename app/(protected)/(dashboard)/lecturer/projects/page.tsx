"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  Search,
  Loader2,
  FolderGit2,
  GitBranch,
  ShieldAlert,
  LayoutGrid,
  FilterX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ProjectCard } from "@/features/projects/components/project-card";
import { StatCard } from "@/features/projects/components/stat-card";

import { useClassProjects } from "@/features/projects/hooks/use-class-projects";
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";

export default function LecturerProjectManagementPage() {
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("classId");

  const cookieClassId =
    typeof window !== "undefined"
      ? Cookies.get("lecturer_class_id")
      : undefined;

  const classId = urlClassId || cookieClassId;

  const { data, isLoading: isProjectsLoading } = useClassProjects(classId);

  const { data: classDetailData, isLoading: isClassDetailLoading } =
    useClassDetails(classId);
  const className = classDetailData?.class?.name || "Lớp học";

  const [searchTerm, setSearchTerm] = useState("");

  const projects = data?.projects || [];

  const filteredProjects = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.leader_id?.student_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.jiraProjectKey?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isLoading = isProjectsLoading || isClassDetailLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] dark:bg-slate-950 transition-colors duration-300">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <Loader2 className="h-12 w-12 animate-spin text-[#F27124]" />
        </div>
        <p className="mt-6 text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
          Đang nạp dữ liệu đồ án...
        </p>
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500 dark:text-slate-400 animate-in fade-in duration-500 dark:bg-slate-950 transition-colors duration-300">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full mb-6 border border-slate-100 dark:border-slate-800">
          <FolderGit2 className="w-16 h-16 text-slate-200 dark:text-slate-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase">
          Chưa xác định lớp học
        </h2>
        <p className="text-slate-400 mt-2 font-medium">
          Vui lòng chọn lớp học tại danh sách quản lý.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-sans p-4 md:p-10 transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F27124] dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-100 dark:border-orange-500/20 mb-2">
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Project Hub
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-50 leading-tight">
            Đồ án Lớp {className}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg">
            Quản lý tập trung tiến độ, mã nguồn và nhân sự của {projects.length}{" "}
            nhóm dự án.
          </p>
        </div>
      </div>

      {/* STATS DASHBOARD (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Tổng số Đồ án"
          value={projects.length}
          icon={<FolderGit2 className="w-6 h-6" />}
          color="orange"
          subText="Nhóm đang vận hành"
        />
        <StatCard
          label="Github Link"
          value={projects.filter((p) => p.githubRepoUrl).length}
          icon={<GitBranch className="w-6 h-6" />}
          color="blue"
          subText="Đã liên kết mã nguồn"
        />
        <StatCard
          label="Cảnh báo"
          value={
            projects.filter((p) => !p.githubRepoUrl || !p.jiraProjectKey).length
          }
          icon={<ShieldAlert className="w-6 h-6" />}
          color="red"
          subText="Thiếu thông tin quản lý"
        />
      </div>

      {/* TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-[32px] border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-colors duration-300">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-500 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm theo tên dự án, mã Leader hoặc Jira Key..."
            className="w-full pl-14 h-14 bg-slate-50/50 dark:bg-slate-950/50 border-none focus:bg-white dark:focus:bg-slate-900 rounded-[24px] text-slate-700 dark:text-slate-100 font-bold text-base transition-all dark:placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <Button
            variant="ghost"
            onClick={() => setSearchTerm("")}
            className="rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 gap-1.5"
          >
            <FilterX className="w-3.5 h-3.5" /> Xóa lọc
          </Button>
        )}
      </div>

      {/* PROJECTS GRID */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[48px] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner transition-colors duration-300">
          <FolderGit2 className="mx-auto h-20 w-20 text-slate-100 dark:text-slate-700 mb-6" />
          <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
            Không tìm thấy kết quả phù hợp
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
