"use client";

import { useEffect, useState } from "react";
import {
  FolderPlus,
  Users,
  Github,
  Trello,
  Loader2,
  CheckCircle2,
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
  onSuccess?: () => void;
}

export function AddProjectDialog({
  members,
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
        .map((m) => m._id)
        .filter((id): id is string => !!id);

      // Reset form với giá trị members mặc định
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
    createProject(
      {
        name: data.name,
        members: data.members,
        githubRepoUrl: data.githubRepoUrl,
        jiraProjectKey: data.jiraProjectKey,
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
        <Button className="bg-[#F27124] hover:bg-[#d45d1d] text-white font-bold uppercase tracking-tight rounded-xl gap-2 shadow-md shadow-orange-500/10 transition-all active:scale-95 px-4 h-10 text-xs">
          <FolderPlus className="w-4 h-4" />
          Khởi tạo Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] rounded-[24px] border-slate-200 bg-white/95 backdrop-blur-xl p-8 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Tạo dự án mới
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 leading-relaxed text-left">
            Kết nối GitHub, Jira và xác nhận thành viên để bắt đầu không gian
            làm việc.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="grid gap-6 py-6">
                {/* FIELD: Tên dự án */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 text-left space-y-0">
                      <FormLabel className="text-xs font-bold uppercase text-slate-400 tracking-widest">
                        Tên dự án <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên dự án..."
                          className="rounded-xl border-slate-200 h-12 text-sm font-medium transition-all focus:ring-2 focus:ring-orange-500/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                        <FormLabel className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-900" /> Xác nhận
                          thành viên ({form.watch("members").length})
                        </FormLabel>
                        <FormMessage />
                      </div>

                      <div className="grid grid-cols-1 gap-2 border rounded-2xl p-3 bg-slate-50/50 border-slate-100">
                        {members.map((member) => (
                          <FormField
                            key={member._id}
                            control={form.control}
                            name="members"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={member._id}
                                  className="flex flex-row items-center justify-between p-2 hover:bg-white rounded-xl transition-colors cursor-pointer space-y-0"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 border border-white">
                                      <AvatarImage src={member.avatar_url} />
                                      <AvatarFallback className="text-[10px] bg-orange-100 text-orange-600 font-bold">
                                        {member.full_name?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col text-left">
                                      <Label className="text-xs font-bold text-slate-700 cursor-pointer">
                                        {member.full_name}
                                      </Label>
                                      <span className="text-[10px] text-slate-400 uppercase">
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
                                      className="rounded-md border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
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
                      <FormLabel className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Github className="w-4 h-4 text-slate-900" /> GitHub
                        Repository <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-white">
                            <SelectValue
                              placeholder={
                                isLoadingRepos
                                  ? "Đang tải..."
                                  : "Chọn repository"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                          {repos.map((repo: any) => (
                            <SelectItem
                              key={repo.id}
                              value={repo.url}
                              className="text-sm py-3 cursor-pointer"
                            >
                              {repo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FIELD: Jira Project */}
                <FormField
                  control={form.control}
                  name="jiraProjectKey"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 text-left space-y-0">
                      <FormLabel className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Trello className="w-4 h-4 text-blue-500" /> Jira
                        Project Key <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-white">
                            <SelectValue
                              placeholder={
                                isLoadingJira
                                  ? "Đang tải..."
                                  : "Chọn dự án Jira"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                          {projects.map((proj: any) => (
                            <SelectItem
                              key={proj.id}
                              value={proj.key}
                              className="text-sm py-3 cursor-pointer"
                            >
                              <span className="font-bold text-blue-600 mr-2">
                                [{proj.key}]
                              </span>
                              {proj.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="pt-6 border-t mt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-slate-900 hover:bg-black text-white rounded-xl uppercase font-bold text-sm h-14 shadow-xl transition-all active:scale-[0.98]"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                )}
                Xác nhận khởi tạo dự án
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
