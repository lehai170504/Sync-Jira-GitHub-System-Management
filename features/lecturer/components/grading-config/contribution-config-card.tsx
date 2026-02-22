"use client";

import { Settings2 } from "lucide-react";
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
    (config.jiraWeight + config.gitWeight + config.reviewWeight) * 100,
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
              Đánh giá Nhóm
            </CardTitle>
            <Badge
              variant={totalContribPercent === 100 ? "outline" : "destructive"}
              className={`px-3 py-1 rounded-full ${
                totalContribPercent === 100
                  ? "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20"
                  : ""
              }`}
            >
              Total: {totalContribPercent}%
            </Badge>
          </div>
          <CardDescription className="dark:text-slate-400">
            Cấu hình tỷ lệ tính điểm đóng góp (Contribution).
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Jira */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">
                Jira Weight (Task)
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
              className="[&>.relative>.absolute]:bg-orange-500 dark:[&>.relative]:bg-slate-800"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Dựa trên tiến độ và hoàn thành task trên Jira.
            </p>
          </div>

          {/* Git */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">
                Git Weight (Code)
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
              className="[&>.relative>.absolute]:bg-blue-500 dark:[&>.relative]:bg-slate-800"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Dựa trên số lượng Commit, Pull Requests.
            </p>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold">
                Review Weight (Peer)
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
              className="[&>.relative>.absolute]:bg-purple-500 dark:[&>.relative]:bg-slate-800"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Dựa trên đánh giá chéo giữa các thành viên.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Allow Over Ceiling */}
      <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-slate-900 border-l-4 border-l-[#F27124] transition-colors">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <Label className="text-base font-bold text-slate-800 dark:text-slate-100">
              Allow Over Ceiling
            </Label>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cho phép sinh viên xuất sắc nhận điểm cao hơn điểm nhóm (VD: Nhóm
              9đ, Cá nhân 10đ).
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
