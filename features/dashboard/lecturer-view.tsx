"use client";

import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
// Import hook mới của Dashboard
import { useClassDashboard } from "@/features/lecturer/hooks/use-dashboard";
import {
  Users,
  Layers,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  Loader2,
  RefreshCw,
  Trophy,
  Medal,
  Code2,
  ListTodo,
  AlertTriangle,
  Ghost,
  Skull,
  UserX,
  UserPlus, // MỚI: Thêm icon cho trạng thái trống
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SendClassNotification } from "@/features/notifications/components/SendClassNotification";

interface LecturerDashboardProps {
  classId?: string;
}

export function LecturerDashboard({ classId }: LecturerDashboardProps) {
  // Lấy thông tin cơ bản của lớp
  const { data: classDetails, isLoading: isClassLoading } =
    useClassDetails(classId);
  // Lấy data xịn xò từ API Dashboard mới
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useClassDashboard(classId);

  const className = classDetails?.class?.name || "Đang tải...";
  const subjectCode = classDetails?.class?.subject_id?.code || "...";

  const overview = dashboardData?.overview;
  const distribution = dashboardData?.distribution;
  const leaderboards = dashboardData?.leaderboards;
  const alerts = dashboardData?.alerts;

  // Kiểm tra xem lớp có sinh viên không
  const hasStudents = (overview?.total_students || 0) > 0;

  // Xử lý Data Biểu đồ
  const chartData = [
    {
      name: "Giỏi (8-10)",
      value: distribution?.excellent || 0,
      color: "#10b981",
    }, // Xanh lá
    { name: "Khá (6.5-7.9)", value: distribution?.good || 0, color: "#3b82f6" }, // Xanh dương
    { name: "TB (5-6.4)", value: distribution?.average || 0, color: "#f59e0b" }, // Cam
    { name: "Yếu (<5)", value: distribution?.poor || 0, color: "#ef4444" }, // Đỏ
  ].filter((d) => d.value > 0); // Chỉ hiển thị các mốc có sinh viên

  if (!classId) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <Sparkles className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-medium">
          Vui lòng chọn một lớp học để xem tổng quan.
        </p>
      </div>
    );
  }

  if (isClassLoading || isDashboardLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 font-sans transition-colors duration-300">
      {/* =========================================================
          1. HERO WELCOME SECTION (Luôn hiển thị)
          ========================================================= */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-[0.02] pointer-events-none">
          <Sparkles className="w-40 h-40 text-[#F27124]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <Badge className="bg-orange-100 dark:bg-orange-900/20 text-[#F27124] dark:text-orange-400 mb-2 uppercase tracking-[0.2em] text-[10px] font-black px-4 py-1 rounded-full border-none">
              Lecturer Workspace
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-50 leading-tight">
              Dashboard Lớp học
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium flex items-center gap-2 flex-wrap">
              Đang xem báo cáo AI cho lớp{" "}
              <span className="text-[#F27124] dark:text-orange-400 font-black underline decoration-2 underline-offset-4 decoration-orange-200 dark:decoration-orange-900/50">
                {className}
              </span>
              môn{" "}
              <span className="text-slate-900 dark:text-slate-100 font-black">
                {subjectCode}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          ĐIỀU KIỆN TRỐNG: LỚP CHƯA CÓ SINH VIÊN
          ========================================================= */}
      {!hasStudents ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-white/50 dark:bg-slate-900/30">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full shadow-sm mb-6 border border-blue-100 dark:border-blue-800">
            <UserPlus className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
            Lớp học hiện tại chưa có sinh viên
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
            Hệ thống AI cần dữ liệu hoạt động của sinh viên để tiến hành phân
            tích. Vui lòng điều hướng tới tab{" "}
            <strong>Quản lý Thành viên</strong> để thêm sinh viên vào danh sách
            lớp!
          </p>
        </div>
      ) : (
        <>
          {/* =========================================================
              2. KHU VỰC KPI CARDS (Có Sinh viên mới hiện)
              ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Sĩ số */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
              <CardContent className="p-6 flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Sĩ số lớp
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100">
                    {overview?.total_students || 0}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                  <Users className="h-7 w-7" />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Số Nhóm */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
              <CardContent className="p-6 flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Số Nhóm Đồ Án
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100">
                    {overview?.total_teams || 0}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Layers className="h-7 w-7" />
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Tỷ lệ Sync */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
              <CardContent className="p-6 flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Đồng bộ Hệ thống
                  </p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    {overview?.synced_teams_ratio || "0/0"}
                  </h3>
                  <div className="text-[10px] font-bold text-orange-500 uppercase">
                    Jira & GitHub
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                  <RefreshCw className="h-7 w-7" />
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Điểm TB */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
              <CardContent className="p-6 flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Điểm Trung Bình
                  </p>
                  {overview?.is_graded ? (
                    <>
                      <h3 className="text-4xl font-black text-emerald-600">
                        {Number(overview?.average_class_grade || 0).toFixed(1)}
                      </h3>
                      <div className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Lớp đã chốt điểm
                      </div>
                    </>
                  ) : (
                    <div className="pt-2">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-500 border-none font-bold uppercase text-xs"
                      >
                        Chưa chốt điểm
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-7 w-7" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* =========================================================
                3. KHU VỰC BIỂU ĐỒ (CHARTS)
                ========================================================= */}
            <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden">
              <CardHeader className="px-8 pt-8 pb-0">
                <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex justify-between items-center">
                  Phổ điểm của lớp
                  {!overview?.is_graded && (
                    <Badge variant="outline" className="text-[9px]">
                      Dự kiến
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-8">
                {chartData.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <PieChart className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm font-medium">
                      Chưa có dữ liệu phổ điểm
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-64 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            innerRadius={80}
                            outerRadius={105}
                            paddingAngle={5}
                            dataKey="value"
                            strokeWidth={0}
                            cornerRadius={8}
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                className="outline-none"
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: "16px",
                              border: "none",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                              backgroundColor: "var(--tw-colors-slate-900)",
                              color: "#fff",
                            }}
                            itemStyle={{ color: "#fff", fontWeight: "bold" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
                          {overview?.total_students}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.1em] mt-1">
                          Sinh viên
                        </span>
                      </div>
                    </div>
                    {/* Chart Legend */}
                    <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                      {chartData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                            {item.name}: {item.value} SV
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* =========================================================
                4. BẢNG XẾP HẠNG (LEADERBOARDS)
                ========================================================= */}
            <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden">
              <CardHeader className="px-8 pt-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  Bảng Vinh Danh (Top Performers)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                  {/* Top Cá Nhân */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Medal className="w-4 h-4 text-purple-500" /> Top Cá Nhân
                      "Gánh Team"
                    </h3>
                    {leaderboards?.top_individual_contributors?.length > 0 ? (
                      leaderboards.top_individual_contributors.map(
                        (user: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                          >
                            <div className="w-6 h-6 shrink-0 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                                {user.full_name}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {user.team_name}
                              </p>
                            </div>
                            <span className="text-xs font-black text-purple-600 shrink-0">
                              {Number(user.factor).toFixed(2)}x
                            </span>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Chưa có dữ liệu
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* =========================================================
                5. CẢNH BÁO ĐỎ (ALERTS) - SIÊU QUAN TRỌNG
                ========================================================= */}
            <Card className="lg:col-span-8 border-none shadow-xl shadow-red-200/20 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border-l-4 border-l-red-500">
              <CardHeader className="px-8 pt-8 pb-4">
                <CardTitle className="text-xl font-black text-red-600 dark:text-red-400 tracking-tight flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6" /> Cảnh Báo Vận Hành Lớp
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex flex-col md:flex-row gap-6">
                {/* Sinh viên tàng hình */}
                <div className="flex-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                      <Ghost className="w-4 h-4" /> Sinh viên "Tàng hình"
                    </h4>
                    <Badge className="bg-red-500 text-white hover:bg-red-600">
                      {alerts?.ghost_students_count || 0}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-red-600/70 dark:text-red-400/70 mb-3 font-medium uppercase tracking-wider">
                    (0 Commit, 0 Task Done)
                  </p>

                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-200 dark:scrollbar-thumb-red-900">
                    {alerts?.ghost_students_list?.length > 0 ? (
                      alerts.ghost_students_list.map(
                        (ghost: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-lg border border-red-100 dark:border-red-900/30"
                          >
                            <UserX className="w-4 h-4 text-red-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {ghost.full_name}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {ghost.team_name}
                              </p>
                            </div>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Toàn bộ sinh viên
                        đều có tham gia làm bài.
                      </p>
                    )}
                  </div>
                </div>

                {/* Nhóm ngủ đông */}
                <div className="flex-1 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Skull className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300">
                      Nhóm "Ngủ đông" (Chưa Sync)
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {alerts?.inactive_teams?.length > 0 ? (
                      alerts.inactive_teams.map(
                        (teamName: string, i: number) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-white dark:bg-slate-900 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 w-full justify-start py-2"
                          >
                            {teamName}
                          </Badge>
                        ),
                      )
                    ) : (
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tất cả các nhóm đã
                        kết nối Jira/Git.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* =========================================================
                6. BROADCAST CENTER
                ========================================================= */}
            <Card className="lg:col-span-4 border-none shadow-2xl shadow-orange-600/20 dark:shadow-none bg-[#F27124] dark:bg-[#c05615] rounded-[32px] overflow-hidden relative group transition-colors duration-300">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                <Clock className="w-48 h-48 text-white" />
              </div>
              <CardHeader className="relative z-10 px-8 pt-8">
                <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" /> Broadcast Center
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-8 p-8 pt-4">
                <div className="p-7 bg-white/15 backdrop-blur-md rounded-[28px] border border-white/20 shadow-inner">
                  <p className="text-base text-orange-50 leading-relaxed font-bold mb-8">
                    Nhìn thấy danh sách báo động đỏ? Nhắc nhở lớp học ngay bây
                    giờ qua thông báo đẩy!
                  </p>
                  <div className="w-full transition-transform hover:-translate-y-1">
                    <SendClassNotification
                      classId={classId}
                      className={className}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 bg-black/10 dark:bg-black/20 py-3 rounded-2xl border border-white/5">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                  <span className="text-[10px] font-black text-orange-50 uppercase tracking-[0.2em]">
                    FCM System Online
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
