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
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle>{editing ? "Chỉnh sửa sprint" : "Thêm sprint"}</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Quản lý sprint. Mỗi sprint có ngày bắt đầu và ngày kết thúc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Tên sprint <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formSprint.name}
              onChange={(e) => setFormSprint({ ...formSprint, name: e.target.value })}
              placeholder="Ví dụ: Sprint 7"
              required
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={startDateValue}
              onChange={handleStartDateChange}
              required
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Ngày kết thúc <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={endDateValue}
              onChange={handleEndDateChange}
              required
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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


