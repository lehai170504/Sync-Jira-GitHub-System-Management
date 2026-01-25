"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner"; // Import toast

// Hooks & Types
import { useCreateProject } from "@/features/projects/hooks/use-create-project";
import { useGithubRepos } from "@/features/integration/hooks/use-github-repos";
import { useJiraProjects } from "@/features/integration/hooks/use-jira-projects";
import { ClassStudent } from "@/features/management/classes/types";

interface AddProjectDialogProps {
  members: ClassStudent[];
  onSuccess?: () => void;
}

export function AddProjectDialog({
  members,
  onSuccess,
}: AddProjectDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Form State
  const [projectName, setProjectName] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedJira, setSelectedJira] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

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

  // Tự động chọn tất cả thành viên khi mở dialog
  useEffect(() => {
    if (members && open) {
      // Lọc bỏ những member không có _id để tránh gửi null/undefined
      const validIds = members
        .map((m) => m._id)
        .filter((id): id is string => !!id);
      setSelectedMemberIds(validIds);
    }
  }, [members, open]);

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    // 1. Validate Form
    if (!projectName.trim()) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }
    if (selectedMemberIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 thành viên");
      return;
    }
    // Github/Jira có thể optional tùy logic, nếu bắt buộc thì uncomment:
    if (!selectedRepo || !selectedJira) {
      toast.error("Vui lòng chọn Github Repo và Jira Project");
      return;
    }

    // 2. Chuẩn bị Payload
    const payload = {
      name: projectName,
      members: selectedMemberIds, // Mảng ID: ["id1", "id2"]
      githubRepoUrl: selectedRepo,
      jiraProjectKey: selectedJira,
    };

    // DEBUG: In ra console để xem data gửi đi có đúng ý BE không
    console.log("🚀 Payload gửi đi:", payload);

    // 3. Gọi API
    createProject(payload, {
      onSuccess: () => {
        toast.success("Khởi tạo dự án thành công!");
        setOpen(false);
        // Reset Form
        setProjectName("");
        setSelectedRepo("");
        setSelectedJira("");

        onSuccess?.();
        // router.push("/project"); // Chuyển trang nếu cần
      },
    });
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

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="grid gap-6 py-6">
            {/* Tên dự án */}
            <div className="grid gap-2 text-left">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase text-slate-400 tracking-widest"
              >
                Tên dự án
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên dự án..."
                className="rounded-xl border-slate-200 h-12 text-sm font-medium transition-all focus:ring-2 focus:ring-orange-500/20"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            {/* Chọn Thành viên */}
            <div className="grid gap-3 text-left">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-900" /> Xác nhận thành viên
                ({selectedMemberIds.length})
              </Label>
              <div className="grid grid-cols-1 gap-2 border rounded-2xl p-3 bg-slate-50/50 border-slate-100">
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 hover:bg-white rounded-xl transition-colors cursor-pointer"
                    onClick={() => toggleMember(member._id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-white">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback className="text-[10px] bg-orange-100 text-orange-600 font-bold">
                          {member.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-700">
                          {member.full_name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase">
                          {member.student_code}
                        </span>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedMemberIds.includes(member._id)}
                      onCheckedChange={() => toggleMember(member._id)}
                      className="rounded-md border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Repo */}
            <div className="grid gap-2 text-left">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-900" /> GitHub Repository
              </Label>
              <Select onValueChange={setSelectedRepo} value={selectedRepo}>
                <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-white">
                  <SelectValue
                    placeholder={
                      isLoadingRepos ? "Đang tải..." : "Chọn repository"
                    }
                  />
                </SelectTrigger>
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
            </div>

            {/* Jira Project */}
            <div className="grid gap-2 text-left">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Trello className="w-4 h-4 text-blue-500" /> Jira Project Key
              </Label>
              <Select onValueChange={setSelectedJira} value={selectedJira}>
                <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-white">
                  <SelectValue
                    placeholder={
                      isLoadingJira ? "Đang tải..." : "Chọn dự án Jira"
                    }
                  />
                </SelectTrigger>
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
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-6 border-t mt-4">
          <Button
            onClick={handleSubmit}
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
      </DialogContent>
    </Dialog>
  );
}
