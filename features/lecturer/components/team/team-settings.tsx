import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trello, Github } from "lucide-react";

export function TeamSettings() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Cấu hình Dự án</CardTitle>
          <CardDescription>
            Quản lý liên kết repository và tên đề tài
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Tên Đề tài</Label>
            <Input
              id="topic"
              defaultValue="Hệ thống Thương mại điện tử tích hợp AI"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jira">Đường dẫn Jira</Label>
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
              <Label htmlFor="github">Đường dẫn GitHub</Label>
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
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-xl">
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] text-white">
            Lưu thay đổi
          </Button>
        </div>
      </Card>
    </div>
  );
}
