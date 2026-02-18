"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RouteItem } from "./sidebar-config";

interface NavItemProps {
  item: RouteItem;
  isCollapsed: boolean;
  pathname: string;
  currentClassId?: string;
}

export function NavItem({
  item,
  isCollapsed,
  pathname,
  currentClassId,
}: NavItemProps) {
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  let href = item.href;
  if (currentClassId) {
    const separator = href.includes("?") ? "&" : "?";
    href = `${href}${separator}classId=${currentClassId}`;
  }

  const LinkContent = (
    <Link
      href={href}
      className={cn(
        "group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 relative",
        isCollapsed ? "justify-center px-2" : "px-4",
        isActive
          ? "bg-slate-800/80 text-white shadow-sm ring-1 ring-slate-700"
          : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200",
      )}
    >
      <item.icon
        className={cn(
          "h-5 w-5 flex-shrink-0 transition-colors",
          isActive ? item.color : "text-slate-500 group-hover:text-slate-300",
          !isCollapsed && "mr-3",
        )}
      />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
      {isActive && !isCollapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F27124] shadow-[0_0_8px_#F27124]" />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-slate-900 text-white border-slate-700"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return LinkContent;
}
