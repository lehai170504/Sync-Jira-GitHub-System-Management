"use client";

import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  FilterX,
  Search,
  LayoutGrid,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";

// Components
import { UserStats } from "@/features/management/users/components/user-stats";
import { UserTable } from "@/features/management/users/components/user-table";
import { UserToolbar } from "@/features/management/users/components/user-toolbar";
import { CreateUserModal } from "@/features/management/users/components/create-user-modal";
import { Button } from "@/components/ui/button";

// Hooks & Types
import { useUsers } from "@/features/management/users/hooks/use-users";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, refetch } = useUsers({
    page: 1,
    limit: 1000,
  });

  const allUsers = data?.users || [];

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.student_code &&
          user.student_code.toLowerCase().includes(searchLower));

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const userStatus = user.status || "Active";
      const matchesStatus =
        statusFilter === "all" || userStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, searchTerm, roleFilter, statusFilter]);

  const ITEMS_PER_PAGE = 10;
  const totalFiltered = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans animate-in fade-in duration-700">
      <div className="max-w-[1440px] mx-auto p-4 md:p-10 space-y-10">
        {/* --- 1. MODERN HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200/60 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Hệ thống Quản trị Identity</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
              Quản lý Người dùng
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-2xl leading-relaxed">
              Kiểm soát trạng thái tài khoản, phân quyền hệ thống và theo dõi
              nhật ký hoạt động của thành viên.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="rounded-2xl h-12 w-12 border-slate-200 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
            >
              <RefreshCcw className="h-5 w-5" />
            </Button>
            <CreateUserModal />
          </div>
        </div>

        {/* --- 2. INTELLIGENT STATS SECTION --- */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[40px] blur opacity-20 transition duration-1000 group-hover:opacity-40" />
          <div className="relative">
            <UserStats users={allUsers} totalUsers={allUsers.length} />
          </div>
        </section>

        {/* --- 3. FILTER & LIST CONTAINER --- */}
        <div className="space-y-6">
          {/* Bento-style Toolbar */}
          <div className="bg-white p-3 rounded-[32px] border border-slate-200/60 shadow-sm shadow-slate-200/50">
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

          {/* Results Summary & Clear Action */}
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-slate-300" />
              <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">
                Danh sách kết quả ({totalFiltered})
              </h3>
            </div>

            {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 gap-1.5 transition-colors"
              >
                <FilterX className="w-3.5 h-3.5" /> Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Main Table with Island Design */}
          <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden min-h-[600px]">
            <UserTable
              users={paginatedUsers}
              isLoading={isLoading}
              total={totalFiltered}
              page={page}
              onPageChange={setPage}
              onToggleStatus={(id) =>
                toast.info(`Đang phát triển tính năng khóa tài khoản: ${id}`)
              }
              onClearFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
