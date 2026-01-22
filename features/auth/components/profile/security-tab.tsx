"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Loader2, KeyRound, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/features/auth/hooks/use-profile";
import {
  useRequestResetOtp,
  useResetPassword,
} from "@/features/auth/hooks/use-forgot-password";

export function SecurityTab() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { data: profileData } = useProfile();
  const user = profileData?.user;

  const { mutate: requestOtp, isPending: isSendingOtp } = useRequestResetOtp(
    () => {
      setIsOtpSent(true);
    },
  );

  const { mutate: resetPass, isPending: isResetting } = useResetPassword();

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSecurityForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleRequestOtp = () => {
    if (!user?.email || !user?.role) return;
    if (user.role === "ADMIN") {
      toast.error("Admin không thể tự đổi mật khẩu qua OTP.");
      return;
    }
    requestOtp({ email: user.email, role: user.role });
  };

  const handleSubmitPasswordChange = () => {
    if (!user?.email) return;
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    resetPass({
      email: user.email,
      otp_code: securityForm.otp,
      new_password: securityForm.newPassword,
      confirm_password: securityForm.confirmPassword,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-2 duration-300">
      {/* Change Password Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>
            Để bảo mật, hệ thống yêu cầu xác thực OTP gửi về email trước khi đổi
            mật khẩu.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isOtpSent ? (
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-200">
                <Shield className="h-6 w-6 text-slate-500" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Bảo mật 2 lớp</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Gửi mã OTP 6 chữ số đến{" "}
                  <span className="font-semibold">{user?.email}</span>
                </p>
              </div>
              <Button
                onClick={handleRequestOtp}
                disabled={isSendingOtp}
                className="bg-[#F27124] hover:bg-[#d65d1b]"
              >
                {isSendingOtp ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSendingOtp ? "Đang gửi..." : "Gửi mã xác thực"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md text-sm flex items-center mb-4 border border-green-200">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Mã OTP đã được gửi.
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP (6 số)</Label>
                <div className="relative">
                  <Input
                    id="otp"
                    value={securityForm.otp}
                    onChange={handleSecurityChange}
                    placeholder="123456"
                    maxLength={6}
                    className="tracking-widest font-bold pl-10"
                  />
                  <KeyRound className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    placeholder="••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Nhập lại</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    placeholder="••••••"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {isOtpSent && (
          <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end gap-3 rounded-b-xl">
            <Button
              variant="ghost"
              onClick={() => setIsOtpSent(false)}
              disabled={isResetting}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmitPasswordChange}
              disabled={isResetting}
              className="bg-[#F27124] hover:bg-[#d65d1b] shadow-md"
            >
              {isResetting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Xác nhận thay đổi"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
