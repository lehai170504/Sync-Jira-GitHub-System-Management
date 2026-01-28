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

  const tabTriggerStyle = cn(
    "relative flex items-center gap-3 px-8 py-4 font-black uppercase text-[11px] tracking-[0.2em] transition-all",
    "text-slate-400 border-b-2 border-transparent",
    "hover:text-slate-900 hover:bg-slate-50/50",
    "data-[state=active]:text-[#F27124] data-[state=active]:border-[#F27124] data-[state=active]:bg-white",
  );

  if (isLoading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F27124] opacity-20" />
      </div>
    );
  }

  return (
    <div className="w-full font-mono">
      <Tabs defaultValue="general" className="w-full">
        {/* --- NAVIGATION LIST --- */}
        <div className="border-b border-slate-100 mb-10 overflow-x-auto scrollbar-hide">
          <TabsList className="bg-transparent p-0 h-auto w-full justify-start space-x-0 min-w-max">
            <TabsTrigger value="general" className={tabTriggerStyle}>
              <User className="w-4 h-4" />
              Thông tin chung
            </TabsTrigger>

            {/* Chỉ hiện tab Tích hợp nếu là Sinh viên */}
            {userRole === "STUDENT" && (
              <TabsTrigger value="integration" className={tabTriggerStyle}>
                <Zap className="w-4 h-4" />
                Kết nối & Tích hợp
              </TabsTrigger>
            )}

            <TabsTrigger value="security" className={tabTriggerStyle}>
              <ShieldCheck className="w-4 h-4" />
              Bảo mật & Tài khoản
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <TabsContent
            value="general"
            className="mt-0 outline-none border-none"
          >
            {/* Truyền dữ liệu user vào Tab Info để xử lý hiển thị linh hoạt */}
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
