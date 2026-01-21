"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  MapPin,
  Users,
  FileCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- MOCK DATA ---
const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Dạy lớp SE1783",
    date: "2026-01-22",
    time: "07:30 - 09:00",
    type: "Teaching",
    location: "BE-401",
  },
  {
    id: 2,
    title: "Dạy lớp SE1783",
    date: "2026-01-22",
    time: "09:10 - 10:40",
    type: "Teaching",
    location: "BE-401",
  },
  {
    id: 3,
    title: "Hạn chấm Lab 1",
    date: "2026-01-23",
    time: "23:59",
    type: "Grading",
    location: "Hệ thống",
  },
  {
    id: 4,
    title: "Review Team 1 (E-Com)",
    date: "2026-01-24",
    time: "14:00 - 15:00",
    type: "Meeting",
    location: "Google Meet",
  },
];

const TEAMS = [
  { id: "t1", name: "Team 1: E-Commerce" },
  { id: "t2", name: "Team 2: LMS System" },
  { id: "t3", name: "Team 3: Grab Clone" },
];

export default function SchedulePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventType, setEventType] = useState("Meeting"); // 'Meeting' or 'Grading'

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    team: "",
    note: "",
  });

  const handleCreateEvent = () => {
    const newId = events.length + 1;
    const title =
      eventType === "Meeting"
        ? `Meeting: ${newEvent.team}`
        : `Chấm bài: ${newEvent.title}`;
    const location = eventType === "Meeting" ? "Google Meet" : "System";

    // Giả lập thêm vào lịch ngày hôm nay
    const todayStr = new Date().toISOString().split("T")[0];

    setEvents([
      ...events,
      {
        id: newId,
        title: title,
        date: todayStr,
        time: newEvent.time || "00:00",
        type: eventType,
        location: location,
      },
    ]);

    setIsDialogOpen(false);
    setNewEvent({ title: "", time: "", team: "", note: "" });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 pb-10">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lịch trình & Công việc
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý lịch giảng dạy, hẹn gặp nhóm và hạn chấm bài
          </p>
        </div>

        {/* ADD EVENT DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
              <Plus className="mr-2 h-4 w-4" /> Tạo Lịch Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm sự kiện mới vào lịch</DialogTitle>
              <DialogDescription>
                Chọn loại sự kiện bạn muốn ghi chú.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue="Meeting"
              onValueChange={setEventType}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="Meeting">Lịch Hẹn (Meeting)</TabsTrigger>
                <TabsTrigger value="Grading">Lịch Chấm (Grading)</TabsTrigger>
              </TabsList>

              {/* TAB MEETING */}
              <TabsContent value="Meeting" className="space-y-4">
                <div className="grid gap-2">
                  <Label>Chọn Nhóm</Label>
                  <Select
                    onValueChange={(v) => setNewEvent({ ...newEvent, team: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm cần gặp" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAMS.map((t) => (
                        <SelectItem key={t.id} value={t.name}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Ngày</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Giờ bắt đầu</Label>
                    <Input
                      type="time"
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Hình thức / Địa điểm</Label>
                  <Select defaultValue="online">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">
                        Online (Google Meet)
                      </SelectItem>
                      <SelectItem value="offline">
                        Offline (Tại trường)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* TAB GRADING */}
              <TabsContent value="Grading" className="space-y-4">
                <div className="grid gap-2">
                  <Label>Tiêu đề (Bài tập cần chấm)</Label>
                  <Input
                    placeholder="VD: Chấm Lab 3, Review SRS..."
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Deadline Chấm</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Giờ</Label>
                    <Input
                      type="time"
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Ghi chú thêm..." />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                className="bg-[#F27124] hover:bg-[#d65d1b]"
                onClick={handleCreateEvent}
              >
                Lưu vào Lịch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: CALENDAR VIEW (Simulated) */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm h-fit">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Tháng 1, 2026</h2>
              <div className="flex items-center rounded-md border border-gray-200 bg-white">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-r-none border-r"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-100 text-gray-900 border-0"
              >
                Hôm nay
              </Button>
              <Select defaultValue="month">
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Tháng</SelectItem>
                  <SelectItem value="week">Tuần</SelectItem>
                  <SelectItem value="day">Ngày</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Lịch giả lập (Grid) */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200">
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
                <div
                  key={d}
                  className="py-3 border-r last:border-r-0 border-gray-200"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[120px] text-sm">
              {/* Empty cells prev month */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={`prev-${i}`}
                  className="border-b border-r bg-gray-50/30 p-2 text-gray-300"
                >
                  {29 + i}
                </div>
              ))}

              {/* Days of Jan */}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const dateStr = `2026-01-${day.toString().padStart(2, "0")}`;
                const dayEvents = events.filter((e) => e.date === dateStr);
                const isToday = day === 22; // Giả sử hôm nay là ngày 22

                return (
                  <div
                    key={day}
                    className={`border-b border-r p-2 transition-colors hover:bg-gray-50 relative group ${
                      isToday ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        isToday
                          ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                          : "text-gray-700"
                      }`}
                    >
                      {day}
                    </span>

                    {/* Event Pills */}
                    <div className="mt-2 space-y-1">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[10px] px-1.5 py-1 rounded border truncate cursor-pointer hover:opacity-80 font-medium
                                    ${
                                      ev.type === "Teaching"
                                        ? "bg-blue-100 text-blue-700 border-blue-200"
                                        : ev.type === "Grading"
                                        ? "bg-red-100 text-red-700 border-red-200"
                                        : "bg-purple-100 text-purple-700 border-purple-200"
                                    }`}
                        >
                          {ev.time.split(" ")[0]} {ev.title}
                        </div>
                      ))}
                    </div>

                    {/* Add button on hover */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus className="h-3 w-3 text-gray-400" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: UPCOMING & TASKS */}
        <div className="space-y-6">
          {/* Today's Agenda */}
          <Card className="border-l-4 border-l-[#F27124] shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Hôm nay (22/01)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events
                .filter((e) => e.date === "2026-01-22")
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="flex gap-3 items-start pb-3 border-b last:border-0 border-gray-100"
                  >
                    <div className="mt-1">
                      {ev.type === "Teaching" ? (
                        <Users className="h-4 w-4 text-blue-500" />
                      ) : ev.type === "Grading" ? (
                        <FileCheck className="h-4 w-4 text-red-500" />
                      ) : (
                        <Video className="h-4 w-4 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {ev.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {ev.time}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {ev.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {events.filter((e) => e.date === "2026-01-22").length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Không có lịch trình hôm nay.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines (Grading) */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 bg-red-50/50 border-b border-red-100">
              <CardTitle className="text-base text-red-700 flex items-center gap-2">
                <FileCheck className="h-4 w-4" /> Deadline Chấm Bài
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {events
                .filter((e) => e.type === "Grading")
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-center px-2 py-1 bg-gray-100 rounded">
                        <p className="text-[10px] text-gray-500 uppercase">
                          Tháng 1
                        </p>
                        <p className="text-lg font-bold text-gray-900 leading-none">
                          {ev.date.split("-")[2]}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {ev.title}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Giảng
              dạy
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Họp
              nhóm
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Chấm bài
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
