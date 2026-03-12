"use client";

import { Settings2, Calculator } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ContributionConfig } from "../../types/grading-types";

interface ContributionConfigCardProps {
  config: ContributionConfig;
  onChange: (newConfig: ContributionConfig) => void;
}

export function ContributionConfigCard({
  config,
  onChange,
}: ContributionConfigCardProps) {
  const totalContribPercent = Math.round(
    (config.jiraWeight + config.gitWeight + config.reviewWeight) * 100
  );

  const handleUpdate = (field: keyof ContributionConfig, value: number) => {
    const newVal = typeof value === "boolean" ? value : value / 100;
    onChange({ ...config, [field]: newVal });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden transition-colors">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              Đánh giá Đóng góp Nhóm
            </CardTitle>
            <Badge
              variant={totalContribPercent === 100 ? "outline" : "destructive"}
              className={`px-3 py-1 rounded-full ${
                totalContribPercent === 100
                  ? "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20"
                  : ""
              }`}
            >
              Tổng trọng số: {totalContribPercent}%
            </Badge>
          </div>
          <CardDescription className="dark:text-slate-400">
            Cấu hình tỷ lệ phân bổ công sức để tính điểm cá nhân từ điểm nhóm.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Hộp thoại thông tin Công thức */}
          <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-xl">
            <Calculator className="h-4 w-4" />
            <AlertTitle className="font-bold mb-1">
              Công thức tính Hệ số chuẩn hóa
            </AlertTitle>
            <AlertDescription className="text-xs leading-relaxed opacity-90">
              Hệ số ={" "}
              <strong className="font-semibold">
                (Jira_Weight × %Jira + Git_Weight × %Git + Review_Weight ×
                %Review)
              </strong>{" "}
              × Sĩ_số_nhóm
              <br />
              <span className="italic mt-1 block">
                * Điểm cá nhân = Điểm nhóm × Hệ số chuẩn hóa.
              </span>
            </AlertDescription>
          </Alert>

          {/* Jira */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">
                Jira Weight (Quản lý Task)
              </Label>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md">
                {Math.round(config.jiraWeight * 100)}%
              </span>
            </div>
            <Slider
              value={[config.jiraWeight * 100]}
              max={100}
              step={5}
              onValueChange={(val) => handleUpdate("jiraWeight", val[0])}
              className="[&>.relative>.absolute]:bg-orange-500 dark:[&>.relative]:bg-slate-800 cursor-pointer"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tính dựa trên{" "}
              <strong>tỷ lệ Story Points hoàn thành (Done)</strong> của cá nhân
              so với tổng Story Points Done của cả nhóm.
            </p>
          </div>

          {/* Git */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">
                Git Weight (Đóng góp Code)
              </Label>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                {Math.round(config.gitWeight * 100)}%
              </span>
            </div>
            <Slider
              value={[config.gitWeight * 100]}
              max={100}
              step={5}
              onValueChange={(val) => handleUpdate("gitWeight", val[0])}
              className="[&>.relative>.absolute]:bg-blue-500 dark:[&>.relative]:bg-slate-800 cursor-pointer"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tính dựa trên <strong>tỷ lệ Commit hợp lệ</strong> (không spam, đủ
              tiêu chuẩn) của cá nhân so với toàn đội.
            </p>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">
                Review Weight (Đánh giá chéo)
              </Label>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md">
                {Math.round(config.reviewWeight * 100)}%
              </span>
            </div>
            <Slider
              value={[config.reviewWeight * 100]}
              max={100}
              step={5}
              onValueChange={(val) => handleUpdate("reviewWeight", val[0])}
              className="[&>.relative>.absolute]:bg-purple-500 dark:[&>.relative]:bg-slate-800 cursor-pointer"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tính dựa trên <strong>tổng số Sao (Stars)</strong> mà sinh viên
              nhận được từ các thành viên khác trong nhóm.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Allow Over Ceiling */}
      <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-slate-900 border-l-4 border-l-[#F27124] transition-colors rounded-2xl">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <Label className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Cho phép Vượt trần (Over Ceiling)
            </Label>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nếu bật, sinh viên "gánh team" có Hệ số chuẩn hóa {">"} 1.0 sẽ
              nhận điểm <strong>lớn hơn</strong> điểm gốc của nhóm. Nếu tắt, tối
              đa chỉ bằng điểm nhóm (Ép về 1.0).
            </p>
          </div>
          <Switch
            checked={config.allowOverCeiling}
            onCheckedChange={(c) =>
              onChange({ ...config, allowOverCeiling: c })
            }
            className="data-[state=checked]:bg-[#F27124] dark:data-[state=unchecked]:bg-slate-700"
          />
        </CardContent>
      </Card>
    </div>
  );
}
