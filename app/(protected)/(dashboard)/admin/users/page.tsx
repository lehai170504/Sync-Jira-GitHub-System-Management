"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  FilterX,
  LayoutGrid,
  RefreshCcw,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// Components
import { UserStats } from "@/features/management/users/components/user-stats";
import { UserTable } from "@/features/management/users/components/user-table";
import { UserToolbar } from "@/features/management/users/components/user-toolbar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Hooks
import { useUsers } from "@/features/management/users/hooks/use-users";

export default function UserManagementPage() {
  // --- STATE ---
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // --- DATA FETCHING ---
  // Lấy limit lớn để xử lý client-side pagination (Tạm thời)
  const { data, isLoading, refetch, isRefetching } = useUsers({
    page: 1,
    limit: 1000,
  });

  const allUsers = data?.users || [];

  // --- FILTER LOGIC (CLIENT SIDE) ---
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      // 1. Loại bỏ ADMIN khỏi danh sách này (Chỉ quản lý User thường)
      if (user.role === "ADMIN") return false;

      // 2. Search (Tên, Email, MSSV)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        (user.student_code &&
          user.student_code.toLowerCase().includes(searchLower));

      // 3. Filter Role
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      // 4. Filter Status
      const userStatus = user.status || "Active";
      const matchesStatus =
        statusFilter === "all" || userStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, searchTerm, roleFilter, statusFilter]);

  // --- PAGINATION LOGIC ---
  const ITEMS_PER_PAGE = 10;
  const totalFiltered = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // --- HANDLERS ---
  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setPage(1);
    toast.success("Đã đặt lại bộ lọc");
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Đang cập nhật dữ liệu...");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans animate-in fade-in duration-700">
      <div className="max-w-[1440px] mx-auto p-4 md:p-10 space-y-10">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200/60 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Identity Management</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">
              Quản lý Người dùng
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
              Kiểm soát trạng thái tài khoản, phân quyền hệ thống và theo dõi
              nhật ký hoạt động của thành viên.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isLoading || isRefetching}
                    className="rounded-xl border-slate-200 bg-white text-slate-500 hover:text-[#F27124]"
                  >
                    <RefreshCcw
                      className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Làm mới dữ liệu</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button className="bg-[#F27124] hover:bg-[#d65d1b] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 pl-4 pr-5 h-11">
              <Plus className="mr-2 h-5 w-5" /> Thêm mới
            </Button>
          </div>
        </div>

        {/* --- 2. STATS SECTION --- */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-100 to-blue-100 rounded-[40px] blur opacity-20 transition duration-1000 group-hover:opacity-40" />
          <div className="relative">
            <UserStats users={allUsers} totalUsers={allUsers.length} />
          </div>
        </section>

        {/* --- 3. MAIN CONTENT --- */}
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-[32px] border border-slate-200/60 shadow-sm shadow-slate-200/50">
            <UserToolbar
              searchTerm={searchTerm}
              setSearchTerm={(val) => {
                setSearchTerm(val);
                setPage(1);
              }}
              roleFilter={roleFilter}
              setRoleFilter={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
              statusFilter={statusFilter}
              setStatusFilter={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <h3 className="font-black text-slate-500 uppercase tracking-widest text-[10px]">
                Kết quả hiển thị ({totalFiltered})
              </h3>
            </div>

            {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 gap-1.5 transition-colors h-8"
              >
                <FilterX className="w-3.5 h-3.5" /> Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden h-fit min-h-[300px]">
            <UserTable
              users={paginatedUsers}
              isLoading={isLoading || isRefetching}
              total={totalFiltered}
              page={page}
              onPageChange={setPage}
              onToggleStatus={(id) =>
                toast.info(`Tính năng khóa tài khoản ${id} đang phát triển`)
              }
              onClearFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
