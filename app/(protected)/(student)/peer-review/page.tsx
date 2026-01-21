"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PeerReviewForm } from "@/components/features/peer-review/student-peer-review-form";

export default function PeerReviewPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const roleFromCookie = Cookies.get("user_role") as UserRole;
    if (roleFromCookie) setRole(roleFromCookie);
  }, []);

  if (!mounted) {
    return null;
  }

  // Chỉ LEADER và MEMBER mới được truy cập
  if (role !== "LEADER" && role !== "MEMBER") {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Chỉ LEADER và MEMBER mới có quyền truy cập trang này.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <PeerReviewForm />;
}

