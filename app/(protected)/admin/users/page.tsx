"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Components
import { UserStats } from "@/features/management/users/components/user-stats";
import { UserTable } from "@/features/management/users/components/user-table";
import { UserToolbar } from "@/features/management/users/components/user-toolbar";
// 👇 Import Modal Tạo User Mới
import { CreateUserModal } from "@/features/management/users/components/create-user-modal";

// Hooks & Types
import { useUsers } from "@/features/management/users/hooks/use-users";

export default function UserManagementPage() {
  // 1. State quản lý bộ lọc & Pagination
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSyncing, setIsSyncing] = useState(false);

  // 2. Fetch Data từ API
  // Convert filter sang format API cần
  const apiRole = roleFilter === "all" ? undefined : roleFilter;

  // Gọi Hook lấy dữ liệu (Tự động fetch khi params thay đổi)
  const { data, isLoading } = useUsers({
    page,
    limit: 10,
    role: apiRole,
    search: searchTerm,
  });

  const users = data?.users || [];
  const totalUsers = data?.total || 0;

  // 3. Logic: Đồng bộ dữ liệu
  const handleSyncData = async () => {
    setIsSyncing(true);
    // TODO: Gọi API sync thật ở đây nếu có
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success(
      "Đã đồng bộ dữ liệu thành công từ hệ thống đào tạo (AP/FAP)!",
    );
    setIsSyncing(false);
  };

  // 4. Logic: Toggle Status
  const handleToggleStatus = (id: string) => {
    toast.info(`Chức năng khóa/mở khóa user ${id} đang được phát triển.`);
  };

  // 5. Logic: Xóa bộ lọc
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  // 6. Xử lý Search
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
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
          {/* Sync Button */}
          <Button
            variant="outline"
            disabled={isSyncing}
            onClick={handleSyncData}
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F27124] hover:border-orange-200 shadow-sm transition-all rounded-xl"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đồng bộ...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Đồng bộ AP/FAP
              </>
            )}
          </Button>

          {/* 👇 Thay nút cũ bằng Modal Tạo Mới */}
          <CreateUserModal />
        </div>
      </div>

      {/* STATS DASHBOARD */}
      <UserStats users={users} totalUsers={totalUsers} />

      {/* CONTENT AREA */}
      <div className="space-y-6">
        {/* Toolbar Filter */}
        <UserToolbar
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          roleFilter={roleFilter}
          setRoleFilter={handleRoleChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Data Table */}
        <UserTable
          users={users}
          isLoading={isLoading}
          total={totalUsers}
          page={page}
          onPageChange={setPage}
          onToggleStatus={handleToggleStatus}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
