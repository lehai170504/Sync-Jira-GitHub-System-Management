import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectMember } from "@/features/projects/types/types";

interface ProjectLeaderProps {
  leader: ProjectMember;
}

export function ProjectLeader({ leader }: ProjectLeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <AvatarImage src={leader?.avatar_url} />
        <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs">
          {leader?.full_name?.charAt(0) || "L"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">
          Nhóm trưởng
        </p>
        <p
          className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate"
          title={leader?.full_name}
        >
          {leader?.full_name || "Chưa có thông tin"}
        </p>
      </div>
    </div>
  );
}
