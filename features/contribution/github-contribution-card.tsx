"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { GithubContributionItem } from "./types";

type Props = {
  data: GithubContributionItem[];
  colors: string[];
  totalCommits: number;
};

export function GithubContributionCard({ data, colors, totalCommits }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">GitHub Contribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((m, index) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border bg-background">
                <AvatarFallback
                  className="text-[10px] font-semibold text-white"
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Commits: <span className="font-semibold">{m.commits}</span> • LOC:{" "}
                  <span className="font-semibold">{m.loc}</span> ({m.percent}%)
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{m.percent}%</p>
              <p className="text-[11px] text-muted-foreground">
                {totalCommits ? ((m.commits / totalCommits) * 100).toFixed(1) : "0"}% trên tổng
                commits
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


