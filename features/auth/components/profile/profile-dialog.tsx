"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, Zap, Loader2, Camera, X } from "lucide-react";

import { useProfile } from "@/features/auth/hooks/use-profile";
import { cn } from "@/lib/utils";

import { ProfileInfoTab } from "./profile-info-tab";
import { IntegrationTab } from "./integration-tab";
import { SecurityTab } from "./security-tab";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { data: profile, isLoading, isError } = useProfile();
  const user = profile?.user;
  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState("general");

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "LECTURER":
        return "Giảng viên";
      case "STUDENT":
        return "Sinh viên";
      default:
        return "Người dùng";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  const tabTriggerStyle = cn(
    "relative flex-1 flex justify-center items-center gap-2 py-3 font-bold text-xs uppercase tracking-wider transition-all",
    "text-slate-500 dark:text-slate-400 border-b-2 border-transparent",
    "hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
    "data-[state=active]:text-[#F27124] dark:data-[state=active]:text-orange-400",
    "data-[state=active]:border-[#F27124] dark:data-[state=active]:border-orange-400",
    "data-[state=active]:bg-transparent",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-none shadow-2xl rounded-3xl md:rounded-[40px] flex flex-col max-h-[90vh] transition-colors">
        {/* Nút tắt custom (Đè lên nút X mặc định của Shadcn) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-black/10 hover:bg-black/20 text-white backdrop-blur-md"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </Button>

        {isLoading ? (
          <div className="h-[400px] flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#F27124] opacity-50" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">
              Đang tải hồ sơ...
            </p>
          </div>
        ) : isError || !user ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400 font-bold text-sm uppercase tracking-widest">
            Lỗi tải dữ liệu người dùng
          </div>
        ) : (
          <>
            {/* --- HEADER: AVATAR & INFO (Rút gọn từ Sidebar cũ) --- */}
            <div className="relative shrink-0">
              {/* Background Cover */}
              <div className="h-32 bg-[#0B0F1A] dark:bg-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F27124_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
              </div>

              {/* User Info (Đẩy lên đè qua background) */}
              <div className="relative -mt-12 px-8 pb-6 flex items-end gap-5">
                <div className="relative group shrink-0">
                  <Avatar className="h-24 w-24 border-[4px] border-white dark:border-slate-950 shadow-lg bg-white dark:bg-slate-800 rounded-2xl transition-colors">
                    <AvatarImage
                      src={user.avatar_url}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-black bg-orange-50 dark:bg-orange-900/30 text-[#F27124] dark:text-orange-400">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-xl h-8 w-8 shadow-md bg-[#F27124] hover:bg-[#d65d1b] text-white border-2 border-white dark:border-slate-950 transition-all group-hover:scale-110"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <DialogTitle className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                      {user.full_name}
                    </DialogTitle>
                    {user.is_verified && (
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-none px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                      {getRoleDisplayName(userRole)}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BODY: TABS --- */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0" // min-h-0 quan trọng để ScrollArea hoạt động
            >
              {/* Tab Navigation */}
              <div className="px-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <TabsList className="bg-transparent p-0 h-auto w-full flex">
                  <TabsTrigger value="general" className={tabTriggerStyle}>
                    <User className="w-4 h-4 mb-0.5" />
                    <span className="hidden sm:inline">Thông tin chung</span>
                  </TabsTrigger>

                  {userRole === "STUDENT" && (
                    <TabsTrigger
                      value="integration"
                      className={tabTriggerStyle}
                    >
                      <Zap className="w-4 h-4 mb-0.5" />
                      <span className="hidden sm:inline">Tích hợp</span>
                    </TabsTrigger>
                  )}

                  <TabsTrigger value="security" className={tabTriggerStyle}>
                    <ShieldCheck className="w-4 h-4 mb-0.5" />
                    <span className="hidden sm:inline">Bảo mật</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-900/30">
                <TabsContent
                  value="general"
                  className="m-0 border-none outline-none"
                >
                  {/* Truyền callback đóng modal nếu cần sau khi save */}
                  <ProfileInfoTab
                    user={user}
                    onSuccess={() => onOpenChange(false)}
                  />
                </TabsContent>

                {userRole === "STUDENT" && (
                  <TabsContent
                    value="integration"
                    className="m-0 border-none outline-none"
                  >
                    <IntegrationTab />
                  </TabsContent>
                )}

                <TabsContent
                  value="security"
                  className="m-0 border-none outline-none"
                >
                  <SecurityTab />
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
