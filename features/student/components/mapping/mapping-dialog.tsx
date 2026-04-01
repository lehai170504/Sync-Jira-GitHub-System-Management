"use client";

import { useEffect, useState } from "react";
import { Loader2, Github, Trello, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamMember } from "@/features/student/types/member-types";

export type ProfileMappingDefaults = {
  jiraAccountId?: string;
  githubUsername?: string;
};

interface MappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onSubmit: (data: { jira: string; github: string }) => void;
  isSubmitting: boolean;
  /** student._id của user đang đăng nhập — chỉ auto-fill OAuth cho đúng dòng này */
  currentUserStudentId?: string;
  /** Jira/GitHub lấy từ OAuth (auth/me) khi member chưa có mapping sau sync/project */
  profileIntegrationDefaults?: ProfileMappingDefaults | null;
}

export function MappingDialog({
  open,
  onOpenChange,
  member,
  onSubmit,
  isSubmitting,
  currentUserStudentId,
  profileIntegrationDefaults,
}: MappingDialogProps) {
  const [formData, setFormData] = useState({ jira: "", github: "" });

  // Reset form khi mở dialog: ưu tiên dữ liệu đã lưu trên member; nếu trống và là chính mình thì gợi ý từ OAuth Jira/GitHub
  useEffect(() => {
    if (!open || !member) return;

    const isSelf =
      !!currentUserStudentId &&
      !!member.student?._id &&
      member.student._id === currentUserStudentId;

    const jiraFromApi = (member.jira_account_id || "").trim();
    const githubFromApi = (member.github_username || "").trim();

    const jiraSuggest = (profileIntegrationDefaults?.jiraAccountId || "").trim();
    const githubSuggest = (profileIntegrationDefaults?.githubUsername || "").trim();

    setFormData({
      jira: jiraFromApi || (isSelf ? jiraSuggest : ""),
      github: githubFromApi || (isSelf ? githubSuggest : ""),
    });
  }, [
    open,
    member,
    currentUserStudentId,
    profileIntegrationDefaults?.jiraAccountId,
    profileIntegrationDefaults?.githubUsername,
  ]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isSelf =
    !!currentUserStudentId &&
    !!member?.student?._id &&
    member.student._id === currentUserStudentId;

  const jiraHintOAuth =
    isSelf &&
    member &&
    !(member.jira_account_id || "").trim() &&
    (profileIntegrationDefaults?.jiraAccountId || "").trim() &&
    formData.jira.trim() ===
      (profileIntegrationDefaults?.jiraAccountId || "").trim();

  const githubHintOAuth =
    isSelf &&
    member &&
    !(member.github_username || "").trim() &&
    (profileIntegrationDefaults?.githubUsername || "").trim() &&
    formData.github.trim() ===
      (profileIntegrationDefaults?.githubUsername || "").trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950">
        <DialogHeader className="p-6 pb-2 bg-linear-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950">
          <DialogTitle className="text-xl text-indigo-950 dark:text-slate-50">
            Liên kết tài khoản
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho{" "}
            <b>{member?.student?.full_name ?? "—"}</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 p-6 pt-2">
          {/* Jira Input */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-gray-700 dark:text-slate-100">
              Jira Account ID
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-2.5 bg-blue-50 dark:bg-blue-900/40 p-1 rounded-md">
                <Trello className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              </div>
              <Input
                placeholder="Ví dụ: 712020:8a4d..."
                value={formData.jira}
                onChange={(e) =>
                  setFormData({ ...formData, jira: e.target.value })
                }
                className="pl-12 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 font-mono text-sm transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-1">
              * Tìm trong URL profile Jira của bạn.
            </p>
            {jiraHintOAuth ? (
              <p className="text-[11px] text-sky-600 dark:text-sky-400 pl-1 font-medium">
                Đã gợi ý từ Jira đã liên kết ở Hồ sơ — bấm Lưu để ghi vào nhóm.
              </p>
            ) : null}
          </div>

          {/* GitHub Input */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-gray-700 dark:text-slate-100">
              GitHub Username
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-2.5 bg-gray-100 dark:bg-slate-800 p-1 rounded-md">
                <Github className="w-4 h-4 text-gray-700 dark:text-slate-100" />
              </div>
              <Input
                placeholder="Ví dụ: lehai170504"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                className="pl-12 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-950 focus:border-gray-800 font-medium transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            {githubHintOAuth ? (
              <p className="text-[11px] text-sky-600 dark:text-sky-400 pl-1 font-medium">
                Đã gợi ý từ GitHub đã liên kết ở Hồ sơ — bấm Lưu để ghi vào nhóm.
              </p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-slate-50/50 dark:bg-slate-900/60 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-10 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#F27124] hover:bg-[#d65d1b] text-white gap-2 rounded-xl h-10 px-6 shadow-lg shadow-orange-500/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
