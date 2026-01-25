"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { JiraFormLeader } from "@/features/integration/components/config/jira-form-leader";
import { GithubFormLeader } from "@/features/integration/components/config/github-form-leader";

export default function ConfigPage() {

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Cấu hình tích hợp
            </h2>
            <p className="text-muted-foreground mt-1">
              Kết nối và quản lý tích hợp với Jira và GitHub để đồng bộ dữ liệu dự án.
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* MAIN CONTENT */}
      <Tabs defaultValue="jira" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-muted/50 p-1">
            <TabsTrigger
              value="jira"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-jira-3628861-3030021.png"
                alt="Jira"
                className="w-4 h-4"
              />
              <span className="font-medium">Jira Software</span>
            </TabsTrigger>
            <TabsTrigger
              value="github"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <svg
                className="w-4 h-4"
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
              <span className="font-medium">GitHub</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* JIRA TAB */}
        <TabsContent
          value="jira"
          className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
        >
          <JiraFormLeader />
        </TabsContent>

        {/* GITHUB TAB */}
        <TabsContent
          value="github"
          className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
        >
          <GithubFormLeader />
        </TabsContent>
      </Tabs>
    </div>
  );
}

