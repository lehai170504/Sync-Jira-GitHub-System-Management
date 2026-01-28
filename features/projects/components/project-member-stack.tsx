"use client"; // Cần use client vì dùng Tooltip

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
      <span className="text-xs text-slate-400 font-medium italic pl-1">
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
              <Avatar className="h-9 w-9 border-2 border-white cursor-pointer transition-transform hover:scale-110 hover:z-10 shadow-sm ring-1 ring-slate-100">
                <AvatarImage src={member.avatar_url} className="object-cover" />
                <AvatarFallback className="bg-slate-100 text-slate-500 text-[9px] font-black">
                  {member.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-center">
              <p className="font-bold text-xs">{member.full_name}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {member.student_code}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {remainingCount > 0 && (
        <div className="h-9 w-9 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm z-0">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
