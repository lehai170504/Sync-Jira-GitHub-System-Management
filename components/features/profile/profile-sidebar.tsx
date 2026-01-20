"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Github, Linkedin } from "lucide-react";

export function ProfileSidebar() {
  return (
    <aside className="w-full md:w-1/4 space-y-6">
      {/* CARD 1: USER INFO */}
      <Card className="text-center overflow-hidden border-slate-200 shadow-sm">
        {/* Cover Background */}
        <div className="h-24 bg-gradient-to-r from-orange-400 to-red-500"></div>

        {/* Avatar Section */}
        <div className="relative -mt-12 flex justify-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-sm border border-white"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <CardContent className="pt-4 pb-6">
          <h2 className="text-xl font-bold text-gray-900">Nguyễn Văn Admin</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Admin Hệ thống
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="font-normal">
              Administrator
            </Badge>
            <Badge
              variant="outline"
              className="border-orange-200 text-orange-600 bg-orange-50 font-normal"
            >
              FPT Staff
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: SOCIAL LINKS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Liên kết xã hội
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm group cursor-pointer">
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
              <Github className="h-4 w-4 text-slate-700" />
            </div>
            <span className="text-muted-foreground group-hover:text-gray-900 transition-colors">
              @admin_dev
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm group cursor-pointer">
            <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
              <Linkedin className="h-4 w-4 text-blue-700" />
            </div>
            <span className="text-muted-foreground group-hover:text-gray-900 transition-colors">
              linkedin.com/in/admin
            </span>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
