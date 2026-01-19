"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface UserOption {
  id: string;
  label: string;
  subLabel?: string;
  avatarUrl?: string;
}

interface UserSelectProps {
  options: UserOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  error?: boolean; // Prop để highlight khi có lỗi
}

export function UserSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn tài khoản...",
  emptyText = "Không tìm thấy dữ liệu.",
  error = false,
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 px-3 bg-white hover:bg-slate-50 border-dashed hover:border-solid",
            !selectedOption && "text-muted-foreground",
            error && "border-red-500 bg-red-50/50 hover:bg-red-50"
          )}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="h-5 w-5 border border-slate-200">
                {selectedOption.avatarUrl && (
                  <AvatarImage src={selectedOption.avatarUrl} />
                )}
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                  {selectedOption.label.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="truncate text-sm font-medium">
                  {selectedOption.label}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-normal">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] p-0 shadow-lg" align="start">
        <Command>
          <CommandInput placeholder="Tìm kiếm user..." />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
              {emptyText}
            </CommandEmpty>
            <CommandGroup heading="Danh sách gợi ý">
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-7 w-7 border">
                      {option.avatarUrl && (
                        <AvatarImage src={option.avatarUrl} />
                      )}
                      <AvatarFallback className="text-[10px]">
                        {option.label.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                      {option.subLabel && (
                        <span className="text-[10px] text-muted-foreground">
                          {option.subLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  {value === option.id && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
