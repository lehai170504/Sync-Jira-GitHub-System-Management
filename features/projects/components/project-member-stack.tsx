"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectMember } from "@/features/projects/types/types";

interface ProjectMemberStackProps {
  members: ProjectMember[];
  limit?: number;
}

export function ProjectMemberStack({
  members,
  limit = 5,
}: ProjectMemberStackProps) {
  const displayMembers = members.slice(0, limit);
  const remainingCount = members.length - limit;

  if (members.length === 0) {
    return (
      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic pl-1">
        Chưa có thành viên
      </span>
    );
  }

  return (
    <div className="flex items-center -space-x-3 hover:space-x-1 transition-all duration-300 py-1 pl-1">
      {displayMembers.map((member) => (
        <TooltipProvider key={member._id}>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 cursor-pointer transition-transform hover:scale-110 hover:z-10 shadow-sm">
                <AvatarImage src={member.avatar_url} className="object-cover" />
                <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                  {member.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-center bg-slate-900 dark:bg-slate-800 border-none text-white shadow-xl"
            >
              <p className="font-bold text-xs">{member.full_name}</p>
              <p className="text-[10px] text-slate-300 dark:text-slate-400 font-mono mt-0.5">
                {member.student_code}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {remainingCount > 0 && (
        <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 shadow-sm z-0">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
