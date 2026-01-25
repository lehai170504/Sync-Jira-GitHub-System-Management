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
    // Nếu là weight thì chia 100, allowOverCeiling thì giữ nguyên boolean
    const newVal = typeof value === "boolean" ? value : value / 100;
    onChange({ ...config, [field]: newVal });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-orange-500" />
              Đánh giá Nhóm
            </CardTitle>
            <Badge
              variant={totalContribPercent === 100 ? "outline" : "destructive"}
              className={`px-3 py-1 rounded-full ${
                totalContribPercent === 100
                  ? "text-green-600 border-green-200 bg-green-50"
                  : ""
              }`}
            >
              Total: {totalContribPercent}%
            </Badge>
          </div>
          <CardDescription>
            Cấu hình tỷ lệ tính điểm đóng góp (Contribution).
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Jira */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 font-semibold">
                Jira Weight (Task)
              </Label>
              <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                {Math.round(config.jiraWeight * 100)}%
              </span>
            </div>
            <Slider
              value={[config.jiraWeight * 100]}
              max={100}
              step={5}
              onValueChange={(val) => handleUpdate("jiraWeight", val[0])}
              className="[&>.relative>.absolute]:bg-orange-500"
            />
            <p className="text-xs text-slate-400">
              Dựa trên tiến độ và hoàn thành task trên Jira.
            </p>
          </div>

          {/* Git */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 font-semibold">
                Git Weight (Code)
              </Label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {Math.round(config.gitWeight * 100)}%
              </span>
            </div>
            <Slider
              value={[config.gitWeight * 100]}
              max={100}
              step={5}
              onValueChange={(val) => handleUpdate("gitWeight", val[0])}
              className="[&>.relative>.absolute]:bg-blue-500"
            />
            <p className="text-xs text-slate-400">
              Dựa trên số lượng Commit, Pull Requests.
            </p>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-slate-700 font-semibold">
                Review Weight (Peer)
              </Label>
              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                {Math.round(config.reviewWeight * 100)}%
              </span>
            </div>
            <Slider
              value={[config.reviewWeight * 100]}
              max={100}
              step={5}
              onValueChange={(val) => handleUpdate("reviewWeight", val[0])}
              className="[&>.relative>.absolute]:bg-purple-500"
            />
            <p className="text-xs text-slate-400">
              Dựa trên đánh giá chéo giữa các thành viên.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Allow Over Ceiling */}
      <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-white border-l-4 border-l-[#F27124]">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <Label className="text-base font-bold text-slate-800">
              Allow Over Ceiling
            </Label>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cho phép sinh viên xuất sắc nhận điểm cao hơn điểm nhóm (VD: Nhóm
              9đ, Cá nhân 10đ).
            </p>
          </div>
          <Switch
            checked={config.allowOverCeiling}
            onCheckedChange={(c) =>
              onChange({ ...config, allowOverCeiling: c })
            }
            className="data-[state=checked]:bg-[#F27124]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
