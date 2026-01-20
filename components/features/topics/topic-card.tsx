"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, Tag, Users, ArrowRight } from "lucide-react";

// --- FIX: Import Type từ file gốc ---
import { Topic } from "@/components/features/topics/topic-data";

interface TopicCardProps {
  topic: Topic;
  onReview: (topic: Topic) => void;
}

export function TopicCard({ topic, onReview }: TopicCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            Đã duyệt
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
            Từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
            Chờ duyệt
          </Badge>
        );
    }
  };

  return (
    <Card className="group hover:shadow-lg hover:border-[#F27124]/50 transition-all duration-300 border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-full">
      {/* HEADER */}
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
            #{topic.id}
          </span>
          {getStatusBadge(topic.status)}
        </div>

        <h3
          className="font-bold text-lg text-gray-900 leading-snug group-hover:text-[#F27124] transition-colors line-clamp-2 min-h-[3.5rem]"
          title={topic.name}
        >
          {topic.name}
        </h3>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-gray-600 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
            {topic.major}
          </span>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-5 pt-0 flex-1">
        <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-100 mb-4">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {topic.description}
          </p>
        </div>

        <div className="space-y-3">
          {/* Team Info */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500">Nhóm thực hiện</p>
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={topic.team}
              >
                {topic.team}
                {/* Hiển thị số lượng thành viên */}
                <span className="ml-1 text-xs text-muted-foreground font-normal">
                  ({topic.members.length} tv)
                </span>
              </p>
            </div>
          </div>

          {/* Mentor Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-white shadow-sm flex-shrink-0">
              <AvatarFallback className="bg-orange-50 text-[#F27124] text-xs font-bold">
                {topic.mentor.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500">Mentor hướng dẫn</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {topic.mentor}
              </p>
              {/* Hiển thị Email Mentor */}
              <p className="text-[10px] text-gray-400 truncate">
                {topic.mentorEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {topic.tags.slice(0, 3).map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600"
            >
              <Tag className="h-3 w-3 text-gray-400" /> {tag}
            </div>
          ))}
          {topic.tags.length > 3 && (
            <span className="text-[10px] text-gray-400 self-center">
              +{topic.tags.length - 3}
            </span>
          )}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Cập nhật: {topic.submittedDate}
        </span>

        <Button
          size="sm"
          variant={topic.status === "Pending" ? "default" : "outline"}
          className={
            topic.status === "Pending"
              ? "bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/10 h-8 rounded-lg text-xs"
              : "h-8 rounded-lg text-xs hover:bg-gray-100 border-gray-200"
          }
          onClick={() => onReview(topic)}
        >
          {topic.status === "Pending" ? "Xem & Duyệt" : "Xem chi tiết"}
          <ArrowRight className="ml-1.5 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
