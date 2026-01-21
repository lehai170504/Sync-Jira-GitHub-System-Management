"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LeaderCommits } from "@/components/features/commits/student-commits";

export default function LeaderCommitListPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="max-w-6xl mx-auto py-8 px-4 md:px-0" />;
  }

  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Commit History</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để xem lịch sử commit của nhóm.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài khoản Leader nếu
            muốn xem lịch sử commit.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <LeaderCommits />;
}
