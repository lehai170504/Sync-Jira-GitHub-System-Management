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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course, Member, Sprint, Task } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: boolean;
  formTask: Task;
  setFormTask: (t: Task) => void;
  onSave: () => void;

  members: Member[];
  courses: Course[];
  sprints: Sprint[];
  isLeader: boolean;
  currentUserId: string;
};

export function TaskDialog({
  open,
  onOpenChange,
  editing,
  formTask,
  setFormTask,
  onSave,
  members,
  courses,
  sprints,
  isLeader,
  currentUserId,
}: Props) {
  // MEMBER chỉ có thể assign task cho chính mình
  const canChangeAssignee = isLeader;
  
  // Đảm bảo MEMBER luôn assign cho chính mình khi mở dialog
  React.useEffect(() => {
    if (!isLeader && open && formTask.assigneeId !== currentUserId) {
      setFormTask({ ...formTask, assigneeId: currentUserId });
    }
  }, [open, isLeader, currentUserId, formTask, setFormTask]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Chỉnh sửa task" : "Thêm task mới"}</DialogTitle>
          <DialogDescription>
            Nhập thông tin task của nhóm. ID sẽ được tạo tự động khi thêm mới.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tiêu đề</Label>
            <Input
              value={formTask.title}
              onChange={(e) => setFormTask({ ...formTask, title: e.target.value })}
              placeholder="Ví dụ: Thiết kế trang thanh toán"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={formTask.assigneeId}
                onValueChange={(v) => setFormTask({ ...formTask, assigneeId: v })}
                disabled={!canChangeAssignee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thành viên" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!canChangeAssignee && (
                <p className="text-xs text-muted-foreground">
                  Bạn chỉ có thể thêm/sửa task cho chính mình
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Story Points</Label>
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formTask.status}
                onValueChange={(v) =>
                  setFormTask({
                    ...formTask,
                    status: v as Task["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Độ ưu tiên</Label>
              <Select
                value={formTask.priority}
                onValueChange={(v) =>
                  setFormTask({
                    ...formTask,
                    priority: v as Task["priority"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Loại công việc</Label>
            <Input
              value={formTask.type}
              onChange={(e) => setFormTask({ ...formTask, type: e.target.value })}
              placeholder="Frontend / Backend / DevOps / Testing"
            />
          </div>
          <div className="space-y-2">
            <Label>Môn học</Label>
            <Select
              value={formTask.courseId}
              onValueChange={(v) => setFormTask({ ...formTask, courseId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sprint</Label>
            <Select
              value={formTask.printId}
              onValueChange={(v) => setFormTask({ ...formTask, printId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} • {p.deadline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
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

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSave}>{editing ? "Lưu thay đổi" : "Thêm task"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


