"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LeaderCommits } from "@/components/features/commits/student-commits";

export default function LeaderCommitListPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeader, setIsLeader] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeader(leaderStatus);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="max-w-6xl mx-auto py-8 px-4 md:px-0" />;
  }

  // Logic cũ: Chỉ LEADER và MEMBER mới được truy cập
  // Logic mới: STUDENT (đã có role hệ thống) đều vào được, component con sẽ tự xử lý view
  // Tuy nhiên, nếu muốn giữ UX cũ (chặn truy cập nếu role không phù hợp), ta có thể check role hệ thống.
  // Ở đây giả sử STUDENT là role hệ thống cho cả Leader và Member.
  
  if (role !== "STUDENT") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Lịch sử Commit</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Sinh viên.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài khoản Sinh viên.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <LeaderCommits isLeader={isLeader} />;
}
