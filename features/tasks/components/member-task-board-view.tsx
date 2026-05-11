"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/status-badge";
import type { Task } from "@/features/tasks/types/tasks-types";
import {
    formatDateVN_ddMMyyyy,
    isDateOverdue,
    mapApiTaskToStatus,
    formatDateVN_yyyyMMdd,
} from "@/features/tasks/utils/utils";

type MemberOption = {
    id: string;
    jiraAccountId: string;
    displayName: string;
    initials: string;
    role?: string;
    studentCode?: string;
    email?: string;
    total: number;
    tasks: any[];
};

type Props = {
    memberOptions: MemberOption[];
    selectedMemberId: string | null;
    onMemberChange: (id: string) => void;
    onViewTask: (task: Task) => void;
};

export function MemberTaskBoardView({
    memberOptions,
    selectedMemberId,
    onMemberChange,
    onViewTask,
}: Props) {
    const selectedMember = useMemo(() => {
        if (!memberOptions.length) return null;
        const id = selectedMemberId ?? memberOptions[0].id;
        return memberOptions.find((m) => m.id === id) ?? memberOptions[0];
    }, [memberOptions, selectedMemberId]);

    if (!selectedMember) return null;

    return (
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border bg-background">
                        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {selectedMember.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                            {selectedMember.displayName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                            {selectedMember.email || selectedMember.studentCode || "—"}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedMemberId ?? selectedMember.id}
                            onValueChange={onMemberChange}
                        >
                            <SelectTrigger className="h-8 w-full text-xs">
                                <SelectValue placeholder="Chọn thành viên" />
                            </SelectTrigger>
                            <SelectContent>
                                {memberOptions.map((opt) => (
                                    <SelectItem
                                        key={opt.id}
                                        value={opt.id}
                                        className="text-xs"
                                    >
                                        {opt.displayName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedMember.role && (
                            <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5"
                            >
                                {selectedMember.role === "Leader" ? "Leader" : "Member"}
                            </Badge>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                        <Badge variant="outline">
                            Tổng task:
                            <span className="ml-1 font-semibold">
                                {selectedMember.total}
                            </span>
                        </Badge>
                        <Badge variant="outline">
                            Hoàn thành:
                            <span className="ml-1 font-semibold">
                                {selectedMember.tasks.filter(
                                    (t: any) =>
                                        (t.status_category || "")
                                            .toLowerCase()
                                            .trim() === "done"
                                ).length}
                            </span>
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[380px] overflow-y-auto">
                {selectedMember.tasks.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic">
                        Thành viên này chưa có task nào.
                    </p>
                ) : (
                    selectedMember.tasks.map((t: any) => {
                        const status = mapApiTaskToStatus(
                            t.status_category,
                            t.status_name
                        );
                        const deadline = t.due_date
                            ? formatDateVN_ddMMyyyy(t.due_date)
                            : "";
                        const start = t.start_date
                            ? formatDateVN_ddMMyyyy(t.start_date)
                            : "";
                        const overdue =
                            t.due_date &&
                            status !== "done" &&
                            isDateOverdue(t.due_date);

                        const mappedTask: Task = {
                            id: t._id || t.issue_id || t.issue_key,
                            key: t.issue_key || t.issue_id,
                            title: t.summary || t.issue_key || "",
                            description: t.description,
                            assigneeId: t.assignee_account_id || selectedMember.jiraAccountId || "",
                            assigneeName: t.assignee_name || selectedMember.displayName,
                            status,
                            storyPoints: Number(t.story_point ?? 0) || 0,
                            priority: "Medium",
                            type: "Jira",
                            courseId: "",
                            printId: typeof t.sprint_id === "object" && t.sprint_id?._id
                                ? t.sprint_id._id
                                : t.sprint_id || "",
                            sprintName: typeof t.sprint_id === "object" ? t.sprint_id?.name : undefined,
                            sprintState: typeof t.sprint_id === "object" ? t.sprint_id?.state : undefined,
                            deadline: t.due_date ? formatDateVN_yyyyMMdd(t.due_date) : "",
                            startDate: t.start_date ? formatDateVN_yyyyMMdd(t.start_date) : undefined,
                        };

                        return (
                            <div
                                key={t._id || t.issue_id || t.issue_key}
                                role="button"
                                tabIndex={0}
                                onClick={() => onViewTask(mappedTask)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onViewTask(mappedTask);
                                    }
                                }}
                                className={
                                    "rounded-lg border px-4 py-3 text-xs space-y-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 " +
                                    (overdue
                                        ? "border-red-300 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30 dark:hover:bg-red-950/40"
                                        : "border-slate-200 bg-background")
                                }
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-[10px] px-1.5 py-0.5"
                                        >
                                            {t.issue_key || t.issue_id}
                                        </Badge>
                                        <span className="font-medium truncate">
                                            {t.summary || t.issue_key}
                                        </span>
                                    </div>
                                    <StatusBadge status={status === "todo"
                                        ? "To Do"
                                        : status === "in-progress"
                                            ? "In Progress"
                                            : status === "review"
                                                ? "In Review"
                                                : "Done"} />
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                                    {t.sprint_id?.name && (
                                        <span className="flex items-center gap-1.5">
                                            Sprint:{" "}
                                            <span className="font-medium">
                                                {t.sprint_id.name}
                                            </span>
                                            {t.sprint_id?.state && (
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        "text-[9px] px-1 py-0 " +
                                                        (t.sprint_id.state === "active"
                                                            ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                                                            : t.sprint_id.state === "closed"
                                                                ? "border-slate-300 text-slate-500 bg-slate-50 dark:bg-slate-800 opacity-70"
                                                                : "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40")
                                                    }
                                                >
                                                    {t.sprint_id.state === "active"
                                                        ? "Đang chạy"
                                                        : t.sprint_id.state === "closed"
                                                            ? "Đã đóng"
                                                            : "Sắp tới"}
                                                </Badge>
                                            )}
                                        </span>
                                    )}
                                    {start && (
                                        <span>
                                            Bắt đầu: <span className="font-medium">{start}</span>
                                        </span>
                                    )}
                                    {deadline && (
                                        <span>
                                            Hạn: <span className="font-medium">{deadline}</span>
                                        </span>
                                    )}
                                    <span>{t.story_point ?? 0} SP</span>
                                </div>
                                {overdue && (
                                    <span className="inline-flex items-center text-[10px] text-red-600 dark:text-red-400">
                                        Quá hạn
                                    </span>
                                )}
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
