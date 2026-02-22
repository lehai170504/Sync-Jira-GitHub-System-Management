import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectMember } from "@/features/projects/types/types";

interface ProjectLeaderProps {
  leader: ProjectMember;
}

export function ProjectLeader({ leader }: ProjectLeaderProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800">
      <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm">
        <AvatarImage src={leader?.avatar_url} />
        <AvatarFallback className="bg-orange-100 dark:bg-orange-900/30 text-[#F27124] font-black text-xs">
          {leader?.full_name?.charAt(0) || "L"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
          Nhóm trưởng
        </p>
        <p
          className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate"
          title={leader?.full_name}
        >
          {leader?.full_name || "Unknown"}
        </p>
      </div>
    </div>
  );
}
