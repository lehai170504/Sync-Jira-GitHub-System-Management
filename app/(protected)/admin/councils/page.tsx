"use client";

import { useState } from "react";
import { CouncilStats } from "@/components/features/councils/council-stats";
import { CouncilToolbar } from "@/components/features/councils/council-toolbar";
import { CouncilCard } from "@/components/features/councils/council-card";
import { CouncilFormDialog } from "@/components/features/councils/council-form-dialog";
import { mockCouncils } from "@/components/features/councils/council-data";
import { CouncilSession } from "@/components/features/councils/council-types";

export default function CouncilManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CouncilSession | null>(
    null,
  );

  const filteredData = mockCouncils.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingSession(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (session: CouncilSession) => {
    setEditingSession(session);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Xếp lịch Hội đồng
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">
          Tổ chức các buổi bảo vệ đồ án và phân công giám khảo chấm điểm.
        </p>
      </div>

      {/* STATS */}
      <CouncilStats data={mockCouncils} />

      {/* TOOLBAR */}
      <CouncilToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onCreate={handleCreate}
      />

      {/* GRID LIST */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((session) => (
          <CouncilCard key={session.id} session={session} onEdit={handleEdit} />
        ))}
      </div>

      {/* CREATE/EDIT FORM */}
      <CouncilFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingSession}
      />
    </div>
  );
}
