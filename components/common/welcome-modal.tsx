"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  CheckCircle2,
  LayoutDashboard,
  Users,
  BookOpen,
  ShieldCheck,
  Briefcase,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { UserRole } from "@/components/layouts/sidebar-config";

interface WelcomeModalProps {
  role: UserRole;
  userName: string;
}

export function WelcomeModal({ role, userName }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("has_seen_welcome");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000); // Delay 1s để mượt hơn
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("has_seen_welcome", "true");
  };

  const getRoleContent = () => {
    switch (role) {
      case "ADMIN":
        return {
          title: "Chào mừng Quản trị viên!",
          description: "Hệ thống đã sẵn sàng để bạn quản lý toàn bộ học kỳ, lớp học và người dùng.",
          features: [
            { icon: LayoutDashboard, text: "Theo dõi tổng quan toàn hệ thống" },
            { icon: Settings, text: "Cấu hình học kỳ và môn học linh hoạt" },
            { icon: ShieldCheck, text: "Quản lý quyền và danh sách người dùng" },
          ],
          color: "from-violet-500 to-purple-600",
        };
      case "LECTURER":
        return {
          title: "Chào mừng Giảng viên!",
          description: "Bắt đầu quản lý lớp học và theo dõi tiến độ đồ án của sinh viên ngay hôm nay.",
          features: [
            { icon: BookOpen, text: "Quản lý danh sách lớp học và sinh viên" },
            { icon: Briefcase, text: "Theo dõi tiến độ đồ án qua Jira/Github" },
            { icon: CheckCircle2, text: "Đánh giá và tính điểm tự động" },
          ],
          color: "from-blue-500 to-indigo-600",
        };
      case "STUDENT":
      default:
        return {
          title: "Chào mừng Sinh viên!",
          description: "Chúc bạn có một học kỳ bùng nổ và hoàn thành đồ án thật xuất sắc.",
          features: [
            { icon: LayoutDashboard, text: "Theo dõi tiến độ nhiệm vụ (Tasks)" },
            { icon: Users, text: "Cập nhật thông tin nhóm và dự án" },
            { icon: CheckCircle2, text: "Tham gia đánh giá chéo đồng đội" },
          ],
          color: "from-orange-500 to-rose-600",
        };
    }
  };

  const content = getRoleContent();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900 shadow-2xl">
        <div className={`h-32 w-full bg-gradient-to-br ${content.color} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="absolute -bottom-6 -right-6 h-32 w-32 bg-white/10 rounded-full blur-2xl"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30 shadow-xl"
            >
              <Rocket className="h-10 w-10 text-white animate-bounce" />
            </motion.div>
          </div>
        </div>

        <div className="p-8 pt-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {content.title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2 text-base">
              Chào <span className="font-bold text-slate-900 dark:text-slate-200">{userName}</span>, {content.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Các tính năng chính của bạn
            </h4>
            <div className="grid gap-3">
              {content.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${content.color} text-white shadow-sm`}>
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-8 sm:justify-center">
            <Button
              onClick={handleClose}
              className={`w-full py-6 rounded-2xl bg-gradient-to-br ${content.color} text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border-none`}
            >
              Bắt đầu khám phá ngay
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
