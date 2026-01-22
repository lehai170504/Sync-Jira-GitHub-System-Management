"use client";

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
import type { Sprint } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: boolean;
  formSprint: Sprint;
  setFormSprint: (s: Sprint) => void;
  onSave: () => void;
};

export function SprintDialog({
  open,
  onOpenChange,
  editing,
  formSprint,
  setFormSprint,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Chỉnh sửa sprint" : "Thêm sprint"}</DialogTitle>
          <DialogDescription>
            Quản lý sprint. Mỗi sprint có deadline riêng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tên sprint</Label>
            <Input
              value={formSprint.name}
              onChange={(e) => setFormSprint({ ...formSprint, name: e.target.value })}
              placeholder="Ví dụ: Sprint 7"
            />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={formSprint.deadline}
              onChange={(e) =>
                setFormSprint({ ...formSprint, deadline: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSave}>
            {editing ? "Lưu thay đổi" : "Thêm sprint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


