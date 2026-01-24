"use client";

import { Separator } from "@/components/ui/separator";
import { ProfileSidebar } from "@/features/auth/components/profile/profile-sidebar";
import { ProfileTabs } from "@/features/auth/components/profile/profile-tabs";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">
          Hồ sơ cá nhân
        </h3>
        <p className="text-muted-foreground mt-1 text-lg">
          Quản lý thông tin định danh và hiển thị công khai của bạn.
        </p>
      </div>

      <Separator className="my-6" />

      {/* CONTENT LAYOUT */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* LEFT COLUMN */}
        <ProfileSidebar />

        {/* RIGHT COLUMN */}
        <ProfileTabs />
      </div>
    </div>
  );
}
