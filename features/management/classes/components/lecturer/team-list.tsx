"use client";

import { useState } from "react";
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
  // State quản lý Dialog
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetail = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Đang tải danh sách nhóm...
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
        <Users className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">
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
            className="group hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 rounded-2xl border-gray-100 overflow-hidden relative cursor-pointer"
            onClick={() => handleViewDetail(team._id)}
          >
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors pointer-events-none" />

            <CardHeader className="bg-gray-50/50 pb-3 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <CardTitle
                  className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-[#F27124] transition-colors"
                  title={team.project_name}
                >
                  {team.project_name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-white text-xs font-bold text-emerald-600 border-emerald-100"
                >
                  Đang hoạt động
                </Badge>
              </div>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                ID: {team._id.slice(-6)}
              </p>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${team.github_repo_url ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-xs text-gray-500 font-medium">
                  {team.github_repo_url
                    ? "Đã kết nối Repository"
                    : "Chưa kết nối Repo"}
                </span>
              </div>

              {/* Action Buttons (ngăn sự kiện click lan ra Card cha) */}
              <div
                className="flex gap-2 pt-2"
                onClick={(e) => e.stopPropagation()}
              >
                {team.github_repo_url ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-gray-200 bg-white hover:bg-gray-50 hover:text-black h-9"
                    onClick={() => window.open(team.github_repo_url, "_blank")}
                  >
                    <SiGithub className="w-3.5 h-3.5" />
                    <span className="text-xs">GitHub</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-dashed text-gray-400 h-9"
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
                    className="flex-1 gap-2 border-blue-100 bg-blue-50/50 text-blue-600 hover:bg-blue-100 h-9"
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
                    className="flex-1 gap-2 border-dashed text-gray-400 h-9"
                    disabled
                  >
                    <SiJira className="w-3.5 h-3.5" />{" "}
                    <span className="text-xs">Jira</span>
                  </Button>
                )}
              </div>

              <div className="pt-2 border-t border-gray-50 flex justify-center">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 group-hover:text-[#F27124] transition-colors">
                  <Eye className="w-3 h-3" /> Xem chi tiết
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog Chi Tiết */}
      <TeamDetailSheet
        teamId={selectedTeamId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
