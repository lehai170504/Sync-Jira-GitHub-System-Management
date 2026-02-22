"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FolderGit2, LayoutDashboard, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiGithub, SiJira } from "react-icons/si";
import { ProjectManagement } from "@/features/projects/types/types";

import { ProjectLeader } from "./project-leader";
import { ProjectMemberStack } from "./project-member-stack";
import { TeamDetailSheet } from "./team-detail-sheet";

interface ProjectCardProps {
  project: ProjectManagement;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDetailOpen = searchParams.get("teamId") === project._id;

  const handleOpenDetail = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("teamId", project._id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("teamId");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <>
      <div
        onClick={handleOpenDetail}
        className="group bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm dark:shadow-none hover:shadow-2xl hover:border-[#F27124]/30 dark:hover:border-orange-500/50 transition-all duration-500 flex flex-col h-full cursor-pointer relative overflow-hidden"
      >
        {/* Hiệu ứng hover giả lập link chi tiết */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#F27124] p-2 rounded-full text-white shadow-lg">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* 1. Header (Kênh tích hợp) */}
        <div className="flex justify-between items-start mb-5">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
            <FolderGit2 className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-[#F27124] dark:group-hover:text-[#F27124]" />
          </div>

          <div className="flex items-center gap-2">
            {project.jiraProjectKey && (
              <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800 h-9 px-3 rounded-full font-black text-[10px] uppercase gap-1.5 shadow-none">
                <SiJira className="w-3 h-3" />
                {project.jiraProjectKey}
              </Badge>
            )}
            {project.githubRepoUrl && (
              <div className="h-9 w-9 flex items-center justify-center bg-slate-900 dark:bg-slate-800 rounded-full text-white dark:text-slate-300 shadow-md dark:shadow-none border border-transparent dark:border-slate-700">
                <SiGithub className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* 2. Project Info */}
        <div className="mb-6 flex-1">
          <div className="flex items-center gap-2 mb-2 opacity-40 dark:opacity-60">
            <LayoutDashboard className="w-3 h-3 dark:text-slate-300" />
            <span className="text-[9px] font-black uppercase tracking-widest font-mono dark:text-slate-300">
              Project nhóm
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight group-hover:text-[#F27124] transition-colors uppercase tracking-tight font-mono">
            {project.name}
          </h3>
        </div>

        {/* 3. Team Section */}
        <div className="space-y-5 pt-5 border-t border-slate-50 dark:border-slate-800 font-mono">
          <ProjectLeader leader={project.leader_id} />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Số lượng thành viên
              </span>
              <ProjectMemberStack members={project.members} />
            </div>

            <div className="flex flex-col gap-1.5 items-end text-right">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Ngày tạo
              </span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700">
                {new Date(project.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Drawer chi tiết */}
      <TeamDetailSheet
        teamId={project._id}
        open={isDetailOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
