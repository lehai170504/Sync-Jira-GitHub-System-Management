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
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function JiraForm() {
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Mock state: Giả sử đã kết nối (Logic này bạn lấy từ DB thật)
  const isConnected = false;

  const form = useForm<JiraConfigValues>({
    resolver: zodResolver(jiraConfigSchema),
    defaultValues: {
      domainUrl: "",
      email: "",
      apiToken: "",
    },
  });

  async function onSubmit(values: JiraConfigValues) {
    setLoading(true);
    const result = await updateJiraConfig(values);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
  }

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      {/* BRAND HEADER */}
      <div className="bg-[#0052CC] p-6 text-white flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
              className="w-6 h-6"
              alt="Jira"
            />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Jira Software</CardTitle>
            <CardDescription className="text-blue-100 mt-1">
              Đồng bộ User Stories & Story Points
            </CardDescription>
          </div>
        </div>
        {isConnected ? (
          <Badge className="bg-green-400/20 text-green-100 hover:bg-green-400/20 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Đã kết nối
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-0"
          >
            Chưa kết nối
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="domainUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain URL</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Admin</FormLabel>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>API Token</FormLabel>
                      <a
                        href="https://id.atlassian.com/manage-profile/security/api-tokens"
                        target="_blank"
                        className="text-xs text-[#0052CC] hover:underline flex items-center gap-1"
                      >
                        Lấy token ở đâu? <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
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

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-[#0052CC] hover:bg-[#0747A6] min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Checking...
                  </>
                ) : (
                  "Lưu cấu hình"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
