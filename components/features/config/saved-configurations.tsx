"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Lock,
  Globe,
  Mail,
  Key,
  ExternalLink,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Helper: Mask token (chỉ hiển thị 4 ký tự đầu và cuối)
function maskToken(token: string): string {
  if (!token || token.length < 8) return "••••••••";
  const start = token.substring(0, 4);
  const end = token.substring(token.length - 4);
  const masked = "•".repeat(Math.max(8, token.length - 8));
  return `${start}${masked}${end}`;
}

// Mock data: Saved configurations
const mockSavedConfigs = {
  jira: {
    domainUrl: "https://myproject.atlassian.net",
    email: "admin@example.com",
    apiToken: "ATATT3xFfGF0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    savedAt: "2026-01-15T10:30:00Z",
    status: "connected" as const,
  },
  github: {
    repoUrl: "https://github.com/username/project-name",
    accessToken: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    savedAt: "2026-01-15T11:00:00Z",
    status: "connected" as const,
  },
};

interface SavedConfigurationsProps {
  onEdit?: (type: "jira" | "github") => void;
}

export function SavedConfigurations({ onEdit }: SavedConfigurationsProps) {
  const [showJiraToken, setShowJiraToken] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [hasConfigs, setHasConfigs] = useState(true); // Mock: giả sử đã có config

  // Mock: Xóa config
  const handleDelete = async (type: "jira" | "github") => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success(`Đã xóa cấu hình ${type === "jira" ? "Jira" : "GitHub"}`);
    setHasConfigs(false);
  };

  if (!hasConfigs) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có cấu hình nào</h3>
          <p className="text-sm text-muted-foreground text-center">
            Vui lòng cấu hình Jira hoặc GitHub ở các tab trên để bắt đầu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* JIRA CONFIGURATION CARD */}
      <Card className="border-l-4 border-l-[#0052CC]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0052CC]/10 rounded-lg">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
                  className="w-6 h-6"
                  alt="Jira"
                />
              </div>
              <div>
                <CardTitle className="text-lg">Jira Software</CardTitle>
                <CardDescription className="mt-1">
                  Cấu hình đã lưu và đang hoạt động
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Đã kết nối
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Domain URL */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Domain URL
              </p>
              <p className="text-sm font-mono">{mockSavedConfigs.jira.domainUrl}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Email Admin
              </p>
              <p className="text-sm">{mockSavedConfigs.jira.email}</p>
            </div>
          </div>

          {/* API Token (Masked) */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                API Token (Đã mã hóa)
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono">
                  {showJiraToken
                    ? mockSavedConfigs.jira.apiToken
                    : maskToken(mockSavedConfigs.jira.apiToken)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setShowJiraToken(!showJiraToken)}
                >
                  {showJiraToken ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Token được mã hóa và lưu trữ an toàn
              </p>
            </div>
          </div>

          {/* Saved Date */}
          <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <span>
              Đã lưu: {new Date(mockSavedConfigs.jira.savedAt).toLocaleString("vi-VN")}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onEdit?.("jira")}
              >
                <Edit className="h-3 w-3 mr-1" /> Chỉnh sửa
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3 mr-1" /> Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa cấu hình</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa cấu hình Jira này? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete("jira")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GITHUB CONFIGURATION CARD */}
      <Card className="border-l-4 border-l-[#181717]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#181717]/10 rounded-lg">
                <ExternalLink className="w-6 h-6 text-[#181717]" />
              </div>
              <div>
                <CardTitle className="text-lg">GitHub Repository</CardTitle>
                <CardDescription className="mt-1">
                  Cấu hình đã lưu và đang hoạt động
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Đã kết nối
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Repository URL */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Repository URL
              </p>
              <p className="text-sm font-mono break-all">
                {mockSavedConfigs.github.repoUrl}
              </p>
            </div>
          </div>

          {/* Access Token (Masked) */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Access Token (Đã mã hóa)
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono">
                  {showGithubToken
                    ? mockSavedConfigs.github.accessToken
                    : maskToken(mockSavedConfigs.github.accessToken)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setShowGithubToken(!showGithubToken)}
                >
                  {showGithubToken ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Token được mã hóa và lưu trữ an toàn
              </p>
            </div>
          </div>

          {/* Saved Date */}
          <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <span>
              Đã lưu: {new Date(mockSavedConfigs.github.savedAt).toLocaleString("vi-VN")}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onEdit?.("github")}
              >
                <Edit className="h-3 w-3 mr-1" /> Chỉnh sửa
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3 mr-1" /> Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa cấu hình</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa cấu hình GitHub này? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete("github")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

