"use client";

import {
  FolderGit2,
  Users,
  ExternalLink,
  Calendar,
  Trello,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectManagement } from "@/features/projects/types";

// Import các component con vừa tách
import { ProjectLeader } from "./project-leader";
import { ProjectMemberStack } from "./project-member-stack";

interface ProjectCardProps {
  project: ProjectManagement;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 flex flex-col h-full">
      {/* 1. Header (Icon Folder & Links) */}
      <div className="flex justify-between items-start mb-5">
        <div className="p-3.5 bg-slate-50 rounded-2xl group-hover:bg-orange-50 transition-colors">
          <FolderGit2 className="w-6 h-6 text-slate-400 group-hover:text-[#F27124]" />
        </div>

        <div className="flex items-center gap-2">
          {/* Jira Key */}
          {project.jiraProjectKey && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-600 border-blue-100 h-10 px-3 rounded-full font-black text-[10px] uppercase tracking-wider gap-1.5 cursor-help hover:bg-blue-100 transition-colors"
                  >
                    <Trello className="w-3.5 h-3.5" />
                    {project.jiraProjectKey}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Jira Project Key</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Github Link */}
          {project.githubRepoUrl ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={project.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-full hover:bg-black hover:text-white transition-all border border-slate-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mở Github Repository</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-400 border-slate-200 h-10 px-3 rounded-full font-bold text-[10px] uppercase tracking-wider"
            >
              No Link
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Project Name & Desc */}
      <div className="mb-6 flex-1">
        <h3
          className="text-xl font-black text-slate-900 mb-2 line-clamp-1 leading-tight group-hover:text-[#F27124] transition-colors"
          title={project.name}
        >
          {project.name}
        </h3>
      </div>

      {/* 3. Team Info Section */}
      <div className="space-y-5 pt-5 border-t border-slate-50">
        {/* Leader Component */}
        <ProjectLeader leader={project.leader_id} />

        {/* Members & Date Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Thành viên nhóm
              </span>
            </div>
            {/* Members Stack Component */}
            <ProjectMemberStack members={project.members} />
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Ngày tạo
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg">
              {new Date(project.created_at || Date.now()).toLocaleDateString(
                "vi-VN",
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
