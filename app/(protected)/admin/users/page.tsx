"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Components
import { UserStats } from "@/features/management/users/components/user-stats";
import { UserTable } from "@/features/management/users/components/user-table";
import { UserToolbar } from "@/features/management/users/components/user-toolbar";
import { CreateUserModal } from "@/features/management/users/components/create-user-modal";

// Hooks & Types
import { useUsers } from "@/features/management/users/hooks/use-users";

export default function UserManagementPage() {
  // 1. State quản lý
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // 2. Fetch Data (Lấy ALL dữ liệu về FE để lọc)
  // Lưu ý: Không truyền search/role vào API params để lấy toàn bộ danh sách
  const { data, isLoading } = useUsers({
    page: 1,
    limit: 1000, // Lấy số lượng lớn để lọc FE (hoặc config backend trả về all)
  });

  const allUsers = data?.users || [];

  // 3. Logic Filter (Client-side)
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      // a. Lọc theo Search (Tên, Email, MSSV)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.student_code &&
          user.student_code.toLowerCase().includes(searchLower));

      // b. Lọc theo Role
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      // c. Lọc theo Status (Default active nếu null)
      const userStatus = user.status || "Active";
      const matchesStatus =
        statusFilter === "all" || userStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, searchTerm, roleFilter, statusFilter]);

  // 4. Logic Pagination (Client-side slicing)
  const ITEMS_PER_PAGE = 10; // Phải khớp với trong UserTable
  const totalFiltered = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleToggleStatus = (id: string) => {
    toast.info(`Tính năng khóa user ${id} đang phát triển.`);
  };

  // Reset về trang 1 khi filter thay đổi
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Người dùng
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Kiểm soát trạng thái tài khoản, phân quyền và hỗ trợ kỹ thuật.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateUserModal />
        </div>
      </div>

      {/* STATS */}
      {/* Tính toán dựa trên danh sách đã lọc (hoặc toàn bộ tùy nghiệp vụ) */}
      <UserStats users={allUsers} totalUsers={allUsers.length} />

      {/* CONTENT */}
      <div className="space-y-6">
        <UserToolbar
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          roleFilter={roleFilter}
          setRoleFilter={handleRoleChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          onResetFilters={handleResetFilters}
        />

        <UserTable
          users={paginatedUsers} // Truyền dữ liệu đã cắt trang
          isLoading={isLoading}
          total={totalFiltered} // Truyền tổng số lượng sau khi lọc
          page={page}
          onPageChange={setPage}
          onToggleStatus={handleToggleStatus}
          onClearFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
