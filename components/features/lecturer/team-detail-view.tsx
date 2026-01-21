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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Github,
  Trello,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Search,
  LayoutDashboard,
  Settings,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- MOCK DATA ---
const JIRA_TASKS = [
  {
    id: "J-101",
    title: "Thiết kế Database Schema",
    assignee: "Nguyen Van A",
    status: "Done",
    priority: "High",
    type: "Task",
  },
  {
    id: "J-102",
    title: "API Authentication (JWT)",
    assignee: "Le Van C",
    status: "Done",
    priority: "High",
    type: "Story",
  },
  {
    id: "J-103",
    title: "UI Trang chủ (Homepage)",
    assignee: "Tran Thi B",
    status: "In Progress",
    priority: "Medium",
    type: "Story",
  },
  {
    id: "J-104",
    title: "Integrate VNPay Payment",
    assignee: "Nguyen Van A",
    status: "In Progress",
    priority: "High",
    type: "Task",
  },
  {
    id: "J-105",
    title: "Fix bug login Google",
    assignee: "Pham Minh D",
    status: "To Do",
    priority: "Critical",
    type: "Bug",
  },
  {
    id: "J-106",
    title: "Viết Unit Test Module User",
    assignee: "Pham Minh D",
    status: "To Do",
    priority: "Low",
    type: "Task",
  },
];

const COMMIT_HISTORY = [
  {
    hash: "a1b2c3d",
    msg: "feat: init project structure",
    author: "Nguyen Van A",
    date: "2026-01-10",
    additions: 150,
    deletions: 0,
  },
  {
    hash: "x9y8z7w",
    msg: "fix: login validation logic",
    author: "Le Van C",
    date: "2026-01-12",
    additions: 45,
    deletions: 12,
  },
  {
    hash: "m5n6o7p",
    msg: "style: update homepage header",
    author: "Tran Thi B",
    date: "2026-01-13",
    additions: 80,
    deletions: 20,
  },
  {
    hash: "q1w2e3r",
    msg: "docs: update readme",
    author: "Pham Minh D",
    date: "2026-01-14",
    additions: 10,
    deletions: 5,
  },
  {
    hash: "k9l8j7h",
    msg: "feat: add payment gateway",
    author: "Nguyen Van A",
    date: "2026-01-15",
    additions: 210,
    deletions: 30,
  },
];

const MEMBER_STATS = [
  { name: "NV A", commits: 25, tasks: 12, role: "Leader" },
  { name: "TT B", commits: 18, tasks: 10, role: "Frontend" },
  { name: "LV C", commits: 30, tasks: 15, role: "Backend" },
  { name: "PM D", commits: 5, tasks: 4, role: "Tester" },
];

interface TeamDetailViewProps {
  teamId: string;
  teamName: string;
}

export function TeamDetailView({ teamName }: TeamDetailViewProps) {
  // Jira task filtering
  const todoTasks = JIRA_TASKS.filter((t) => t.status === "To Do");
  const inProgressTasks = JIRA_TASKS.filter((t) => t.status === "In Progress");
  const doneTasks = JIRA_TASKS.filter((t) => t.status === "Done");

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* 1. PROJECT INFO HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {teamName}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 rounded-md"
            >
              Sprint 3
            </Badge>
            <span>•</span>
            <span className="font-medium text-gray-700">
              Topic: AI-Powered E-Commerce Recommendation System
            </span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((avt, i) => (
                <Avatar
                  key={i}
                  className="border-2 border-white w-8 h-8 ring-1 ring-gray-100"
                >
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xs font-bold">
                    {avt}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              4 members active
            </span>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="flex gap-4">
          <Card className="shadow-sm border border-gray-100 bg-white w-36">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                Velocity
              </p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-2xl font-bold text-gray-900">24</span>
                <span className="text-xs text-green-600 font-medium mb-1">
                  pts
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-100 bg-white w-36">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                Commits
              </p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-2xl font-bold text-[#F27124]">78</span>
                <span className="text-xs text-gray-400 font-medium mb-1">
                  total
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. MAIN CONTENT TABS */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100/50 p-1 rounded-xl border border-gray-200 inline-flex h-auto">
            <TabsTrigger
              value="overview"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <LayoutDashboard className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="jira"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0052CC] data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <Trello className="h-4 w-4" /> Jira Board
            </TabsTrigger>
            <TabsTrigger
              value="github"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <Github className="h-4 w-4" /> GitHub Repo
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
            >
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-9 gap-2"
            >
              <ArrowUpRight className="h-4 w-4" /> External Links
            </Button>
          </div>
        </div>

        {/* --- TAB: OVERVIEW (Combined view) --- */}
        <TabsContent value="overview" className="space-y-6">
          {/* Member Contribution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {MEMBER_STATS.map((mem, idx) => (
              <Card
                key={idx}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-100">
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">
                      {mem.name.split(" ")[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {mem.name}
                    </p>
                    <p className="text-xs text-gray-500">{mem.role}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs font-medium text-gray-900">
                      {mem.tasks} Tasks
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {mem.commits} Commits
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Progress */}
            <Card className="lg:col-span-2 border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Project Progress</CardTitle>
                <CardDescription>
                  Overall completion based on Jira tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="font-bold text-gray-900">65%</span>
                  </div>
                  <Progress
                    value={65}
                    className="h-2 bg-gray-100"
                    indicatorColor="bg-green-500"
                  />
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">To Do</div>
                      <div className="text-xl font-bold text-gray-700">
                        {todoTasks.length}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-blue-600 mb-1">
                        In Progress
                      </div>
                      <div className="text-xl font-bold text-blue-700">
                        {inProgressTasks.length}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-600 mb-1">Done</div>
                      <div className="text-xl font-bold text-green-700">
                        {doneTasks.length}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity (Mini) */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4">
                    {COMMIT_HISTORY.slice(0, 4).map((commit, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1 p-1.5 bg-gray-100 rounded-full">
                          <GitCommit className="h-3 w-3 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 line-clamp-1">
                            {commit.msg}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {commit.author} • {commit.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: JIRA KANBAN BOARD --- */}
        <TabsContent value="jira" className="space-y-6 h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* TO DO COLUMN */}
            <div className="flex flex-col bg-gray-50/50 rounded-xl border border-gray-200 h-full">
              <div className="p-3 border-b border-gray-200 bg-gray-100/50 rounded-t-xl flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span> To
                  Do
                </span>
                <Badge
                  variant="secondary"
                  className="bg-white text-gray-600 border border-gray-200"
                >
                  {todoTasks.length}
                </Badge>
              </div>
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                  {todoTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* IN PROGRESS COLUMN */}
            <div className="flex flex-col bg-blue-50/30 rounded-xl border border-blue-100 h-full">
              <div className="p-3 border-b border-blue-100 bg-blue-50/50 rounded-t-xl flex justify-between items-center">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>{" "}
                  In Progress
                </span>
                <Badge
                  variant="secondary"
                  className="bg-white text-blue-700 border border-blue-200"
                >
                  {inProgressTasks.length}
                </Badge>
              </div>
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                  {inProgressTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* DONE COLUMN */}
            <div className="flex flex-col bg-green-50/30 rounded-xl border border-green-100 h-full">
              <div className="p-3 border-b border-green-100 bg-green-50/50 rounded-t-xl flex justify-between items-center">
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                  Done
                </span>
                <Badge
                  variant="secondary"
                  className="bg-white text-green-700 border border-green-200"
                >
                  {doneTasks.length}
                </Badge>
              </div>
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                  {doneTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        {/* --- TAB: GITHUB REPO --- */}
        <TabsContent value="github" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contributions Chart */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-[#F27124]" /> Contributions
                  (Commits)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MEMBER_STATS}
                    layout="vertical"
                    margin={{ left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={40}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#f9fafb" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="commits"
                      fill="#1f2937"
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* PR Stats */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-purple-600" /> Pull
                  Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-green-600 shadow-sm">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Merged PRs
                      </p>
                      <p className="text-xs text-gray-500">Last 30 days</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-green-700">12</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-orange-600 shadow-sm">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Open PRs
                      </p>
                      <p className="text-xs text-gray-500">Needs review</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-orange-700">3</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commit Table */}
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Commit History</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search commits..."
                    className="pl-8 h-9 bg-white border-gray-200"
                  />
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Message</th>
                    <th className="px-6 py-3 font-medium">Author</th>
                    <th className="px-6 py-3 font-medium">Changes</th>
                    <th className="px-6 py-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COMMIT_HISTORY.map((commit, i) => (
                    <tr
                      key={i}
                      className="bg-white hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <GitCommit className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {commit.msg}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              {commit.hash}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-gray-100">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px]">
                              {commit.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-700">{commit.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-medium">
                          +{commit.additions}
                        </span>
                        <span className="text-gray-300 mx-2">/</span>
                        <span className="text-red-500 font-medium">
                          -{commit.deletions}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {commit.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* --- TAB: SETTINGS (Editable Info) --- */}
        <TabsContent
          value="settings"
          className="max-w-2xl mx-auto space-y-6 py-4"
        >
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Project Settings</CardTitle>
              <CardDescription>
                Manage repository links and topic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Project Topic</Label>
                <Input
                  id="topic"
                  defaultValue="AI-Powered E-Commerce Recommendation System"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jira">Jira URL</Label>
                  <div className="relative">
                    <Trello className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
                    <Input
                      id="jira"
                      defaultValue="https://jira.atlassian.com/..."
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-2.5 h-4 w-4 text-black" />
                    <Input
                      id="github"
                      defaultValue="https://github.com/..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 1. Định nghĩa kiểu dữ liệu cho Task
interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  priority: string; // Hoặc dùng Union type nếu muốn chặt chẽ: 'High' | 'Medium' | 'Low' | 'Critical'
  type: string; // Hoặc: 'Bug' | 'Story' | 'Task'
  status?: string; // Cho thêm vào nếu data gốc có, đánh dấu ? nếu không bắt buộc
}

// 2. Áp dụng vào component
function TaskCard({ task }: { task: TaskItem }) {
  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
          {task.id}
        </span>
        {task.priority === "High" || task.priority === "Critical" ? (
          <Badge
            variant="destructive"
            className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-tight bg-red-100 text-red-700 hover:bg-red-200 border-0"
          >
            {task.priority}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="h-5 px-1.5 text-[10px] text-gray-500 uppercase border-gray-200 bg-gray-50"
          >
            {task.priority}
          </Badge>
        )}
      </div>
      <p className="text-sm font-medium text-gray-800 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
        {task.title}
      </p>
      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          {task.type === "Bug" ? (
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
          ) : task.type === "Story" ? (
            <FileText className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
          )}
          <span className="text-[10px] font-medium text-gray-500">
            {task.type}
          </span>
        </div>
        <Avatar className="h-5 w-5 ring-1 ring-white">
          <AvatarFallback className="text-[9px] bg-indigo-50 text-indigo-600 font-bold">
            {task.assignee.split(" ").pop()?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
