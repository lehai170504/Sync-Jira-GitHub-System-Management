"use client";

import { use } from "react"; // <--- 1. Thêm import này
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamDetailView } from "@/components/features/lecturer/team-detail-view";

// Mock helper to get team name
const getTeamNameById = (id: string) => {
  if (id.includes("t1")) return "Team 1: E-Commerce";
  if (id.includes("t2")) return "Team 2: LMS System";
  if (id.includes("t3")) return "Team 3: Grab Clone";
  return "Unknown Team";
};

// 2. Sửa type của params thành Promise
export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const router = useRouter();

  // 3. Dùng use() để lấy teamId từ Promise
  const { teamId } = use(params);

  const teamName = getTeamNameById(teamId);

  return (
    <div className="space-y-4 animate-in fade-in-50 pb-10">
      {/* NAVIGATION HEADER */}
      <div className="flex items-center gap-2 py-1 border-b border-transparent">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 pl-0 gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách nhóm
        </Button>
      </div>

      {/* COMPONENT CHI TIẾT */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[800px] p-6">
        <TeamDetailView
          teamId={teamId} // Truyền teamId đã unwrap vào đây
          teamName={teamName}
        />
      </div>
    </div>
  );
}
