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
import { Loader2 } from "lucide-react";
import type { Sprint } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: boolean;
  formSprint: Sprint;
  setFormSprint: (s: Sprint) => void;
  onSave: () => void;
  isSaving?: boolean;
};

export function SprintDialog({
  open,
  onOpenChange,
  editing,
  formSprint,
  setFormSprint,
  onSave,
  isSaving = false,
}: Props) {
  // Convert ISO -> datetime-local WITHOUT shifting timezone (use local time display)
  const isoToDatetimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const tzOffset = d.getTimezoneOffset() * 60_000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const startDateValue = isoToDatetimeLocal(formSprint.start_date);
  const endDateValue = isoToDatetimeLocal(formSprint.end_date);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const isoString = new Date(value).toISOString();
      setFormSprint({ ...formSprint, start_date: isoString });
    } else {
      setFormSprint({ ...formSprint, start_date: "" });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const isoString = new Date(value).toISOString();
      setFormSprint({ ...formSprint, end_date: isoString });
    } else {
      setFormSprint({ ...formSprint, end_date: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Chỉnh sửa sprint" : "Thêm sprint"}</DialogTitle>
          <DialogDescription>
            Quản lý sprint. Mỗi sprint có ngày bắt đầu và ngày kết thúc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Tên sprint <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formSprint.name}
              onChange={(e) => setFormSprint({ ...formSprint, name: e.target.value })}
              placeholder="Ví dụ: Sprint 7"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>
              Ngày bắt đầu <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={startDateValue}
              onChange={handleStartDateChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>
              Ngày kết thúc <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={endDateValue}
              onChange={handleEndDateChange}
              required
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : editing ? (
              "Lưu thay đổi"
            ) : (
              "Thêm sprint"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


