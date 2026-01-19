"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  githubConfigSchema,
  GithubConfigValues,
} from "@/lib/validations/config.schema";
import { updateGithubConfig } from "@/server/actions/config-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Github,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Plug,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function GithubFormLeader() {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  // Mock state: Giả sử đã kết nối (Logic này bạn lấy từ DB thật)
  const isConnected = connectionStatus.status === "success";

  const form = useForm<GithubConfigValues>({
    resolver: zodResolver(githubConfigSchema),
    defaultValues: {
      repoUrl: "",
      accessToken: "",
    },
  });

  // Helper: Normalize repo URL (đảm bảo có https://)
  function normalizeRepoUrl(url: string): string {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  // Hàm Test Connection riêng
  async function handleTestConnection() {
    const values = form.getValues();
    
    // Validate form trước khi test
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi test kết nối");
      return;
    }

    setTesting(true);
    setConnectionStatus({ status: "idle" });

    try {
      // Normalize repo URL
      const normalizedUrl = normalizeRepoUrl(values.repoUrl);
      
      // Giả lập test connection (delay 2 giây)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock: Random success/error để demo
      const mockSuccess = Math.random() > 0.3; // 70% success rate

      if (mockSuccess) {
        setConnectionStatus({
          status: "success",
          message: "Kết nối thành công! Repository và Token hợp lệ.",
        });
        toast.success("Kết nối GitHub thành công!");
      } else {
        setConnectionStatus({
          status: "error",
          message: "Không thể kết nối. Vui lòng kiểm tra lại Repository URL hoặc Access Token.",
        });
        toast.error("Kết nối thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      setConnectionStatus({
        status: "error",
        message: "Lỗi kết nối. Vui lòng thử lại sau.",
      });
      toast.error("Có lỗi xảy ra khi test kết nối");
    } finally {
      setTesting(false);
    }
  }

  // Hàm Submit để lưu cấu hình
  async function onSubmit(values: GithubConfigValues) {
    // Nếu chưa test connection, yêu cầu test trước
    if (connectionStatus.status !== "success") {
      toast.info("Vui lòng test kết nối trước khi lưu cấu hình", {
        description: "Nhấn nút 'Test Connection' để kiểm tra thông tin đăng nhập.",
      });
      return;
    }

    setLoading(true);
    
    // Normalize repo URL trước khi submit
    const normalizedValues = {
      ...values,
      repoUrl: normalizeRepoUrl(values.repoUrl),
    };
    
    const result = await updateGithubConfig(normalizedValues);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
  }

  return (
    <Card className="border-none shadow-lg overflow-hidden -mt-5">
      {/* BRAND HEADER */}
      <div className="bg-[#181717] p-6 text-white flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg shadow-sm border border-white/10">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">
              GitHub Repository
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              Cấu hình kết nối GitHub để đồng bộ Commit History & Lines of Code
            </CardDescription>
          </div>
        </div>
        {isConnected ? (
          <Badge className="bg-green-500/20 text-green-200 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Đã kết nối
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-white/10 text-gray-300 hover:bg-white/20 border-0"
          >
            Chưa kết nối
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ALERT: Connection Status */}
            {connectionStatus.status !== "idle" && (
              <Alert
                className={
                  connectionStatus.status === "success"
                    ? "bg-green-50 border-green-200 text-green-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }
              >
                {connectionStatus.status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className="mt-1">
                  {connectionStatus.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Repository URL Field */}
            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormDescription className="text-xs">
                    Nhập URL đầy đủ của GitHub repository (có thể là public hoặc private)
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/project-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Access Token Field */}
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Personal Access Token</FormLabel>
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#181717] hover:underline flex items-center gap-1 font-medium"
                    >
                      Tạo Token (Classic) <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <FormDescription className="text-xs">
                    Token để xác thực API requests (yêu cầu quyền <b>repo</b> cho private repository)
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showToken ? "text" : "password"}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing || loading}
                className="w-full sm:w-auto"
              >
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <Plug className="mr-2 h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
              <Button
                type="submit"
                disabled={loading || testing || connectionStatus.status !== "success"}
                className="w-full sm:w-auto bg-[#181717] hover:bg-[#333] min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu cấu hình"
                )}
              </Button>
            </div>

            {/* Helper Text */}
            {connectionStatus.status !== "success" && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                💡 <strong>Lưu ý:</strong> Vui lòng test kết nối trước khi lưu cấu hình.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

