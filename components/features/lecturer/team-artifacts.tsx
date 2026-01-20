"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Box, Eye } from "lucide-react";

export function TeamArtifacts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* CỘT TRÁI: TÀI LIỆU YÊU CẦU (SRS) */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#F27124]" /> Tài liệu Yêu cầu (SRS)
        </h3>

        {/* SRS Card Generated from Jira */}
        <Card className="border-l-4 border-l-[#F27124]">
          <CardHeader>
            <CardTitle className="text-base">
              SRS v1.0 - Generated from Jira
            </CardTitle>
            <CardDescription>Cập nhật lần cuối: 2 giờ trước</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc pl-4 space-y-1">
              <li>34 User Stories</li>
              <li>12 Functional Requirements</li>
              <li>5 Non-functional Requirements</li>
            </ul>
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              size="sm"
              className="w-full bg-[#F27124] hover:bg-[#d65d1b]"
            >
              <Eye className="mr-2 h-4 w-4" /> Xem Online
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Xuất PDF
            </Button>
          </CardFooter>
        </Card>

        {/* Other Docs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tài liệu Thiết kế (Architecture)
            </CardTitle>
            <CardDescription>Do sinh viên upload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-600 underline cursor-pointer text-sm">
              <FileText className="h-4 w-4" /> System_Design_v2.pdf
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CỘT PHẢI: SẢN PHẨM (DELIVERABLES) */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Box className="h-5 w-5 text-blue-600" /> Sản phẩm Bàn giao
        </h3>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-black text-white p-2 rounded-full">
                  <Box className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">GitHub Repository</p>
                  <p className="text-xs text-muted-foreground">Main branch</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deployment (Demo)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white p-2 rounded-full">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Live Demo URL</p>
                  <p className="text-xs text-green-700">Status: Online</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-green-700">
                Truy cập
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
