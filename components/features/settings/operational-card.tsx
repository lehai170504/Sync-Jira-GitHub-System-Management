"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Loader2,
  Save,
  Database as DbIcon,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

export function OperationalSettings() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success("HỆ THỐNG: Cấu hình vận hành đã được cập nhật!");
  };

  return (
    <div className="w-full font-mono">
      <div className="grid gap-10 md:grid-cols-2 p-2">
        {/* Cột 1: Thời gian */}
        <div className="space-y-6">
          <SectionHeader icon={Clock} title="Quy tắc thời gian" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Chu kỳ Sprint (Tuần)
              </Label>
              <Input
                type="number"
                defaultValue={2}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-[#F27124]/20 font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Giờ khóa bài (Cut-off)
              </Label>
              <Input
                type="time"
                defaultValue="23:59"
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-[#F27124]/20 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Cột 2: Trọng số điểm */}
        <div className="space-y-6">
          <SectionHeader icon={Activity} title="Trọng số đánh giá" />

          <div className="grid grid-cols-2 gap-4">
            <WeightInput label="GitHub Code" defaultValue={40} />
            <WeightInput label="Jira Tasks" defaultValue={40} />
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
            <p className="text-[10px] text-blue-600 font-bold uppercase leading-relaxed">
              Lưu ý: Tổng trọng số nên đạt 100% để đảm bảo tính toán Progress
              chính xác theo thuật toán SyncSystem_V1.
            </p>
          </div>
        </div>
      </div>

      {/* Footer mượt mà */}
      <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Last_Update: 15/01/2026 // By_Admin
          </span>
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="h-14 bg-slate-900 hover:bg-[#F27124] text-white rounded-[20px] px-10 transition-all duration-300 active:scale-95 shadow-xl hover:shadow-[#F27124]/20"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-3" />
          ) : (
            <Save className="h-5 w-5 mr-3" />
          )}
          <span className="font-black uppercase tracking-widest text-xs">
            Lưu cấu hình
          </span>
        </Button>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <Icon className="h-4 w-4 text-[#F27124]" />
      <span className="text-[12px] font-black uppercase tracking-widest text-slate-900">
        {title}
      </span>
    </div>
  );
}

function WeightInput({ label, defaultValue }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
        {label}
      </Label>
      <div className="relative">
        <Input
          type="number"
          defaultValue={defaultValue}
          className="h-12 rounded-2xl border-slate-200 pr-10 font-bold bg-slate-50/50 focus:bg-white"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
          %
        </span>
      </div>
    </div>
  );
}
