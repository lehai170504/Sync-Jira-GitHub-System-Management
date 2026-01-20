"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  MoreVertical,
  Users,
} from "lucide-react";
import { CouncilSession } from "./council-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CouncilCardProps {
  session: CouncilSession;
  onEdit: (session: CouncilSession) => void;
}

export function CouncilCard({ session, onEdit }: CouncilCardProps) {
  const isUpcoming = session.status === "Upcoming";
  const isCompleted = session.status === "Completed";

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${isUpcoming ? "border-l-blue-500" : isCompleted ? "border-l-green-500" : "border-l-orange-500"}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant={
              isUpcoming ? "secondary" : isCompleted ? "outline" : "default"
            }
            className={
              isUpcoming
                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                : isCompleted
                  ? "bg-green-50 text-green-700 border-green-200"
                  : ""
            }
          >
            {session.status === "Upcoming"
              ? "Sắp diễn ra"
              : session.status === "Completed"
                ? "Đã xong"
                : "Đang diễn ra"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-3 text-gray-400 hover:text-gray-700"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(session)}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Hủy hội đồng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-lg font-bold leading-tight group-hover:text-[#F27124] transition-colors line-clamp-2">
          {session.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" /> {session.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" /> {session.time}
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="h-4 w-4 text-gray-400" /> {session.room}
          </div>
        </div>

        {/* Members List with Avatars */}
        <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Hội đồng chấm
            </span>
            <Users className="h-3.5 w-3.5 text-gray-400" />
          </div>
          <div className="space-y-2">
            {session.members.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                  <AvatarFallback className="text-[10px] bg-white text-gray-600 font-bold">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.role === "President"
                      ? "Chủ tịch"
                      : member.role === "Secretary"
                        ? "Thư ký"
                        : "Ủy viên"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {session.teams.map((team) => (
            <Badge
              key={team}
              variant="outline"
              className="bg-white text-gray-600 font-normal"
            >
              {team}
            </Badge>
          ))}
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full h-9 text-xs border-dashed border-gray-300 text-gray-500 hover:text-[#F27124] hover:border-[#F27124] hover:bg-orange-50"
            onClick={() => onEdit(session)}
          >
            <Edit className="mr-2 h-3.5 w-3.5" /> Điều chỉnh lịch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
