"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateTeamConfig } from "@/features/management/teams/hooks/use-update-team-config";
import { UpdateTeamConfigPayload } from "@/features/management/teams/types";

interface TeamConfigFormProps {
  teamId: string | undefined;
}

export function TeamConfigForm({ teamId }: TeamConfigFormProps) {
  const { mutate: updateConfig, isPending } = useUpdateTeamConfig(teamId);

  const [formData, setFormData] = useState<UpdateTeamConfigPayload>({
    jira_url: "",
    jira_project_key: "",
    jira_board_id: 1,
    api_token_jira: "",
    github_repo_url: "",
    api_token_github: "",
  });

  const handleChange = (field: keyof UpdateTeamConfigPayload, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      return;
    }
    updateConfig(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* JIRA SECTION */}
      <Card className="border-l-4 border-l-[#0052CC]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
              alt="Jira"
              className="w-6 h-6"
            />
            Jira Software Configuration
          </CardTitle>
          <CardDescription>
            Cấu hình tích hợp Jira để đồng bộ tasks và sprints từ Jira board.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Jira URL */}
          <div className="space-y-2">
            <Label htmlFor="jira_url">
              Jira URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jira_url"
              type="url"
              placeholder="https://your-domain.atlassian.net"
              value={formData.jira_url}
              onChange={(e) => handleChange("jira_url", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL của Jira instance (ví dụ: https://your-domain.atlassian.net)
            </p>
          </div>

          {/* Jira Project Key */}
          <div className="space-y-2">
            <Label htmlFor="jira_project_key">
              Project Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jira_project_key"
              type="text"
              placeholder="PROJ"
              value={formData.jira_project_key}
              onChange={(e) => handleChange("jira_project_key", e.target.value.toUpperCase())}
              required
            />
            <p className="text-xs text-muted-foreground">
              Key của Jira project (ví dụ: PROJ, DEV)
            </p>
          </div>

          {/* Jira Board ID */}
          <div className="space-y-2">
            <Label htmlFor="jira_board_id">
              Board ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jira_board_id"
              type="number"
              placeholder="1"
              value={formData.jira_board_id}
              onChange={(e) => handleChange("jira_board_id", parseInt(e.target.value) || 1)}
              required
              min="1"
            />
            <p className="text-xs text-muted-foreground">
              ID của Jira board (số nguyên dương)
            </p>
          </div>

          {/* Jira API Token */}
          <div className="space-y-2">
            <Label htmlFor="api_token_jira">
              API Token <span className="text-red-500">*</span>
            </Label>
            <Input
              id="api_token_jira"
              type="password"
              placeholder="Nhập API token của Jira"
              value={formData.api_token_jira}
              onChange={(e) => handleChange("api_token_jira", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              API token để xác thực với Jira API
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GITHUB SECTION */}
      <Card className="border-l-4 border-l-[#24292F]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub Configuration
          </CardTitle>
          <CardDescription>
            Cấu hình tích hợp GitHub để đồng bộ commits từ repository.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* GitHub Repo URL */}
          <div className="space-y-2">
            <Label htmlFor="github_repo_url">
              Repository URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="github_repo_url"
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.github_repo_url}
              onChange={(e) => handleChange("github_repo_url", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL của GitHub repository (ví dụ: https://github.com/username/repo)
            </p>
          </div>

          {/* GitHub API Token */}
          <div className="space-y-2">
            <Label htmlFor="api_token_github">
              API Token <span className="text-red-500">*</span>
            </Label>
            <Input
              id="api_token_github"
              type="password"
              placeholder="Nhập API token của GitHub"
              value={formData.api_token_github}
              onChange={(e) => handleChange("api_token_github", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Personal Access Token (PAT) để xác thực với GitHub API
            </p>
          </div>
        </CardContent>
      </Card>

      {/* INFO ALERT */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Lưu ý: Tất cả các field trên đều bắt buộc. Sau khi cấu hình và nhấn "Lưu cấu hình", hệ thống sẽ tự động đồng bộ dữ liệu từ cả Jira và GitHub.
        </AlertDescription>
      </Alert>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isPending || !teamId}
          className="bg-primary hover:bg-primary/90 min-w-[150px]"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu cấu hình
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
