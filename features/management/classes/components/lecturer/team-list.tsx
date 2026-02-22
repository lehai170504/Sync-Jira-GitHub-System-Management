"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Users, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/features/student/types/team-types";
import { TeamDetailSheet } from "./team-detail-sheet";
import { SiGithub, SiJira } from "react-icons/si";

interface TeamListProps {
  teams: Team[];
  isLoading: boolean;
}

export function TeamList({ teams, isLoading }: TeamListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedTeamId = searchParams.get("teamId");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsDialogOpen(!!selectedTeamId);
  }, [selectedTeamId]);

  const handleViewDetail = (teamId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("teamId", teamId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("teamId");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
    setIsDialogOpen(open);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium animate-pulse">
        Đang tải danh sách nhóm...
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
        <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Chưa có nhóm nào được tạo trong lớp này.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {teams.map((team) => (
          <Card
            key={team._id}
            className="group hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 rounded-2xl border-slate-100 dark:border-slate-800 overflow-hidden relative cursor-pointer bg-white dark:bg-slate-900"
            onClick={() => handleViewDetail(team._id)}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02] transition-colors pointer-events-none" />

            <CardHeader className="bg-slate-50/50 dark:bg-slate-950/50 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start">
                <CardTitle
                  className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-[#F27124] transition-colors"
                  title={team.project_name}
                >
                  {team.project_name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-white dark:bg-slate-900 text-xs font-bold text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 shadow-sm"
                >
                  Đang hoạt động
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
                ID: {team._id.slice(-6)}
              </p>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                    team.github_repo_url
                      ? "bg-green-500 text-green-500"
                      : "bg-slate-300 dark:bg-slate-600 text-slate-300 dark:text-slate-600"
                  }`}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {team.github_repo_url
                    ? "Đã kết nối Repository"
                    : "Chưa kết nối Repo"}
                </span>
              </div>

              <div
                className="flex gap-2 pt-2"
                onClick={(e) => e.stopPropagation()}
              >
                {team.github_repo_url ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white h-9 text-slate-700 dark:text-slate-300"
                    onClick={() => window.open(team.github_repo_url, "_blank")}
                  >
                    <SiGithub className="w-3.5 h-3.5" />
                    <span className="text-xs">GitHub</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-dashed text-slate-400 dark:text-slate-600 h-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                    disabled
                  >
                    <SiGithub className="w-3.5 h-3.5" />{" "}
                    <span className="text-xs">Link</span>
                  </Button>
                )}

                {team.jira_project_key ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 h-9"
                    onClick={() =>
                      team.jira_url && window.open(team.jira_url, "_blank")
                    }
                  >
                    <SiJira className="w-3.5 h-3.5" />
                    <span className="text-xs">{team.jira_project_key}</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-dashed text-slate-400 dark:text-slate-600 h-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                    disabled
                  >
                    <SiJira className="w-3.5 h-3.5" />{" "}
                    <span className="text-xs">Jira</span>
                  </Button>
                )}
              </div>

              <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 group-hover:text-[#F27124] transition-colors font-medium">
                  <Eye className="w-3 h-3" /> Xem chi tiết
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TeamDetailSheet
        teamId={selectedTeamId}
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
      />
    </>
  );
}
