// src/components/features/dashboard/leader-view.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LeaderDashboard() {
  return (
    <div className="space-y-6">
      {/* TEAM HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl text-white flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">Team 1 - E-Commerce App</h2>
          <p className="text-slate-300">
            Sprint 4: Payment Integration (Còn 3 ngày)
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#F27124]">72%</div>
          <div className="text-xs text-slate-400">Hoàn thành Sprint</div>
        </div>
      </div>

      {/* MEMBER WORKLOAD */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {["An Nguyễn", "Bình Trần", "Cường Lê"].map((member, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`}
                />
                <AvatarFallback>{member.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{member}</CardTitle>
                <CardDescription className="text-xs">
                  Frontend Dev
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Tasks (Jira)</span>
                    <span className="font-medium">4/6 Done</span>
                  </div>
                  <Progress value={66} className="h-2" />
                </div>
                <div className="flex justify-between text-xs border-t pt-2">
                  <span className="flex items-center gap-1">
                    <GitPullRequest className="h-3 w-3" /> 2 PRs open
                  </span>
                  <span className="text-green-600 font-medium">On Track</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TASKS STATUS */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Đang thực hiện (In Progress)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded-lg border flex gap-3"
              >
                <div className="mt-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Integrate VNPay Gateway</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      Backend
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      An Nguyễn
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cần Review (Code Review)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1].map((i) => (
              <div
                key={i}
                className="p-3 bg-orange-50/50 rounded-lg border border-orange-100 flex gap-3"
              >
                <div className="mt-1">
                  <GitPullRequest className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Fix layout mobile responsive
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                      Frontend
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Bình Trần
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto h-7 text-xs"
                >
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
