"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Import các tab components
import { ProfileInfoTab } from "./profile-info-tab";
import { SecurityTab } from "./security-tab";
import { IntegrationTab } from "./integration-tab";

// 1. Import Hook lấy thông tin user
import { useProfile } from "@/features/auth/hooks/use-profile";

export function ProfileTabs() {
  const tabTriggerStyle =
    "rounded-full border border-transparent px-6 py-2.5 font-medium text-muted-foreground transition-all hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-[#F27124] data-[state=active]:text-white data-[state=active]:shadow-sm text-sm whitespace-nowrap";

  // 2. Lấy role từ profile (Realtime)
  const { data: profile } = useProfile();
  const userRole = profile?.user?.role;

  return (
    <div className="flex-1">
      <Tabs defaultValue="general" className="w-full">
        {/* Scrollable Tabs List */}
        <div className="mb-8 overflow-x-auto scrollbar-none pb-1">
          <TabsList className="bg-transparent p-0 h-auto w-full justify-start space-x-2 min-w-max">
            <TabsTrigger value="general" className={tabTriggerStyle}>
              Thông tin chung
            </TabsTrigger>

            {userRole === "STUDENT" && (
              <TabsTrigger value="integration" className={tabTriggerStyle}>
                Kết nối & Tích hợp
              </TabsTrigger>
            )}

            <TabsTrigger value="security" className={tabTriggerStyle}>
              Bảo mật & Tài khoản
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- Content: Thông tin chung --- */}
        <TabsContent
          value="general"
          className="mt-0 focus-visible:outline-none"
        >
          <ProfileInfoTab />
        </TabsContent>

        {/* 4. LOGIC ẨN/HIỆN CONTENT: Bảo vệ cả nội dung bên trong */}
        {userRole === "STUDENT" && (
          <TabsContent
            value="integration"
            className="mt-0 focus-visible:outline-none"
          >
            <IntegrationTab />
          </TabsContent>
        )}

        {/* --- Content: Bảo mật --- */}
        <TabsContent
          value="security"
          className="mt-0 focus-visible:outline-none"
        >
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
