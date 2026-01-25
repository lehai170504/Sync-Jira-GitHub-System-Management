"use client";

import { Trash2, Plus, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GradeColumn } from "../../types/grading-types";

interface GradeStructureCardProps {
  gradeStructure: GradeColumn[];
  onChange: (newStructure: GradeColumn[]) => void;
}

export function GradeStructureCard({
  gradeStructure,
  onChange,
}: GradeStructureCardProps) {
  // Helper tính tổng %
  const totalGradePercent = Math.round(
    gradeStructure.reduce((sum, item) => sum + Number(item.weight), 0) * 100,
  );

  const handleUpdate = (
    index: number,
    field: keyof GradeColumn,
    value: any,
  ) => {
    const newGrades = [...gradeStructure];
    // Nếu là weight thì chia 100 để lưu 0.x
    if (field === "weight") {
      newGrades[index] = { ...newGrades[index], weight: value / 100 };
    } else {
      newGrades[index] = { ...newGrades[index], [field]: value };
    }
    onChange(newGrades);
  };

  const handleAdd = () => {
    onChange([
      ...gradeStructure,
      { name: "New Item", weight: 0, isGroupGrade: false },
    ]);
  };

  const handleDelete = (index: number) => {
    onChange(gradeStructure.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden h-fit">
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Percent className="h-5 w-5 text-blue-500" />
            Cấu trúc Cột điểm
          </CardTitle>
          <Badge
            variant={totalGradePercent === 100 ? "default" : "destructive"}
            className={`px-3 py-1 rounded-full ${
              totalGradePercent === 100 ? "bg-green-500 hover:bg-green-600" : ""
            }`}
          >
            Tổng: {totalGradePercent}%
          </Badge>
        </div>
        <Progress
          value={totalGradePercent}
          className={`h-2 ${totalGradePercent > 100 ? "bg-red-100" : "bg-slate-100"}`}
          indicatorColor={
            totalGradePercent === 100
              ? "bg-green-500"
              : totalGradePercent > 100
                ? "bg-red-500"
                : "bg-blue-500"
          }
        />
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {gradeStructure.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
          >
            {/* Tên cột điểm */}
            <div className="flex gap-3 mb-4">
              <Input
                value={item.name}
                onChange={(e) => handleUpdate(index, "name", e.target.value)}
                placeholder="Tên đầu điểm (VD: Assignment 1)"
                className="font-semibold text-slate-700 border-transparent bg-slate-50 focus:bg-white focus:border-blue-200"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Slider & Switch */}
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Trọng số</span>
                  <span className="text-blue-600 font-bold">
                    {Math.round(item.weight * 100)}%
                  </span>
                </div>
                <Slider
                  value={[item.weight * 100]}
                  max={100}
                  step={5}
                  onValueChange={(vals) =>
                    handleUpdate(index, "weight", vals[0])
                  }
                  className="py-1"
                />
              </div>

              <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
                <Label
                  className="text-xs text-slate-500 cursor-pointer"
                  htmlFor={`grp-${index}`}
                >
                  Điểm nhóm
                </Label>
                <Switch
                  id={`grp-${index}`}
                  checked={item.isGroupGrade}
                  onCheckedChange={(checked) =>
                    handleUpdate(index, "isGroupGrade", checked)
                  }
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full border-dashed border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 h-12 rounded-xl"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm cột điểm mới
        </Button>
      </CardContent>
    </Card>
  );
}
