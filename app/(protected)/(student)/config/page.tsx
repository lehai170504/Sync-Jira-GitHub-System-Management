"use client";

import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";
import { Settings, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TeamConfigForm } from "@/components/features/config/team-config-form";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useTeamMembers } from "@/features/student/hooks/use-team-members";

export default function ConfigPage() {
  // Khởi tạo isLeader từ cookie ngay từ đầu
  const leaderCookie = Cookies.get("student_is_leader") === "true";
  const [isLeader, setIsLeader] = useState(leaderCookie);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const currentStudentId = Cookies.get("student_id");
  const classId = Cookies.get("student_class_id");
  const myTeamName = Cookies.get("student_team_name");

  const { data: myClassesData, isLoading: isClassesLoading } = useMyClasses();
  const { data: teamsData, isLoading: isTeamLoading } = useClassTeams(classId);
  const { data: membersData, isLoading: isMembersLoading } = useTeamMembers(teamId);

  // Lấy teamId từ class hoặc teams data
  useEffect(() => {
    if (classId && myClassesData?.classes) {
      const currentClass = myClassesData.classes.find(
        (cls) => cls.class._id === classId
      );
      if (currentClass?.team_id) {
        setTeamId(currentClass.team_id);
      }
    } else if (teamsData?.teams && teamsData.teams.length > 0) {
      const myTeam = teamsData.teams.find(
        (t: any) => t.project_name === myTeamName
      );
      if (myTeam?._id) {
        setTeamId(myTeam._id);
      } else if (teamsData.teams[0]?._id) {
        setTeamId(teamsData.teams[0]._id);
      }
    }
  }, [classId, myClassesData, teamsData, myTeamName]);

  // Kiểm tra isLeader từ members data (ưu tiên API, fallback về cookie)
  useEffect(() => {
    if (membersData?.members && currentStudentId) {
      const currentMember = membersData.members.find(
        (m) => m.student._id === currentStudentId
      );
      if (currentMember) {
        // Ưu tiên dùng API data
        setIsLeader(currentMember.role_in_team === "Leader");
      }
      // Nếu không tìm thấy trong API, giữ nguyên giá trị từ cookie (đã set ở useState)
    }
    
    // Set loading = false khi đã có đủ data hoặc đã có cookie
    if (!isClassesLoading && !isTeamLoading && (teamId || leaderCookie)) {
      // Nếu không có teamId nhưng có cookie leader, vẫn cho phép truy cập
      if (!teamId && leaderCookie) {
        setIsLoading(false);
      } else if (teamId && (!isMembersLoading || membersData)) {
        setIsLoading(false);
      }
    }
  }, [membersData, currentStudentId, isClassesLoading, isTeamLoading, isMembersLoading, teamId, leaderCookie]);

  // Loading state - chỉ loading khi đang fetch data và chưa có cookie leader
  if (isLoading && !leaderCookie) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Kiểm tra quyền truy cập - chỉ dành cho Leader
  if (!isLeader) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
        {/* HEADER */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Cấu hình tích hợp
              </h2>
              <p className="text-muted-foreground mt-1">
                Kết nối và quản lý tích hợp với Jira và GitHub để đồng bộ dữ liệu dự án.
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertCircle className="h-4 w-4 text-gray-600" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Trang này chỉ dành cho Leader để cấu hình tích hợp Jira và GitHub cho team.
            Vui lòng liên hệ Leader nếu cần hỗ trợ.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Cấu hình tích hợp
            </h2>
            <p className="text-muted-foreground mt-1">
              Cấu hình tích hợp với Jira và GitHub để đồng bộ dữ liệu dự án cho team.
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* MAIN CONTENT */}
      <TeamConfigForm teamId={teamId} />
    </div>
  );
}

