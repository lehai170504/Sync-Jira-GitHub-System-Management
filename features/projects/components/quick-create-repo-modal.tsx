"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Github, Loader2, CheckCircle2, Trello } from "lucide-react";
import { toast } from "sonner";
import { createGithubRepoApi } from "@/features/integration/api/github-create-repo-api";
import { createProjectApi } from "@/features/projects/api/project-api";
import { useQueryClient } from "@tanstack/react-query";
import { useJiraProjects } from "@/features/integration/hooks/use-jira-projects";
import type { ClassStudent } from "@/features/management/classes/types/class-types";

const GITIGNORE_OPTIONS = [
  { value: "Node", label: "Node" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "CSharp", label: "C#" },
  { value: "Ruby", label: "Ruby" },
  { value: "PHP", label: "PHP" },
  { value: "Android", label: "Android" },
  { value: "VisualStudio", label: "Visual Studio" },
  { value: "__none__", label: "Không dùng" },
];

interface QuickCreateRepoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: ClassStudent[];
  classId?: string;
  teamId?: string;
  onSuccess?: () => void;
}

export function QuickCreateRepoModal({
  open,
  onOpenChange,
  members,
  classId,
  teamId,
  onSuccess,
}: QuickCreateRepoModalProps) {
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [gitIgnoreTemplate, setGitIgnoreTemplate] = useState("__none__");
  const [projectName, setProjectName] = useState("");
  const [jiraProjectKey, setJiraProjectKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { data: jiraData, isLoading: isLoadingJira } = useJiraProjects(open);
  const projects = Array.isArray(jiraData)
    ? jiraData
    : (jiraData as any)?.projects || [];
  const unenrolledMembers = useMemo(
    () => members.filter((m) => m.status !== "Enrolled"),
    [members],
  );

  const memberIds = members
    .filter((m) => m.status === "Enrolled")
    .map((m) => m._id)
    .filter(Boolean) as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) {
      toast.error("Vui lòng nhập tên Repo");
      return;
    }
    if (!jiraProjectKey) {
      toast.error("Vui lòng chọn Jira Project");
      return;
    }
    if (memberIds.length === 0) {
      toast.error("Chưa có thành viên");
      return;
    }
    if (unenrolledMembers.length > 0) {
      const names = unenrolledMembers
        .map((m) => m.full_name || m.student_code)
        .slice(0, 3)
        .join(", ");
      toast.error("Không thể tạo project", {
        description: `Nhóm còn thành viên chưa tạo tài khoản: ${names}${unenrolledMembers.length > 3 ? "..." : ""}`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Bước 1: Tạo repo GitHub (KHÔNG truyền projectId)
      const repoRes = await createGithubRepoApi({
        repoName: repoName.trim(),
        description: description.trim() || undefined,
        isPrivate,
        gitIgnoreTemplate: gitIgnoreTemplate && gitIgnoreTemplate !== "__none__" ? gitIgnoreTemplate : undefined,
      });

      const repoUrl = repoRes?.repoUrl;
      if (!repoUrl) {
        throw new Error(repoRes?.message || "Không nhận được link GitHub từ server.");
      }

      // Bước 2: Tạo project với repoUrl vừa nhận
      await createProjectApi({
        name: projectName.trim() || repoName.trim(),
        members: memberIds,
        githubRepoUrl: repoUrl,
        jiraProjectKey,
        ...(classId && { class_id: classId }),
        ...(teamId && { team_id: teamId }),
      });

      toast.success("Tạo Repo và Project thành công!");
      onOpenChange(false);
      setRepoName("");
      setDescription("");
      setProjectName("");
      setJiraProjectKey("");
      await queryClient.invalidateQueries({ queryKey: ["my-project"] });
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Không thể tạo Repo.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
              <Github className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Tạo nhanh Repo GitHub
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tự động tạo repository trên GitHub và khởi tạo Project trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4 bg-white dark:bg-slate-950">
            {unenrolledMembers.length > 0 && (
              <Alert className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Không thể tạo Repo/Project khi nhóm còn thành viên chưa tạo tài khoản.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="repoName" className="text-slate-700 dark:text-slate-200">Tên Repo <span className="text-red-500">*</span></Label>
              <Input
                id="repoName"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="vd: my-awesome-project"
                className="dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 dark:text-slate-200">Mô tả</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn về repo..."
                className="dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={(v) => setIsPrivate(!!v)}
                className="dark:border-slate-600 dark:data-[state=checked]:bg-emerald-600"
              />
              <Label htmlFor="isPrivate" className="cursor-pointer text-sm text-foreground">
                Private (nếu bỏ chọn = Public)
              </Label>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">Ngôn ngữ (.gitignore)</Label>
              <Select value={gitIgnoreTemplate} onValueChange={setGitIgnoreTemplate}>
                <SelectTrigger className="dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500">
                  <SelectValue placeholder="Chọn template .gitignore" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  {GITIGNORE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-800">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-slate-700 dark:text-slate-200">Tên dự án</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Để trống = dùng tên Repo"
                className="dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest flex items-center gap-2">
                <Trello className="w-4 h-4 text-blue-500 dark:text-blue-400" />{" "}
                Jira Project Key <span className="text-red-500">*</span>
              </Label>
              <Select value={jiraProjectKey} onValueChange={setJiraProjectKey}>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800 h-12 bg-white dark:bg-slate-900 dark:text-slate-100 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                  <SelectValue
                    placeholder={
                      isLoadingJira
                        ? "Đang tải dữ liệu..."
                        : "Chọn dự án Jira để liên kết"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  {projects.map((proj: any) => (
                    <SelectItem
                      key={proj.id}
                      value={proj.key}
                      className="text-sm py-3 cursor-pointer dark:text-slate-200 focus:bg-blue-50 dark:focus:bg-blue-900/20 font-medium"
                    >
                      <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">
                        [{proj.key}]
                      </span>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || unenrolledMembers.length > 0}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Tạo Repo & Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
