"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FolderGit2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiGithub, SiJira } from "react-icons/si";
import {
  ProjectDetail,
  ProjectManagement,
} from "@/features/projects/types/types";

import { ProjectLeader } from "./project-leader";
import { ProjectMemberStack } from "./project-member-stack";
import { TeamDetailSheet } from "./team-detail-sheet";

interface ProjectCardProps {
  project: ProjectManagement | ProjectDetail;
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
        className="group bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900/50 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden"
      >
        {/* Nút Xem chi tiết ảo */}
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* 1. Header (Kênh tích hợp) */}
        <div className="flex justify-between items-start mb-4 pr-10">
          <div className="flex items-center gap-2">
            {project.jiraProjectKey ? (
              <Badge
                variant="outline"
                className="bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 h-8 px-2.5 rounded-lg font-bold text-[10px] uppercase gap-1.5"
              >
                <SiJira className="w-3.5 h-3.5" />
                {project.jiraProjectKey}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 h-8 px-2.5 rounded-lg font-medium text-[10px] uppercase gap-1.5 border-none"
              >
                <SiJira className="w-3.5 h-3.5 opacity-50" /> No Jira
              </Badge>
            )}

            {project.githubRepoUrl ? (
              <div className="h-8 w-8 flex items-center justify-center bg-slate-900 dark:bg-slate-100 rounded-lg text-white dark:text-slate-900 shadow-sm">
                <SiGithub className="w-4 h-4" />
              </div>
            ) : (
              <div className="h-8 w-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500">
                <SiGithub className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* 2. Project Info */}
        <div className="mb-6 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5 text-slate-500 dark:text-slate-400">
            <FolderGit2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Đồ án nhóm
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
        </div>

        {/* 3. Team Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <ProjectLeader leader={project.leader_id} />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Thành viên
              </span>
              <ProjectMemberStack members={project.members} />
            </div>

            <div className="flex flex-col gap-1 items-end text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Khởi tạo
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
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
