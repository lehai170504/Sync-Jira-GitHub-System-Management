"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link2, ShieldAlert } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/use-profile";

export function MissingIntegrationsAlert() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: profile, isLoading } = useProfile();
  const user = profile?.user;
  const isStudent = user?.role === "STUDENT";

  const linkedGithub = !!user?.integrations?.github;
  const linkedJira = !!user?.integrations?.jira;
  const bothMissing = !linkedGithub && !linkedJira;
  const isOnProfilePage = pathname?.startsWith("/profile");

  const sessionKey = useMemo(
    () => (user?._id ? `missing_integrations_alert_seen:${user._id}` : ""),
    [user?._id],
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading || !user || !sessionKey) return;
    if (!isStudent) return;
    if (!bothMissing) return;
    if (isOnProfilePage) return;
    const seen = sessionStorage.getItem(sessionKey) === "true";
    if (!seen) setOpen(true);
  }, [isLoading, user, sessionKey, bothMissing, isOnProfilePage, isStudent]);

  if (!user || !isStudent) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[560px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Bạn chưa tích hợp GitHub và Jira
          </DialogTitle>
        </DialogHeader>

        <Alert className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
          <AlertTitle>Khuyến nghị bắt buộc</AlertTitle>
          <AlertDescription>
            Vui lòng kết nối GitHub + Jira để đồng bộ commit/task và nhận cập nhật realtime đầy đủ.
            Khi đã đăng nhập GitHub, hệ thống gán commit về đúng tên thành viên; nhớ hoàn tất liên kết
            trước khi demo hoặc chấm điểm.
          </AlertDescription>
        </Alert>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (sessionKey) sessionStorage.setItem(sessionKey, "true");
              setOpen(false);
            }}
          >
            Để sau
          </Button>
          <Button
            onClick={() => {
              if (sessionKey) sessionStorage.setItem(sessionKey, "true");
              setOpen(false);
              router.push("/profile");
            }}
          >
            <Link2 className="h-4 w-4 mr-2" />
            Đi tới tích hợp ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

