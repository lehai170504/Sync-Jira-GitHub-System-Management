"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from "./profile-info-tab";
import { SecurityTab } from "./security-tab";
import { IntegrationTab } from "./integration-tab";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { cn } from "@/lib/utils";
import { User, ShieldCheck, Zap, Loader2 } from "lucide-react";

export function ProfileTabs() {
  const { data: profile, isLoading } = useProfile();
  const user = profile?.user;
  const userRole = user?.role;

  // UX Fix: Đổi style sang dạng "Nút" (Pill) thay vì gạch chân. Dễ bấm trên điện thoại hơn.
  const tabTriggerStyle = cn(
    "relative flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all duration-300",
    "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50",
    "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900",
    "data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400",
    "data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 dark:data-[state=active]:border-slate-800",
  );

  if (isLoading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 opacity-80" />
      </div>
    );
  }

  return (
    <div className="w-full font-mono transition-colors duration-300">
      <Tabs defaultValue="general" className="w-full">
        {/* --- NAVIGATION LIST --- */}
        <div className="mb-10 overflow-x-auto scrollbar-hide pb-2">
          <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1.5 h-auto rounded-[24px] inline-flex min-w-max border border-slate-200/50 dark:border-slate-800">
            <TabsTrigger value="general" className={tabTriggerStyle}>
              <User className="w-4 h-4" />
              Thông tin chung
            </TabsTrigger>

            {userRole === "STUDENT" && (
              <TabsTrigger value="integration" className={tabTriggerStyle}>
                <Zap className="w-4 h-4" />
                Kết nối & Tích hợp
              </TabsTrigger>
            )}

            <TabsTrigger value="security" className={tabTriggerStyle}>
              <ShieldCheck className="w-4 h-4" />
              Bảo mật tài khoản
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TabsContent
            value="general"
            className="mt-0 outline-none border-none"
          >
            <ProfileInfoTab user={user} />
          </TabsContent>

          {userRole === "STUDENT" && (
            <TabsContent
              value="integration"
              className="mt-0 outline-none border-none"
            >
              <IntegrationTab />
            </TabsContent>
          )}

          <TabsContent
            value="security"
            className="mt-0 outline-none border-none"
          >
            <SecurityTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
