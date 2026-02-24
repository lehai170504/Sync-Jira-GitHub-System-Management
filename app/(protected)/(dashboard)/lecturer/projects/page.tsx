 "use client";

import { useEffect, useState } from "react";
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
  const urlClassId = searchParams.get("classId") ?? undefined;
  const [classId, setClassId] = useState<string | undefined>(urlClassId ?? undefined);

  useEffect(() => {
    if (urlClassId) {
      setClassId(urlClassId);
      return;
    }

    const cookieClassId = Cookies.get("lecturer_class_id") ?? undefined;
    setClassId((prev) => prev ?? cookieClassId);
  }, [urlClassId]);

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
      <div className="flex flex-col items-center justify-center h-[80vh] bg-transparent dark:bg-slate-950 transition-colors duration-300 font-sans">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">
          Đang tải dữ liệu đồ án...
        </p>
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500 dark:text-slate-400 animate-in fade-in duration-500 dark:bg-slate-950 transition-colors duration-300 font-sans">
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-full mb-6 border border-slate-200 dark:border-slate-800">
          <FolderGit2 className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Chưa xác định lớp học
        </h2>
        <p className="text-sm mt-2 font-medium">
          Vui lòng chọn lớp học tại danh sách quản lý.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans p-4 md:p-8 max-w-400 mx-auto transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutGrid className="h-4 w-4" />
            Project Hub
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            Đồ án Lớp {className}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base">
            Quản lý tập trung tiến độ, mã nguồn và nhân sự của{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {projects.length}
            </span>{" "}
            nhóm dự án.
          </p>
        </div>
      </div>

      {/* STATS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Tổng số Đồ án"
          value={projects.length}
          icon={<FolderGit2 className="w-6 h-6" />}
          color="blue"
          subText="Nhóm đang vận hành"
        />
        <StatCard
          label="Github Link"
          value={projects.filter((p) => p.githubRepoUrl).length}
          icon={<GitBranch className="w-6 h-6" />}
          color="emerald"
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

      <div className="space-y-6">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Tìm tên đồ án, mã Leader, Jira Key..."
              className="w-full pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 font-medium transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:placeholder:text-slate-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FilterX className="w-4 h-4 mr-2" /> Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* PROJECTS GRID */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <FolderGit2 className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">
              Không tìm thấy đồ án nào phù hợp
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
    </div>
  );
}
