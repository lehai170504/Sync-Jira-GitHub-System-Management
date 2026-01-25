"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { AlertCircle } from "lucide-react";

// Imports từ components con
import { MappingHeader } from "@/features/student/components/mapping/mapping-header";
import { MappingTable } from "@/features/student/components/mapping/mapping-table";
import { MappingDialog } from "@/features/student/components/mapping/mapping-dialog";

// Hooks & Types
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import {
  useTeamMembers,
  useUpdateMapping,
} from "@/features/student/hooks/use-team-members";
import { TeamMember } from "@/features/student/types/member-types";

export default function AccountMappingPage() {
  // --- 1. Lấy Context ---
  const classId = Cookies.get("student_class_id");
  const myTeamName = Cookies.get("student_team_name");
  const currentStudentId = Cookies.get("student_id");
  const isLeader = Cookies.get("student_is_leader") === "true";

  // --- 2. Logic Data ---
  const { data: teamsData, isLoading: isTeamLoading } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find(
    (t: any) => t.project_name === myTeamName,
  );
  const teamId = myTeamInfo?._id;

  const { data: membersData, isLoading: isMembersLoading } =
    useTeamMembers(teamId);
  const { mutate: updateMapping, isPending: isUpdating } = useUpdateMapping(
    teamId || "",
  );

  // --- 3. State Management ---
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- 4. Handlers ---
  const handleEditClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleSave = (data: { jira: string; github: string }) => {
    if (!selectedMember) return;
    updateMapping(
      {
        memberId: selectedMember._id,
        data: {
          jira_account_id: data.jira,
          github_username: data.github,
        },
      },
      {
        onSuccess: () => setIsDialogOpen(false),
      },
    );
  };

  const isLoading = isTeamLoading || isMembersLoading;

  if (!teamId && !isLoading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center text-gray-400 gap-4 animate-in fade-in zoom-in-95">
        <div className="p-6 bg-slate-50 rounded-full">
          <AlertCircle className="h-12 w-12 text-slate-300" />
        </div>
        <p className="text-lg font-medium">
          Không tìm thấy thông tin nhóm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-8 md:p-10 space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="max-w-4xl">
        <MappingHeader />
      </div>

      <MappingTable
        members={membersData?.members || []}
        isLoading={isLoading}
        currentStudentId={currentStudentId}
        isLeader={isLeader}
        onEdit={handleEditClick}
      />

      <MappingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={selectedMember}
        onSubmit={handleSave}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
