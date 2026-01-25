"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import {
  Search,
  Loader2,
  FolderGit2,
  GitBranch,
  ShieldAlert,
  LayoutGrid,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Import Hooks
import { useLecturerProjects } from "@/features/projects/hooks/use-projects";

// Import Components đã tách
import { ProjectCard } from "@/features/projects/components/project-card";
import { StatCard } from "@/features/projects/components/stat-card";

export default function LecturerProjectManagementPage() {
  const classId = Cookies.get("lecturer_class_id");
  const className = Cookies.get("lecturer_class_name");

  const { data: projects = [], isLoading } = useLecturerProjects(classId);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter Logic
  const filteredProjects = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.leader_id?.student_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.jiraProjectKey?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- Render Loading ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="p-8 bg-white rounded-[32px] border-2 border-dashed border-slate-100 shadow-sm">
          <Loader2 className="h-12 w-12 animate-spin text-[#F27124]" />
        </div>
        <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
          Đang tải danh sách đồ án...
        </p>
      </div>
    );
  }

  // --- Render Empty State ---
  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
        <FolderGit2 className="w-16 h-16 text-slate-200 mb-4" />
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
          Chưa chọn lớp học
        </h2>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F27124] mb-1">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Quản lí Projects
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
            Projects của Lớp {className}
          </h1>
          <p className="text-slate-500 font-medium">
            Theo dõi tiến độ, mã nguồn và thành viên của các nhóm dự án.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Tổng số Đồ án"
          value={projects.length}
          icon={<FolderGit2 className="w-6 h-6" />}
          color="orange"
        />
        <StatCard
          label="Đã có Github"
          value={projects.filter((p) => p.githubRepoUrl).length}
          icon={<GitBranch className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          label="Chưa cập nhật"
          value={projects.filter((p) => !p.githubRepoUrl).length}
          icon={<ShieldAlert className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* SEARCH BAR */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#F27124] transition-colors" />
        <Input
          placeholder="Tìm kiếm theo tên đồ án, mã số Leader hoặc Jira Key..."
          className="w-full pl-14 pr-6 py-6 bg-white border-2 border-slate-50 rounded-[24px] shadow-sm focus:ring-4 focus:ring-[#F27124]/10 focus:border-[#F27124] transition-all outline-none text-slate-700 font-bold text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* PROJECTS GRID */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
          <FolderGit2 className="mx-auto h-16 w-16 text-slate-200 mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            Không tìm thấy đồ án nào
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
