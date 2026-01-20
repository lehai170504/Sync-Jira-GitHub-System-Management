"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Shield, User, GraduationCap, Users } from "lucide-react";
import Cookies from "js-cookie";
// --- CẤU HÌNH ROLE ---
// Export cái này để bên Sidebar có thể (tùy chọn) dùng chung Type
export const DEMO_ROLES = {
  ADMIN: {
    email: "admin@fpt.edu.vn",
    label: "Admin",
    icon: Shield,
    redirect: "/dashboard",
  },
  LECTURER: {
    email: "gv_hien@fpt.edu.vn",
    label: "Giảng viên",
    icon: GraduationCap,
    redirect: "/lecturer/courses",
  },
  LEADER: {
    email: "leader_team1@fpt.edu.vn",
    label: "Leader",
    icon: Users,
    redirect: "/dashboard",
  },
  MEMBER: {
    email: "sv_an@fpt.edu.vn",
    label: "Sinh viên",
    icon: User,
    redirect: "/dashboard",
  },
};

export type RoleKey = keyof typeof DEMO_ROLES;

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<RoleKey>("MEMBER");
  const [email, setEmail] = useState(DEMO_ROLES.MEMBER.email);

  useEffect(() => {
    setEmail(DEMO_ROLES[selectedRole].email);
  }, [selectedRole]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Giả lập Loading
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay giả 1s

      // ✅ 1. LƯU ROLE VÀO COOKIE
      // Cookie sẽ tồn tại 1 ngày (expires: 1)
      Cookies.set("user_role", selectedRole, { expires: 1 });
      Cookies.set("user_email", email, { expires: 1 }); // Lưu thêm email để hiển thị

      const targetPath = DEMO_ROLES[selectedRole].redirect;

      toast.success(
        `Đăng nhập thành công với vai trò ${DEMO_ROLES[selectedRole].label}!`
      );

      // ✅ 2. CHUYỂN TRANG
      router.push(targetPath);
      router.refresh(); // Refresh để Sidebar cập nhật lại Cookie mới
    });
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F172A]">
            <span className="text-[#F27124] font-bold text-xl">S</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">SyncSystem</CardTitle>
        <CardDescription>
          Đăng nhập để quản lý đồ án FPT University
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* ROLE SWITCHER */}
        <Tabs
          defaultValue="MEMBER"
          value={selectedRole}
          onValueChange={(v) => setSelectedRole(v as RoleKey)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted">
            {(Object.keys(DEMO_ROLES) as RoleKey[]).map((role) => {
              const Icon = DEMO_ROLES[role].icon;
              return (
                <TabsTrigger
                  key={role}
                  value={role}
                  className="data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm py-2"
                  title={DEMO_ROLES[role].label}
                >
                  <Icon className="h-4 w-4" />
                </TabsTrigger>
              );
            })}
          </TabsList>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Đang chọn vai trò:{" "}
            <span className="font-medium text-foreground">
              {DEMO_ROLES[selectedRole].label}
            </span>
          </p>
        </Tabs>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email FPT</Label>
            <Input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link href="#" className="text-xs text-[#F27124] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue="123456"
              disabled={isPending}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F27124] hover:bg-[#d65d1b]"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng nhập
          </Button>
        </form>

        <Button
          variant="outline"
          type="button"
          disabled={isPending}
          className="w-full"
        >
          Google Workspace
        </Button>
      </CardContent>

      <CardFooter>
        <p className="px-8 text-center text-xs text-muted-foreground w-full">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <Link href="#" className="underline">
            Điều khoản sử dụng
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
