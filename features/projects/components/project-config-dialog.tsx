"use client";

import { useState } from "react";
import {
  Settings,
  Loader2,
  Info,
  Github,
  Trello,
  Globe,
  Key,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateTeamConfig } from "../hooks/use-update-config";
import { toast } from "sonner";
import { teamConfigSchema } from "@/features/management/teams/schemas/team-config-schema";

interface ProjectConfigDialogProps {
  teamId: string;
  initialValues?: {
    jira_url?: string;
    jira_project_key?: string;
    github_repo_url?: string;
  };
}

export function ProjectConfigDialog({
  teamId,
  initialValues,
}: ProjectConfigDialogProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    jira_url: initialValues?.jira_url || "",
    jira_project_key: initialValues?.jira_project_key || "",
    jira_board_id: "",
    api_token_jira: "",
    github_repo_url: initialValues?.github_repo_url || "",
    api_token_github: "",
  });

  const { mutate: updateConfig, isPending } = useUpdateTeamConfig(teamId);

  const handleSubmit = () => {
    const parsed = teamConfigSchema.safeParse({
      ...formData,
      jira_project_key: formData.jira_project_key.toUpperCase().trim(),
      jira_board_id: Number(formData.jira_board_id),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Cấu hình chưa hợp lệ");
      return;
    }
    updateConfig(
      parsed.data,
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900 dark:text-slate-300 rounded-xl font-semibold h-10"
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Cấu hình API</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-175 rounded-[32px] p-0 overflow-hidden max-h-[90vh] flex flex-col bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl transition-colors font-sans">
        <DialogHeader className="p-8 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            Cấu hình tích hợp
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Cập nhật lại các khóa API, Token và cấu hình để đồng bộ dữ liệu
            nhóm.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-8 py-2 custom-scrollbar">
          <div className="grid gap-8 py-4">
            {/* --- SECTION JIRA --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Trello className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  Cấu hình Jira Software
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                    Jira URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="https://domain.atlassian.net"
                      className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors rounded-xl"
                      value={formData.jira_url}
                      onChange={(e) => handleChange("jira_url", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                    Project Key <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="VD: SCRUM, SWP..."
                    className="h-10 uppercase bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors rounded-xl"
                    value={formData.jira_project_key}
                    onChange={(e) =>
                      handleChange("jira_project_key", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                    Board ID <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <LayoutTemplate className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      placeholder="VD: 1, 5"
                      className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors rounded-xl"
                      value={formData.jira_board_id}
                      onChange={(e) =>
                        handleChange("jira_board_id", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                    API Token (Jira) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="ATATT3xFf..."
                      className="pl-10 h-10 font-mono bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors rounded-xl"
                      value={formData.api_token_jira}
                      onChange={(e) =>
                        handleChange("api_token_jira", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* HƯỚNG DẪN JIRA */}
              <Accordion
                type="single"
                collapsible
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:no-underline py-3">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" /> Hướng dẫn lấy
                      thông tin Jira
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2 pb-4 leading-relaxed font-medium">
                    <p>
                      1. <b>URL & Key:</b> Vào dự án Jira, URL là{" "}
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">
                        https://[domain].atlassian.net
                      </code>
                      . Key là tiền tố của task (VD: <b>SCRUM</b>-123).
                    </p>
                    <p>
                      2. <b>Board ID:</b> Mở Board, nhìn lên URL tìm tham số{" "}
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">
                        ?rapidView=5
                      </code>{" "}
                      hoặc{" "}
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">
                        board/5
                      </code>
                      . Số <b>5</b> là Board ID.
                    </p>
                    <p>
                      3. <b>API Token:</b> Truy cập{" "}
                      <a
                        href="https://id.atlassian.com/manage-profile/security/api-tokens"
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                      >
                        Atlassian Security
                      </a>{" "}
                      -&gt; Create API token -&gt; Copy token.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* --- SECTION GITHUB --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Github className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  Cấu hình GitHub
                </h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                    Repository URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="https://github.com/username/repo-name"
                      className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors rounded-xl"
                      value={formData.github_repo_url}
                      onChange={(e) =>
                        handleChange("github_repo_url", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                    Personal Access Token (Classic){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="pl-10 h-10 font-mono bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors rounded-xl"
                      value={formData.api_token_github}
                      onChange={(e) =>
                        handleChange("api_token_github", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* HƯỚNG DẪN GITHUB */}
              <Accordion
                type="single"
                collapsible
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <AccordionItem value="item-2" className="border-none">
                  <AccordionTrigger className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:no-underline py-3">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-500" /> Hướng dẫn lấy
                      Github Token
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2 pb-4 leading-relaxed font-medium">
                    <p>
                      1. Truy cập Github: <b>Settings</b> -&gt;{" "}
                      <b>Developer settings</b> -&gt;{" "}
                      <b>Personal access tokens</b> -&gt;{" "}
                      <b>Tokens (classic)</b>.
                    </p>
                    <p>
                      2. Chọn <b>Generate new token (classic)</b>.
                    </p>
                    <p>
                      3. Chọn scopes: <b>repo</b> (full control),{" "}
                      <b>read:org</b>, <b>read:user</b>.
                    </p>
                    <p>
                      4. Generate và copy token (bắt đầu bằng{" "}
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">
                        ghp_...
                      </code>
                      ).
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 transition-colors">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 h-11"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-11 transition-all"
          >
            {isPending ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Settings className="mr-2 w-4 h-4" />
            )}
            Lưu cấu hình
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
