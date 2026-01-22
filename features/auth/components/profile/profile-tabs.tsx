"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from "./profile-info-tab";
import { SecurityTab } from "./security-tab";

export function ProfileTabs() {
  const tabTriggerStyle =
    "rounded-full border border-transparent px-6 py-2.5 font-medium text-muted-foreground transition-all hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-[#F27124] data-[state=active]:text-white data-[state=active]:shadow-sm text-sm";

  return (
    <div className="flex-1">
      <Tabs defaultValue="general" className="w-full">
        <div className="mb-6 overflow-x-auto scrollbar-none pb-1">
          <TabsList className="bg-transparent p-0 h-auto w-full justify-start space-x-2 min-w-max">
            <TabsTrigger value="general" className={tabTriggerStyle}>
              Thông tin chung
            </TabsTrigger>
            <TabsTrigger value="security" className={tabTriggerStyle}>
              Bảo mật & Tài khoản
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="general"
          className="mt-0 focus-visible:outline-none"
        >
          <ProfileInfoTab />
        </TabsContent>

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
