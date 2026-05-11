"use client";

import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useEffect, useState, useMemo } from "react";

/**
 * Hook để lấy classId đang hoạt động.
 * Thứ tự ưu tiên: 
 * 1. URL search params (?classId=...)
 * 2. Cookie theo role (lecturer_class_id hoặc student_class_id)
 */
export function useActiveClassId() {
  const searchParams = useSearchParams();
  const { data: profile } = useProfile();
  const user = profile?.user;
  
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  const urlClassId = searchParams.get("classId");
  
  useEffect(() => {
    // 1. Nếu có trong URL, ưu tiên số 1 và lưu vào cookie tương ứng
    if (urlClassId) {
      setActiveId(urlClassId);
      if (user?.role === "LECTURER") {
        Cookies.set("lecturer_class_id", urlClassId);
      } else if (user?.role === "STUDENT") {
        Cookies.set("student_class_id", urlClassId);
      }
      return;
    }

    // 2. Nếu không có URL, check cookie theo role
    let cookieId: string | undefined = undefined;
    if (user?.role === "LECTURER") {
      cookieId = Cookies.get("lecturer_class_id");
    } else if (user?.role === "STUDENT") {
      cookieId = Cookies.get("student_class_id");
    }

    if (cookieId) {
      setActiveId(cookieId);
    }
  }, [urlClassId, user?.role]);

  return activeId;
}
