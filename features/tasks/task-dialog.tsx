"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Member, Sprint, Task } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: boolean;
  formTask: Task;
  setFormTask: (t: Task) => void;
  onSave: () => void;
  isSaving?: boolean;

  members: Member[];
  /** Danh sách assignee từ Jira users (dùng cho dropdown khi thêm task) */
  assigneeOptions?: { id: string; name: string }[];
  sprints: Sprint[];
};

export function TaskDialog({
  open,
  onOpenChange,
  editing,
  formTask,
  setFormTask,
  onSave,
  isSaving = false,
  members,
  assigneeOptions,
  sprints,
}: Props) {
  // Đảm bảo Select luôn có item cho giá trị đang chọn (hiển thị tên, không chỉ id)
  const assigneeListResolved = React.useMemo(() => {
    const list =
      assigneeOptions && assigneeOptions.length > 0 ? assigneeOptions : members;
    const byId = new Map(list.map((m) => [m.id, m]));
    if (formTask.assigneeId && !byId.has(formTask.assigneeId)) {
      const hint = formTask.assigneeName?.trim();
      return [
        ...list,
        {
          id: formTask.assigneeId,
          name: hint || formTask.assigneeId,
        },
      ];
    }
    return list;
  }, [assigneeOptions, members, formTask.assigneeId, formTask.assigneeName]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle>{editing ? "Chỉnh sửa task" : "Thêm task mới"}</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Nhập thông tin task của nhóm. ID sẽ được tạo tự động khi thêm mới.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Tiêu đề (Summary) <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formTask.title}
              onChange={(e) => setFormTask({ ...formTask, title: e.target.value })}
              placeholder="Ví dụ: Thiết kế trang thanh toán"
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">Mô tả (Description)</Label>
            <Textarea
              value={formTask.description ?? ""}
              onChange={(e) => setFormTask({ ...formTask, description: e.target.value })}
              placeholder="Ví dụ: Phân tích yêu cầu và thiết kế chi tiết"
              rows={3}
              className="resize-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Assignee <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formTask.assigneeId}
                onValueChange={(v) => setFormTask({ ...formTask, assigneeId: v })}
              >
                <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Chọn thành viên" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  {assigneeListResolved.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Story Points <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                value={formTask.storyPoints}
                onChange={(e) =>
                  setFormTask({
                    ...formTask,
                    storyPoints: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Sprint <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formTask.printId}
              onValueChange={(v) => setFormTask({ ...formTask, printId: v })}
            >
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Chọn sprint" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {sprints.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} • {p.deadline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Ngày bắt đầu (Start date) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formTask.startDate ?? ""}
                onChange={(e) =>
                  setFormTask({
                    ...formTask,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Hạn chót (Due date) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formTask.deadline}
                onChange={(e) =>
                  setFormTask({
                    ...formTask,
                    deadline: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Đang xử lý..." : editing ? "Lưu thay đổi" : "Thêm task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


