"use client";

import { useState } from "react";
import { FolderGit2, LayoutDashboard, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiGithub, SiJira } from "react-icons/si";
import { ProjectManagement } from "@/features/projects/types/types";

// Components
import { ProjectLeader } from "./project-leader";
import { ProjectMemberStack } from "./project-member-stack";
import { TeamDetailSheet } from "./team-detail-sheet";

interface ProjectCardProps {
  project: ProjectManagement;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        className="group bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-2xl hover:border-[#F27124]/30 transition-all duration-500 flex flex-col h-full cursor-pointer relative overflow-hidden"
      >
        {/* Hiệu ứng hover giả lập link chi tiết */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#F27124] p-2 rounded-full text-white shadow-lg">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* 1. Header (Kênh tích hợp) */}
        <div className="flex justify-between items-start mb-5">
          <div className="p-3.5 bg-slate-50 rounded-2xl group-hover:bg-orange-50 transition-colors">
            <FolderGit2 className="w-6 h-6 text-slate-400 group-hover:text-[#F27124]" />
          </div>

          <div className="flex items-center gap-2">
            {project.jiraProjectKey && (
              <Badge className="bg-blue-50 text-blue-600 border-blue-100 h-9 px-3 rounded-full font-black text-[10px] uppercase gap-1.5 shadow-none">
                <SiJira className="w-3 h-3" />
                {project.jiraProjectKey}
              </Badge>
            )}
            {project.githubRepoUrl && (
              <div className="h-9 w-9 flex items-center justify-center bg-slate-900 rounded-full text-white shadow-md">
                <SiGithub className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* 2. Project Info */}
        <div className="mb-6 flex-1">
          <div className="flex items-center gap-2 mb-2 opacity-40">
            <LayoutDashboard className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest font-mono">
              Project nhóm
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-[#F27124] transition-colors uppercase tracking-tight font-mono">
            {project.name}
          </h3>
        </div>

        {/* 3. Team Section */}
        <div className="space-y-5 pt-5 border-t border-slate-50 font-mono">
          <ProjectLeader leader={project.leader_id} />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Số lượng thành viên
              </span>
              <ProjectMemberStack members={project.members} />
            </div>

            <div className="flex flex-col gap-1.5 items-end text-right">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Ngày tạo
              </span>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                {new Date(project.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Drawer chi tiết gọi API /api/projects/teams/{teamId} */}
      <TeamDetailSheet
        teamId={project._id}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
