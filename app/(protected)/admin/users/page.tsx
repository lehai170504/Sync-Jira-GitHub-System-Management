"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react"; // Import Loader2
import { toast } from "sonner";
import { UserStats } from "@/components/features/users/user-stats";
import { UserToolbar } from "@/components/features/users/user-toolbar";
import { UserTable } from "@/components/features/users/user-table";
import { initialUsers } from "@/components/features/users/user-data";
import { User } from "@/components/features/users/user-types";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isSyncing, setIsSyncing] = useState(false); // State quản lý loading đồng bộ

  // State Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Logic: Giả lập đồng bộ dữ liệu
  const handleSyncData = async () => {
    setIsSyncing(true);
    // Giả lập delay gọi API (2 giây)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(
      "Đã đồng bộ dữ liệu thành công từ hệ thống đào tạo (AP/FAP)!",
    );
    setIsSyncing(false);
  };

  // Logic: Toggle Status (Khóa/Mở khóa)
  const toggleStatus = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "Active" ? "Reserved" : "Active";
          const actionText =
            newStatus === "Active" ? "Mở khóa" : "Khóa (Bảo lưu)";
          toast.success(`Đã ${actionText} tài khoản ${u.email}`);
          return { ...u, status: newStatus };
        }
        return u;
      }),
    );
  };

  // Logic: Filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
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

        {/* Sync Button với Loading State */}
        <Button
          variant="outline"
          disabled={isSyncing}
          onClick={handleSyncData}
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F27124] hover:border-orange-200 shadow-sm transition-all rounded-xl min-w-[200px]"
        >
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đồng bộ...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Đồng bộ từ AP/FAP
            </>
          )}
        </Button>
      </div>

      {/* STATS DASHBOARD */}
      <UserStats users={users} />

      {/* CONTENT AREA */}
      <div className="space-y-6">
        <UserToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <UserTable
          users={filteredUsers}
          onToggleStatus={toggleStatus}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
