"use client";

import { useState } from "react";
import { Scale, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function GradingConfig() {
  const [weights, setWeights] = useState({
    process: 40,
    product: 40,
    softSkill: 20,
  });

  const totalWeight = weights.process + weights.product + weights.softSkill;
  const isWeightValid = totalWeight === 100;

  return (
    <>
      {/* SCORING MODEL */}
      <Card className="border border-blue-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-blue-50/30 border-b border-blue-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">
                  Mô hình Trọng số (Scoring Weights)
                </CardTitle>
                <CardDescription>
                  Quyết định cách hệ thống tính điểm Project (Auto-score)
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={isWeightValid ? "default" : "destructive"}
              className={
                isWeightValid
                  ? "bg-green-600 hover:bg-green-700 h-7 px-3 text-sm"
                  : "h-7 px-3 text-sm"
              }
            >
              Tổng: {totalWeight}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-800">
                  1. Tiến độ & Quy trình (Jira)
                </Label>
                <p className="text-sm text-gray-500">
                  Dựa trên: Task completion, Burndown rate, Story Points.
                </p>
              </div>
              <span className="text-3xl font-bold text-blue-600 w-20 text-right">
                {weights.process}%
              </span>
            </div>
            <Slider
              value={[weights.process]}
              max={100}
              step={5}
              onValueChange={(v) => setWeights({ ...weights, process: v[0] })}
              className="py-2"
            />
          </div>
          <Separator className="bg-gray-100" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-800">
                  2. Chất lượng Sản phẩm (GitHub)
                </Label>
                <p className="text-sm text-gray-500">
                  Dựa trên: Commit volume, Lines of Code, PR Merged.
                </p>
              </div>
              <span className="text-3xl font-bold text-[#F27124] w-20 text-right">
                {weights.product}%
              </span>
            </div>
            <Slider
              value={[weights.product]}
              max={100}
              step={5}
              onValueChange={(v) => setWeights({ ...weights, product: v[0] })}
              className="py-2"
            />
          </div>
          <Separator className="bg-gray-100" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-800">
                  3. Kỹ năng mềm & Đánh giá chéo
                </Label>
                <p className="text-sm text-gray-500">
                  Dựa trên: Peer Review score, Điểm danh, Thái độ.
                </p>
              </div>
              <span className="text-3xl font-bold text-green-600 w-20 text-right">
                {weights.softSkill}%
              </span>
            </div>
            <Slider
              value={[weights.softSkill]}
              max={100}
              step={5}
              onValueChange={(v) => setWeights({ ...weights, softSkill: v[0] })}
              className="py-2"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* RISK SETTINGS */}
        <Card className="border border-gray-200 shadow-sm h-full bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-gray-900">
                Ngưỡng Cảnh báo
              </CardTitle>
            </div>
            <CardDescription>
              Điều kiện để hệ thống gắn cờ "Risk"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">
                  Không hoạt động (Inactive)
                </Label>
                <p className="text-xs text-gray-500">
                  Không có commit trong X ngày.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                <Input
                  type="number"
                  className="w-12 h-7 p-1 text-center border-none shadow-none focus-visible:ring-0"
                  defaultValue={3}
                />
                <span className="text-xs font-medium text-gray-500 pr-1">
                  ngày
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Spam Commits</Label>
                <p className="text-xs text-gray-500">Phát hiện commit rác.</p>
              </div>
              <Switch
                checked={true}
                className="data-[state=checked]:bg-[#F27124]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for Class Rules (Component tiếp theo) */}
        <ClassRules />
      </div>
    </>
  );
}

// Tách ClassRules ra component riêng hoặc để chung file nếu nhỏ
import { GraduationCap, ShieldAlert } from "lucide-react";

export function ClassRules() {
  return (
    <Card className="border border-gray-200 shadow-sm h-full bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <GraduationCap className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg text-gray-900">
            Quy chế Học thuật
          </CardTitle>
        </div>
        <CardDescription>Các quy tắc chung cho lớp học</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold">
              Max Cap Điểm Project
            </Label>
            <p className="text-xs text-gray-500">
              Điểm tối đa có thể đạt được.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
            <ShieldAlert className="h-4 w-4 text-gray-400" />
            <Input
              type="number"
              className="w-12 h-7 p-1 text-center border-none shadow-none focus-visible:ring-0"
              defaultValue={10}
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold">Yêu cầu Peer Review</Label>
            <p className="text-xs text-gray-500">Bắt buộc đánh giá chéo.</p>
          </div>
          <Switch
            checked={true}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}
