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
    updateConfig(
      {
        ...formData,
        jira_board_id: Number(formData.jira_board_id),
      },
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
          className="gap-2 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="hidden sm:inline">Cấu hình kết nối</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col bg-white dark:bg-slate-950 border-none shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-slate-100">
            <Settings className="w-5 h-5 text-orange-500" />
            Cấu hình tích hợp
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Kết nối dự án với Jira Board và GitHub Repository để đồng bộ dữ
            liệu.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="grid gap-8">
            {/* --- SECTION JIRA --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Trello className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Jira Software Config
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    Jira URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      placeholder="https://domain.atlassian.net"
                      className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                      value={formData.jira_url}
                      onChange={(e) => handleChange("jira_url", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    Project Key <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="VD: SCRUM, SWP..."
                    className="font-mono uppercase bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                    value={formData.jira_project_key}
                    onChange={(e) =>
                      handleChange("jira_project_key", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    Board ID <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <LayoutTemplate className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      type="number"
                      placeholder="VD: 1, 5"
                      className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                      value={formData.jira_board_id}
                      onChange={(e) =>
                        handleChange("jira_board_id", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    API Token (Email Owner){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      type="password"
                      placeholder="ATATT3xFf..."
                      className="pl-9 font-mono bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
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
                className="w-full bg-blue-50/50 dark:bg-blue-900/10 rounded-lg px-4 border border-blue-100 dark:border-blue-900/30"
              >
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:no-underline py-3">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4" /> Hướng dẫn lấy thông tin Jira
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pb-4">
                    <p>
                      1. <b>URL & Key:</b> Vào dự án Jira, URL là{" "}
                      <code>https://[domain].atlassian.net</code>. Key là tiền
                      tố của task (VD: <b>SCRUM</b>-123).
                    </p>
                    <p>
                      2. <b>Board ID:</b> Mở Board của bạn, nhìn lên URL tìm
                      tham số{" "}
                      <code>
                        ?rapidView=<b>5</b>
                      </code>{" "}
                      hoặc{" "}
                      <code>
                        board/<b>5</b>
                      </code>
                      . Số <b>5</b> là Board ID.
                    </p>
                    <p>
                      3. <b>API Token:</b> Truy cập{" "}
                      <a
                        href="https://id.atlassian.com/manage-profile/security/api-tokens"
                        target="_blank"
                        className="text-blue-500 dark:text-blue-400 underline"
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
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  GitHub Config
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    Repository URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      placeholder="https://github.com/username/repo-name"
                      className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                      value={formData.github_repo_url}
                      onChange={(e) =>
                        handleChange("github_repo_url", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    Personal Access Token (Classic){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="pl-9 font-mono bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
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
                className="w-full bg-slate-100/50 dark:bg-slate-900/50 rounded-lg px-4 border border-slate-200 dark:border-slate-800"
              >
                <AccordionItem value="item-2" className="border-none">
                  <AccordionTrigger className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:no-underline py-3">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4" /> Hướng dẫn lấy Github Token
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pb-4">
                    <p>
                      1. Truy cập: <b>Settings</b> -&gt;{" "}
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
                      <code>ghp_...</code>).
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#F27124] hover:bg-[#d45d1d] text-white"
          >
            {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
            Lưu cấu hình
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
