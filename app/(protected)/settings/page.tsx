"use client";

import { Separator } from "@/components/ui/separator";
import { AppearanceSettings } from "@/components/features/settings/appearance-card";
import { NotificationSettings } from "@/components/features/settings/notification-card";
import { OperationalSettings } from "@/components/features/settings/operational-card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">
          Cài đặt hệ thống
        </h3>
        <p className="text-muted-foreground mt-1 text-lg">
          Cấu hình giao diện, thông báo và các tham số vận hành của SyncSystem.
        </p>
      </div>

      <Separator className="my-6" />

      {/* SETTINGS GRID */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Row 1: Appearance & Notification */}
        <div className="space-y-6 lg:contents">
          <AppearanceSettings />
          <NotificationSettings />
        </div>

        {/* Row 2: Operational (Full Width in Grid logic defined in component col-span-2) */}
        <OperationalSettings />
      </div>
    </div>
  );
}
