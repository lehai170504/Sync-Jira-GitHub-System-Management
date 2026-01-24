"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jiraConfigSchema,
  JiraConfigValues,
} from "@/lib/validations/config.schema";
import { updateJiraConfig } from "@/server/actions/config-actions";

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

export function JiraFormLeader() {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  // Mock state: Giả sử đã kết nối (Logic này bạn lấy từ DB thật)
  const isConnected = connectionStatus.status === "success";

  const form = useForm<JiraConfigValues>({
    resolver: zodResolver(jiraConfigSchema),
    defaultValues: {
      domainUrl: "",
      email: "",
      apiToken: "",
    },
  });

  // Helper: Normalize domain URL (thêm https:// nếu chưa có)
  function normalizeDomainUrl(domain: string): string {
    if (!domain) return "";
    const trimmed = domain.trim();
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
      // Normalize domain URL
      const normalizedDomain = normalizeDomainUrl(values.domainUrl);
      
      // Giả lập test connection (delay 2 giây)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock: Random success/error để demo
      const mockSuccess = Math.random() > 0.3; // 70% success rate

      if (mockSuccess) {
        setConnectionStatus({
          status: "success",
          message: "Kết nối thành công! Thông tin xác thực hợp lệ.",
        });
        toast.success("Kết nối Jira thành công!");
      } else {
        setConnectionStatus({
          status: "error",
          message: "Không thể kết nối. Vui lòng kiểm tra lại Domain, Email hoặc API Token.",
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
  async function onSubmit(values: JiraConfigValues) {
    // Nếu chưa test connection, yêu cầu test trước
    if (connectionStatus.status !== "success") {
      toast.info("Vui lòng test kết nối trước khi lưu cấu hình", {
        description: "Nhấn nút 'Test Connection' để kiểm tra thông tin đăng nhập.",
      });
      return;
    }

    setLoading(true);
    
    // Normalize domain URL trước khi submit
    const normalizedValues = {
      ...values,
      domainUrl: normalizeDomainUrl(values.domainUrl),
    };
    
    const result = await updateJiraConfig(normalizedValues);
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
      <div className="bg-[#0052CC] p-4 md:p-6 text-white flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Jira"
            />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base md:text-lg text-white">Jira Software</CardTitle>
            <CardDescription className="text-blue-100 mt-1 text-xs md:text-sm">
              <span className="hidden sm:inline">Cấu hình kết nối Jira để đồng bộ User Stories & Story Points</span>
              <span className="sm:hidden">Đồng bộ User Stories & Story Points</span>
            </CardDescription>
          </div>
        </div>
        {isConnected ? (
          <Badge className="bg-green-400/20 text-green-100 hover:bg-green-400/20 border-0 shrink-0">
            <CheckCircle2 className="w-3 h-3 mr-1" /> <span className="hidden sm:inline">Đã kết nối</span><span className="sm:hidden">Kết nối</span>
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-0 shrink-0"
          >
            <span className="hidden sm:inline">Chưa kết nối</span><span className="sm:hidden">Chưa kết nối</span>
          </Badge>
        )}
      </div>

      <CardContent className="p-4 md:p-6">
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

            {/* Domain URL Field */}
            <FormField
              control={form.control}
              name="domainUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain URL</FormLabel>
                  <FormDescription className="text-xs">
                    Nhập domain Jira của bạn (không cần https://)
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                        https://
                      </span>
                      <Input
                        placeholder="your-project.atlassian.net"
                        className="pl-16"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email & API Token Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Admin</FormLabel>
                    <FormDescription className="text-xs">
                      Email tài khoản Jira của bạn
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiToken"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <FormLabel>API Token</FormLabel>
                      <a
                        href="https://id.atlassian.com/manage-profile/security/api-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0052CC] hover:underline flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">Lấy token ở đâu?</span>
                        <span className="sm:hidden">Hướng dẫn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <FormDescription className="text-xs">
                      Token để xác thực API requests
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showToken ? "text" : "password"}
                          placeholder="••••••••••••••••••••"
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing || loading}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Đang kiểm tra...</span>
                    <span className="sm:hidden">Đang kiểm tra</span>
                  </>
                ) : (
                  <>
                    <Plug className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Test Connection</span>
                    <span className="sm:hidden">Test</span>
                  </>
                )}
              </Button>
              <Button
                type="submit"
                disabled={loading || testing || connectionStatus.status !== "success"}
                className="w-full sm:w-auto bg-[#0052CC] hover:bg-[#0747A6] min-w-[140px] order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Đang lưu...</span>
                    <span className="sm:hidden">Đang lưu</span>
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

