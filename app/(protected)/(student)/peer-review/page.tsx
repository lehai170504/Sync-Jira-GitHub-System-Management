"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PeerReviewForm } from "@/components/features/peer-review/student-peer-review-form";

export default function PeerReviewPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeader, setIsLeader] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const roleFromCookie = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (roleFromCookie) setRole(roleFromCookie);
    setIsLeader(leaderStatus);
  }, []);

  if (!mounted) {
    return null;
  }

  // Cho phép STUDENT (đã có role hệ thống) truy cập
  // Logic cũ check LEADER/MEMBER (nhưng thực tế UserRole là STUDENT)
  if (role !== "STUDENT") {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn không có quyền truy cập trang này.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Có thể truyền isLeader vào form nếu cần
  return <PeerReviewForm />;
}

