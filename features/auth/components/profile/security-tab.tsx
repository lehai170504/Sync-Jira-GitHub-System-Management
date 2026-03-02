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
import {
  Shield,
  Loader2,
  KeyRound,
  Send,
  CheckCircle2,
  Lock,
} from "lucide-react";
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
    if (user.role === "STUDENT" || user.role === "LECTURER") {
      requestOtp({ email: user.email, role: user.role });
    }
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <Card className="border-slate-200/60 dark:border-slate-800 rounded-[32px] bg-white dark:bg-slate-900 shadow-sm transition-colors overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Shield className="w-6 h-6 text-orange-500" />
            Đổi mật khẩu bảo mật
          </CardTitle>
          <CardDescription className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
            Hệ thống yêu cầu xác thực OTP gửi về email trước khi đổi mật khẩu.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {!isOtpSent ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[24px] border border-slate-200/60 dark:border-slate-800 text-center space-y-6 transition-colors max-w-md mx-auto">
              <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-md border border-slate-100 dark:border-slate-700 transition-transform hover:scale-110 duration-300">
                <Lock className="h-8 w-8 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                  Xác thực danh tính
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Mã OTP 6 chữ số sẽ được gửi an toàn đến email: <br />
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mt-1">
                    {user?.email}
                  </span>
                </p>
              </div>
              <Button
                onClick={handleRequestOtp}
                disabled={isSendingOtp}
                className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-orange-500 dark:hover:bg-orange-500 text-white dark:text-slate-900 hover:text-white transition-all font-bold tracking-widest uppercase text-xs"
              >
                {isSendingOtp ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSendingOtp ? "Đang gửi OTP..." : "Gửi mã xác thực"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center border border-emerald-200 dark:border-emerald-900/50 transition-colors">
                <CheckCircle2 className="h-5 w-5 mr-3" />
                Mã OTP đã được gửi đến email của bạn.
              </div>

              <div className="space-y-2.5 group">
                <Label
                  htmlFor="otp"
                  className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                >
                  Mã xác thực OTP (6 số)
                </Label>
                <div className="relative">
                  <Input
                    id="otp"
                    value={securityForm.otp}
                    onChange={handleSecurityChange}
                    placeholder="123456"
                    maxLength={6}
                    // Bỏ text-center để thẳng hàng với input mật khẩu
                    className="pl-12 h-14 rounded-2xl tracking-[0.5em] font-black text-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-all hover:border-orange-300 dark:hover:border-orange-700 focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-500/10 peer"
                  />
                  {/* Sử dụng top-1/2 -translate-y-1/2 để căn giữa icon */}
                  <KeyRound className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5 group">
                  <Label
                    htmlFor="newPassword"
                    className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                  >
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                      placeholder="••••••••"
                      className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold transition-all hover:border-orange-300 dark:hover:border-orange-700 focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-500/10 peer"
                    />
                    <Lock className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-orange-500" />
                  </div>
                </div>

                <div className="space-y-2.5 group">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                  >
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      placeholder="••••••••"
                      className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold transition-all hover:border-orange-300 dark:hover:border-orange-700 focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-500/10 peer"
                    />
                    <Lock className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {isOtpSent && (
          <CardFooter className="bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 p-8 flex justify-end gap-4 transition-colors">
            <Button
              variant="outline"
              onClick={() => setIsOtpSent(false)}
              disabled={isResetting}
              className="h-14 rounded-2xl px-8 font-bold uppercase tracking-widest text-xs text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmitPasswordChange}
              disabled={isResetting}
              className="h-14 rounded-2xl px-10 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-xs shadow-md transition-all active:scale-95"
            >
              {isResetting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Shield className="mr-2 h-5 w-5" />
              )}
              Lưu mật khẩu mới
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
