"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertCircle, FileClock, Terminal } from "lucide-react";

export function LogStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Logs */}
      <Card className="shadow-sm border-l-4 border-l-[#F27124]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng Log (24h)
            </p>
            <h3 className="text-2xl font-bold">1,248</h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F27124]">
            <Activity className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      <Card className="shadow-sm border-l-4 border-l-red-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Lỗi hệ thống
            </p>
            <h3 className="text-2xl font-bold text-red-600">12</h3>
          </div>
          <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <AlertCircle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Người dùng Active
            </p>
            <h3 className="text-2xl font-bold text-blue-600">45</h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Terminal className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Last Backup */}
      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Backup lần cuối
            </p>
            <h3 className="text-lg font-bold text-green-700">02:00 AM</h3>
          </div>
          <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <FileClock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
