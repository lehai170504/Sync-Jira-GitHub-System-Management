import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, GitCommit, Users, Calculator } from "lucide-react";

export function ScoreBreakdown() {
  // Config trọng số (Giả sử lấy từ DB)
  const weights = { jira: 40, github: 40, review: 20 };

  // Điểm hiện tại (Thang 10)
  const scores = { jira: 8.5, github: 9.2, review: 7.8 };

  // Tính điểm tổng: (8.5 * 0.4) + (9.2 * 0.4) + (7.8 * 0.2) = 8.64
  const finalScore =
    scores.jira * (weights.jira / 100) +
    scores.github * (weights.github / 100) +
    scores.review * (weights.review / 100);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          Bảng tính điểm chi tiết
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* JIRA SECTION */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span className="font-medium">
                Jira Tasks (Trọng số {weights.jira}%)
              </span>
            </div>
            <span className="font-bold">{scores.jira}/10</span>
          </div>
          <Progress
            value={scores.jira * 10}
            className="h-2 bg-blue-100"
            indicatorColor="bg-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Đã hoàn thành 12/15 Story Points. Không có task trễ hạn.
          </p>
        </div>

        {/* GITHUB SECTION */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-slate-800" />
              <span className="font-medium">
                GitHub Activity (Trọng số {weights.github}%)
              </span>
            </div>
            <span className="font-bold">{scores.github}/10</span>
          </div>
          <Progress
            value={scores.github * 10}
            className="h-2 bg-slate-100"
            indicatorColor="bg-slate-800"
          />
          <p className="text-xs text-muted-foreground">
            35 Commits hợp lệ. 1200 dòng code sạch (đã trừ code rác).
          </p>
        </div>

        {/* PEER REVIEW SECTION */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="font-medium">
                Peer Review (Trọng số {weights.review}%)
              </span>
            </div>
            <span className="font-bold">{scores.review}/10</span>
          </div>
          <Progress
            value={scores.review * 10}
            className="h-2 bg-orange-100"
            indicatorColor="bg-orange-500"
          />
          <p className="text-xs text-muted-foreground">
            Được đánh giá cao về tinh thần teamwork. Cần cải thiện giao tiếp.
          </p>
        </div>

        {/* TOTAL SCORE */}
        <div className="pt-4 mt-4 border-t flex justify-between items-center">
          <span className="text-lg font-bold text-slate-700">
            Tổng kết Sprint
          </span>
          <Badge className="text-lg px-3 py-1 bg-emerald-600 hover:bg-emerald-700">
            {finalScore.toFixed(2)} / 10
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
