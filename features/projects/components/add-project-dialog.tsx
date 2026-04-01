"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FolderPlus,
  Users,
  Github,
  Trello,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// --- FORM IMPORTS ---
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Hooks & Types & Schemas
import { useCreateProject } from "@/features/projects/hooks/use-create-project";
import { useGithubRepos } from "@/features/integration/hooks/use-github-repos";
import { useJiraProjects } from "@/features/integration/hooks/use-jira-projects";
import { ClassStudent } from "@/features/management/classes/types/class-types";
import {
  addProjectSchema,
  type AddProjectFormValues,
} from "@/features/projects/schemas/add-project-schema";

interface AddProjectDialogProps {
  members: ClassStudent[];
  classId?: string;
  teamId?: string;
  onSuccess?: () => void;
}

export function AddProjectDialog({
  members,
  classId,
  teamId,
  onSuccess,
}: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);

  // Hooks Data
  const { data: githubData, isLoading: isLoadingRepos } = useGithubRepos(open);
  const { data: jiraData, isLoading: isLoadingJira } = useJiraProjects(open);
  const { mutate: createProject, isPending } = useCreateProject();

  // Normalize Data
  const repos = Array.isArray(githubData)
    ? githubData
    : (githubData as any)?.repos || [];
  const projects = Array.isArray(jiraData)
    ? jiraData
    : (jiraData as any)?.projects || [];
  const unenrolledMembers = useMemo(
    () => members.filter((m) => m.status !== "Enrolled"),
    [members],
  );

  // 1. Setup Form
  const form = useForm<AddProjectFormValues>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      name: "",
      githubRepoUrl: "",
      jiraProjectKey: "",
      members: [],
    },
  });

  // 2. Tự động chọn tất cả thành viên khi mở dialog
  useEffect(() => {
    if (open && members) {
      const validIds = members
        .filter((m) => m.status === "Enrolled")
        .map((m) => m._id)
        .filter((id): id is string => !!id);

      form.reset({
        name: "",
        githubRepoUrl: "",
        jiraProjectKey: "",
        members: validIds,
      });
    }
  }, [open, members, form]);

  // 3. Handle Submit
  const onSubmit = (data: AddProjectFormValues) => {
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
    createProject(
      {
        name: data.name,
        members: data.members,
        githubRepoUrl: data.githubRepoUrl,
        jiraProjectKey: data.jiraProjectKey,
        ...(classId && { class_id: classId }),
        ...(teamId && { team_id: teamId }),
      },
      {
        onSuccess: () => {
          toast.success("Khởi tạo dự án thành công!");
          setOpen(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold uppercase tracking-tight rounded-xl gap-2 shadow-sm transition-all active:scale-95 px-4 h-10 text-xs">
          <FolderPlus className="w-4 h-4" />
          Khởi tạo Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-137.5 rounded-[32px] border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-0 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-colors font-sans">
        <DialogHeader className="p-8 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <FolderPlus className="h-5 w-5" />
            </div>
            Tạo dự án mới
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-left mt-2">
            Kết nối GitHub, Jira và xác nhận thành viên để bắt đầu không gian
            làm việc.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="flex-1 px-8 py-2 custom-scrollbar">
              <div className="grid gap-6 py-4">
                {unenrolledMembers.length > 0 && (
                  <Alert className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
                    <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                      Không thể tạo project khi nhóm còn thành viên chưa đăng ký tài khoản.
                    </AlertDescription>
                  </Alert>
                )}
                {/* FIELD: Tên dự án */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 text-left space-y-0">
                      <FormLabel className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                        Tên dự án <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên dự án..."
                          className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-12 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:text-slate-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* FIELD: Chọn thành viên */}
                <FormField
                  control={form.control}
                  name="members"
                  render={() => (
                    <FormItem className="grid gap-3 text-left space-y-0">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />{" "}
                          Xác nhận thành viên ({form.watch("members").length})
                        </FormLabel>
                        <FormMessage className="text-[10px]" />
                      </div>

                      <div className="grid grid-cols-1 gap-2 border rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 transition-colors">
                        {members.map((member) => (
                          <FormField
                            key={member._id}
                            control={form.control}
                            name="members"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={member._id}
                                  className="flex flex-row items-center justify-between p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer space-y-0 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                      <AvatarImage src={member.avatar_url} />
                                      <AvatarFallback className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                                        {member.full_name?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col text-left">
                                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {member.full_name}
                                      </Label>
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                        {member.student_code}
                                      </span>
                                    </div>
                                  </div>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        member._id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              member._id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== member._id,
                                              ),
                                            );
                                      }}
                                      className="rounded-lg border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {/* FIELD: GitHub Repo */}
                <FormField
                  control={form.control}
                  name="githubRepoUrl"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 text-left space-y-0">
                      <FormLabel className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest flex items-center gap-2">
                        <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />{" "}
                        GitHub Repository{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800 h-12 bg-white dark:bg-slate-900 dark:text-slate-100 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                            <SelectValue
                              placeholder={
                                isLoadingRepos
                                  ? "Đang tải dữ liệu..."
                                  : "Chọn repository để liên kết"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                          {repos.map((repo: any) => (
                            <SelectItem
                              key={repo.id}
                              value={repo.url}
                              className="text-sm py-3 cursor-pointer dark:text-slate-200 focus:bg-blue-50 dark:focus:bg-blue-900/20 font-medium"
                            >
                              {repo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* FIELD: Jira Project */}
                <FormField
                  control={form.control}
                  name="jiraProjectKey"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 text-left space-y-0">
                      <FormLabel className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest flex items-center gap-2">
                        <Trello className="w-4 h-4 text-blue-500 dark:text-blue-400" />{" "}
                        Jira Project Key <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800 h-12 bg-white dark:bg-slate-900 dark:text-slate-100 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                            <SelectValue
                              placeholder={
                                isLoadingJira
                                  ? "Đang tải dữ liệu..."
                                  : "Chọn dự án Jira để liên kết"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 transition-colors">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 h-11"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending || unenrolledMembers.length > 0}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl font-bold text-sm h-11 transition-all active:scale-[0.98]"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Xác nhận tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
