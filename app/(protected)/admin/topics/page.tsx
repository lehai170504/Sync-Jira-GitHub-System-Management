"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopicStats } from "@/components/features/topics/topic-stats";
import { TopicToolbar } from "@/components/features/topics/topic-toolbar";
import { TopicCard } from "@/components/features/topics/topic-card";
import { TopicReviewDialog } from "@/components/features/topics/topic-review-dialog";
// Import cả data và type từ file gốc
import { mockTopics, Topic } from "@/components/features/topics/topic-data";

export default function TopicManagementPage() {
  // State bây giờ dùng Type chính xác
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [majorFilter, setMajorFilter] = useState("All");

  // Logic Filter
  const filteredTopics = mockTopics.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mentor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = majorFilter === "All" || t.major === majorFilter;
    return matchesSearch && matchesMajor;
  });

  const tabTriggerStyle =
    "rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm";

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Quản lý Đề tài
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">
          Phê duyệt ý tưởng đồ án của sinh viên và gán Mentor hướng dẫn.
        </p>
      </div>

      {/* STATS & TOOLBAR */}
      <TopicStats topics={mockTopics} />
      <TopicToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        majorFilter={majorFilter}
        setMajorFilter={setMajorFilter}
      />

      {/* MAIN CONTENT */}
      <Tabs defaultValue="Pending" className="w-full">
        <TabsList className="bg-gray-100/80 p-1 rounded-xl h-auto inline-flex mb-6">
          <TabsTrigger
            value="Pending"
            className={`${tabTriggerStyle} data-[state=active]:text-[#F27124]`}
          >
            Chờ duyệt (
            {filteredTopics.filter((t) => t.status === "Pending").length})
          </TabsTrigger>
          <TabsTrigger
            value="Approved"
            className={`${tabTriggerStyle} data-[state=active]:text-green-600`}
          >
            Đã duyệt
          </TabsTrigger>
          <TabsTrigger
            value="Rejected"
            className={`${tabTriggerStyle} data-[state=active]:text-red-600`}
          >
            Đã từ chối
          </TabsTrigger>
        </TabsList>

        {["Pending", "Approved", "Rejected"].map((status) => (
          <TabsContent key={status} value={status} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTopics
                .filter((t) => t.status === status)
                .map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onReview={setSelectedTopic}
                  />
                ))}
            </div>

            {/* Empty State */}
            {filteredTopics.filter((t) => t.status === status).length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <p className="text-gray-500 font-medium">Không có dữ liệu.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* DIALOG */}
      <TopicReviewDialog
        open={!!selectedTopic}
        onOpenChange={(open: boolean) => !open && setSelectedTopic(null)}
        topic={selectedTopic}
      />
    </div>
  );
}
