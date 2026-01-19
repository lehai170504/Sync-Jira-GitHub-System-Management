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
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function GithubForm() {
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Mock state
  const isConnected = false;

  const form = useForm<GithubConfigValues>({
    resolver: zodResolver(githubConfigSchema),
    defaultValues: {
      repoUrl: "",
      accessToken: "",
    },
  });

  async function onSubmit(values: GithubConfigValues) {
    setLoading(true);
    const result = await updateGithubConfig(values);
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
              Đồng bộ Commit History & Lines of Code
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
            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
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
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Tạo Token (Classic) <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Yêu cầu quyền <b>repo</b> để truy cập private repository.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-[#181717] hover:bg-[#333] min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Checking...
                  </>
                ) : (
                  "Lưu kết nối"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
