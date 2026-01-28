"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  Mail,
  Loader2,
  User as UserIcon,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { useProfile } from "@/features/auth/hooks/use-profile";

export function ProfileSidebar() {
  const { data, isLoading, isError } = useProfile();
  const user = data?.user;

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

  if (isLoading) {
    return (
      <div className="space-y-6 w-full font-mono">
        <Card className="h-[400px] flex flex-col items-center justify-center border-slate-200/60 rounded-[32px] bg-white shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-[#F27124] opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">
            Loading_Profile...
          </p>
        </Card>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="w-full font-mono">
        <Card className="p-8 text-center text-slate-400 border-slate-200/60 rounded-[32px] uppercase font-bold text-xs tracking-widest bg-white">
          Error_Fetch_User_Data
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full font-mono">
      {/* CARD 1: IDENTITY CARD */}
      <Card className="overflow-hidden border-slate-200/60 rounded-[32px] bg-white shadow-sm transition-all hover:shadow-md">
        <div className="h-28 bg-[#0B0F1A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F27124_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Avatar Section */}
        <div className="relative -mt-14 flex justify-center">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-[6px] border-white shadow-xl bg-white rounded-[32px]">
              <AvatarImage src={user.avatar_url} className="object-cover" />
              <AvatarFallback className="text-3xl font-black bg-orange-50 text-[#F27124]">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-1 -right-1 rounded-2xl h-9 w-9 shadow-lg bg-[#F27124] hover:bg-[#d65d1b] text-white border-4 border-white transition-transform group-hover:scale-110"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="pt-5 pb-8 text-center">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter line-clamp-1">
            {user.full_name}
          </h2>

          <div className="mt-6 flex flex-col gap-2">
            <Badge className="w-full justify-center py-1.5 bg-slate-900 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-[0.1em]">
              {getRoleDisplayName(user.role)}
            </Badge>

            {user.is_verified && (
              <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Verified_Account
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: CONTACT & METADATA */}
      <Card className="border-slate-200/60 rounded-[32px] bg-white shadow-sm overflow-hidden">
        <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Fingerprint className="w-3.5 h-3.5 text-[#F27124]" />
            Thông tin hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          {/* Email */}
          <div className="group space-y-1.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Email_Address
            </p>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-transparent group-hover:border-orange-100 group-hover:bg-white transition-all">
              <Mail className="h-4 w-4 text-[#F27124]" />
              <span className="text-[12px] font-bold text-slate-700 truncate lowercase">
                {user.email}
              </span>
            </div>
          </div>

          {/* Major */}
          {(user as any).major && (
            <div className="group space-y-1.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Academic_Major
              </p>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-transparent group-hover:border-blue-100 group-hover:bg-white transition-all">
                <UserIcon className="h-4 w-4 text-blue-500" />
                <span className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">
                  {(user as any).major}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
